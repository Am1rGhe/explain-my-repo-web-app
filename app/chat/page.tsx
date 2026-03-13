"use client";

import Link from "next/link";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  // placeholder: replace with NextAuth useSession() when you add auth
  const [user, setUser] = useState<{ name: string } | null>(null);
  // search by owner (forgot URL)
  const [ownerSearch, setOwnerSearch] = useState("");
  const [ownerRepos, setOwnerRepos] = useState<{ name: string; fullName: string; url: string }[]>([]);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState<string | null>(null);

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

  async function handleSearchByOwner(e?: React.FormEvent) {
    e?.preventDefault();
    if (!ownerSearch.trim()) return;
    setOwnerError(null);
    setOwnerRepos([]);
    setOwnerLoading(true);
    try {
      const res = await fetch(
        `/api/user-repos?username=${encodeURIComponent(ownerSearch.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setOwnerError(data.error || "Failed to load repos");
        return;
      }
      setOwnerRepos(data.repos || []);
      if (!data.repos?.length) setOwnerError("No public repos found.");
    } catch {
      setOwnerError("Network error");
    } finally {
      setOwnerLoading(false);
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
        <div className="mt-auto p-4 space-y-3 border-t border-app-border">
          {!user ? (
            <button
              type="button"
              onClick={() => {
                // to implement later
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-app-border bg-app-button py-2 px-3 text-sm font-medium text-app-main hover:bg-app-border transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Log in with GitHub
            </button>
          ) : (
            <p className="text-xs text-app-muted">{user.name}</p>
          )}
          <Link href="/" className="block text-xs text-app-muted hover:text-app-main">
            &larr; Back to home
          </Link>
        </div>
      </aside>
      {/* conversation and input area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* messages list */}
        <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-4 overflow-y-auto rounded-2xl bg-black/10 border border-app-border/40 backdrop-blur-sm">
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
                      ? "max-w-[75%] rounded-2xl bg-app-card border border-app-border px-4 py-3 text-sm text-app-main whitespace-pre-wrap break-words overflow-x-auto"
                      : "max-w-[75%] rounded-2xl bg-black/10 border border-app-border/60 px-4 py-3 text-sm text-app-muted whitespace-pre-wrap break-words overflow-x-auto prose prose-invert max-w-none"
                  }
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content}
                  </ReactMarkdown>
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
            <>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="GitHub repo URL (https://github.com/owner/repo)"
                className="w-full rounded-lg border border-app-border bg-app-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-app-border"
                required
              />
              <div className="rounded-lg border border-app-border/60 bg-app-card/50 p-3 space-y-2">
                <p className="text-xs text-app-muted">Forgot the URL? Search by owner (GitHub username)</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ownerSearch}
                    onChange={(e) => setOwnerSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearchByOwner();
                      }
                    }}
                    placeholder="e.g. facebook, vercel"
                    className="flex-1 rounded-lg border border-app-border bg-app-card px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-app-border"
                  />
                  <button
                    type="button"
                    disabled={ownerLoading}
                    onClick={() => handleSearchByOwner()}
                    className="rounded-lg bg-app-button hover:bg-app-border text-app-main text-sm font-medium px-3 py-2 disabled:opacity-60"
                  >
                    {ownerLoading ? "…" : "Find repos"}
                  </button>
                </div>
                {ownerError && (
                  <p className="text-xs text-red-400">{ownerError}</p>
                )}
                {ownerRepos.length > 0 && (
                  <ul className="max-h-40 overflow-y-auto space-y-1 mt-2">
                    {ownerRepos.map((repo) => (
                      <li key={repo.url}>
                        <button
                          type="button"
                          onClick={() => {
                            setRepoUrl(repo.url);
                            setOwnerRepos([]);
                            setOwnerError(null);
                          }}
                          className="w-full text-left text-xs text-app-muted hover:text-app-main truncate rounded px-2 py-1 hover:bg-app-border/50"
                        >
                          {repo.fullName}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
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
