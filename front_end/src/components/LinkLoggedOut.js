import React from "react";
import Link from "./Link";
import jwt from "jsonwebtoken";
import { useDispatch, useSelector } from "react-redux";
import LinkLoggedIn from "./LinkLoggedIn";
import "../styles/LinkLoggedOut.css";
const LinkLoggedOut = () => {
  const token = useSelector((state) => state.token);
  const _token = useSelector((state) => state._token);
  const access_token = useSelector((state) => state.access_token);
  const dispatch = useDispatch();
  dispatch({
    type: "SET_CURRENT_LOCATION",
    currentLocation: window.location.pathname,
  });
  return (
    <>
      {token && !access_token && !_token && (
        <div className="LinkLoggedOut">
          <h1
            className="display-3
      "
          >
            Cash Counselor
          </h1>
          <div className="LinkLoggedOut-body">
            <h3 className="LinkLoggedOut-body-title">
              Welcome, {jwt.decode(token).username}
            </h3>
            <div>
              <h4 className="LinkLoggedOut-middle-title">
                <b style={{ color: "#5BC0DE" }}>
                  Before Getting Started, read below!
                </b>
              </h4>
              <div className="LinkLoggedOut-text">
                Your fake bank credentials will be listed in{" "}
                <u>the gray bar at the very bottom of the screen </u> when you
                are prompted to enter a username and password. You can choose
                any banking institution to login.
              </div>
              <div className="LinkLoggedOut-text">
                Here they are just in case you miss them later.
              </div>
              <div className="LinkLoggedOut-text">
                <div>
                  Username: <b style={{ color: "#5BC0DE" }}>user_good</b>
                </div>{" "}
                <div>
                  {" "}
                  Password: <b style={{ color: "#5BC0DE" }}>pass_good</b>
                </div>
              </div>
            </div>
            <Link />
          </div>
        </div>
      )}
      {token && access_token && _token && <LinkLoggedIn />}
    </>
  );
};

export default LinkLoggedOut;
