import { expect, test } from "@playwright/test";
import { lesson03 } from "../../contracts/lessons/03";
import { openLesson } from "./helpers";

test("L3 solves YTM as the rate reproducing price", async ({ page }) => {
  await openLesson(page, lesson03, "?mode=aula&scene=l3-solve-ytm&stage=l3-solve-ytm-3");
  await expect(page.locator(".price-result")).toContainText("y = 4.00%");
  await expect(page.locator(".formula-legend")).toContainText("tasa única que reproduce P");
});

test("L3 distinguishes YTM calculation from realized return", async ({ page }) => {
  await openLesson(page, lesson03, "?mode=aula&scene=l3-exit&stage=l3-exit-2");
  await page.getByRole("button", { name: /Realizar YTM exige/ }).click();
  await expect(page.getByRole("status")).toContainText("Correcto");
  await expect(page.getByRole("status")).toContainText("no entra en el cálculo");
});
