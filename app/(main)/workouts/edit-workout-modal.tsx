"use client";

import { useState } from "react";
import { editWorkout } from "@/lib/edit-workout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

export default function EditWorkoutModal({ workout }: { workout: any }) {
  const [name, setName] = useState(workout.name);
  const [notes, setNotes] = useState(workout.notes);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await editWorkout(workout.id, {
        name,
        notes,
      });
      toast.success("Workout updated");
      setIsLoading(false);
      setOpen(false);
    } catch {
      toast.error("Failed to update workout");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workout</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner />
                <span>Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
