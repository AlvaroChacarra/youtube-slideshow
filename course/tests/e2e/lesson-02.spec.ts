import { expect, test } from "@playwright/test";
import { lesson02 } from "../../contracts/lessons/02";
import { openLesson } from "./helpers";

test("L2 assembles price 100 from discounted cash flows", async ({ page }) => {
  await openLesson(page, lesson02, "?mode=aula&scene=l2-dcf&stage=l2-dcf-3");
  await expect(page.locator(".price-result")).toContainText("P = 100.00 €");
  await expect(page.locator(".formula-legend")).toContainText("spot aplicable al flujo");
});

test("L2 Rate Lab moves PV without relabeling r_t as YTM", async ({ page }) => {
  await openLesson(page, lesson02, "?mode=aula&scene=l2-rate-lab&stage=l2-rate-lab-2");
  await page.getByRole("slider", { name: "Tasa de descuento" }).fill("0.08");
  await expect(page.locator(".amount.present")).toContainText("68.06 €");
});
