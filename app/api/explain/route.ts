import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// adding url function helper
function parseRepoUrl(url: string) {
  const match = url.match(/github\.com[/]([^/]+)[/]([^/]+?)(?:\.git)?\/?$/);
  return match ? { owner: match[1], repo: match[2] } : null;
}

// add fetch repo content function
async function fetchRepoContent(
  owner: string,
  repo: string,
  ref: string
): Promise<string> {
  // use github token form .env file if theres one , otherwise we use the simpler version without auth
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // fetching files
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents?ref=${ref}`,
    { headers }
  );
  if (!res.ok) throw new Error("Repo not found or private");
  const items = await res.json();
  // check if we received files correctly
  if (!Array.isArray(items)) throw new Error("Invalid repo response");
  // take files and send them into big string to the ai as part of the prompt
  const parts: string[] = [];
  // limit the files to 20 cuz of the free ai limited tokens
  const maxFiles = 20;
  // count files
  let count = 0;

  for (const item of items) {
    // break when the files number reaches the max
    if (count >= maxFiles) break;
    // start with files on the root
    if (item.type === "file") {
      // get file url
      const fileUrl = item.download_url || item.url;
      // get response object
      const fileRes = await fetch(fileUrl, { headers });
      if (fileRes.ok) {
        const text = await fileRes.text();
        // seperate the files with headers inline
        parts.push(`\n--- ${item.path} ---\n${text.slice(0, 8000)}`);
        // increment the counts
        count++;
      }
    }
    // if it's a folder , we look inside the most important ones
    else if (
      item.type === "dir" &&
      ["src", "app", "lib", "components", "pages"].includes(item.name)
    ) {
      const dirRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${item.name}?ref=${ref}`,
        { headers }
      );
      if (!dirRes.ok) continue;
      // get files inside the folder
      const dirItems = await dirRes.json();
      // double check
      if (!Array.isArray(dirItems)) continue;
      // take a maximum number of 6 files inside a folder

      for (const f of dirItems.slice(0, 6)) {
        // respecting the main condition
        if (count >= maxFiles) break;
        if (f.type === "file" && f.download_url) {
          const fileRes = await fetch(f.download_url, { headers });
          if (fileRes.ok) {
            const text = await fileRes.text();
            parts.push(`\n--- ${f.path} ---\n${text.slice(0, 6000)}`);
            count++;
          }
        }
      }
    }
  }
  //   assemble all the chunks into one string, if nothing was read return a message
  return parts.length ? parts.join("\n") : "No files could be read.";
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { repoUrl, question } = body;

  // check if the url or the question is missing
  if (!repoUrl || !question) {
    return NextResponse.json(
      { error: "Missing repoUrl or the question" },
      { status: 400 }
    );
  }

  const parsed = parseRepoUrl(String(repoUrl).trim());
  if (!parsed) {
    return NextResponse.json(
      { error: "Invalid GitHub repo URL, try again" },
      { status: 400 }
    );
  }

  // now we store the owner and the repo name
  const { owner, repo } = parsed;

  let repoContent: string;
  //   handle both cases master and main
  try {
    repoContent = await fetchRepoContent(owner, repo, "main");
  } catch {
    repoContent = await fetchRepoContent(owner, repo, "master");
  }

  // check if we have the gemini api key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { error: "Server missing gemini api key" },
      { status: 500 }
    );

  // create gemini client and the version
  const genAi = new GoogleGenerativeAI(apiKey);
  const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });

  // add the prompt
  const prompt = `You are an expert software engineer helping a developer understand a GitHub repository.

You must answer ONLY based on the provided repository content.
Do not invent files, functions, or behavior that are not present in the provided content.
If the answer is not clearly supported by the repository content, say that you do not have enough information.

When possible:
- mention the relevant file path(s)
- refer to specific functions, components, or code structure
- keep the answer concise, clear, and practical

Format your response like this:
1. Short answer
2. Relevant file(s)
3. Brief explanation

REPOSITORY CONTENT:
${repoContent}

USER QUESTION:
${question}`;

  // return response as a json file and handle the error
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: "AI request failed ",
      },
      { status: 502 }
    );
  }
}
