import { expect, test } from "@playwright/test";
import { lesson04 } from "../../contracts/lessons/04";
import { lessonUrl } from "./helpers";

test("L4 meets browser performance and network budgets", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "LCP and long-task entry support is canonical in Chromium");
  await page.addInitScript(() => {
    const metrics = { lcp: 0, cls: 0, longTasks: [] as number[] };
    Object.defineProperty(window, "__PERF_METRICS__", { value: metrics });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) metrics.lcp = Math.max(metrics.lcp, entry.startTime);
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) if (!entry.hadRecentInput) metrics.cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) metrics.longTasks.push(entry.duration);
    }).observe({ type: "longtask", buffered: true });
  });
  const origins = new Set<string>();
  page.on("request", (request) => origins.add(new URL(request.url()).origin));
  await page.goto(lessonUrl(lesson04, "?mode=aula&scene=l4-points-curve&stage=l4-points-curve-3"));
  await expect(page.locator("path.fair-curve")).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(100);
  const metrics = await page.evaluate(() => (window as unknown as { __PERF_METRICS__: { lcp: number; cls: number; longTasks: number[] } }).__PERF_METRICS__);
  expect(metrics.lcp).toBeGreaterThan(0);
  expect(metrics.lcp).toBeLessThan(2500);
  expect(metrics.cls).toBeLessThan(0.05);
  expect(Math.max(0, ...metrics.longTasks)).toBeLessThanOrEqual(150);
  expect([...origins]).toEqual(["http://127.0.0.1:4321"]);
});
