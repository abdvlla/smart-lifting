"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [sex, setSex] = useState<string | null>(null);
  const [experience_level, setExperienceLevel] = useState<string | null>(null);
  const [days_per_week, setDaysPerWeek] = useState<number | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(
          `name, username, sex, avatar_url, experience_level, days_per_week`
        )
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setName(data.name);
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setExperienceLevel(data.experience_level);
        setSex(data.sex);
        setDaysPerWeek(data.days_per_week);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string | null;
    name: string | null;
    avatar_url: string | null;
    sex: string | null;
    experience_level: string | null;
    days_per_week: number | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        name: name,
        username,
        avatar_url,
        sex,
        experience_level,
        days_per_week,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast.success("Changes successfully saved!");
    } catch (error) {
      toast.error("Failed to save changes!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container max-w-2xl py-8 px-4 mx-auto">
      <Card className="border-2 shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Account Settings
          </CardTitle>
          <CardDescription className="text-base">
            Manage your profile information and account preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="text"
              value={user?.email}
              disabled
              className="bg-muted/50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Your email address cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="transition-all focus:ring-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="transition-all focus:ring-2"
            />
          </div>

          <Separator />

          <h2 className="font-bold text-3xl tracking-tight">Your Details</h2>
          <div className="space-y-2">
            <Label htmlFor="sex" className="text-sm font-semibold">
              Sex
            </Label>

            <Select value={sex || ""} onValueChange={(value) => setSex(value)}>
              <SelectTrigger
                id="form-rhf-select-language"
                className="min-w-[120px]"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectSeparator />
                <SelectItem value="prefer_not_to_say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience_level" className="text-sm font-semibold">
              Experience Level
            </Label>

            <Select
              value={experience_level || ""}
              onValueChange={(value) => setExperienceLevel(value)}
            >
              <SelectTrigger
                id="form-rhf-select-language"
                className="min-w-[120px]"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectSeparator />
                <SelectItem value="prefer_not_to_say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold">
              Days in a week you can train
            </Label>
            <Input
              id="days_per_week"
              type="number"
              value={days_per_week ?? ""}
              onChange={(e) =>
                setDaysPerWeek(
                  e.currentTarget.value ? Number(e.currentTarget.value) : null
                )
              }
              placeholder="Choose how many days you can train every week"
              className="transition-all focus:ring-2 min-w-[120px]"
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() =>
                updateProfile({
                  name,
                  username,
                  avatar_url,
                  sex,
                  experience_level,
                  days_per_week,
                })
              }
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <form action="/auth/signout" method="post" className="flex-1">
              <Button type="submit" variant="outline">
                Sign Out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
