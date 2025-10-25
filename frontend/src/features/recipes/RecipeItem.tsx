import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import "./styles/RecipeItem.css";
import type { IRecipe } from "../../types";
import { deleteRecipe, getRecipes } from "./recipesThunk";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectUser } from "../users/usersSlice";
import SpinnerButton from "../../components/Spinner/SpinnerButton";
import { selectDeleteRecipeFetching } from "./recipesSlice";

interface Props {
  recipe: IRecipe;
}
const RecipeItem = ({ recipe }: Props) => {
  const { _id, name, image, author } = recipe;
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const deleteRecipeLoading = useAppSelector(selectDeleteRecipeFetching);
  const isDeleting = deleteRecipeLoading === _id;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      await dispatch(deleteRecipe(_id));
      await dispatch(getRecipes());
    }
  };

  return (
    <div className="card p-2 recipeCard border-0 w-100">
      {image && (
        <img
          src={API_URL + "/" + image}
          alt={image}
          className="card-img-top m-auto recipe-image"
        />
      )}

      <div className="card-body">
        <div className="recipe-info d-flex flex-column">
          <h5
            className="recipe-title"
            onClick={() => navigate(`/recipes/${_id}`)}
          >
            {name}
          </h5>
          <span
            className="recipe-author"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/user/${author._id}/recipes`);
            }}
          >
            By {author.displayName}
          </span>
        </div>

        {user &&
          user._id === author._id &&
          location.pathname === `/user/${user._id}/recipes` && (
            <button
              type="button"
              className="btn btn-sm btn-danger mt-2 d-flex align-items-center gap-2"
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

export default RecipeItem;
