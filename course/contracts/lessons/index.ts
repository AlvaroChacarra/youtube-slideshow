import { CourseSchema, type Course } from "../course";
import { lesson01 } from "./01";
import { lesson02 } from "./02";
import { lesson03 } from "./03";
import { lesson04 } from "./04";

export const course: Course = CourseSchema.parse({
  id: "fixed-income-foundations-v1",
  title: "Bloque 1 — Fundamentos de los bonos",
  sourceIds: [
    "01-block-cover", "02-table-of-contents", "03-miniblock-1-cover", "04-what-is-a-bond", "05-bond-anatomy",
    "06-miniblock-2-cover", "07-discounting-theory", "08-discounting-example", "09-miniblock-3-cover",
    "10-ytm-vs-cagr", "11-same-ytm-different-cagr", "12-miniblock-4-cover", "13-why-many-bonds-same-tenor",
    "14-coupon-price-ytm", "15-yield-curve", "16-recap-miniblocks-1-2", "17-recap-miniblocks-3-4"
  ],
  deliveryProfiles: ["AULA", "ESTUDIO", "VIDEO", "CAPTURE"],
  lessons: [lesson01, lesson02, lesson03, lesson04]
});

export const lessonBySlug = Object.fromEntries(course.lessons.map((lesson) => [lesson.slug, lesson]));
