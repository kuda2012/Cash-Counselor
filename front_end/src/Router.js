import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./components/Home";
import Account from "./components/Account";
import AccountsTrends from "./components/AccountsTrends";
import DeleteUser from "./components/DeleteUser";
import EditUsername from "./components/EditUsername";
import EditPassword from "./components/EditPassword";
import ProfileInfo from "./components/ProfileInfo";
import { useSelector } from "react-redux";

const Router = () => {
  const access_token = useSelector((state) => state.access_token);
  const token = useSelector((state) => state.token);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        {token || localStorage.getItem("token") ? (
          <ProfileInfo />
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route exact path="/profile/delete">
        {token || localStorage.getItem("token") ? (
          <DeleteUser />
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route exact path="/profile/edit/username">
        {token || localStorage.getItem("token") ? (
          <EditUsername />
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route exact path="/profile/edit/password">
        {token || localStorage.getItem("token") ? (
          <EditPassword />
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route exact path="/:account_id">
        {access_token || localStorage.getItem("access_token") ? (
          <Account />
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route exact path="/accounts/trends">
        {access_token || localStorage.getItem("access_token") ? (
          <AccountsTrends />
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default Router;
