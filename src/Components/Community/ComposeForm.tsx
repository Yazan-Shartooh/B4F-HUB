import { useState } from "react";
import type { FormEvent } from "react";
import type { PostCategory } from "../../types";

const CATEGORY_OPTIONS: { value: PostCategory; label: string }[] = [
  { value: "announcement", label: "Announcement" },
  { value: "event", label: "Event" },
  { value: "community", label: "Community" },
  { value: "resource", label: "Resource" },
];

const MIN_LENGTH = 3;
const MAX_LENGTH = 2000;

interface ComposeFormProps {
  submitting: boolean;
  onSubmit: (content: string, category: PostCategory) => Promise<boolean>;
}

export default function ComposeForm({ submitting, onSubmit }: ComposeFormProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory | "">("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function validate(): string | null {
    const trimmed = content.trim();
    if (trimmed.length === 0) {
      return "Write something before posting.";
    }
    if (trimmed.length < MIN_LENGTH) {
      return `Posts need at least ${MIN_LENGTH} characters.`;
    }
    if (trimmed.length > MAX_LENGTH) {
      return `Posts can't be longer than ${MAX_LENGTH} characters.`;
    }
    if (!category) {
      return "Choose a category for this post.";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const problem = validate();
    if (problem) {
      setValidationError(problem);
      return;
    }

    setValidationError(null);
    const succeeded = await onSubmit(content.trim(), category as PostCategory);
    if (succeeded) {
      setContent("");
      setCategory("");
    }
  }

  return (
    <form className="compose-form" onSubmit={handleSubmit} noValidate>
      <textarea
        className="compose-textarea"
        placeholder="Share an update, a win, a question, or a resource with the cohort..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
        maxLength={MAX_LENGTH + 200}
        disabled={submitting}
      />

      <div className="compose-row">
        <div className="compose-categories" role="radiogroup" aria-label="Post category">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`chip${category === option.value ? " chip--selected" : ""}`}
              aria-pressed={category === option.value}
              onClick={() => setCategory(option.value)}
              disabled={submitting}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? "Posting…" : "Post"}
        </button>
      </div>

      {validationError && <p className="form-error">{validationError}</p>}
    </form>
  );
}
