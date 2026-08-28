import { expect, type Page } from "@playwright/test";
import type { Lesson } from "../../contracts/course";

export function lessonUrl(lesson: Lesson, search = "?mode=aula"): string {
  return `lessons/${lesson.slug}/${search}`;
}

export async function openLesson(page: Page, lesson: Lesson, search = "?mode=aula"): Promise<void> {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(lessonUrl(lesson, search));
  await expect(page.locator(".lesson-runtime")).toBeVisible();
}

export async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

export async function expectAulaGeometry(page: Page): Promise<void> {
  const geometry = await page.evaluate(() => {
    const canvas = document.querySelector<HTMLElement>("#recordable-canvas")?.getBoundingClientRect();
    const frame = document.querySelector<HTMLElement>(".active-scene .scene-frame")?.getBoundingClientRect();
    return {
      bodyScroll: document.body.scrollHeight - window.innerHeight,
      canvas: canvas && { top: canvas.top, bottom: canvas.bottom, left: canvas.left, right: canvas.right },
      frame: frame && { top: frame.top, bottom: frame.bottom, left: frame.left, right: frame.right }
    };
  });
  expect(geometry.bodyScroll).toBeLessThanOrEqual(1);
  expect(geometry.canvas).toBeTruthy();
  expect(geometry.frame).toBeTruthy();
  expect(geometry.frame!.top).toBeGreaterThanOrEqual(geometry.canvas!.top - 1);
  expect(geometry.frame!.bottom).toBeLessThanOrEqual(geometry.canvas!.bottom + 1);
  expect(geometry.frame!.left).toBeGreaterThanOrEqual(geometry.canvas!.left - 1);
  expect(geometry.frame!.right).toBeLessThanOrEqual(geometry.canvas!.right + 1);
  await expectNoHorizontalOverflow(page);
}

export function captureErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}
