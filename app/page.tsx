"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col">
      {/* big hero background – GitHub blue with subtle gradient */}
      <div
        className="flex-1"
        style={{ background: "var(--hero-bg-gradient)" }}
      >
        {/* welcome + explanation */}
        <main className="min-h-full">
          <section className="max-w-2xl mx-auto px-6 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Explain my <span className="text-[#f85149]">repo</span>
          </h1>
          <p className="mt-6 text-lg text-[#8b949e] leading-relaxed">
            Paste any GitHub repo URL and chat with an AI that reads the code for you.
            Ask what the project does, how a feature works, or how to get started —
            no clone, no search, just ask.
          </p>
        </section>

        {/* two cards: normal vs auth */}
        <section className="max-w-4xl mx-auto px-6 py-8">
          <h2 className="text-xl font-semibold text-[#f0f6fc] mb-6 text-center">
            Choose your experience
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* normal version */}
            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6 flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-2">Normal version</h3>
              <p className="text-sm text-[#8b949e] mb-4 flex-1">
                No account needed. One chat per session: paste a repo URL, ask
                your first question, then keep chatting like ChatGPT. When you
                start a new chat, you start fresh — no history or saved chats.
              </p>
              <ul className="text-xs text-[#8b949e] space-y-1 mb-4">
                <li>• No login</li>
                <li>• One repo per chat, no history</li>
                <li>• New chat = new conversation</li>
              </ul>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-lg bg-[#f85149] text-white text-sm font-medium py-2.5 px-4 hover:bg-[#da3633] transition-colors"
              >
                Start normal chat
              </Link>
            </div>

            {/* auth version – neon border for "premium" feel */}
            <div className="card-auth-neon rounded-xl bg-[#161b22]/80 p-6 flex flex-col opacity-90">
              <h3 className="text-lg font-semibold text-white mb-2">Auth version</h3>
              <p className="text-sm text-[#8b949e] mb-4 flex-1">
                Sign in to save your chats and search your history. Revisit past
                repos and conversations anytime. Multiple chats, one place.
              </p>
              <ul className="text-xs text-[#8b949e] space-y-1 mb-4">
                <li>• Login with GitHub</li>
                <li>• Chat history and search</li>
                <li>• Resume any conversation</li>
              </ul>
              <button
                type="button"
                disabled
                className="inline-flex items-center justify-center rounded-lg bg-[#21262d] text-[#8b949e] text-sm font-medium py-2.5 px-4 cursor-not-allowed"
              >
                Coming soon
              </button>
            </div>
          </div>
        </section>
        </main>
      </div>

      {/* footer */}
      <footer className="border-t border-[#30363d] py-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#8b949e]">
            Explain my repo — understand any GitHub codebase with AI.
          </p>
          <div className="flex gap-6 text-sm text-[#8b949e]">
            <a
              href="https://www.amirghouari.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/amir-ghouari-395a5b3b0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
