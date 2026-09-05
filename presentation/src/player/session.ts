import type { DeckDefinition, Scenario, Snapshot } from "./types";
import { positionOf } from "./state";

export type SessionEvent<S extends Scenario = Scenario> = {
  at: number;
  state: Snapshot<S>;
};
export type RecordedSession<S extends Scenario = Scenario> = {
  format: "presentation-session";
  version: 1;
  deckId: string;
  deckVersion: number;
  duration: number;
  events: SessionEvent<S>[];
};
const MAX_DURATION = 8 * 60 * 60 * 1000;
export function parseSession<S extends Scenario>(
  raw: string,
  deck: DeckDefinition<S>,
): RecordedSession<S> {
  if (raw.length > 5_000_000) throw new Error("La sesión es demasiado grande.");
  const data = JSON.parse(raw);
  if (
    data?.format !== "presentation-session" ||
    data.version !== 1 ||
    data.deckId !== deck.id ||
    data.deckVersion !== deck.version
  )
    throw new Error("La sesión pertenece a otra presentación o versión.");
  if (
    !Array.isArray(data.events) ||
    !data.events.length ||
    data.events.length > 20000
  )
    throw new Error("La sesión no contiene una secuencia válida.");
  if (
    !Number.isFinite(data.duration) ||
    data.duration < 0 ||
    data.duration > MAX_DURATION
  )
    throw new Error("Duración de sesión no válida.");
  let previous = -1;
  for (const event of data.events) {
    if (
      !event ||
      !Number.isFinite(event.at) ||
      event.at < 0 ||
      event.at < previous ||
      event.at > data.duration
    )
      throw new Error("Orden temporal de sesión no válido.");
    if (!event.state || typeof event.state !== "object")
      throw new Error("Estado de sesión no válido.");
    positionOf(deck, event.state);
    previous = event.at;
  }
  if (data.events[0].at !== 0)
    throw new Error("La sesión debe comenzar en cero.");
  return data;
}
export function sessionStateAt<S extends Scenario>(
  session: RecordedSession<S>,
  time: number,
): Snapshot<S> {
  let low = 0,
    high = session.events.length - 1;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (session.events[mid]!.at <= time) low = mid;
    else high = mid - 1;
  }
  return session.events[low]!.state;
}
export function shareHash<S extends Scenario>(snapshot: Snapshot<S>): string {
  return "#state=" + encodeURIComponent(JSON.stringify(snapshot));
}
export function readSharedState<S extends Scenario>(
  hash: string,
  deck: DeckDefinition<S>,
): Snapshot<S> | null {
  if (!hash.startsWith("#state=")) return null;
  const state = JSON.parse(decodeURIComponent(hash.slice(7)));
  positionOf(deck, state);
  return state;
}
