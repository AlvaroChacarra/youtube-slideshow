import { expect, test } from "@playwright/test";
import { lesson04 } from "../../contracts/lessons/04";
import { openLesson } from "./helpers";

test("L4 reprices fixed coupons at a common market yield", async ({ page }) => {
  await openLesson(page, lesson04, "?mode=aula&scene=l4-repricing&stage=l4-repricing-3");
  await expect(page.locator(".repricing-bonds")).toContainText("113.36 €");
  await expect(page.locator(".repricing-bonds")).toContainText("100.00 €");
  await expect(page.locator(".repricing-bonds")).toContainText("95.55 €");
  await expect(page.locator(".takeaway")).toContainText("cupón no cambia");
});

test("L4 keeps observed points, fitted line and benchmark distinct", async ({ page }) => {
  await openLesson(page, lesson04, "?mode=aula&scene=l4-points-curve&stage=l4-points-curve-3");
  await expect(page.locator("svg[aria-labelledby='curve-title curve-desc']")).toBeVisible();
  await expect(page.locator("circle.bond-point")).toHaveCount(30);
  await expect(page.locator("path.fair-curve")).toHaveCount(1);
  await expect(page.locator("line.boundary")).toHaveAttribute("x1", await page.locator("line.boundary").getAttribute("x2") ?? "");
  await expect(page.locator(".illustrative-note")).toContainText("no spot curve");
});
