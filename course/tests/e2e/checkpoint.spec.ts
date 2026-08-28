import { expect, test } from "@playwright/test";

test("checkpoint integrates the case and exactly 12 retrieval questions", async ({ page }) => {
  await page.goto("checkpoint/");
  await expect(page.getByRole("heading", { name: "De contrato a curva" })).toBeVisible();
  await expect(page.locator(".question-grid fieldset")).toHaveCount(12);
  await page.locator(".checkpoint-case li button").nth(4).click();
  await expect(page.locator(".checkpoint-case li").nth(4)).toContainText("YTM inferida ≈ 4.00%");
});
