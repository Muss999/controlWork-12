import { useParams } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";
import SpinnerButton from "../../../components/Spinner/SpinnerButton";
import type { ICommentForm } from "../../../types";

interface Props {
  onSubmit: (comment: ICommentForm) => void;
  isLoading?: boolean;
  error?: string | null;
}

const CommentForm = ({ onSubmit, isLoading = false, error = null }: Props) => {
  const { id: recipeId } = useParams();
  const [text, setText] = useState("");
  const [validationError, setValidationError] = useState("");

  const changeComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    if (validationError) {
      setValidationError("");
    }
  };

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();

    if (!text.trim()) {
      setValidationError("Comment text is required");
      return;
    }

    if (!recipeId) {
      setValidationError("Recipe ID is missing");
      return;
    }

    const newComment: ICommentForm = {
      text: text.trim(),
      recipeId,
    };

    onSubmit(newComment);
    setText("");
    setValidationError("");
  };

  return (
    <div className="mt-4">
      <h5 className="mb-3">Add Comment</h5>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={onSubmitHandler} noValidate>
        <div className="mb-3">
          <textarea
            name="text"
            id="text"
            rows={3}
            className={`form-control ${validationError ? "is-invalid" : ""}`}
            placeholder="Write your comment..."
            value={text}
            onChange={changeComment}
            disabled={isLoading}
          />
          {validationError && (
            <div className="invalid-feedback">{validationError}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary d-inline-flex align-items-center gap-2"
          disabled={isLoading || !text.trim()}
        >
          {isLoading && <SpinnerButton />}
          {isLoading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
