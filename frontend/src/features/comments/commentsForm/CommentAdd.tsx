import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectAddCommentError,
  selectAddCommentFetching,
} from "../commentsSlice";
import type { ICommentForm } from "../../../types";
import { addComment, getComments } from "../commentsThunk";
import CommentForm from "./CommentForm";

const CommentAdd = () => {
  const { id: recipeId } = useParams();
  const dispatch = useAppDispatch();
  const addCommentLoading = useAppSelector(selectAddCommentFetching);
  const addCommentError = useAppSelector(selectAddCommentError);

  const onSubmit = async (comment: ICommentForm) => {
    try {
      await dispatch(addComment(comment)).unwrap();
      if (recipeId) {
        await dispatch(getComments(recipeId));
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <div className="mt-4 mb-4">
      <CommentForm
        onSubmit={onSubmit}
        isLoading={addCommentLoading}
        error={addCommentError}
      />
    </div>
  );
};

export default CommentAdd;
