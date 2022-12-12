import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../config";
const CheckLoggedIn = () => {
  const dispatch = useDispatch();
  const [checkedOnce, setCheckedOnce] = useState(false);
  const access_token = localStorage.getItem("access_token");
  const _token = localStorage.getItem("_token");
  let token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      async function checkBaseToken() {
        try {
          let response = await axios.post(`${BASE_URL}checkBaseToken`, {
            token,
          });
          if (response.data.token) {
            dispatch({ type: "SET_BASE_TOKEN", token });
          } else {
            token = null;
            localStorage.clear();
          }
        } catch (error) {
          console.log(error);
          token = null;
          dispatch({
            type: "FULL-RESET",
          });
          localStorage.clear();
        }
      }
      checkBaseToken();
    }
  });

  if (!_token || (!access_token && token)) {
    dispatch({
      type: "SET_LOGIN",
      logged_in: false,
    });
  }
  useEffect(() => {
    if (_token && access_token && token && !checkedOnce) {
      async function checkJwt() {
        try {
          const { data } = await axios.post(`${BASE_URL}checkPlaidTokens`, {
            _token,
            access_token: access_token,
          });
          if (data.status_code === 200) {
            dispatch({
              type: "SET_LOGIN",
              logged_in: true,
            });
            dispatch({
              type: "SET_ACCESS_TOKEN",
              access_token,
              _token,
              institution_id: data.item.institution_id,
              item_id: data.item.item_id,
              new_visitor: false,
              logged_in: true,
              accounts: [],
              accountTransactions: {},
            });
          } else {
            dispatch({
              type: "HALF-RESET",
            });
          }
        } catch (error) {
          localStorage.removeItem("_token");
          localStorage.removeItem("access_token");
          dispatch({
            type: "HALF-RESET",
          });
        }
        setCheckedOnce(true);
      }
      checkJwt();
    }
  });
  return true;
};
export default CheckLoggedIn;
