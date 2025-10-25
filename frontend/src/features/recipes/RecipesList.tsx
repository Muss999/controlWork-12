import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Spinner from "../../components/Spinner/Spinner";
import { selectUser } from "../users/usersSlice";
import { selectGetRecipesFetching, selectRecipes } from "./recipesSlice";
import { getRecipes } from "./recipesThunk";
import RecipeItem from "./RecipeItem";

const RecipesList = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const recipes = useAppSelector(selectRecipes);
  const recipesLoading = useAppSelector(selectGetRecipesFetching);

  useEffect(() => {
    dispatch(getRecipes());
  }, [dispatch]);

  const myRecipes = recipes.filter((recipe) => recipe.author._id === user?._id);

  if (recipesLoading) {
    return <Spinner />;
  }

  if (recipesLoading === false && recipes.length === 0) {
    return (
      <div className="d-flex gap-5">
        <div className="alert alert-warning">Recipes are not found</div>
      </div>
    );
  }
  if (location.pathname === "/myRecipes") {
    return (
      <>
        <h4>My recipes</h4>
        <div className="d-flex flex-wrap gap-3 mb-3">
          {myRecipes.map((oneRecipe) => {
            return <RecipeItem recipe={oneRecipe} key={oneRecipe._id} />;
          })}
        </div>
      </>
    );
  }
  return (
    <>
      <h4>All recipes</h4>

      <div className="d-flex flex-wrap gap-3 mb-3">
        {recipes.map((oneRecipe) => {
          return <RecipeItem recipe={oneRecipe} key={oneRecipe._id} />;
        })}
      </div>
    </>
  );
};

export default RecipesList;
