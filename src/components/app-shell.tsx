"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, ClipboardList, Factory, LayoutDashboard, LifeBuoy,
  LogOut, Menu, Scale, Settings, ShieldCheck, TriangleAlert, Truck, X,
} from "lucide-react";
import { useState } from "react";
import { signout } from "@/app/auth-actions";

const nav = [
  ["Overview", "/dashboard", LayoutDashboard],
  ["Job Orders", "/jobs", ClipboardList],
  ["Suppliers", "/suppliers", Factory],
  ["Material Movements", "/materials", Truck],
  ["Reconciliation", "/reconciliation", Scale],
  ["Quality Control", "/quality", ShieldCheck],
  ["Exceptions", "/alerts", TriangleAlert],
  ["Reports", "/reports", BarChart3],
] as const;

function Nav({ close, name }: { close?: () => void; name: string }) {
  const path = usePathname();

  return <>
    <div className="border-b border-[#e4e7ec] px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded bg-[#304a5f] text-sm font-bold text-white">J</div>
        <div>
          <div className="font-bold tracking-tight">JobworkOS</div>
          <div className="text-[10px] text-[#667085]">MANUFACTURING OPERATIONS</div>
        </div>
      </div>
    </div>

    <nav className="flex-1 p-3">
      {nav.map(([name, href, Icon]) => {
        const active = path === href || path.startsWith(`${href}/`);
        return <Link
          onClick={close}
          key={href}
          href={href}
          className={`mb-1 flex items-center gap-3 rounded px-3 py-2.5 text-[13px] font-medium ${active ? "border-l-2 border-[#304a5f] bg-[#eef2f4] text-[#304a5f]" : "text-[#475467] hover:bg-[#f7f8fa]"}`}
        >
          <Icon size={17} />{name}
        </Link>;
      })}
    </nav>

    <div className="border-t border-[#e4e7ec] p-4">
      <div className="flex min-w-0 items-center gap-3">
        <div aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#dfe8e3] text-xs font-bold text-[#3f6b58]">{name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase()}</div>
        <div className="min-w-0"><div className="text-[11px] text-[#667085]">Signed in as</div><div title={name} className="break-words text-sm font-semibold">{name}</div></div>
      </div>
    </div>
    <div className="border-t border-[#e4e7ec] p-3">
      <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-[13px] text-[#475467]"><Settings size={17} />Settings</Link>
      <Link href="/help" className="flex items-center gap-3 px-3 py-2 text-[13px] text-[#475467]"><LifeBuoy size={17} />Help</Link>
      <form action={signout}><button className="flex items-center gap-3 px-3 py-2 text-[13px] text-[#475467]"><LogOut size={17} />Sign out</button></form>
    </div>

  </>;
}

export function AppShell({ children, name }: { children: React.ReactNode; name: string }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen">
    <aside className="desktop-nav fixed inset-y-0 left-0 z-20 flex w-[232px] flex-col overflow-y-auto border-r border-[#e4e7ec] bg-white"><Nav name={name} /></aside>
    <header className="mobile-head sticky top-0 z-20 hidden h-14 items-center justify-between border-b border-[#e4e7ec] bg-white px-4">
      <b>JobworkOS</b><button onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></button>
    </header>
    {open && <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setOpen(false)}>
      <aside onClick={(event) => event.stopPropagation()} className="flex h-full w-[270px] flex-col bg-white">
        <button className="absolute left-[278px] top-4 text-white" onClick={() => setOpen(false)}><X /></button>
        <Nav name={name} close={() => setOpen(false)} />
      </aside>
    </div>}
    <main className="main-shell ml-[232px] min-h-screen">
      <div className="mx-auto max-w-[1480px] p-4 sm:p-6 lg:p-8"><div className="mb-5 border-b border-[#e4e7ec] pb-3 text-sm">Signed in as <strong>{name}</strong></div>{children}</div>
    </main>
  </div>;
}
