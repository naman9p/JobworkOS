"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { jobSchema } from "@/lib/schemas";
import type { Result } from "@/components/action-form";
export async function createJob(_: Result, form: FormData): Promise<Result> {
 const parsed = jobSchema.safeParse(Object.fromEntries(form));
 if (!parsed.success) return { error: parsed.error.issues[0]?.message };
 try {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { error: "Please sign in before creating an order." };
  const { data: org, error: setupError } = await db.rpc("ensure_personal_workspace");
  if (setupError) return { error: "Workspace setup failed. Please apply the latest database migration. " + setupError.message };
  const { data: profile, error: profileError } = await db.from("user_profiles").select("role").eq("id", user.id).single();
  if (profileError) return { error: "Could not read your workspace profile: " + profileError.message };
  if (!profile) return { error: "Your workspace profile is missing. Please contact the workspace owner." };
  if (!["administrator", "planner"].includes(profile.role)) return { error: `Your workspace role is ${profile.role}. Only planners and administrators can create orders. Ask your workspace owner to update your role.` };
  const p = parsed.data;
  const number = `JOB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const { error } = await db.from("job_orders").insert({ organization_id: org, created_by: user.id, job_number: number, title: p.title, product: p.product, material: p.material, quantity: p.quantity, unit: p.unit, priority: p.priority, start_date: p.startDate.toISOString().slice(0,10), due_date: p.dueDate.toISOString().slice(0,10), instructions: p.instructions });
  if (error) return { error: "Order was not saved: " + error.message };
  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  revalidatePath("/reports");
  return { message: `${number} created successfully. Find it by job ID, title or product in Job Orders.`, href: "/jobs" };
 } catch { return { error: "Unable to save this order. Check the server connection and try again." }; }
}
