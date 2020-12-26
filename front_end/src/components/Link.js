import React, { useCallback, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useSelector, useDispatch } from "react-redux";
import { getLinkToken, getAccessToken } from "../helpers/actionCreators";
import { BASE_URL } from "../config";
import jwt from "jsonwebtoken";
import axios from "axios";
import { Button } from "reactstrap";
const Link = () => {
  const dispatch = useDispatch();
  const link_token = useSelector((state) => state.link_token);
  const public_token = useSelector((state) => state.public_token);
  const access_token = useSelector((state) => state.access_token);
  const _token = useSelector((state) => state._token);
  const token = useSelector((state) => state.token);
  const onSuccess = useCallback(
    async (public_token, metadata) => {
      let { user_id } = jwt.decode(token);
      let response = await axios.post(`${BASE_URL}item/search`, {
        user_id,
        institution_id: metadata.institution.institution_id,
        token,
      });
      if (response.data.item_id) {
        let { data } = await axios.post(`${BASE_URL}getPlaidToken`, {
          item_id: response.data.item_id,
          token,
        });

        dispatch({
          type: "SET_ACCESS_TOKEN",
          access_token: response.data.access_token,
          _token: data._token,
          item_id: response.data.item_id,
          institution_id: metadata.institution.institution_id,
          new_visitor: false,
          logged_in: true,
          accountTransactions: {},
        });
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("_token", data._token);
      } else {
        dispatch({
          type: "SET_PUBLIC_TOKEN",
          public_token,
          institution_id: metadata.institution.institution_id,
        });
      }
    },
    [dispatch]
  );
  useEffect(() => {
    let { user_id } = jwt.decode(token);
    if (!link_token) {
      dispatch(getLinkToken({ user_id, token }));
    }
    if (public_token && !access_token) {
      dispatch(getAccessToken(public_token, token));
    }
  }, [link_token, public_token, dispatch, access_token, _token]);

  const config = {
    token: link_token || true,
    onSuccess,
  };
  const { open, ready } = usePlaidLink(config);

  return (
    <Button
      id="Link-button"
      color="primary"
      onClick={() => open()}
      disabled={!ready}
    >
      Connect a bank account
    </Button>
  );
};
export default Link;
