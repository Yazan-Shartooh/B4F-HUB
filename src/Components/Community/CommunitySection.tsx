import { useMemo, useState } from "react";
import type { Post, PostCategory } from "../../types";
import { createPost, fetchPosts, setPostLiked } from "../../lib/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { ErrorView, LoadingView, EmptyView } from "../StatusViews";
import ComposeForm from "./ComposeForm";
import CommunityFilters from "./CommunityFilters";
import PostCard from "./PostCard";

interface CommunitySectionProps {
  notify: (kind: "success" | "error", message: string) => void;
}

export default function CommunitySection({ notify }: CommunitySectionProps) {
  const {
    data: posts,
    setData: setPosts,
    status,
    error,
    reload,
  } = useAsyncData(fetchPosts);

  const [categoryFilter, setCategoryFilter] = useState<PostCategory | "all">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<number>>(new Set());

  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        categoryFilter === "all" || post.category === categoryFilter;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        post.author.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    });
  }, [posts, categoryFilter, search]);

  async function handleCreatePost(
    content: string,
    category: PostCategory,
  ): Promise<boolean> {
    setCreating(true);
    try {
      const newPost = await createPost(content, category);
      setPosts((prev) => (prev ? [newPost, ...prev] : [newPost]));
      notify("success", "Post published.");
      return true;
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Couldn't publish that post.",
      );
      return false;
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleLike(post: Post) {
    if (pendingLikeIds.has(post.id)) return;

    setPendingLikeIds((prev) => new Set(prev).add(post.id));
    try {
      const updated = await setPostLiked(post.id, !post.liked);
      setPosts((prev) =>
        prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : prev,
      );
    } catch (err) {
      notify(
        "error",
        err instanceof Error
          ? err.message
          : "Couldn't update that like. Please try again.",
      );
    } finally {
      setPendingLikeIds((prev) => {
        const next = new Set(prev);
        next.delete(post.id);
        return next;
      });
    }
  }

  return (
    <section className="main-content panel" aria-label="Community">
      <header className="panel-header">
        <h2>Community</h2>
        <p className="panel-subtitle">
          Updates, events, wins, and resources from the cohort.
        </p>
      </header>

      <ComposeForm submitting={creating} onSubmit={handleCreatePost} />

      {status === "success" && posts && posts.length > 0 && (
        <CommunityFilters
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          search={search}
          onSearchChange={setSearch}
        />
      )}
      <div className="panel-scroll">
        {status === "loading" && <LoadingView label="Loading posts…" />}

        {status === "error" && (
          <ErrorView
            message={error ?? "Something went wrong."}
            onRetry={reload}
          />
        )}

        {status === "success" && posts && posts.length === 0 && (
          <EmptyView
            title="No posts yet"
            message="Be the first to share something with the cohort."
          />
        )}

        {status === "success" &&
          posts &&
          posts.length > 0 &&
          filteredPosts.length === 0 && (
            <EmptyView
              title="Nothing here"
              message="No posts match your filters. Try a different category or search."
            />
          )}

        {status === "success" && filteredPosts.length > 0 && (
          <div className="post-list">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLikePending={pendingLikeIds.has(post.id)}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
