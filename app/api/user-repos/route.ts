import { NextRequest, NextResponse } from "next/server";


 //returns public repos for a GitHub user owner
export async function GET(request: NextRequest) {
  // get the username
  const username = request.nextUrl.searchParams.get("username")?.trim();
  if (!username) {
    return NextResponse.json(
      { error: "username is required" },
      { status: 400 }
    );
  }
  // GitHub token
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=30&sort=updated`,
      { headers }
    );

    if (res.status === 404) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repos" },
        { status: res.status }
      );
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid response" },
        { status: 502 }
      );
    }

    const repos = data.map((repo: { full_name: string; html_url: string; name: string }) => ({
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
    }));

    return NextResponse.json({ repos });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch repos" },
      { status: 502 }
    );
  }
}
