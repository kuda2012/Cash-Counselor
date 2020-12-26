import React, { useState } from "react";
import "../styles/Signup.css";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProfile } from "../helpers/actionCreators";
import { Button } from "reactstrap";
const Signup = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const INITIAL_STATE = {
    username: "",
    password: "",
    password_copy: "",
    first_name: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const toggleShowPassword1 = () => {
    setShowPassword1((password) => !password);
  };
  const toggleShowPassword2 = () => {
    setShowPassword2((password) => !password);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_copy) {
      alert("Passwords do not match");
      return;
    }
    try {
      dispatch(createProfile(formData));
      setFormData(INITIAL_STATE);
    } catch (error) {
      setFormData(INITIAL_STATE);
      alert(error[0]);
    }
  };

  return (
    <>
      <div className="card">
        <h4 id="title">Signup</h4>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="Signup-form-items form-group">
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
            <div className="Signup-form-items form-group">
              <label htmlFor="first_name">
                <b>First Name</b>
              </label>
              <input
                required={true}
                type="text"
                id="first_name"
                name="first_name"
                className="form-control"
                onChange={handleChange}
                value={formData.first_name}
              />
            </div>
            <div className="Signup-form-items form-group">
              <label htmlFor="password">
                <b>Password</b>
              </label>
              <div className="Input-password">
                <input
                  autoComplete="new-password"
                  type={showPassword1 ? "text" : "password"}
                  required={true}
                  id="password"
                  name="password"
                  className="form-control Signup-password"
                  onChange={handleChange}
                  value={formData.password}
                />
                <Button
                  type="button"
                  className="password-button"
                  onClick={() => toggleShowPassword1()}
                >
                  {showPassword1 ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
            <div className="Signup-form-items form-group">
              <label htmlFor="password_copy">
                <b>Re-type Password</b>
              </label>
              <div className="Input-password">
                <input
                  type={showPassword2 ? "text" : "password"}
                  required={true}
                  id="password_copy"
                  name="password_copy"
                  className="form-control  Signup-password"
                  onChange={handleChange}
                  value={formData.password_copy}
                />
                <Button
                  type="button"
                  className="password-button"
                  onClick={() => toggleShowPassword2()}
                >
                  {showPassword2 ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
            <Button color="primary" className="Login-submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
