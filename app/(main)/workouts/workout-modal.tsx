import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Exercise {
  name: string;
  sets: number;
}

interface WorkoutPlan {
  [dayName: string]: Exercise[];
}

interface Workout {
  name: string;
  days: number;
  notes: string;
  plan: WorkoutPlan;
}

export default function WorkoutModal({ workout }: { workout: Workout }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Workout</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {workout.name} – {workout.days} days/week
          </DialogTitle>

          <DialogDescription>{workout.notes}</DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <h2 className="font-bold text-xl mb-4">Exercise Selection</h2>

          <div className="space-y-6">
            {Object.entries(workout.plan).map(([dayName, exercises]) => (
              <div key={dayName} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{dayName}</h3>

                <ul className="space-y-1">
                  {exercises.map((ex: any, i: number) => (
                    <li key={i} className="text-sm">
                      • {ex.name} — {ex.sets} sets
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
