import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { lesson01 } from "../../contracts/lessons/01";
import { lesson04 } from "../../contracts/lessons/04";
import { openLesson } from "./helpers";

for (const [name, open] of [
  ["landing", async (page: Parameters<typeof openLesson>[0]) => page.goto("")],
  ["lesson aula", async (page: Parameters<typeof openLesson>[0]) => openLesson(page, lesson01, "?mode=aula&profe=1")],
  ["lesson study", async (page: Parameters<typeof openLesson>[0]) => openLesson(page, lesson04, "?mode=estudio")],
  ["checkpoint", async (page: Parameters<typeof openLesson>[0]) => page.goto("checkpoint/")]
] as const) {
  test(`${name} has no critical or serious axe violations`, async ({ page }) => {
    await open(page);
    const result = await new AxeBuilder({ page }).analyze();
    const blocking = result.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
    expect(blocking, blocking.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
  });
}

test("runtime exposes a stable ARIA structure", async ({ page }) => {
  await openLesson(page, lesson01, "?mode=aula");
  await expect(page.locator("main.lesson-runtime")).toMatchAriaSnapshot(`
    - main:
      - banner:
        - link "Volver al mapa"
        - navigation "Perfil de entrega"
      - article:
        - heading "¿Qué compras al entregar 100 €?" [level=2]
      - contentinfo "Navegación de la lección"
  `);
});
