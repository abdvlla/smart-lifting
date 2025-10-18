import Navbar from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error, status } = await supabase
    .from("profiles")
    .select(`name, username, avatar_url`)
    .eq("id", user?.id)
    .single();

  if (error && status !== 406) {
    console.log(error);
  }

  console.log("USER DATA:", data);

  return (
    <>
      <Navbar user={user} profile={data} />
      {children}
    </>
  );
}
