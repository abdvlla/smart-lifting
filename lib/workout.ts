"use server";

import { z } from "zod";
import { createClient } from "@/utils/supabase/server";

const WorkoutExerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
});

const WorkoutResultSchema = z.object({
  split: z.string(),
  days: z.number(),
  notes: z.string(),
  example: z.union([
    z.array(WorkoutExerciseSchema),
    z.record(z.string(), z.array(WorkoutExerciseSchema)),
  ]),
});

export async function saveWorkoutAction(input: unknown) {
  const result = WorkoutResultSchema.parse(input);

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Not authenticated");
  }

  const { data, error } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      name: `${result.split}`,
      split: result.split,
      days: result.days,
      notes: result.notes,
      plan: result.example,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to save workout");
  }

  return data;
}
