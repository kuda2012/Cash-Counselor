import React from "react";
import "../styles/Transaction.css";

const Transaction = ({ transaction }) => {
  return (
    <div className="Transaction">
      <div className="Transaction-date">
        <h6>{transaction.date}</h6>
      </div>
      <div className="Transaction-name-amount">
        <div className="Transaction-name">
          <h4>{transaction.name}</h4>
        </div>
        <div className="Transaction-amount">
          <h4>${transaction.amount}</h4>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
