"use client";
import { useActionState } from "react";

export type Result = { error?: string; message?: string; href?: string };
export function ActionForm({ action, children, className, label }: { action: (state: Result, data: FormData) => Promise<Result>; children: React.ReactNode; className?: string; label: string }) {
  const [state, submit, pending] = useActionState(action, {});
  return <form action={submit} className={className}>
    {children}
    <div aria-live="polite" className="px-5">
      {state.error && <p role="alert" className="my-3 rounded bg-red-50 p-3 text-red-700">{state.error}</p>}
      {state.message && <p className="my-3 rounded bg-green-50 p-3 text-green-800">{state.message} {state.href && <a className="font-semibold underline" href={state.href}>View job orders</a>}</p>}
    </div>
    <div className="p-5"><button disabled={pending} className="btn btn-primary w-full disabled:opacity-50">{pending ? "Please wait…" : label}</button></div>
  </form>;
}
