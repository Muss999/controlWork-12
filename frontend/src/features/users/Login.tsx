import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./UserForm.css";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { IUserLogin } from "../../types";
import { selectLoginError, selectLoginLoading } from "./usersSlice";
import { googleLogin, login } from "./usersThunk";
import SpinnerButton from "../../components/Spinner/SpinnerButton";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

const Login = () => {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);
  const navigate = useNavigate();

  const [state, setState] = useState<IUserLogin>({
    username: "",
    password: "",
  });

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(login(state)).unwrap();
      navigate("/");
    } catch (e) {
      console.error("Something went wrong", e);
      return;
    }
  };

  const googleLoginHandler = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      await dispatch(googleLogin(credentialResponse.credential)).unwrap();
      navigate("/");
    }
  };
  return (
    <>
      <form
        className="userForm d-flex flex-column gap-3 align-items-center"
        onSubmit={submitFormHandler}
      >
        <h2>Login</h2>
        {error && <div className="alert alert-danger">{error.error}</div>}
        <div className="input-group">
          <input
            name="username"
            type="text"
            className={`form-control`}
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={inputChangeHandler}
            value={state.username}
            autoComplete="current-username"
          />
        </div>
        <div className="input-group">
          <input
            name="password"
            type="password"
            className={`form-control`}
            placeholder="Password"
            aria-label="Password"
            aria-describedby="basic-addon1"
            onChange={inputChangeHandler}
            value={state.password}
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-success w-50"
          disabled={loading}
        >
          {loading && <SpinnerButton />}
          Sigh In
        </button>
        <GoogleLogin onSuccess={googleLoginHandler} />
        <Link to="/register">Don't have an account? Register now!</Link>
      </form>
    </>
  );
};

export default Login;
