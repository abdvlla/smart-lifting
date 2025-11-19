import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import { Dumbbell, Calendar, TrendingUp } from "lucide-react";

export default async function Component() {
  const supabase = await createClient();
  const { data: workouts, error } = await supabase
    .from("workouts")
    .select()
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <header className="border-b border-border/40 bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-balance">
              Workout Routines
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Browse your training programs and track your progress
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workouts?.map((workout, index) => (
              <Card
                key={workout.id}
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 overflow-hidden"
              >
                {/* Card Header with Accent */}
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />

                <CardContent className="p-6">
                  {/* Workout Name */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors text-balance">
                      {workout.name}
                    </h3>
                  </div>

                  {/* Workout Details */}
                  <div className="flex flex-col gap-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">Split:</span>
                      <Badge variant="secondary" className="ml-auto">
                        {workout.split}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Frequency:</span>
                      <Badge variant="outline" className="ml-auto">
                        {workout.days} days/week
                      </Badge>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full transition-all" variant="outline">
                    View Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {(!workouts || workouts.length === 0) && (
            <div className="text-center py-20">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
                <Dumbbell className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No workouts yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by creating your first workout routine
              </p>
              <Button size="lg">Create Workout</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
