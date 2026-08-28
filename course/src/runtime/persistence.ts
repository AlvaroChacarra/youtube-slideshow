import type { Position } from "./navigation";

export const STORAGE_VERSION = 1;

export type StoredProgress = Readonly<{ version: 1; position: Position; visited: string[]; savedAt: string }>;

export function storageKey(lessonId: string): string {
  return `fixed-income-foundations:${STORAGE_VERSION}:${lessonId}`;
}

export function readProgress(storage: Pick<Storage, "getItem">, lessonId: string): StoredProgress | null {
  try {
    const raw = storage.getItem(storageKey(lessonId));
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<StoredProgress>;
    if (value.version !== STORAGE_VERSION || !value.position || !Array.isArray(value.visited)) return null;
    return value as StoredProgress;
  } catch {
    return null;
  }
}

export function writeProgress(storage: Pick<Storage, "setItem">, lessonId: string, position: Position, visited: readonly string[]): void {
  const payload: StoredProgress = { version: STORAGE_VERSION, position, visited: [...new Set(visited)], savedAt: new Date().toISOString() };
  storage.setItem(storageKey(lessonId), JSON.stringify(payload));
}
