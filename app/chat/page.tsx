"use client";

import Link from "next/link";
import React, { useState } from "react";

export default function ChatPage() {
  // state
  const [repoUrl, setRepoUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // send message handler
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!repoUrl || !question.trim()) return;

    const userMessage = { role: "user" as const, content: question.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, question: question.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong...");
        return;
      }

      const assistantMessage = {
        role: "assistant" as const,
        content: data.answer || "",
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setHasStarted(true);
      setQuestion("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen text-app-main flex"
      style={{ background: "var(--hero-bg-gradient)" }}
    >
      {/* sidebar */}
      <aside className="w-64 border-r border-app-border flex flex-col">
        <div className="px-4 py-4 border-b border-app-border">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-app-main hover:text-app-muted"
          >
            Explain my <span className="text-app-red">repo</span>
          </Link>
          <p className="text-xs text-app-muted mt-1">
            Chat about a GitHub repo
          </p>
        </div>
        <div className="p-4">
          {/* new chat button  */}
          <button
            type="button"
            onClick={() => {
              setRepoUrl("");
              setQuestion("");
              setMessages([]);
              setHasStarted(false);
              setError(null);
            }}
            className="block w-full rounded-lg bg-app-button hover:bg-app-border text-sm font-medium py-2 px-3 text-center transition-colors border border-app-border/60 cursor-pointer"
          >
            + New chat
          </button>
        </div>
        <div className="mt-auto p-4 text-xs text-app-muted border-t border-app-border">
          <Link href="/" className="hover:text-app-main">
            &larr; Back to home
          </Link>
        </div>
      </aside>
      {/* conversation and input area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* messages list */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-4 overflow-y-auto">
          {messages.length === 0 && !loading && !error && (
            <p className="text-sm text-app-muted text-center mt-10">
              Start by pasting a GitHub repo URL and asking your first question.
            </p>
          )}

          {messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div
                key={i}
                className={`flex w-full ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    isUser
                      ? "max-w-[75%] rounded-lg bg-app-card border border-app-border px-3 py-2 text-sm text-app-main"
                      : "max-w-[75%] rounded-lg bg-transparent border border-app-border/60 px-3 py-2 text-sm text-app-muted"
                  }
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          {loading && <p className="text-xs text-app-muted">Thinking…</p>}

          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        {/* input area */}
        <form
          onSubmit={handleSend}
          className="w-full max-w-3xl mx-auto px-4 pb-6 space-y-3"
        >
          {!hasStarted && (
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="GitHub repo URL (https://github.com/owner/repo)"
              className="w-full rounded-lg border border-app-border bg-app-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-app-border"
              required
            />
          )}

          <div className="flex gap-2 items-end">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!loading) handleSend(e);
                }
              }}
              placeholder={
                hasStarted
                  ? "Ask a follow-up question about this repo..."
                  : "Ask your first question about this repo..."
              }
              rows={1}
              className="flex-1 rounded-lg border border-app-border bg-app-card px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-app-border"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-app-red hover:bg-app-red-hover text-app-main text-sm font-medium px-4 py-2 disabled:opacity-60 cursor-pointer"
            >
              <span className="text-lg leading-none">↑</span>
              {!loading && <span className="sr-only">Send</span>}
              {loading && <span className="text-xs">Sending…</span>}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
