import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../users/usersSlice";
import {
  selectDeleteRecipeFetching,
  selectGetOneRecipeFetching,
  selectOneRecipe,
} from "./recipesSlice";
import { deleteRecipe, getOneRecipe } from "./recipesThunk";
import { useEffect } from "react";
import Spinner from "../../components/Spinner/Spinner";
import SpinnerButton from "../../components/Spinner/SpinnerButton";
import { API_URL } from "../../constants";
import CommentsList from "../comments/CommentsList";
import CommentAdd from "../comments/commentsForm/CommentAdd";

const RecipeInfo = () => {
  const { id: recipeId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const oneRecipe = useAppSelector(selectOneRecipe);
  const oneRecipeLoading = useAppSelector(selectGetOneRecipeFetching);
  const deleteRecipeLoading = useAppSelector(selectDeleteRecipeFetching);

  const isDeleting = deleteRecipeLoading === recipeId;

  useEffect(() => {
    if (recipeId) {
      dispatch(getOneRecipe(recipeId));
    }
  }, [dispatch, recipeId]);

  const deleteOneRecipe = async () => {
    if (!recipeId) return;

    try {
      await dispatch(deleteRecipe(recipeId)).unwrap();
      navigate(-1);
    } catch (err) {
      alert(err);
    }
  };

  if (oneRecipeLoading) {
    return <Spinner />;
  }
  if (!recipeId) {
    return <div className="alert alert-danger">Something went wrong!</div>;
  }
  if (!oneRecipe) {
    return <div className="alert alert-warning">Recipe not found</div>;
  }

  return (
    <>
      <div className="d-flex gap-4 flex-column">
        <div className="d-flex gap-5">
          <div>
            {oneRecipe.image === null ? null : (
              <img
                src={API_URL + "/" + oneRecipe.image}
                className="card-img-top"
                style={{
                  minWidth: "300px",
                  maxWidth: "300px",
                  maxHeight: "200px",
                  minHeight: "200px",
                  borderRadius: "10px",
                }}
                alt={oneRecipe.image}
              />
            )}
          </div>
          <div className="d-flex flex-column w-50">
            <h4>{oneRecipe.name}</h4>
            <p className="mb-1">
              <b>Author: </b>
              <Link to={`/user/${oneRecipe.author._id}/recipes`}>
                {oneRecipe.author.displayName}
              </Link>
            </p>
            <p className="mb-1">
              <b>Recipe:</b> {oneRecipe.recipe}
            </p>
          </div>

          <div className="d-flex gap-3 flex-column">
            {user && user._id === oneRecipe.author._id && (
              <button
                type="button"
                className="btn btn-danger align-self-start w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={deleteOneRecipe}
                disabled={isDeleting}
              >
                {isDeleting && <SpinnerButton />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}

            <button
              type="button"
              className="btn btn-primary align-self-start w-100"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
      <div>
        {user && <CommentAdd />}
        <CommentsList recipeAuthorId={oneRecipe.author._id} />
      </div>
    </>
  );
};

export default RecipeInfo;
