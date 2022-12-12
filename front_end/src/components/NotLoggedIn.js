import React from "react";
import Login from "./Login";
import "../styles/NotLoggedIn.css";
const NotLoggedIn = () => {
  return (
    <div className="NotLoggedIn">
      <h1
        className="display-2
      "
      >
        Cash Counselor
      </h1>
      <h3 className="NotLoggedIn-subtitle">
        Analyze your funds like <i>never</i> before
      </h3>
      <ul>
        <li className="NotLoggedIn-details">
          View General account information for all of your bank accounts
        </li>
        <li className="NotLoggedIn-details">
          Search through your transactions for each account
        </li>
        <li className="NotLoggedIn-details">
          Get graphs of your transactions to see how you are spending your money
        </li>
      </ul>
      <Login />
    </div>
  );
};

export default NotLoggedIn;
