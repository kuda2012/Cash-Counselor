import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "reactstrap";
import { deleteProfile, getAccounts } from "../helpers/actionCreators";
import "../styles/DeleteUser.css";
// import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const DeleteUser = () => {
  const dispatch = useDispatch();
  dispatch({
    type: "SET_CURRENT_LOCATION",
    currentLocation: window.location.pathname,
  });
  const INITIAL_STATE = {
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
      dispatch(deleteProfile(formData, token));
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
    <div className="Delete-user">
      {/* <Button
        onClick={() => history.push("/profile")}
        className="Delete-user-cancel"
      >
        <FontAwesomeIcon color="primary" icon={faArrowLeft} />
      </Button> */}
      <div style={{ marginTop: "15px" }}>
        We regret that you would like to delete your account. Please enter your
        password below in order to do so.
      </div>
      <form onSubmit={handleSubmit}>
        <div className="Delete-user-items form-group">
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

        <Button color="danger">Submit</Button>
      </form>
    </div>
  );
};

export default DeleteUser;
