import React from "react";
import "../styles/AccountCard.css";
import { Link } from "react-router-dom";
import icons from "../AccountIcons";

const AccountCard = ({ account }) => {
  return (
    <Link className="AccountCard-link" to={`${account.account_id}`}>
      <div className="AccountCard">
        <div className="AccountCard-left">
          <div>
            <img
              className="AccountCard-icon"
              src={icons[account.subtype] || icons[account.type]}
              alt={`${account.type}`}
            />
          </div>
          <div className="AccountCard-title">
            <div>
              <b>{account.name}</b>
            </div>
            <div>...{account.mask}</div>
          </div>
        </div>
        <div className="AccountCard-right">
          <div>
            <b>${account.balances.current.toFixed(2)}</b>
          </div>
          <div>Available Balance</div>
        </div>
      </div>
    </Link>
  );
};

export default AccountCard;
