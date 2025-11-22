"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function editWorkout(id: string, updates: any) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("workouts")
    .update(updates)
    .eq("id", id);

  if (error) throw new Error("Failed to edit workout");

  revalidatePath("/workouts");
}
