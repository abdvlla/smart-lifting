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

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`name, username, avatar_url`)
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
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        name: name,
        username,
        avatar_url,
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

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => updateProfile({ name, username, avatar_url })}
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
