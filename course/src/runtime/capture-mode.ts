export function isCleanCapture(search: string, width: number): boolean {
  const params = new URLSearchParams(search);
  return width > 900 && params.get("capture") === "1" && (params.get("mode") === "aula" || params.get("mode") === "video");
}

export function recordableCanvasRatio(width: number, height: number): number {
  return width / height;
}
