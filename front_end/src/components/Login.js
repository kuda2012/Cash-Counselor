import React, { useState } from "react";
import "../styles/Login.css";
import Signup from "./Signup";
import { Button } from "reactstrap";
import { login } from "../helpers/actionCreators";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const INITIAL_STATE = {
    username: "",
    password: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [useSignUp, setUseSignUp] = useState(false);
  const [activeLogin, setActiveLogin] = useState("active");
  const [activeSignup, setActiveSignup] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(login(formData));
      setFormData(INITIAL_STATE);
    } catch (error) {
      setFormData(INITIAL_STATE);
      console.log(error);
    }
  };

  return (
    <div className="Login">
      <div>
        <button
          className={`btn btn-primary ${activeLogin}`}
          onClick={(e) => {
            setUseSignUp(false);
            setActiveLogin("active");
            setActiveSignup("");
          }}
        >
          Login
        </button>
        <button
          className={`btn btn-secondary ${activeSignup}`}
          onClick={() => {
            setUseSignUp(true);
            setActiveSignup("active");
            setActiveLogin("");
          }}
        >
          Signup
        </button>
      </div>

      {!useSignUp && (
        <>
          <div className="card">
            <h4 id="title">Login</h4>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="Login-form">
                <div className="Login-form-items form-group">
                  <label htmlFor="username">
                    <b>Username</b>
                  </label>
                  <input
                    required={true}
                    type="text"
                    id="username"
                    className="form-control"
                    name="username"
                    onChange={handleChange}
                    value={formData.username}
                  />
                </div>
                <div className="Login-form-items form-group">
                  <label htmlFor="password">
                    <b>Password</b>
                  </label>
                  <input
                    required={true}
                    type={"password"}
                    id="password"
                    name="password"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.password}
                  />
                </div>
                <Button color="primary" className="Login-submit">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
      {useSignUp && <Signup />}
    </div>
  );
};

export default Login;
