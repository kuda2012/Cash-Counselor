import React from "react";
import NotloggedIn from "./NotLoggedIn";
import LinkLoggedOut from "./LinkLoggedOut";
import "../styles/Home.css";
import { useSelector } from "react-redux";
const Home = () => {
  const token = useSelector((state) => state.token);
  return (
    <div className="Home">
      {!token && <NotloggedIn />}
      {token && <LinkLoggedOut />}
    </div>
  );
};

export default Home;
