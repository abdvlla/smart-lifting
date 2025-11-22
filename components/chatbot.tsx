"use client";

import type React from "react";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import {
  User,
  LocateFixed as BicepsFlexed,
  Zap,
  TrendingUp,
  Apple,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageInput } from "./ui/message-input";
import MarkdownRenderer from "./ui/markdown-renderer";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { WorkoutCard } from "@/components/workout-card";
import type { WorkoutResult } from "@/lib/types/workouts";
import { quickActions } from "./quick-actions";

export default function Chatbot() {
  const [input, setInput] = useState("");

  const { messages, sendMessage } = useChat({
    api: "/api/chat",
  } as any);

  const { containerRef, handleScroll, handleTouchStart } = useAutoScroll([
    messages,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleQuickAction = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto h-[95vh] p-4">
      <div className="flex flex-col h-full bg-card rounded-3xl shadow-2xl overflow-hidden border border-border/30 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        <div className="relative flex items-center gap-4 px-6 py-5 border-b border-border/30 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <BicepsFlexed className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-lg text-card-foreground">
              AI Fitness Coach
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              Online & Ready
            </p>
          </div>
        </div>

        <div
          ref={containerRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          className="relative flex-1 overflow-y-auto px-6 py-6 space-y-6"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-500">
              <div className="rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-6 backdrop-blur-sm">
                <BicepsFlexed className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-card-foreground text-balance">
                  Ready to Transform Your Training?
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm text-pretty">
                  Ask me anything about lifting, nutrition, or workout
                  programming. I'm here to help you reach your goals.
                </p>
              </div>

              <div className="w-full max-w-md space-y-3 pt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Quick Actions
                </p>
                <div className="grid gap-2">
                  {quickActions.map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/40 transition-all hover:scale-[1.02] active:scale-[0.98] text-left group"
                      >
                        <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-card-foreground">
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {messages.map((message, idx) => {
            const isUser = message.role === "user";

            const parts = ((message as any).parts ??
              (message as any).content ??
              []) as any[];

            const textContent =
              parts
                .filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("") ?? "";

            const workoutOutputs: WorkoutResult[] = parts
              .filter(
                (p) =>
                  p.type === "tool-createWorkout" &&
                  p.state === "output-available" &&
                  p.output
              )
              .map((p) => p.output as WorkoutResult);

            const hasWorkout = !isUser && workoutOutputs.length > 0;

            return (
              <div
                key={message.id}
                className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Avatar
                  className={`h-9 w-9 shrink-0 ${
                    isUser
                      ? "ring-2 ring-secondary/50"
                      : "ring-2 ring-primary/30"
                  }`}
                >
                  <AvatarFallback
                    className={
                      isUser
                        ? "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground"
                        : "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                    }
                  >
                    {isUser ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <BicepsFlexed className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={`flex flex-col gap-2 max-w-[85%] ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md ${
                      isUser
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-md"
                        : "bg-secondary/50 text-secondary-foreground rounded-tl-md backdrop-blur-sm border border-border/40"
                    }`}
                  >
                    <div className="text-sm leading-relaxed space-y-3">
                      {textContent && !hasWorkout && (
                        <MarkdownRenderer>{textContent}</MarkdownRenderer>
                      )}

                      {!isUser &&
                        workoutOutputs.map((wo, idx) => (
                          <WorkoutCard key={idx} result={wo} />
                        ))}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground/60 px-1">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative border-t border-border/30 p-4 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <MessageInput
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              isGenerating={false}
              enableInterrupt={true}
              placeholder="Ask about workouts, nutrition, or training advice..."
            />
          </form>
        </div>
      </div>
    </div>
  );
}
