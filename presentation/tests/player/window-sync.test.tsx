// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Player from "../../src/player/Player";
import type { DeckDefinition, Snapshot } from "../../src/player/types";

// Keep GSAP real; normalize its CommonJS export in the Node test environment.
vi.mock("gsap", async (original) => {
  const actual = await original<Record<string, any>>();
  return {
    ...actual,
    default: actual.gsap ?? actual.default?.gsap ?? actual.default,
  };
});

type TestScenario = { value: number };
type WireMessage = {
  kind: string;
  deckId: string;
  session: string;
  payload?: Snapshot<TestScenario>;
  intent: "manual" | "replay";
  origin: "audience" | "presenter";
  baseRevision: number;
  commandId: string | null;
  revision: number;
};
const deck: DeckDefinition<TestScenario> = {
  id: "sync-test",
  version: 1,
  title: "Synchronization",
  subtitle: "",
  author: "",
  mark: "",
  className: "",
  chapters: [],
  concepts: [],
  entities: [],
  scenarioIds: ["test"],
  initialScenario: { value: 0 },
  validateScenario: (value: unknown): value is TestScenario =>
    Boolean(
      value &&
      typeof value === "object" &&
      Number.isFinite((value as TestScenario).value),
    ),
  resetScene: (_, scenario) => scenario,
  scenes: [
    {
      id: "one",
      title: "One",
      eyebrow: "",
      chapter: -1,
      note: "",
      question: "",
      answer: "",
      conceptIds: [],
      prerequisiteIds: [],
      entityIds: [],
      scenarioId: "test",
      steps: Array.from({ length: 5 }, (_, index) => ({
        id: `s${index}`,
        title: `Step ${index}`,
        caption: "",
      })),
      render: () => null,
    },
  ],
};
const snapshot = (step: number): Snapshot<TestScenario> => ({
  sceneId: "one",
  stepId: `s${step}`,
  scenario: { value: 0 },
});
let root: Root;
let host: HTMLDivElement;
let clock: number;
let frames: Map<number, FrameRequestCallback>;
let frameId: number;
let messages: WireMessage[];
let session: string;
let peer: Window;
let initialOpener: unknown;
const dialogDescriptors = new Map<string, PropertyDescriptor | undefined>();

beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  clock = 0;
  frameId = 0;
  frames = new Map();
  messages = [];
  session = "review-session";
  vi.spyOn(performance, "now").mockImplementation(() => clock);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    frames.delete(id);
  });
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  initialOpener = window.opener;
  peer = {
    closed: false,
    focus() {},
    postMessage(message: WireMessage) {
      messages.push(structuredClone(message));
    },
  } as unknown as Window;
  Object.defineProperty(window, "opener", { configurable: true, value: peer });
  vi.spyOn(window, "open").mockImplementation((url) => {
    session = new URL(String(url)).searchParams.get("session")!;
    return peer;
  });
  for (const [name, method] of Object.entries({
    showModal(this: HTMLDialogElement) {
      this.open = true;
    },
    close(this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    },
  })) {
    dialogDescriptors.set(
      name,
      Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name),
    );
    Object.defineProperty(HTMLDialogElement.prototype, name, {
      configurable: true,
      value: method,
    });
  }
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  Object.defineProperty(window, "opener", {
    configurable: true,
    value: initialOpener,
  });
  for (const [name, descriptor] of dialogDescriptors) {
    if (descriptor)
      Object.defineProperty(HTMLDialogElement.prototype, name, descriptor);
    else
      delete (
        HTMLDialogElement.prototype as unknown as Record<string, unknown>
      )[name];
  }
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function mount(presenter: boolean) {
  history.replaceState(
    null,
    "",
    presenter ? `/?view=presenter&session=${session}&motion=0` : "/?motion=0",
  );
  await act(async () => root.render(<Player deck={deck} />));
}
async function click(label: string) {
  const button = host.querySelector<HTMLButtonElement>(
    `button[aria-label="${label}"]`,
  );
  if (!button) throw new Error(`Button not found: ${label}`);
  await act(async () => button.click());
}
async function clickText(text: string) {
  const button = Array.from(host.querySelectorAll("button")).find(
    (element) => element.textContent === text,
  );
  if (!button) throw new Error(`Button not found: ${text}`);
  await act(async () => button.click());
}
function visibleStep() {
  const audience = host.querySelector<HTMLElement>(".stage");
  return audience
    ? Number(audience.dataset.step)
    : Number(
        host
          .querySelector(".presenter-step")!
          .textContent!.replace("Step ", ""),
      );
}
function commands() {
  return messages.filter((message) => message.kind === "command");
}
async function receive(message: Partial<WireMessage>) {
  await act(async () => {
    window.dispatchEvent(
      new MessageEvent("message", {
        source: peer,
        origin: location.origin,
        data: {
          kind: "state",
          deckId: deck.id,
          session,
          payload: snapshot(0),
          intent: "manual",
          origin: "audience",
          baseRevision: 0,
          commandId: null,
          revision: 1,
          ...message,
        },
      }),
    );
  });
}
async function acknowledge(command: WireMessage, revision: number) {
  if (!command.payload)
    throw new Error("Acknowledgement requires command state");
  await receive({
    kind: "state",
    payload: command.payload,
    intent: command.intent,
    origin: "presenter",
    baseRevision: command.baseRevision,
    commandId: command.commandId,
    revision,
  });
}
async function nextFrame(time: number) {
  clock = time;
  await act(async () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback(time));
  });
}
async function recordAndReplay(presenter: boolean) {
  if (!presenter) await click("Abrir vista del ponente");
  await click("Sesión y grabación");
  await clickText("Grabar recorrido");
  await click("Cerrar");
  clock = 50;
  await click("Paso siguiente");
  if (presenter) await acknowledge(commands().at(-1)!, 1);
  clock = 100;
  await clickText("Detener grabación");
  await click("Sesión y grabación");
  await clickText("Reproducir");
  expect(visibleStep()).toBe(0);
}

describe("presenter and audience synchronization", () => {
  it("preserves three advances when the first acknowledgement is delayed", async () => {
    await mount(true);
    await click("Paso siguiente");
    const first = commands().at(-1)!;
    await click("Paso siguiente");
    const second = commands().at(-1)!;
    await acknowledge(first, 1);
    expect(visibleStep()).toBe(2);
    await click("Paso siguiente");
    const third = commands().at(-1)!;
    await acknowledge(second, 2);
    await acknowledge(third, 3);
    expect(visibleStep()).toBe(3);
    expect(commands().map((command) => command.payload!.stepId)).toEqual([
      "s1",
      "s2",
      "s3",
    ]);
  });
  it("stops audience replay when the presenter sends a manual command", async () => {
    await mount(false);
    await recordAndReplay(false);
    await receive({
      kind: "command",
      payload: snapshot(3),
      commandId: "manual-1",
      intent: "manual",
      origin: "presenter",
      revision: 0,
    });
    expect(host.querySelector(".session-stop")).toBeNull();
    await nextFrame(160);
    expect(visibleStep()).toBe(3);
  });
  it("does not stop presenter replay when its own replay state is acknowledged", async () => {
    await mount(true);
    await recordAndReplay(true);
    const replay = commands().at(-1)!;
    expect(replay.intent).toBe("replay");
    await acknowledge(replay, 2);
    expect(host.querySelector(".session-stop")?.textContent).toContain(
      "Detener reproducción",
    );
    await nextFrame(160);
    expect(visibleStep()).toBe(1);
  });
  it("stops presenter replay on an audience manual state after the replay acknowledgement", async () => {
    await mount(true);
    await recordAndReplay(true);
    const replay = commands().at(-1)!;
    await acknowledge(replay, 2);
    await receive({
      payload: snapshot(3),
      commandId: replay.commandId,
      intent: "manual",
      revision: 3,
    });
    expect(host.querySelector(".session-stop")).toBeNull();
    await nextFrame(160);
    expect(visibleStep()).toBe(3);
  });
  it("honors an audience manual action while a replay acknowledgement is still pending", async () => {
    await mount(true);
    await recordAndReplay(true);
    // The audience still echoes its last acknowledged command ID when it acts locally.
    // Its manual update may be queued before it receives the newer replay command.
    const previous = commands().at(-2)!;
    await receive({
      payload: snapshot(3),
      commandId: previous.commandId,
      intent: "manual",
      revision: 2,
    });
    expect(host.querySelector(".session-stop")).toBeNull();
    await nextFrame(160);
    expect(visibleStep()).toBe(3);
  });
  it("rejects a queued replay event after audience manual control and accepts a new replay based on that state", async () => {
    await mount(false);
    await click("Abrir vista del ponente");
    await receive({ kind: "hello", origin: "presenter" });
    const initial = messages
      .filter((message) => message.kind === "state")
      .at(-1)!;
    await click("Paso siguiente");
    const human = messages
      .filter((message) => message.kind === "state")
      .at(-1)!;
    expect(human.origin).toBe("audience");
    expect(human.intent).toBe("manual");
    expect(human.revision).toBeGreaterThan(initial.revision);
    await receive({
      kind: "command",
      payload: snapshot(4),
      commandId: "queued-replay",
      intent: "replay",
      origin: "presenter",
      baseRevision: initial.revision,
      revision: 0,
    });
    expect(visibleStep()).toBe(1);
    const response = messages
      .filter((message) => message.kind === "state")
      .at(-1)!;
    expect(response.payload).toEqual(snapshot(1));
    expect(response.origin).toBe("audience");
    expect(response.intent).toBe("manual");
    expect(response.revision).toBeGreaterThan(human.revision);
    await receive({
      kind: "command",
      payload: snapshot(4),
      commandId: "new-replay",
      intent: "replay",
      origin: "presenter",
      baseRevision: response.revision,
      revision: 0,
    });
    expect(visibleStep()).toBe(4);
    const replayResponse = messages
      .filter((message) => message.kind === "state")
      .at(-1)!;
    expect(replayResponse.origin).toBe("presenter");
    expect(replayResponse.intent).toBe("replay");
    expect(replayResponse.commandId).toBe("new-replay");
  });
});

it("retains multiple independent scenario updates in one interaction", async () => {
  const multi: DeckDefinition<{ value: number; other: number }> = {
    ...deck,
    initialScenario: { value: 0, other: 0 },
    validateScenario: (v: unknown): v is { value: number; other: number } =>
      Boolean(v && typeof v === "object" && "value" in v && "other" in v),
    resetScene: (_, s) => s,
    scenes: [
      {
        ...deck.scenes[0]!,
        render: (c) => (
          <button
            onClick={() => {
              c.update({ value: 1 });
              c.update({ other: 2 });
            }}
          >
            {c.scenario.value}:{c.scenario.other}
          </button>
        ),
      },
    ],
  };
  history.replaceState(null, "", "/?motion=0");
  await act(async () => root.render(<Player deck={multi} />));
  await clickText("0:0");
  expect(host.textContent).toContain("1:2");
});
