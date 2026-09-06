import { useCallback, useEffect, useRef, useState } from "react";
import type { DeckDefinition, Scenario, Snapshot } from "./types";
import { positionOf } from "./state";

/** Explicit window relationship + nonce isolates separate presenting sessions.
 * postMessage also works for our self-contained file, unlike origin storage APIs.
 */
export function useWindowSync<S extends Scenario>(
  deck: DeckDefinition<S>,
  state: Snapshot<S>,
  apply: (state: Snapshot<S>, interrupt: boolean) => void,
  ready: boolean,
  presenter: boolean,
) {
  const peer = useRef<Window | null>(null);
  const intent = useRef<"manual" | "replay">("manual");
  const origin = useRef<"audience" | "presenter">("audience");
  const session = useRef("");
  const pendingCommand = useRef<string | null>(null);
  const acknowledgedCommand = useRef<string | null>(null);
  const ownerRevision = useRef(0);
  const lastOwnerRevision = useRef(-1);
  const lastAudienceManualRevision = useRef(0);
  const latest = useRef(state);
  latest.current = state;
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const targetOrigin = () =>
    location.protocol === "file:" ? "*" : location.origin;
  const send = useCallback(
    (kind: "hello" | "state" | "command", payload?: Snapshot<S>) => {
      const target = presenter ? window.opener : peer.current;
      if (target && !target.closed)
        target.postMessage(
          {
            kind,
            deckId: deck.id,
            session: session.current,
            payload,
            intent: intent.current,
            origin: origin.current,
            baseRevision: lastOwnerRevision.current,
            commandId:
              kind === "command"
                ? pendingCommand.current
                : acknowledgedCommand.current,
            revision: kind === "state" ? ++ownerRevision.current : 0,
          },
          targetOrigin(),
        );
    },
    [deck.id, presenter],
  );
  useEffect(() => {
    if (!ready) return;
    session.current =
      new URLSearchParams(location.search).get("session") ||
      Array.from(crypto.getRandomValues(new Uint8Array(16)), (n) =>
        n.toString(16).padStart(2, "0"),
      ).join("");
    const receive = (event: MessageEvent) => {
      const expected = presenter ? window.opener : peer.current;
      const data = event.data;
      if (
        !expected ||
        event.source !== expected ||
        (location.protocol !== "file:" && event.origin !== location.origin) ||
        data?.session !== session.current ||
        data?.deckId !== deck.id
      )
        return;
      if (data.kind === "hello" && !presenter) {
        setConnected(true);
        send("state", latest.current);
        return;
      }
      if (
        (presenter && data.kind === "state") ||
        (!presenter && data.kind === "command")
      ) {
        try {
          positionOf(deck, data.payload);
          if (presenter) {
            if (
              !Number.isInteger(data.revision) ||
              data.revision <= lastOwnerRevision.current
            )
              return;
            lastOwnerRevision.current = data.revision;
            // A delayed acknowledgement must not roll back a more recent command.
            if (
              pendingCommand.current &&
              data.commandId !== pendingCommand.current &&
              !(data.origin === "audience" && data.intent === "manual")
            )
              return;
            pendingCommand.current = null;
          } else {
            if (typeof data.commandId !== "string") return;
            if (
              data.intent === "replay" &&
              data.baseRevision < lastAudienceManualRevision.current
            ) {
              // A replay event queued before the audience took control is stale.
              intent.current = "manual";
              origin.current = "audience";
              send("state", latest.current);
              return;
            }
            acknowledgedCommand.current = data.commandId;
            intent.current = data.intent === "replay" ? "replay" : "manual";
            origin.current = "presenter";
          }
          applyRef.current(
            data.payload,
            !presenter || data.intent !== "replay",
          );
          setConnected(true);
        } catch {
          /* Reject malformed or stale messages. */
        }
      }
    };
    addEventListener("message", receive);
    if (presenter) send("hello");
    const check = window.setInterval(() => {
      const target = presenter ? window.opener : peer.current;
      if (!target || target.closed) setConnected(false);
    }, 1000);
    return () => {
      removeEventListener("message", receive);
      clearInterval(check);
    };
  }, [ready, presenter, deck, send]);
  useEffect(() => {
    if (ready && !presenter) send("state", state);
  }, [state, ready, presenter, send]);
  function open() {
    const url = new URL(location.href);
    url.searchParams.set("view", "presenter");
    url.searchParams.set("session", session.current);
    url.searchParams.delete("capture");
    peer.current = window.open(
      url,
      `presenter-${session.current}`,
      "popup,width=1100,height=850",
    );
    if (!peer.current)
      setError(
        "Permite abrir esta ventana para ver las notas en otra pantalla.",
      );
    else {
      setError("");
      peer.current.focus();
    }
    return Boolean(peer.current);
  }
  return {
    open,
    connected,
    error,
    localIntent: (value: "manual" | "replay") => {
      intent.current = value;
      origin.current = presenter ? "presenter" : "audience";
      if (!presenter && value === "manual")
        lastAudienceManualRevision.current = ownerRevision.current + 1;
    },
    command: (next: Snapshot<S>) => {
      pendingCommand.current = Array.from(
        crypto.getRandomValues(new Uint8Array(12)),
        (n) => n.toString(16).padStart(2, "0"),
      ).join("");
      send("command", next);
    },
  };
}
