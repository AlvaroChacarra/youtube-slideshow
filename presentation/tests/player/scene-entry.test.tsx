// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import gsap from "gsap";
import Player from "../../src/player/Player";
import type { DeckDefinition } from "../../src/player/types";

// Keep the animation engine real, normalizing only its Node module export.
vi.mock("gsap", async (original) => {
  const actual = await original<Record<string, any>>();
  return {
    ...actual,
    default: actual.gsap ?? actual.default?.gsap ?? actual.default,
  };
});

const deck: DeckDefinition<{ value: number }> = {
  id: "entry-test",
  version: 1,
  title: "Entry timing",
  subtitle: "",
  author: "",
  mark: "",
  className: "",
  chapters: [],
  concepts: [],
  entities: [],
  scenarioIds: ["test"],
  initialScenario: { value: 0 },
  validateScenario: (value: unknown): value is { value: number } =>
    Boolean(value && typeof value === "object" && "value" in value),
  resetScene: (_, value) => value,
  scenes: ["one", "two"].map((id) => ({
    id,
    title: id,
    eyebrow: "",
    chapter: -1,
    note: "",
    question: "",
    answer: "",
    conceptIds: [],
    prerequisiteIds: [],
    entityIds: [],
    scenarioId: "test",
    entranceDelay: 0.8,
    steps: ["a", "b"].map((step) => ({
      id: step,
      title: step,
      caption: "",
    })),
    render: () => <p>{id}</p>,
  })),
};
let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(async () => {
  await act(async () => root.unmount());
  host.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
async function mount(motion: boolean) {
  history.replaceState(null, "", motion ? "/" : "/?motion=0");
  await act(async () => root.render(<Player deck={deck} />));
}
async function next() {
  await act(async () =>
    host
      .querySelector<HTMLButtonElement>('[aria-label="Paso siguiente"]')!
      .click(),
  );
}

it("reserves actor travel time, keeps entry across steps, and cancels it on scene change", async () => {
  await mount(true);
  const body = host.querySelector<HTMLElement>(".slide-body")!;
  const entry = gsap.getTweensOf(body)[0]!;
  expect(entry.delay()).toBe(0.8);
  expect(body.style.opacity).toBe("0");
  entry.pause().progress(0.5);
  expect(Number(body.style.opacity)).toBeGreaterThan(0);
  expect(Number(body.style.opacity)).toBeLessThan(1);

  await next();
  expect(gsap.getTweensOf(body)).toContain(entry);
  await next();
  expect(entry.parent).toBeNull();
  const replacement = gsap.getTweensOf(body)[0]!;
  expect(replacement).not.toBe(entry);
  expect(body.style.opacity).toBe("0");
  replacement.pause().progress(1);
  expect(body.style.opacity).toBe("1");
});

it("shows content immediately when motion is disabled, including a new scene", async () => {
  await mount(false);
  const body = host.querySelector<HTMLElement>(".slide-body")!;
  expect(body.style.opacity).toBe("1");
  await next();
  await next();
  expect(host.querySelector(".stage")?.getAttribute("data-scene")).toBe("two");
  expect(body.style.opacity).toBe("1");
  expect(gsap.getTweensOf(body)).toHaveLength(0);
});
