import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Spinner from "../../components/Spinner/Spinner";
import { selectComments, selectGetCommentsFetching } from "./commentsSlice";
import { getComments } from "./commentsThunk";
import { useParams } from "react-router-dom";
import CommentItem from "./CommentItem";

interface Props {
  recipeAuthorId: string;
}

const CommentsList = ({ recipeAuthorId }: Props) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const comments = useAppSelector(selectComments);
  const commentsLoading = useAppSelector(selectGetCommentsFetching);

  useEffect(() => {
    if (id) {
      dispatch(getComments(id));
    }
  }, [dispatch, id]);

  if (commentsLoading) {
    return <Spinner />;
  }

  if (commentsLoading === false && comments.length === 0) {
    return (
      <div className="d-flex gap-5">
        <div className="alert alert-warning">Comments are not found</div>
      </div>
    );
  }
  return (
    <div className="mt-4 w-50">
      <h5 className="mb-3">Comments ({comments.length})</h5>

      <div>
        {comments.map((oneComment) => (
          <CommentItem
            key={oneComment._id}
            comment={oneComment}
            recipeAuthorId={recipeAuthorId}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsList;
