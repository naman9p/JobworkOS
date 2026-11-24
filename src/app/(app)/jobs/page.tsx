import Link from "next/link";
import { Suspense } from "react";
import { PageHead } from "@/components/page-head";
import { JobsTable } from "@/components/jobs-table";
import { savedJobs } from "@/lib/saved-jobs";
async function Orders() { const { jobs, error } = await savedJobs(); return <section className="panel">{error && <p role="alert" className="p-4 text-red-700">{error}</p>}<JobsTable jobs={jobs} /></section>; }
export default function Jobs() { return <><PageHead title="Job Orders" description="Your saved orders, newest first. Search by ID, title or product; click an ID to view details." action={<Link href="/jobs/new" className="btn btn-primary">Create job</Link>} /><Suspense fallback={<p>Loading your orders…</p>}><Orders /></Suspense></>; }
