"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-app-page text-app-main flex flex-col">
      {/* big hero background – GitHub blue with subtle gradient */}
      <div
        className="flex-1"
        style={{ background: "var(--hero-bg-gradient)" }}
      >
        {/* welcome + explanation */}
        <main className="min-h-full">
          <section className="max-w-2xl mx-auto px-6 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-app-main">
            Explain my <span className="text-app-red">repo</span>
          </h1>
          <p className="mt-6 text-lg text-app-muted leading-relaxed">
            Paste any GitHub repo URL and chat with an AI that reads the code for you.
            Ask what the project does, how a feature works, or how to get started —
            no clone, no search, just ask.
          </p>
        </section>

        {/* two cards: normal vs auth */}
        <section className="max-w-4xl mx-auto px-6 py-8">
          <h2 className="text-xl font-semibold text-app-main mb-6 text-center">
            Choose your experience
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* normal version */}
            <div className="rounded-xl border border-app-border bg-app-card p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-app-main mb-2">Normal version</h3>
              <p className="text-sm text-app-muted mb-4 flex-1">
                No account needed. One chat per session: paste a repo URL, ask
                your first question, then keep chatting like ChatGPT. When you
                start a new chat, you start fresh — no history or saved chats.
              </p>
              <ul className="text-xs text-app-muted space-y-1 mb-4">
                <li>• No login</li>
                <li>• One repo per chat, no history</li>
                <li>• New chat = new conversation</li>
              </ul>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-lg bg-app-red text-app-main text-sm font-medium py-2.5 px-4 hover:bg-app-red-hover transition-colors"
              >
                Start normal chat
              </Link>
            </div>

            {/* auth version – neon border for "premium" feel */}
            <div className="card-auth-neon rounded-xl bg-app-card/80 p-6 flex flex-col opacity-90">
              <h3 className="text-lg font-semibold text-app-main mb-2">Auth version</h3>
              <p className="text-sm text-app-muted mb-4 flex-1">
                Sign in to save your chats and search your history. Revisit past
                repos and conversations anytime. Multiple chats, one place.
              </p>
              <ul className="text-xs text-app-muted space-y-1 mb-4">
                <li>• Login with GitHub</li>
                <li>• Chat history and search</li>
                <li>• Resume any conversation</li>
              </ul>
              <button
                type="button"
                onClick={() => {
                  // to implement later
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-app-border bg-app-button text-app-main text-sm font-medium py-2.5 px-4 hover:bg-app-border transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Log in with GitHub
              </button>
            </div>
          </div>
        </section>
        </main>
      </div>

      {/* footer */}
      <footer className="border-t border-app-border py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-app-muted">
            Explain my repo — understand any GitHub codebase with AI.
          </p>
          <div className="flex gap-6 text-sm text-app-muted">
            <a
              href="https://www.amirghouari.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-app-main transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-app-main transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/amir-ghouari-395a5b3b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-app-main transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
