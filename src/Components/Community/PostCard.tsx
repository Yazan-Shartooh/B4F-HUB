import type { Post } from "../../types";
import { formatPostTime } from "../../lib/formatTime";

const CATEGORY_LABEL: Record<Post["category"], string> = {
  announcement: "Announcement",
  event: "Event",
  community: "Community",
  resource: "Resource",
};

interface PostCardProps {
  post: Post;
  isLikePending: boolean;
  onToggleLike: (post: Post) => void;
}

export default function PostCard({ post, isLikePending, onToggleLike }: PostCardProps) {
  return (
    <article className="post-card">
      <div className="post-card-top">
        <span className="avatar" aria-hidden="true">
          {post.avatar}
        </span>
        <div className="post-card-meta">
          <span className="post-author">{post.author}</span>
          <span className="post-time">{formatPostTime(post.createdAt)}</span>
        </div>
        <span className={`badge badge--${post.category}`}>{CATEGORY_LABEL[post.category]}</span>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-card-actions">
        <button
          type="button"
          className={`like-btn${post.liked ? " like-btn--active" : ""}`}
          onClick={() => onToggleLike(post)}
          disabled={isLikePending}
          aria-pressed={post.liked}
        >
          <span className="like-icon" aria-hidden="true">
            {post.liked ? "♥" : "♡"}
          </span>
          <span>{post.liked ? "Liked" : "Like"}</span>
          <span className="like-count">{post.likes}</span>
        </button>
      </div>
    </article>
  );
}
