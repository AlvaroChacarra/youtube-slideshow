import { describe, expect, it } from "vitest";
import { CourseSchema, SceneTypeSchema } from "../../contracts/course";
import { course } from "../../contracts/lessons";
import { financialClaims, misconceptions, notationRegistry } from "../../contracts/registries";

describe("course contract", () => {
  it("is strict across four lessons and seventeen sources", () => {
    expect(CourseSchema.parse(course)).toEqual(course);
    expect(course.lessons).toHaveLength(4);
    expect(course.sourceIds).toHaveLength(17);
    expect(course.lessons.every((lesson) => lesson.deliveryProfiles.length === 4)).toBe(true);
  });

  it("keeps route and phase orthogonal", () => {
    for (const lesson of course.lessons) {
      expect(lesson.scenes.filter((scene) => scene.route === "LIVE" && scene.phase === "presentation").reduce((sum, scene) => sum + scene.durationMinutes, 0)).toBeGreaterThanOrEqual(18);
      expect(lesson.scenes.filter((scene) => scene.route === "LIVE" && scene.phase === "guided").reduce((sum, scene) => sum + scene.durationMinutes, 0)).toBeGreaterThanOrEqual(18);
    }
  });

  it("uses only the closed V1 scene type set", () => {
    for (const scene of course.lessons.flatMap((lesson) => lesson.scenes)) expect(SceneTypeSchema.safeParse(scene.type).success).toBe(true);
  });

  it("binds every claim and misconception", () => {
    expect(new Set(course.lessons.flatMap((lesson) => lesson.financialClaims))).toEqual(new Set(financialClaims.map((claim) => claim.id)));
    expect(new Set(course.lessons.flatMap((lesson) => lesson.misconceptions))).toEqual(new Set(misconceptions.map((item) => item.id)));
  });

  it("registers complete notation metadata", () => {
    expect(notationRegistry.map((item) => item.symbol)).toEqual(["C_t", "CF_t", "r_t", "y", "P", "N", "FV", "t", "T", "n"]);
    expect(notationRegistry.every((item) => item.unit && item.visual && item.constraints)).toBe(true);
  });
});
