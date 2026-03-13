## Explain my repo

Explain my repo is a portfolio project built with **Next.js (App Router)** that lets you:

- Paste a **GitHub repository URL**.
- Ask an AI (Google Gemini) questions about the codebase.
- Optionally **sign in with GitHub** to save and revisit chat history (each chat is one repo conversation).

The UI is inspired by GitHub’s dark theme + ChatGPT‑style chat.

---

## Tech stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Auth**: NextAuth.js (GitHub OAuth, JWT sessions)
- **AI**: Google Gemini via `@google/generative-ai`
- **GitHub**: GitHub REST API (repo contents + user repos)
- **Database**: PostgreSQL (chat + messages) via Prisma ORM

---

## Features

- Landing page with two “modes”:
  - **Normal version** – no login, one‑off chat (not persisted).
  - **Auth version** – sign in with GitHub to keep chat history.
- `/chat` page:
  - Paste repo URL + ask first question → turns into a chat thread.
  - Messages rendered with Markdown (code blocks, lists, etc.).
  - “Search by owner” (GitHub username) to help find repos.
  - Sidebar with **New chat** and, when signed in, **chat history**.
- AI is instructed to only answer based on the fetched repo files.

---

## Local setup

### 1. Install dependencies

```bash
cd explain-my-repo
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
# Gemini 
GEMINI_API_KEY="your-google-gemini-api-key"

# GitHub : optional but recommended for higher rate limits
GITHUB_TOKEN="your-personal-access-token"

# NextAuth :GitHub OAuth
AUTH_SECRET="a-random-long-secret-string"
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"

# PostgreSQL 
DATABASE_URL="your-database-url"
```




### 4. Run the dev server

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## How it works 

- **`/api/explain`**:
  - Parses the GitHub URL into `owner` + `repo`.
  - Fetches a curated subset of files from GitHub (root + important folders).
  - Sends the code + your question to Gemini and returns the answer.
- **`/api/user-repos`**:
  - Given a GitHub username, returns a list of public repos (used by “Search by owner”).
- **`/api/auth/[...nextauth]`**:
  - Configures NextAuth to use GitHub login + JWT sessions.
- **`/api/chats` & `/api/chats/[id]` & `/api/chats/[id]/messages`**:
  - Store and load chats + messages in PostgreSQL for signed‑in users.

---
