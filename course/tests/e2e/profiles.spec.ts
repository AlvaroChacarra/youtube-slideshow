import { expect, test } from "@playwright/test";
import { lesson01 } from "../../contracts/lessons/01";
import { expectNoHorizontalOverflow, openLesson } from "./helpers";

const viewports = [
  [1280, 720], [1440, 900], [1600, 900], [1920, 1080], [2560, 1440],
  [390, 844], [430, 932], [768, 1024], [1024, 768]
] as const;

for (const [width, height] of viewports) {
  test(`profile geometry ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await openLesson(page, lesson01, "?mode=aula");
    await expectNoHorizontalOverflow(page);
    await expect(page.locator(".lesson-runtime")).toHaveAttribute("data-mode", width <= 900 ? "estudio" : "aula");
    if (width <= 900) await expect(page.getByText("Fallback estudio", { exact: true })).toBeVisible();
    else expect(await page.evaluate(() => document.body.scrollHeight - innerHeight)).toBeLessThanOrEqual(1);
  });
}

test("teacher controls stay outside the recordable canvas", async ({ page }) => {
  await openLesson(page, lesson01, "?mode=aula&profe=1");
  await page.getByRole("button", { name: "Profe" }).click();
  await expect(page.getByRole("complementary", { name: "Guía docente" })).toBeVisible();
  expect(await page.locator("#recordable-canvas .teacher-drawer").count()).toBe(0);
});

test("capture is a clean deterministic 16:9 canvas", async ({ page }) => {
  await openLesson(page, lesson01, "?mode=video&capture=1");
  await expect(page.locator(".runtime-bar, .runtime-controls, .teacher-drawer")).toHaveCount(0);
  const box = await page.locator("#recordable-canvas").boundingBox();
  expect(box!.width / box!.height).toBeCloseTo(16 / 9, 2);
});

test("study progress requires explicit pedagogical review", async ({ page }) => {
  await openLesson(page, lesson01, "?mode=estudio");
  const review = page.getByRole("button", { name: "Marcar como revisado" }).first();
  await review.click();
  await expect(review).toHaveText("Revisado ✓");
});
