import { useNavigate } from "react-router-dom";
import type { IRecipeForm } from "../../../types";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import FileInput from "../../../components/FileInput/FileInput";
import SpinnerButton from "../../../components/Spinner/SpinnerButton";

interface Props {
  onSubmit: (recipe: IRecipeForm) => void;
  isLoading?: boolean;
  error?: string | null;
}

interface ValidationErrors {
  name?: string;
  recipe?: string;
  image?: string;
}

const initialState: IRecipeForm = {
  name: "",
  image: null,
  recipe: "",
};

const RecipeForm = ({ onSubmit, isLoading = false, error = null }: Props) => {
  const navigate = useNavigate();
  const [state, setState] = useState<IRecipeForm>(initialState);
  const [fileName, setFileName] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const changeRecipe = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!state.name.trim()) {
      errors.name = "Name is required";
    }
    if (!state.recipe.trim()) {
      errors.recipe = "Recipe is required";
    }
    if (!state.image) {
      errors.image = "Image is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newRecipe: IRecipeForm = {
      name: state.name.trim(),
      recipe: state.recipe.trim(),
      image: state.image!,
    };

    onSubmit(newRecipe);
    setState(initialState);
    setFileName("");
    setValidationErrors({});
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      setState((prevState) => ({ ...prevState, [name]: files[0] }));
      setFileName(files[0].name);

      if (validationErrors.image) {
        setValidationErrors((prev) => ({ ...prev, image: undefined }));
      }
    } else {
      setState((prevState) => ({ ...prevState, [name]: null }));
      setFileName("");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} noValidate>
      <h4>Add recipe</h4>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="form-group mb-3">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className={`form-control ${
            validationErrors.name ? "is-invalid" : ""
          }`}
          value={state.name}
          onChange={changeRecipe}
          autoFocus
        />
        {validationErrors.name && (
          <div className="invalid-feedback">{validationErrors.name}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="recipe">Recipe</label>
        <input
          type="text"
          name="recipe"
          id="recipe"
          className={`form-control ${
            validationErrors.recipe ? "is-invalid" : ""
          }`}
          value={state.recipe}
          onChange={changeRecipe}
        />
        {validationErrors.recipe && (
          <div className="invalid-feedback">{validationErrors.recipe}</div>
        )}
      </div>

      <div className="form-group mb-3">
        <FileInput
          name="image"
          placeholder="Image"
          onFileChange={fileInputChangeHandler}
          inputRef={inputRef}
          fileName={fileName}
        />
        {validationErrors.image && (
          <div className="text-danger small mt-1">{validationErrors.image}</div>
        )}
      </div>

      <div className="mb-3">
        <button
          type="submit"
          className="btn btn-success me-2 d-inline-flex align-items-center gap-2"
          disabled={isLoading}
        >
          {isLoading && <SpinnerButton />}
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/")}
          disabled={isLoading}
        >
          Back to main page
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
