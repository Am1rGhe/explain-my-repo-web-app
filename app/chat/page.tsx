"use client";

import Link from "next/link";

export default function ChatPage() {
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
          <Link
            href="/chat"
            className="block w-full rounded-lg bg-app-button hover:bg-app-border text-sm font-medium py-2 px-3 text-center transition-colors border"
          >
            + New chat
          </Link>
        </div>
        <div className="mt-auto p-4 text-xs text-app-muted border-t border-app-border">
          <Link href="/" className="hover:text-app-main">
            &larr; Back to home
          </Link>
        </div>
      </aside>
      {/* conversation and input area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <p className="text-app-muted">
            Chat area
          </p>
        </div>
      </main>
    </div>
  );
}
