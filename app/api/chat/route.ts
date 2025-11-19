import { makeCreateWorkoutTool } from "@/lib/ai/tools/create-workout";
import { createClient } from "@/utils/supabase/server";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("[/api/chat] route hit");
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  console.log("[/api/chat] user:", user?.id, "error:", error?.message);

  if (error || !user) return new Response("Unauthorized", { status: 401 });

  async function getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, days_per_week, experience_level, sex")
      .eq("id", userId)
      .single();
    console.log("[/api/chat] profiles select =>", { data, error });
    if (error) return null;
    return data;
  }

  const createWorkout = makeCreateWorkoutTool({
    userId: user.id,
    getProfileByUserId,
  });

  const { messages }: { messages: UIMessage[] } = await req.json();

  const SYSTEM_PROMPT = `You are a science-based lifting assistant.
  - When a plan is requested, CALL the "createWorkout" tool without asking for profile details; the tool will read the user's profile.
- Cite high-quality sources (systematic reviews, position stands, meta-analyses). Use the searchPapers tool when claims need evidence.
- If unsure, say so and note what evidence would resolve it.
- Prefer practical programming guidance (sets, reps, RIR, rest), keep it brief and actionable.
- When giving programs, prefer: low total volume, ≥2x/week frequency, high intensity (RIR 0-1), progressive overload, minimal redundancy.
- Favor stable movements (e.g., machine chest press, leg press, lat pulldown). If the user requests free weights, adapt accordingly.
- Rest: ≥2 min between sets (3+ min optimal regardless of whether it's isolation or compounds).
- Fatigue management is a priority.
- Scope: lifting, nutrition, fitness science fields only. For anything else politely refuse in one sentence.
- They can say greetings and thanks, respond appropriately. But if they ask about other topics, politely refuse and maybe refer them to another resource.
- Refusal template: "I can"t help with that—my scope is lifting and nutrition."
- Answer concisely; bullet points over paragraphs when possible.
- Use information from Chris Beardsley`;

  const result = streamText({
    // model: "openai/gpt-5",
    model: "openai/gpt-4o-mini",
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(8),
    tools: {
      createWorkout,
    },
  });

  return result.toUIMessageStreamResponse();
}

// Filter info instead of RAG
