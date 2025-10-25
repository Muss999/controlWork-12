import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectGetRecipesFetching, selectRecipes } from "./recipesSlice";
import { getRecipes } from "./recipesThunk";
import Spinner from "../../components/Spinner/Spinner";
import RecipeItem from "./RecipeItem";
import { selectUser } from "../users/usersSlice";

const UserRecipes = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const { id } = useParams();
  const recipes = useAppSelector(selectRecipes);
  const recipesLoading = useAppSelector(selectGetRecipesFetching);

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  const userRecipes = recipes.filter(
    (recipe) => recipe.author && recipe.author._id === id
  );

  if (recipesLoading) {
    return <Spinner />;
  }

  if (!recipesLoading && userRecipes.length === 0) {
    return (
      <div className="alert alert-warning">This user has no recipes yet.</div>
    );
  }

  return (
    <>
      <h4 className="mb-3">{userRecipes[0].author.displayName}'s Recipes</h4>
      {user && user._id === id && (
        <Link className="btn btn-primary mb-3 ml-auto" to={"/recipes/add"}>
          Add recipe
        </Link>
      )}
      <div className="d-flex flex-wrap gap-3">
        {userRecipes.map((recipe) => (
          <RecipeItem recipe={recipe} key={recipe._id} />
        ))}
      </div>
    </>
  );
};

export default UserRecipes;
