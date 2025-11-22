"use client";

import { deleteWorkout } from "@/lib/delete-workout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DeleteWorkoutButton({ id }: { id: string }) {
  const handleDelete = async () => {
    try {
      await deleteWorkout(id);
      toast.success("Workout deleted.");
    } catch {
      toast.error("Error. Not able to delete workout.");
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  );
}
