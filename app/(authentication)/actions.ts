"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function login(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password)
    return { ok: false, error: "Email and password are required." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error(error);
    return { ok: false, error: error.message || "Invalid credentials." };
  }

  // Optional: keep, but don’t redirect here (let client toast first)
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function signup(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;

  if (!email || !password)
    return { ok: false, error: "Email and password are required." };

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error(error);
    return { ok: false, error: error.message || "Could not sign up." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
