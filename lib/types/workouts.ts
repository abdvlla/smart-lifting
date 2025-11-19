export type WorkoutExampleFlat = {
  name: string;
  sets: number;
};

export type WorkoutExampleSplit = Record<string, WorkoutExampleFlat[]>;

export type WorkoutResult =
  | {
      split: string;
      days: number;
      notes: string;
      example: WorkoutExampleFlat[];
    }
  | {
      split: string;
      days: number;
      notes: string;
      example: WorkoutExampleSplit;
    };

export type WorkoutRow = {
  id: string;
  user_id: string;
  name: string | null;
  split: string;
  days: number;
  notes: string | null;
  plan: WorkoutResult["example"]; // jsonb in DB
  goal: string | null;
  experience: string | null;
  created_at: string;
  updated_at: string;
};
