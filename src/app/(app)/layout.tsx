import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
async function Protected({ children }: { children: React.ReactNode }) {
 if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login");
 const db = await createClient();
 const { data: { user } } = await db.auth.getUser();
 if (!user) redirect("/login");
 const { error: workspaceError } = await db.rpc("ensure_personal_workspace");
 if (workspaceError) return <div className="panel m-6 p-5" role="alert">Workspace setup failed: {workspaceError.message}</div>;
 const { data: profile } = await db.from("user_profiles").select("full_name").eq("id", user.id).maybeSingle();
 const name = profile?.full_name?.trim() || user.user_metadata.full_name || user.user_metadata.name || user.email || "My account";
 return <AppShell name={name}>{children}</AppShell>;
}
export default function Layout({ children }: { children: React.ReactNode }) { return <Suspense fallback={<p className="p-6">Loading workspace…</p>}><Protected>{children}</Protected></Suspense>; }
