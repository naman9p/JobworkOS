import type { Job } from "@/lib/types";

// SAMPLE-* is the reserved ID range used by the sample-data migration.
export function summarizeOrders(jobs: Job[]) {
  const samples = jobs.filter(job => job.id.startsWith("SAMPLE-"));
  const real = jobs.filter(job => !job.id.startsWith("SAMPLE-"));
  const current = real.filter(job => ["Pending", "Active", "Delayed", "Blocked"].includes(job.status));
  const counts = {
    Pending: real.filter(job => job.status === "Pending").length,
    Active: real.filter(job => job.status === "Active").length,
    Delayed: real.filter(job => job.status === "Delayed").length,
    Blocked: real.filter(job => job.status === "Blocked").length,
    Completed: real.filter(job => job.status === "Completed").length,
  };
  return { real, samples, current, counts };
}
