import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { editPassword, getAccounts } from "../helpers/actionCreators";
import "../styles/EditUsername.css";

const EditUsername = () => {
  const dispatch = useDispatch();
  dispatch({
    type: "SET_CURRENT_LOCATION",
    currentLocation: window.location.pathname,
  });
  const INITIAL_STATE = {
    password: "",
    new_password: "",
    new_password_copy: "",
  };
  const token = useSelector((state) => state.token);
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
    try {
      if (formData.new_password !== formData.new_password_copy) {
        alert("New Passwords do not match");
        return;
      }
      dispatch(editPassword(formData, token));
    } catch (error) {
      setFormData(INITIAL_STATE);
      alert(error[0]);
    }
  };

  const _token = useSelector((state) => state._token);
  const access_token = useSelector((state) => state.access_token);
  const item_id = useSelector((state) => state.item_id);
  const institution_id = useSelector((state) => state.institution_id);
  const accounts = useSelector((state) => state.accounts);
  useEffect(() => {
    if (
      !accounts &&
      _token &&
      access_token &&
      item_id &&
      institution_id &&
      token
    ) {
      dispatch(getAccounts(_token, access_token, false));
    }
  });
  return (
    <div className="Edit-user">
      <h3 style={{ marginTop: "15px" }}>Edit Username</h3>
      <form onSubmit={handleSubmit}>
        <div className="Edit-user-items form-group">
          <label htmlFor="password">
            <b>Current Password</b>
          </label>
          <div className="Input-password">
            <input
              autoComplete="new-password"
              type="password"
              required={true}
              id="password"
              name="password"
              className="form-control"
              onChange={handleChange}
              value={formData.password}
            />
          </div>
        </div>
        <div className="Edit-user-items form-group">
          <label htmlFor="new_password">
            <b>New Password</b>
          </label>
          <div className="Input-password">
            <input
              type={showPassword1 ? "text" : "password"}
              required={true}
              id="new_password"
              name="new_password"
              className="form-control"
              onChange={handleChange}
              value={formData.new_password}
            />
            <Button
              type="button"
              color="primary"
              className="password-button"
              onClick={() => toggleShowPassword1()}
            >
              {showPassword2 ? "Hide Password" : "Show Password"}
            </Button>
          </div>
        </div>
        <div className="Edit-user-items form-group">
          <label htmlFor="new_password_copy">
            <b>Re-type New Password</b>
          </label>
          <div className="Input-password">
            <input
              type={showPassword2 ? "text" : "password"}
              required={true}
              id="new_password_copy"
              name="new_password_copy"
              className="form-control"
              onChange={handleChange}
              value={formData.new_password_copy}
            />
            <Button
              type="button"
              color="primary"
              className="password-button"
              onClick={() => toggleShowPassword2()}
            >
              {showPassword2 ? "Hide Password" : "Show Password"}
            </Button>
          </div>
        </div>
        <Button color="primary" className="Login-submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default EditUsername;
