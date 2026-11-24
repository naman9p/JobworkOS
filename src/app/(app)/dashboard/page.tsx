import Link from "next/link";
import { Suspense } from "react";
import { PageHead } from "@/components/page-head";
import { JobsTable } from "@/components/jobs-table";
import { savedJobs } from "@/lib/saved-jobs";
import { summarizeOrders } from "@/lib/order-summary";

async function Overview() {
  const { jobs, error } = await savedJobs();
  if (error) return <div role="alert" className="panel p-5 text-red-700">{error} <Link href="/dashboard" className="underline">Try again</Link></div>;
  const { real, samples, current, counts } = summarizeOrders(jobs);
  const stats = [
    ["Total job orders", real.length, "Actual orders, excluding samples"],
    ["Current orders", current.length, "Pending, active, delayed and blocked"],
    ["Pending jobs", counts.Pending, "Created, not started"],
    ["Active jobs", counts.Active, "Work in progress"],
    ["Completed jobs", counts.Completed, "Actual orders marked completed"],
    ["Delayed jobs", counts.Delayed, "Requires attention"],
    ["Blocked jobs", counts.Blocked, "Waiting for an issue to be resolved"],
  ] as const;
  return <>
    <p className="mb-4 text-sm text-[#667085]">Counts show actual orders only. {samples.length} sample orders are excluded from all totals and listed separately below.</p>
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">{stats.map(([label, count, description]) => <div key={label} className="panel p-4"><div className="label">{label}</div><div className="mt-2 text-2xl font-semibold">{count}</div><p className="mt-2 text-[11px] text-[#667085]">{description}</p></div>)}</div>
    <section className="panel mb-6"><div className="flex items-center justify-between gap-3 border-b border-[#e4e7ec] p-4"><div><h2 className="font-semibold">Current orders</h2><p className="mt-1 text-xs text-[#667085]">All unfinished orders, including newly created pending jobs.</p></div><Link href="/jobs" className="text-xs font-semibold text-[#304a5f]">View all orders</Link></div>{current.length ? <JobsTable jobs={current}/> : <p className="p-6 text-[#667085]">No current orders. <Link href="/jobs/new" className="underline">Create a job order</Link> to get started.</p>}</section>
    <section className="panel mb-6"><div className="border-b border-[#e4e7ec] p-4"><h2 className="font-semibold">Recent job orders</h2><p className="mt-1 text-xs text-[#667085]">The six most recently created actual orders.</p></div>{real.length ? <JobsTable jobs={real.slice(0,6)}/> : <p className="p-6 text-[#667085]">No actual orders yet.</p>}</section>
    {samples.length > 0 && <section className="panel"><div className="border-b border-[#e4e7ec] p-4"><h2 className="font-semibold">Sample orders</h2><p className="mt-1 text-xs text-[#667085]">Examples for exploring the app. Their statuses do not represent real work and are excluded from dashboard and report counts.</p></div><JobsTable jobs={samples}/></section>}
  </>;
}

export default function Dashboard() {
  return <><PageHead title="Operations Overview" description="Your saved job orders and current workload." action={<Link href="/jobs/new" className="btn btn-primary">Create job order</Link>}/><Suspense fallback={<p className="panel p-5">Loading current orders…</p>}><Overview/></Suspense></>;
}
