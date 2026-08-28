import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { lesson01 } from "../../contracts/lessons/01";
import { lesson02 } from "../../contracts/lessons/02";
import { lesson03 } from "../../contracts/lessons/03";
import { lesson04 } from "../../contracts/lessons/04";
import { openLesson } from "./helpers";

test.beforeEach(({ browserName }) => test.skip(browserName !== "chromium", "Canonical visual baselines use Chromium"));
test.beforeAll(async () => mkdir("evidence/screenshots", { recursive: true }));

async function evidenceShot(page: Parameters<typeof openLesson>[0], name: string, fullPage = false) {
  await page.screenshot({ path: `evidence/screenshots/${name}.webp`, type: "webp", quality: 86, fullPage, animations: "disabled" });
}

test("landing visual", async ({ page }) => {
  await page.goto("");
  await evidenceShot(page, "landing-1600x900", true);
  await expect(page).toHaveScreenshot("landing-1600x900.png", { fullPage: true });
});

for (const [name, lesson, search] of [
  ["l1-contract", lesson01, "?mode=aula&scene=l1-anatomy&stage=l1-anatomy-4"],
  ["l2-dcf", lesson02, "?mode=aula&scene=l2-dcf&stage=l2-dcf-3"],
  ["l3-reinvestment", lesson03, "?mode=aula&scene=l3-reinvestment&stage=l3-reinvestment-3"],
  ["l4-curve", lesson04, "?mode=aula&scene=l4-points-curve&stage=l4-points-curve-3"]
] as const) {
  test(`${name} visual`, async ({ page }) => {
    await openLesson(page, lesson, search);
    if (name === "l2-dcf") await expect(page.locator(".katex")).toBeVisible();
    if (name === "l4-curve") await expect(page.locator("path.fair-curve")).toBeVisible();
    await evidenceShot(page, `${name}-1600x900`);
    await expect(page).toHaveScreenshot(`${name}-1600x900.png`);
  });
}

test("mobile study visual", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLesson(page, lesson01, "?mode=aula");
  await evidenceShot(page, "l1-mobile-390x844", true);
  await expect(page).toHaveScreenshot("l1-mobile-390x844.png", { fullPage: true });
});

test("checkpoint visual", async ({ page }) => {
  await page.goto("checkpoint/");
  await expect(page.locator(".checkpoint-runtime")).toBeVisible();
  await evidenceShot(page, "checkpoint-1600x900", true);
  await expect(page).toHaveScreenshot("checkpoint-1600x900.png", { fullPage: true });
});
