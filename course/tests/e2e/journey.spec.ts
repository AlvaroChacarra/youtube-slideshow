import { expect, test } from "@playwright/test";
import { course } from "../../contracts/lessons";
import { captureErrors, expectAulaGeometry, openLesson } from "./helpers";

for (const lesson of course.lessons) {
  test(`${lesson.id}: every LIVE scene and stage is reachable and reversible`, async ({ page }) => {
    const errors = captureErrors(page);
    await openLesson(page, lesson);
    const scenes = lesson.scenes.filter((scene) => scene.route === "LIVE");
    const states = scenes.flatMap((scene) => scene.stages.map((stage) => ({ scene, stage })));

    for (const [index, state] of states.entries()) {
      const frame = page.locator(`[data-scene="${state.scene.id}"][data-stage="${state.stage.id}"]`);
      await expect(frame).toBeVisible();
      await expectAulaGeometry(page);
      if (index < states.length - 1) await page.keyboard.press("ArrowRight");
    }

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator(`[data-scene="${states.at(-1)!.scene.id}"][data-stage="${states.at(-2)!.stage.id}"]`)).toBeVisible();
    await page.keyboard.press("Home");
    await expect(page.locator(`[data-scene="${states[0]!.scene.id}"][data-stage="${states[0]!.stage.id}"]`)).toBeVisible();
    expect(errors).toEqual([]);
  });
}
