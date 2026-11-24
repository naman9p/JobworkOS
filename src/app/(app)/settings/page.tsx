import { Suspense } from "react";
import { PageHead } from "@/components/page-head";
import { ActionForm } from "@/components/action-form";
import { joinTeam } from "@/app/team-actions";
import { createClient } from "@/lib/supabase/server";

async function TeamSettings() {
 const db = await createClient();
 const { data, error } = await db.rpc("workspace_join_code");
 return <div className="mx-auto max-w-3xl space-y-6">
  <section className="panel p-6">
   <h2 className="text-lg font-semibold">Invite your team</h2>
   <p className="my-3 text-[#667085]">Orders belong to a workspace. Give this code to your friends so they can join your workspace and view and create the same orders. Only share it with people you want on your team.</p>
   {error ? <p role="alert" className="text-red-700">Workspace invitations unavailable: {error.message}</p> : <><p className="label mb-2">YOUR WORKSPACE JOIN CODE</p><code className="block select-all break-all rounded bg-[#f2f4f6] p-4">{data}</code></>}
  </section>
  <ActionForm action={joinTeam} label="Join workspace" className="panel p-6">
   <h2 className="text-lg font-semibold">Join a teammate&apos;s workspace</h2>
   <p className="my-3 text-[#667085]">Sign in with your own account, then enter their code. Accounts with real orders or team members must share their existing workspace instead.</p>
   <label className="block">Workspace join code<input name="code" required maxLength={48} className="input mt-2" autoComplete="off"/></label>
  </ActionForm>
 </div>;
}
export default function Settings() {
 return <><PageHead title="Workspace & Team" description="Share orders with teammates using a workspace join code."/><Suspense fallback={<p>Loading workspace settings…</p>}><TeamSettings/></Suspense></>;
}
