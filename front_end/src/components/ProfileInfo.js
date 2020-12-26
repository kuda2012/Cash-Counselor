import React from "react";
import jwt from "jsonwebtoken";
import "../styles/ProfileInfo.css";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

const ProfileInfo = () => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  dispatch({
    type: "SET_CURRENT_LOCATION",
    currentLocation: window.location.pathname,
  });
  return (
    <div>
      <h1>User Info </h1>
      <div>
        Note: This is info for the account that you created on this site. Not
        for anything related to your bank account.
      </div>
      <div className="ProfileInfo">
        <div>Username: {jwt.decode(token).username}</div>
        <div>First Name: {jwt.decode(token).first_name}</div>
        <div>
          <Button className="Username-button">
            <Link to="profile/edit/username">Edit Username</Link>
          </Button>
          <Button className="Password-button" color="primary">
            <Link to="/profile/edit/password"> Edit Password</Link>
          </Button>
          <div>
            <Button color="danger">
              <Link to="/profile/delete">Want to delete your account?</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
