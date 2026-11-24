"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Result } from "@/components/action-form";

export async function signup(_: Result, form: FormData): Promise<Result> {
  const name = String(form.get("fullName") || "").trim();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (name.length < 2 || !email.includes("@") || password.length < 8) return { error: "Enter your name, a valid email and a password of at least 8 characters." };
  if (password !== form.get("confirmPassword")) return { error: "Passwords do not match." };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) return { error: error.message };
    if (data.user?.identities?.length === 0) return { error: "This email may already be registered. Please sign in or reset your password." };
    return { message: data.session ? "Account created successfully. You can now sign in." : "Signup received. Check your email to confirm your account, then sign in." };
  } catch { return { error: "Account service unavailable. Please check the server's Supabase configuration and try again." }; }
}

export async function signin(_: Result, form: FormData): Promise<Result> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email: String(form.get("email") || ""), password: String(form.get("password") || "") });
    if (error) return { error: error.message };
  } catch { return { error: "Sign-in service unavailable. Please check the server's Supabase configuration and try again." }; }
  redirect("/jobs");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
