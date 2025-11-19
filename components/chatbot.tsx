"use client";

import type React from "react";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { User, BicepsFlexed } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageInput } from "./ui/message-input";
import MarkdownRenderer from "./ui/markdown-renderer";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { WorkoutCard } from "@/components/workout-card";
import type { WorkoutResult } from "@/lib/types/workouts";

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

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-[95vh] p-4">
      <div className="flex flex-col h-full dark:bg-card bg-gray-100 rounded-2xl shadow-xl overflow-hidden border border-border/50">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50 bg-card">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <BicepsFlexed className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-card-foreground">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">
              Science-Based Lifting Coach
            </p>
          </div>
        </div>

        <div
          ref={containerRef}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="rounded-full bg-primary/10 p-4">
                <BicepsFlexed className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-card-foreground">
                  Start a conversation
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ask me anything about lifting or nutrition.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => {
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
                className={`flex gap-3 ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={
                      isUser
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-primary text-primary-foreground"
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
                  className={`flex flex-col gap-1 max-w-[80%] ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 ${
                      isUser
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-secondary text-secondary-foreground rounded-tl-sm"
                    }`}
                  >
                    <div className="text-sm space-y-3">
                      {textContent && !hasWorkout && (
                        <MarkdownRenderer>{textContent}</MarkdownRenderer>
                      )}

                      {!isUser &&
                        workoutOutputs.map((wo, idx) => (
                          <WorkoutCard key={idx} result={wo} />
                        ))}
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground px-2">
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

        <div className="border-t border-border/50 p-4 bg-card">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <MessageInput
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              isGenerating={false}
              enableInterrupt={true}
              placeholder="Ask me anything about lifting or nutrition..."
            />
          </form>
        </div>
      </div>
    </div>
  );
}
