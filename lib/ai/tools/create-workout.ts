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

const EXERCISE_POOLS = {
  // Horizontal Push
  chestPress: [
    "Machine chest press",
    "Dumbbell bench press (either flat or incline)",
    "Pec Dec machine",
    "Cable flyes",
    "Smith machine bench press",
    "Cable chest press",
  ],

  // Vertical Pull
  verticalPull: ["Lat pulldown", "Assisted pull-up machine", "pullups"],

  // Horizontal Pull
  horizontalPull: [
    "Seated cable row",
    "Machine chest-supported row",
    "T-bar row machine",
    "Seated row (wide grip)",
    "Kelso shrugs",
  ],

  // Lateral Delts
  lateralDelts: [
    "Dumbbell lateral raises",
    "Cable lateral raises",
    "Machine lateral raises",
    "Seated lateral raises",
  ],

  // Biceps
  biceps: [
    "Cable biceps curls",
    "Dumbbell biceps curls",
    "Machine preacher curls",
    "EZ bar curls",
  ],

  // Triceps
  triceps: [
    "Cable triceps pushdowns",
    "Overhead cable triceps extensions",
    "Machine triceps extensions",
    "Cable rope pushdowns",
    "Skullcrushers",
  ],

  // Quad Dominant
  quadDominant: [
    "Leg press",
    "Hack squat machine",
    "Smith machine squat",
    "Leg extensions (as primary)",
  ],

  // Hip Hinge
  hipHinge: [
    "RDL (machine/cable)",
    "Leg curl machine",
    "Back extension machine",
  ],

  // Calves
  calves: [
    "Calf raises (on leg press)",
    "Standing calf raise machine",
    "Seated calf raise machine",
  ],

  // Hip Abduction/Adduction
  hips: ["Hip abductor machine", "Hip adductor machine", "Cable hip abduction"],

  // Core
  core: ["Cable crunches", "Ab crunch machine", "Machine ab crunch"],
};

// Randomly select from exercise pool
function pickExercise(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

// Generate varied Upper day
function generateUpperDay(setLevel: { main: number; aux: number }) {
  return [
    { name: pickExercise(EXERCISE_POOLS.chestPress), sets: setLevel.main },
    {
      name: pickExercise(EXERCISE_POOLS.verticalPull),
      sets: setLevel.main - 1,
    },
    {
      name: pickExercise(EXERCISE_POOLS.horizontalPull),
      sets: setLevel.main - 1,
    },
    { name: pickExercise(EXERCISE_POOLS.lateralDelts), sets: setLevel.aux },
    { name: pickExercise(EXERCISE_POOLS.biceps), sets: setLevel.aux },
    { name: pickExercise(EXERCISE_POOLS.triceps), sets: setLevel.aux },
  ];
}

// Generate varied Lower day
function generateLowerDay(setLevel: { main: number; aux: number }) {
  return [
    { name: pickExercise(EXERCISE_POOLS.quadDominant), sets: setLevel.main },
    { name: pickExercise(EXERCISE_POOLS.hipHinge), sets: setLevel.main },
    { name: pickExercise(EXERCISE_POOLS.calves), sets: setLevel.aux },
    { name: pickExercise(EXERCISE_POOLS.hips), sets: setLevel.aux },
    {
      name: `${pickExercise(EXERCISE_POOLS.core)} (optional)`,
      sets: setLevel.aux,
    },
  ];
}

// Generate varied Full Body day
function generateFullBodyDay(setLevel: { main: number; aux: number }) {
  return [
    { name: pickExercise(EXERCISE_POOLS.chestPress), sets: setLevel.main },
    { name: pickExercise(EXERCISE_POOLS.verticalPull), sets: setLevel.main },
    { name: pickExercise(EXERCISE_POOLS.quadDominant), sets: setLevel.main },
    { name: pickExercise(EXERCISE_POOLS.hipHinge), sets: setLevel.main - 1 },
    { name: pickExercise(EXERCISE_POOLS.lateralDelts), sets: setLevel.aux },
    { name: pickExercise(EXERCISE_POOLS.biceps), sets: setLevel.aux },
    { name: pickExercise(EXERCISE_POOLS.triceps), sets: setLevel.aux },
    { name: pickExercise(EXERCISE_POOLS.calves), sets: setLevel.aux },
    {
      name: `${pickExercise(EXERCISE_POOLS.core)} (optional)`,
      sets: setLevel.aux,
    },
  ];
}

export function makeCreateWorkoutTool(ctx: Ctx) {
  return tool({
    description:
      "Create a varied science-based hypertrophy plan using the user's profile (days_per_week, experience_level, sex). Each call generates different exercise selections. Do not suggest non-weighted exercises unless they have no access to weights.",
    inputSchema: z.object({
      days_per_week: z.number().int().min(2).max(6).optional(),
    }),
    execute: async ({ days_per_week }): Promise<WorkoutResult> => {
      const profile = await ctx.getProfileByUserId(ctx.userId);

      const dpw = days_per_week ?? profile?.days_per_week ?? 4;

      const exp = profile?.experience_level ?? "intermediate";

      const setLevel = { main: 3, aux: 2 };

      const isUL = dpw >= 4;

      const notesBase =
        "Low volume, high intensity (RIR 0-1). Rest ≥2 min between sets (3+ min is optimal). Work mainly in the 5-10 rep range. Use progressive overload and keep rest times consistent for main and auxiliary lifts.";

      const notesExp =
        exp === "beginner"
          ? " Focus on stable machines, controlled tempo, and learning good technique. Try to approach or close to it."
          : exp === "advanced"
          ? " You can occasionally add intensifiers (rest-pause, drop sets) on the last set of an exercise, but keep overall fatigue in check."
          : " Keep most sets close to failure without form breakdown, and prioritize consistent performance across weeks.";

      const notes = notesBase + notesExp;

      if (isUL) {
        return {
          split: "Upper/Lower",
          days: Math.max(4, dpw),
          notes,
          example: {
            Upper: generateUpperDay(setLevel),
            Lower: generateLowerDay(setLevel),
          },
        };
      }

      // Full Body (2–3 days)
      return {
        split: "Full Body",
        days: Math.min(Math.max(dpw, 2), 3),
        notes,
        example: {
          "Full Body": generateFullBodyDay(setLevel),
        },
      };
    },
  });
}
