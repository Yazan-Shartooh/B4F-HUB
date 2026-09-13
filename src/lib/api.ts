import type { Opportunity, Post, PostCategory } from "../types";

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  let body: unknown = null;

  try {
    body = await res.json();
  } catch {
    // Response had no JSON body — fall through to the generic error below.
  }

  if (!res.ok) {
    const message =
      body && typeof body === "object" && "error" in body && typeof (body as { error?: unknown }).error === "string"
        ? (body as { error: string }).error
        : `Request failed with status ${res.status}.`;
    throw new Error(message);
  }

  return body as T;
}

// ---------- Community ----------

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  return parseJsonOrThrow<Post[]>(res);
}

export async function createPost(content: string, category: PostCategory): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, category }),
  });
  return parseJsonOrThrow<Post>(res);
}

export async function setPostLiked(id: number, liked: boolean): Promise<Post> {
  const res = await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ liked }),
  });
  return parseJsonOrThrow<Post>(res);
}

// ---------- Opportunities ----------

export async function fetchOpportunities(): Promise<Opportunity[]> {
  const res = await fetch("/api/opportunities");
  return parseJsonOrThrow<Opportunity[]>(res);
}

export async function applyToOpportunity(id: number): Promise<Opportunity> {
  const res = await fetch(`/api/opportunities/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ applied: true }),
  });
  return parseJsonOrThrow<Opportunity>(res);
}
