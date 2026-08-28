export function shouldIgnoreKeyboard(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.matches("input, select, textarea, button, [contenteditable='true']") || Boolean(target.closest("input, select, textarea, button, [contenteditable='true']"));
}

export type KeyboardCommand = "next" | "previous" | "reset" | "escape" | null;

export function commandFromKey(event: KeyboardEvent): KeyboardCommand {
  if (shouldIgnoreKeyboard(event.target)) return null;
  if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") return "next";
  if (event.key === "ArrowLeft" || event.key === "PageUp") return "previous";
  if (event.key === "Home") return "reset";
  if (event.key === "Escape") return "escape";
  return null;
}
