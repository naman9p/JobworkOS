import { describe, expect, it } from "vitest";
import { summarizeOrders } from "./order-summary";
import type { Job } from "./types";
const job = (id: string, status: Job["status"]): Job => ({ id, status, title: "Order", product: "Bracket", supplier: "Not assigned", quantity: 10, unit: "pcs", stage: "Not started", due: "2026-12-01", progress: 0, priority: "Normal", material: "Steel" });
describe("actual order summary", () => {
 it("does not count completed samples as completed work", () => {
  const result = summarizeOrders([job("SAMPLE-007", "Completed"), job("SAMPLE-009", "Completed"), job("JOB-001", "Pending")]);
  expect(result.counts.Completed).toBe(0);
  expect(result.real).toHaveLength(1);
  expect(result.samples).toHaveLength(2);
  expect(result.current).toHaveLength(1);
 });
 it("counts every real status and reconciles current plus completed with total", () => {
  const result = summarizeOrders(["Pending", "Active", "Blocked", "Delayed", "Completed"].map((status, i) => job(`JOB-${i}`, status as Job["status"])));
  expect(result.counts).toEqual({ Pending: 1, Active: 1, Blocked: 1, Delayed: 1, Completed: 1 });
  expect(result.current.length + result.counts.Completed).toBe(result.real.length);
 });
 it("returns zero counts for a workspace containing only examples", () => {
  const result = summarizeOrders([job("SAMPLE-001", "Active")]);
  expect(Object.values(result.counts).every(count => count === 0)).toBe(true);
  expect(result.current).toHaveLength(0);
 });
});
