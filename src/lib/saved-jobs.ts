import { createClient } from "@/lib/supabase/server";
import type { Job } from "@/lib/types";
export async function savedJobs(): Promise<{ jobs: Job[]; error?: string }> {
 try {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { jobs: [], error: "Please sign in to see your orders." };
  const { data, error } = await db.from("job_orders").select("*").order("created_at", { ascending: false });
  if (error) return { jobs: [], error: "Could not load orders: " + error.message };
  return { jobs: (data || []).map(r => ({ id: r.job_number, title: r.title, product: r.product, supplier: "Not assigned", quantity: Number(r.quantity), unit: r.unit, stage: "Not started", due: r.due_date, status: ({pending:"Pending",active:"Active",delayed:"Delayed",completed:"Completed",blocked:"Blocked"} as const)[r.status as "pending"] || "Pending", progress: r.status === "completed" ? 100 : 0, priority: ({low:"Low",normal:"Normal",high:"High"} as const)[r.priority as "normal"], material: r.material })) };
 } catch { return { jobs: [], error: "Unable to load orders. Please check the server connection." }; }
}
