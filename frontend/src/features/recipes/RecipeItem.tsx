import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import "./styles/RecipeItem.css";
import type { IRecipe } from "../../types";

interface Props {
  recipe: IRecipe;
}
const RecipeItem = ({ recipe }: Props) => {
  const { _id, name, image, author } = recipe;
  const navigate = useNavigate();

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
            onClick={() => navigate(`/user/${author._id}/recipes`)}
          >
            By {author.displayName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeItem;
