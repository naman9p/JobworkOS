import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { signin } from "@/app/auth-actions";
export default function Login() {
 return <main className="grid min-h-screen place-items-center p-4"><div className="w-full max-w-md"><h1 className="mb-6 text-center text-2xl font-semibold">Sign in to JobworkOS</h1><ActionForm action={signin} label="Sign in" className="panel p-6"><label className="mb-4 block">Email address<input name="email" type="email" autoComplete="email" required className="input mt-2" /></label><label className="block">Password<input name="password" type="password" autoComplete="current-password" required className="input mt-2" /></label><p className="mt-5 text-center">New to JobworkOS? <Link href="/signup" className="underline">Create an account</Link></p></ActionForm></div></main>;
}
