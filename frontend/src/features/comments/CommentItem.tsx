import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import type { IComment } from "../../types";
import { selectUser } from "../users/usersSlice";
import { selectDeleteCommentFetching } from "./commentsSlice";
import { deleteComment, getComments } from "./commentsThunk";
import SpinnerButton from "../../components/Spinner/SpinnerButton";

interface Props {
  comment: IComment;
  recipeAuthorId?: string;
}

const CommentItem = ({ comment, recipeAuthorId }: Props) => {
  const { id: recipeId } = useParams();
  const { _id, text, author } = comment;
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const deleteCommentLoading = useAppSelector(selectDeleteCommentFetching);
  const isDeleting = deleteCommentLoading === _id;

  const handleDelete = async () => {
    if (!recipeId) return;

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await dispatch(deleteComment(_id)).unwrap();
        await dispatch(getComments(recipeId));
      } catch (error) {
        alert(error);
      }
    }
  };

  const canDelete =
    user && (user._id === author._id || user._id === recipeAuthorId);

  return (
    <div className="border border-2 bg-white p-2 m-3 w-100   rounded-1">
      <div className="d-flex justify-content-between align-items-center">
        <div className="flex-grow-1">
          <strong className="d-block mb-1">{author.displayName}</strong>
          <p className="mb-0">{text}</p>
        </div>

        {canDelete && (
          <button
            type="button"
            className="btn btn-sm btn-danger ms-3"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting && <SpinnerButton />}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
