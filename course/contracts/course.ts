import { z } from "zod";

export const RouteSchema = z.enum(["LIVE", "REQUIRED", "OPTIONAL"]);
export const BaseModeSchema = z.enum(["aula", "estudio", "video"]);
export const DeliveryProfileSchema = z.enum(["AULA", "ESTUDIO", "VIDEO", "CAPTURE"]);
export const LessonPhaseSchema = z.enum(["presentation", "guided", "consolidation"]);
export const SceneTypeSchema = z.enum([
  "hero-challenge",
  "recall",
  "financial-object",
  "concept-simulator",
  "mathematical-state",
  "market-map",
  "guided-exercise",
  "diagnostic-quiz",
  "recap",
  "bridge"
]);

export const StageSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  route: RouteSchema,
  component: z.string().min(1),
  concepts: z.array(z.string()).default([]),
  prompt: z.string().optional()
});

export const SceneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: SceneTypeSchema,
  route: RouteSchema,
  phase: LessonPhaseSchema,
  durationMinutes: z.number().int().positive(),
  sourceRefs: z.array(z.string()).min(1),
  concepts: z.array(z.string()).min(1),
  stages: z.array(StageSchema).min(1),
  teacher: z.object({
    objective: z.string().min(1),
    askBeforeReveal: z.string().min(1),
    interaction: z.string().min(1),
    commonError: z.string().min(1),
    bridge: z.string().min(1)
  })
});

const KnowledgeSchema = z.object({
  concepts: z.array(z.string()),
  notation: z.array(z.string())
});

const IntroductionSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["concept", "notation"]),
  route: RouteSchema,
  scene: z.string().min(1)
});

export const LessonSchema = z.object({
  id: z.string().regex(/^lesson-0[1-4]$/),
  slug: z.string().min(1),
  title: z.string().min(1),
  kicker: z.string().min(1),
  thesis: z.string().min(1),
  requires: KnowledgeSchema,
  requirement_routes: z.object({
    concepts: z.record(z.string(), RouteSchema),
    notation: z.record(z.string(), RouteSchema)
  }),
  introduces: z.array(IntroductionSchema),
  introduction_routes: z.record(z.string(), RouteSchema),
  recalls: z.array(z.object({ id: z.string(), scene: z.string() })),
  routes: z.object({
    LIVE: z.array(z.string()),
    REQUIRED: z.array(z.string()),
    OPTIONAL: z.array(z.string())
  }),
  objectives: z.array(z.object({
    id: z.string(),
    route: RouteSchema,
    statement: z.string(),
    concepts: z.array(z.string()),
    notation: z.array(z.string())
  })).min(1),
  load: z.object({
    livePresentationMinutes: z.number().int(),
    guidedMinutes: z.number().int(),
    requiredAutonomousMinutes: z.number().int(),
    optionalMinutes: z.number().int()
  }),
  scenes: z.array(SceneSchema).min(1),
  bridge: z.object({
    known: z.string(),
    gap: z.string(),
    next: z.string(),
    target: z.string()
  }),
  used_later: z.array(z.object({ id: z.string(), target: z.string(), route: RouteSchema })),
  financialClaims: z.array(z.string()),
  misconceptions: z.array(z.string()),
  deliveryProfiles: z.array(DeliveryProfileSchema).length(4)
});

export const CourseSchema = z.object({
  id: z.literal("fixed-income-foundations-v1"),
  title: z.string(),
  sourceIds: z.array(z.string()).length(17),
  deliveryProfiles: z.array(DeliveryProfileSchema).length(4),
  lessons: z.array(LessonSchema).length(4)
});

export type Route = z.infer<typeof RouteSchema>;
export type BaseMode = z.infer<typeof BaseModeSchema>;
export type DeliveryProfile = z.infer<typeof DeliveryProfileSchema>;
export type LessonPhase = z.infer<typeof LessonPhaseSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Stage = z.infer<typeof StageSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Course = z.infer<typeof CourseSchema>;
