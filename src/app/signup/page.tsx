import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { signup } from "@/app/auth-actions";

export default function Signup() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f2f4f6] p-4">
      <div className="w-full max-w-lg">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded bg-[#304a5f] font-bold text-white">J</div>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-[#667085]">Join JobworkOS to manage your work in one place.</p>
        </div>
        <ActionForm action={signup} label="Create account" className="panel p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="label mb-2 block">FULL NAME</span><input name="fullName" autoComplete="name" required className="input" placeholder="Your full name" /></label>
            <label className="sm:col-span-2"><span className="label mb-2 block">EMAIL ADDRESS</span><input name="email" autoComplete="email" required type="email" className="input" placeholder="name@example.com" /></label>
            <label><span className="label mb-2 block">PASSWORD</span><input name="password" autoComplete="new-password" required type="password" minLength={8} className="input" /></label>
            <label><span className="label mb-2 block">CONFIRM PASSWORD</span><input name="confirmPassword" autoComplete="new-password" required type="password" minLength={8} className="input" /></label>
          </div>
          <p className="mt-3 text-xs text-[#667085]">Use at least 8 characters for your password.</p>
          <p className="mt-4 text-center text-xs text-[#667085]">Already have an account? <Link className="font-semibold text-[#304a5f]" href="/login">Sign in</Link></p>
        </ActionForm>
      </div>
    </main>
  );
}
