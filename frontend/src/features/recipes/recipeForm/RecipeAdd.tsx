import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectAddRecipeFetching } from "../recipesSlice";
import type { IRecipeForm } from "../../../types";
import { addRecipe } from "../recipesThunk";
import RecipeForm from "./RecipeForm";

const RecipeAdd = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const addRecipeLoading = useAppSelector(selectAddRecipeFetching);

  const onSubmit = async (recipes: IRecipeForm) => {
    await dispatch(addRecipe(recipes));
    navigate("/");
  };

  return (
    <div className="row mt-2">
      <div className="col-6 m-auto">
        <RecipeForm onSubmit={onSubmit} isLoading={addRecipeLoading} />
      </div>
    </div>
  );
};

export default RecipeAdd;
