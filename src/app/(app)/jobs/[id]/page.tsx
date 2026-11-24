import Link from "next/link";
import { notFound } from "next/navigation";
import { savedJobs } from "@/lib/saved-jobs";
import { StatusBadge } from "@/components/status-badge";
export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 const { jobs, error } = await savedJobs();
 if (error) return <p role="alert">{error}</p>;
 const job = jobs.find(j => j.id === id);
 if (!job) notFound();
 return <><Link href="/jobs" className="underline">Back to job orders</Link><h1 className="my-5 text-2xl font-semibold">{job.id} — {job.title}</h1><StatusBadge value={job.status}/><dl className="panel mt-5 grid gap-5 p-6 sm:grid-cols-2">{[["Product",job.product],["Material",job.material],["Quantity",`${job.quantity} ${job.unit}`],["Due date",job.due],["Priority",job.priority],["Supplier",job.supplier]].map(([label,value])=><div key={label}><dt className="label">{label}</dt><dd className="mt-1">{value}</dd></div>)}</dl></>;
}
