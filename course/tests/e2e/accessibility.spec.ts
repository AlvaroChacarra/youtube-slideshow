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
      - link "Volver al mapa":
        - /url: /youtube-slideshow/
        - text: B–04 Fixed Income Foundations
      - navigation "Perfil de entrega":
        - button "aula"
        - button "estudio"
        - button "video"
      - text: 4%
      - link "Checkpoint":
        - /url: /youtube-slideshow/checkpoint/
      - article:
        - text: hero challenge · 2 min
        - heading "¿Qué compras al entregar 100 €?" [level=2]
        - text: 01 / 02 B–04
        - paragraph: Instrumento de deuda · pagos anuales
        - heading "BONO 5 AÑOS" [level=3]
        - term: Emisor
        - definition: Estado o empresa
        - term: Coupon rate
        - definition: 4.0%
        - term: Notional · N
        - definition: 100 €
        - term: Face value · FV
        - definition: 100 €
        - term: Vencimiento · T
        - definition: 5 años
        - text: Cupón anual
        - strong: 4.00 €
        - complementary:
          - text: Observado hoy · no contractual
          - strong: P = 100,00 €
      - button "Estado anterior": ←
      - button "01 ¿Qué compras al entregar 100 €?"
      - button "02 Capital hoy, pagos futuros"
      - button "03 El bono canónico"
      - button "04 Anatomía del contrato"
      - button "05 Contrato → cash flows"
      - button "06 Conozco pagos, no valor"
      - button "07 Bond Builder"
      - button "08 Contract Check"
      - button "Estado siguiente": →
      - button "Reiniciar escena": ↺
  `);
});
