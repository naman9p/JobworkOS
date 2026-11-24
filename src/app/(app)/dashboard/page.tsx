import Link from "next/link";
import { Suspense } from "react";
import { PageHead } from "@/components/page-head";
import { JobsTable } from "@/components/jobs-table";
import { savedJobs } from "@/lib/saved-jobs";

async function Overview() {
  const { jobs, error } = await savedJobs();
  if (error) return <div role="alert" className="panel p-5 text-red-700">{error} <Link href="/dashboard" className="underline">Try again</Link></div>;
  const current = jobs.filter(job => job.status !== "Completed");
  const stats = [
    ["Total job orders", jobs.length, "All saved orders"],
    ["Current orders", current.length, "Pending, active, delayed and blocked"],
    ["Pending jobs", jobs.filter(j => j.status === "Pending").length, "Created, not started"],
    ["Active jobs", jobs.filter(j => j.status === "Active").length, "Work in progress"],
    ["Completed jobs", jobs.filter(j => j.status === "Completed").length, "Finished orders"],
    ["Delayed jobs", jobs.filter(j => j.status === "Delayed").length, "Requires attention"],
  ] as const;
  return <>
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-6">{stats.map(([label, count, description]) => <div key={label} className="panel p-4"><div className="label">{label}</div><div className="mt-2 text-2xl font-semibold">{count}</div><p className="mt-2 text-[11px] text-[#667085]">{description}</p></div>)}</div>
    <section className="panel mb-6"><div className="flex items-center justify-between gap-3 border-b border-[#e4e7ec] p-4"><div><h2 className="font-semibold">Current orders</h2><p className="mt-1 text-xs text-[#667085]">All unfinished orders, including newly created pending jobs.</p></div><Link href="/jobs" className="text-xs font-semibold text-[#304a5f]">View all orders</Link></div>{current.length ? <JobsTable jobs={current}/> : <p className="p-6 text-[#667085]">No current orders. <Link href="/jobs/new" className="underline">Create a job order</Link> to get started.</p>}</section>
    <section className="panel"><div className="border-b border-[#e4e7ec] p-4"><h2 className="font-semibold">Recent job orders</h2><p className="mt-1 text-xs text-[#667085]">The six most recently created orders, including completed orders.</p></div>{jobs.length ? <JobsTable jobs={jobs.slice(0,6)}/> : <p className="p-6 text-[#667085]">No saved orders yet.</p>}</section>
  </>;
}

export default function Dashboard() {
  return <><PageHead title="Operations Overview" description="Your saved job orders and current workload." action={<Link href="/jobs/new" className="btn btn-primary">Create job order</Link>}/><Suspense fallback={<p className="panel p-5">Loading current orders…</p>}><Overview/></Suspense></>;
}
