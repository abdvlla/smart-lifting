import { tool } from "ai";
import { z } from "zod";
import type { WorkoutResult } from "@/lib/types/workouts";

type Profile = {
  id: string;
  days_per_week: number | null;
  experience_level: "beginner" | "intermediate" | "advanced" | null;
  sex: "male" | "female" | null;
};

type Ctx = {
  userId: string;
  getProfileByUserId: (userId: string) => Promise<Profile | null>;
};

export function makeCreateWorkoutTool(ctx: Ctx) {
  return tool({
    description:
      "Create a simple science-based hypertrophy plan using the user's profile (days_per_week, experience_level, sex). Do not suggest non-weighted exercises unless they have no access to weights.",
    inputSchema: z.object({
      days_per_week: z.number().int().min(2).max(6).optional(),
    }),
    execute: async ({ days_per_week }): Promise<WorkoutResult> => {
      const profile = await ctx.getProfileByUserId(ctx.userId);

      const dpw = days_per_week ?? profile?.days_per_week ?? 4;

      // map your profile experience to volume level
      const exp = profile?.experience_level ?? "intermediate";

      const setLevel =
        exp === "beginner"
          ? { main: 2, aux: 1 }
          : exp === "advanced"
          ? { main: 3, aux: 2 }
          : { main: 3, aux: 2 }; // intermediate

      const isUL = dpw >= 4;

      const notes =
        "Low volume, high intensity (RIR 0-1). Rest ≥2 min (3+ optimal). Work mainly in 5-10 reps. Progressive overload. Rest time should be the same for main and auxiliary exercises.";

      if (isUL) {
        const Upper = [
          { name: "Machine chest press", sets: setLevel.main },
          { name: "Lat pulldown", sets: setLevel.main - 1 },
          { name: "Seated row", sets: setLevel.main - 1 },
          { name: "Lateral raises", sets: setLevel.aux },
          { name: "Biceps curls", sets: setLevel.aux },
          { name: "Cable triceps extensions", sets: setLevel.aux },
        ];

        const Lower = [
          { name: "Leg press", sets: setLevel.main },
          { name: "RDL (machine/cable)", sets: setLevel.main },
          { name: "Calf raises (on leg press)", sets: setLevel.aux },
          { name: "Hip adductor/abductor", sets: setLevel.aux },
          { name: "Cable crunches (optional)", sets: setLevel.aux },
        ];

        return {
          split: "Upper/Lower",
          days: Math.max(4, dpw),
          notes,
          example: { Upper, Lower },
        };
      }
      // Full Body (2–3 days)
      const FullBody = [
        { name: "Machine chest press", sets: setLevel.main },
        { name: "Lat pulldown", sets: setLevel.main },
        { name: "Leg press", sets: setLevel.main },
        { name: "RDL (machine/cable)", sets: setLevel.main - 1 },
        { name: "Lateral raises", sets: setLevel.aux },
        { name: "Biceps curls", sets: setLevel.aux },
        { name: "Cable triceps extensions", sets: setLevel.aux },
        { name: "Calf raises (on leg press)", sets: setLevel.aux },
        { name: "Cable crunches (optional)", sets: setLevel.aux },
      ];

      return {
        split: "Full Body",
        days: Math.min(Math.max(dpw, 2), 3),
        notes,
        example: { "Full Body": FullBody },
      };
    },
  });
}
