"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/components/action-form";
export async function joinTeam(_: Result, form: FormData): Promise<Result> {
 const code = String(form.get("code") || "").trim();
 if (!/^[a-f0-9]{48}$/.test(code)) return { error: "Enter the full workspace join code shared by your teammate." };
 try {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return { error: "Please sign in first." };
  const { error } = await db.rpc("join_workspace", { invite_code: code });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { message: "Workspace joined. Open Job Orders to see your team's orders.", href: "/jobs" };
 } catch { return { error: "Could not join the workspace. Please try again." }; }
}
