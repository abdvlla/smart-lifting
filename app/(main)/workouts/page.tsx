import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto">
        <section className="py-8 px-6">
          <div className="mb-6 mx-12">
            <h2 className="text-2xl font-bold mb-2">Workout Routines</h2>
            <p className="text-md">Browse through your workouts</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Full Body Workout</h3>
                <p className="text-sm mb-4">
                  A comprehensive workout targeting all major muscle groups.
                </p>
                <Button variant="outline">Start Workout</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Cardio Blast</h3>
                <p className="text-sm mb-4">
                  High-intensity cardio workout to boost your endurance.
                </p>
                <Button variant="outline">Start Workout</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Strength Training</h3>
                <p className="text-sm mb-4">
                  Build muscle and improve your overall strength.
                </p>
                <Button variant="outline">Start Workout</Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
