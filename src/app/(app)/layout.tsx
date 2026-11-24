import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
async function Protected({ children }: { children: React.ReactNode }) {
 if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) redirect("/login");
 const db = await createClient();
 const { data: { user } } = await db.auth.getUser();
 if (!user) redirect("/login");
 return <AppShell name={user.user_metadata.full_name || user.email || "My account"}>{children}</AppShell>;
}
export default function Layout({ children }: { children: React.ReactNode }) { return <Suspense fallback={<p className="p-6">Loading workspace…</p>}><Protected>{children}</Protected></Suspense>; }
