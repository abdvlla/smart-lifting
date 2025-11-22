"use client";

import { useState, useTransition } from "react";
import type { WorkoutResult } from "@/lib/types/workouts";
import { saveWorkoutAction } from "@/lib/workout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function WorkoutCard({ result }: { result: WorkoutResult }) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const isArray = Array.isArray(result.example);

  const handleSave = () => {
    startTransition(async () => {
      try {
        await saveWorkoutAction(result);
        setSaved(true);
        toast.success("Workout saved!");
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div className="mt-3 rounded-xl border bg-background/60 p-3 text-sm space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-semibold">
            {result.split} • {result.days} days/week
          </div>
          <p className="text-xs text-muted-foreground">{result.notes}</p>
        </div>
      </div>

      {isArray ? (
        <ul className="list-disc ms-5 space-y-1">
          {(result.example as any[]).map((ex, idx) => (
            <li key={idx}>
              {ex.name} — {ex.sets} sets
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-2">
          {Object.entries(
            result.example as Record<string, { name: string; sets: number }[]>
          ).map(([day, exercises]) => (
            <div key={day}>
              <div className="font-medium">{day}</div>
              <ul className="list-disc ms-5 space-y-1">
                {exercises.map((ex, idx) => (
                  <li key={idx}>
                    {ex.name} — {ex.sets} sets
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <Button
        className="mx-auto flex mt-4"
        size="sm"
        onClick={handleSave}
        disabled={isPending || saved}
      >
        {isPending ? (
          <>
            <Spinner />
            <span>Saving Workout...</span>
          </>
        ) : (
          "Save Workout"
        )}
      </Button>
    </div>
  );
}
