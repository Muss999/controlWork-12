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
    <div
      className={"card p-2 recipeCard border border-2"}
      onClick={() => {
        navigate(`/recipes/${_id}`);
      }}
    >
      {image === null ? null : (
        <img
          src={API_URL + "/" + image}
          className="card-img-top m-auto"
          style={{
            minWidth: "240px",
            maxWidth: "240px",
            maxHeight: "150px",
            minHeight: "150px",
            borderRadius: "5px",
          }}
          alt={image}
        />
      )}

      <div className="card-body d-flex flex-column">
        <h5 className="card-title m-0">{name}</h5>
        <p className="m-0">By {author.displayName}</p>
      </div>
    </div>
  );
};

export default RecipeItem;
