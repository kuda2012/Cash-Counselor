import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import { editUsername, getAccounts } from "../helpers/actionCreators";
import "../styles/EditUsername.css";

const EditUsername = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  dispatch({
    type: "SET_CURRENT_LOCATION",
    currentLocation: window.location.pathname,
  });
  const currentLocation = useSelector((state) => state.currentLocation);
  const INITIAL_STATE = {
    new_username: "",
    password: "",
  };
  const token = useSelector((state) => state.token);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(editUsername(formData, token));
      setFormData(INITIAL_STATE);
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
          <label htmlFor="username">
            <b>New Username</b>
          </label>
          <input
            required={true}
            type="text"
            id="new_username"
            className="form-control"
            name="new_username"
            onChange={handleChange}
            value={formData.new_username}
          />
        </div>
        <div className="Edit-user-items form-group">
          <label htmlFor="password">
            <b>Password</b>
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
        <Button color="primary" className="Login-submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default EditUsername;
