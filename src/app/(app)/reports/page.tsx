import { Suspense } from "react";
import Link from "next/link";
import { PageHead } from "@/components/page-head";
import { savedJobs } from "@/lib/saved-jobs";
import { summarizeOrders } from "@/lib/order-summary";

async function Portfolio() {
  const { jobs, error } = await savedJobs();
  if (error) return <p role="alert" className="panel p-5 text-red-700">{error}</p>;
  const { real, samples, counts } = summarizeOrders(jobs);
  return <section className="panel p-5"><h2 className="font-semibold">Job status distribution</h2><p className="mt-1 text-xs text-[#667085]">{real.length} actual orders. {samples.length} sample orders excluded.</p><div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">{(Object.keys(counts) as (keyof typeof counts)[]).map(status => <div key={status} className="rounded border border-[#e4e7ec] p-4"><div className="text-2xl font-semibold">{counts[status]}</div><div className="mt-1 text-xs text-[#667085]">{status}</div></div>)}</div><Link href="/jobs" className="mt-5 inline-block font-semibold text-[#304a5f] underline">View job orders</Link></section>;
}

export default function Reports() {
  return <><PageHead title="Reports & Analytics" description="Status counts from actual orders. Sample data is excluded."/><Suspense fallback={<p className="panel p-5">Loading order portfolio…</p>}><Portfolio/></Suspense></>;
}
