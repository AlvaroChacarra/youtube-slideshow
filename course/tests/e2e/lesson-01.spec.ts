import { expect, test } from "@playwright/test";
import { lesson01 } from "../../contracts/lessons/01";
import { openLesson } from "./helpers";

test("L1 builds the contract and keeps principal only at maturity", async ({ page }) => {
  await openLesson(page, lesson01, "?mode=aula&scene=l1-cashflows&stage=l1-cashflows-3");
  const flows = page.getByRole("list", { name: "Cash flows del bono" }).getByRole("listitem");
  await expect(flows).toHaveCount(5);
  await expect(flows.filter({ hasText: "principal" })).toHaveCount(1);
  await expect(flows.last()).toContainText("104 €");
  await expect(flows.last()).toContainText("4 cupón + 100 principal");
});

test("L1 Bond Builder changes coupon base, face value and maturity", async ({ page }) => {
  await openLesson(page, lesson01, "?mode=aula&scene=l1-builder&stage=l1-builder-3");
  await page.getByRole("slider", { name: "Coupon rate" }).fill("0.06");
  await page.getByRole("slider", { name: "Notional" }).fill("150");
  await page.getByRole("slider", { name: "Face value" }).fill("120");
  await page.getByRole("slider", { name: "Vencimiento" }).fill("7");
  await expect(page.locator(".bond-signature")).toContainText("9.00 €");
  await expect(page.locator(".bond-certificate")).toContainText("7 años");
});
