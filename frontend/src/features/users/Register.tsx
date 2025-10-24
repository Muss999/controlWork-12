import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./UserForm.css";
import { selectRegisterError, selectRegisterLoading } from "./usersSlice";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { IUserRegister } from "../../types";
import { register } from "./usersThunk";
import SpinnerButton from "../../components/Spinner/SpinnerButton";
import FileInput from "../../components/FileInput/FileInput";

const Register = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const loading = useAppSelector(selectRegisterLoading);
  const navigate = useNavigate();

  const [state, setState] = useState<IUserRegister>({
    username: "",
    password: "",
    avatar: null,
    displayName: "",
    email: "",
  });
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const getFieldError = (fieldName: string) => {
    return error?.errors[fieldName]?.message;
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(register(state)).unwrap();
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setFileName("");
      navigate("/");
    } catch (e) {
      console.error("Registration error:", e);
      return;
    }
  };

  const fileInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setState((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
    fileInputChangeHandler(e);
  };
  return (
    <>
      <form
        className="userForm d-flex flex-column gap-3 align-items-center"
        onSubmit={submitFormHandler}
      >
        <h2>Registration</h2>
        <div className="input-group">
          <input
            name="username"
            type="text"
            className={`form-control ${
              getFieldError("username") ? "is-invalid" : ""
            }`}
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={inputChangeHandler}
            value={state.username}
            autoComplete="new-username"
          />
          {getFieldError("username") && (
            <div className="invalid-feedback">{getFieldError("username")}</div>
          )}
        </div>
        <div className="input-group">
          <input
            name="displayName"
            type="text"
            className={`form-control ${
              getFieldError("displayName") ? "is-invalid" : ""
            }`}
            placeholder="DisplayName"
            aria-label="DisplayName"
            aria-describedby="basic-addon1"
            onChange={inputChangeHandler}
            value={state.displayName}
            autoComplete="new-displayName"
          />
          {getFieldError("displayName") && (
            <div className="invalid-feedback">
              {getFieldError("displayName")}
            </div>
          )}
        </div>
        <div className="input-group">
          <input
            name="password"
            type="password"
            className={`form-control ${
              getFieldError("password") ? "is-invalid" : ""
            }`}
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon1"
            onChange={inputChangeHandler}
            value={state.password}
            autoComplete="new-password"
          />
          {getFieldError("password") && (
            <div className="invalid-feedback">{getFieldError("password")}</div>
          )}
        </div>
        <div className="input-group">
          <input
            name="email"
            type="email"
            className={`form-control ${
              getFieldError("email") ? "is-invalid" : ""
            }`}
            placeholder="Email"
            aria-label="Email"
            aria-describedby="basic-addon1"
            onChange={inputChangeHandler}
            value={state.email}
            autoComplete="new-email"
          />
          {getFieldError("email") && (
            <div className="invalid-feedback">{getFieldError("email")}</div>
          )}
        </div>
        <div className="form-group mb-3">
          <FileInput
            name="avatar"
            placeholder="Image"
            onFileChange={onFileChange}
            inputRef={inputRef}
            fileName={fileName}
          />
        </div>
        <button
          type="submit"
          className="btn btn-success w-50"
          disabled={loading}
        >
          {loading && <SpinnerButton />}
          Sigh Up
        </button>
        <Link to="/login">Already have an account? Sign in</Link>
      </form>
    </>
  );
};

export default Register;
