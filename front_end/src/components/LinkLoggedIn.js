import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { getAccounts } from "../helpers/actionCreators";
import AccountCard from "./AccountCard";
import "../styles/AccountSummaries.css";
import { BASE_URL } from "../config";
import jwt from "jsonwebtoken";
import axios from "axios";
const LinkLoggedIn = () => {
  const dispatch = useDispatch();
  const _token = useSelector((state) => state._token);
  const access_token = useSelector((state) => state.access_token);
  const accounts = useSelector((state) => state.accounts);
  const item_id = useSelector((state) => state.item_id);
  const institution_id = useSelector((state) => state.institution_id);
  const token = useSelector((state) => state.token);
  const new_visitor = useSelector((state) => state.new_visitor);
  dispatch({
    type: "SET_CURRENT_LOCATION",
    currentLocation: window.location.pathname,
  });
  useEffect(() => {
    if (
      !accounts &&
      _token &&
      access_token &&
      item_id &&
      institution_id &&
      token
    ) {
      dispatch(getAccounts(_token, access_token));

      if (new_visitor) {
        async function saveItem() {
          await axios.post(`${BASE_URL}item/create`, {
            access_token: access_token,
            item_id,
            institution_id,
            user_id: jwt.decode(token).user_id,
            username: jwt.decode(token).username,
            _token,
          });
        }
        saveItem();
      }
    }
  }, [accounts]);
  return (
    <div className="Account-Summaries">
      <h1 className="display-4">Accounts</h1>
      {!accounts && <h6>...loading</h6>}
      <div className="Account-Summaries-box">
        {accounts &&
          accounts.map((account) => (
            <AccountCard key={uuid()} account={account} />
          ))}
      </div>
    </div>
  );
};
export default LinkLoggedIn;
