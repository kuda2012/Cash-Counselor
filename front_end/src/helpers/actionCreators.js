import axios from "axios";
import { BASE_URL } from "../config";
export function getLinkToken(user_id, token) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(
        `${BASE_URL}createLinkToken`,
        user_id,
        token
      );
      dispatch(linkTokenReceived(data.link_token));
    } catch (error) {
      console.log(error);
    }
  };
}
export function getAccessToken(public_token, token) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(`${BASE_URL}getAccessToken`, {
        public_token,
        token,
      });
      dispatch(
        accessTokenReceived(data.access_token, data._token, data.item_id)
      );
    } catch (error) {
      console.log(error);
    }
  };
}

export function getAccounts(_token, access_token, initialRequest = true) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(`${BASE_URL}api/accounts`, {
        _token,
        access_token,
      });
      if (initialRequest) {
        await axios.post(`${BASE_URL}api/transactions/all`, {
          _token,
          access_token,
        });
      }
      dispatch(accountsReceived(data.accounts));
    } catch (error) {
      console.log(error);
    }
  };
}
export function getTransactions(_token, access_token, account_id, formData) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(`${BASE_URL}api/transactions/account`, {
        _token,
        access_token,
        account_id,
        ...formData,
      });
      dispatch(transactionsReceived(data.transactions, account_id));
      dispatch(categoriesReceived(data.categories));
    } catch (error) {
      console.log(error);
    }
  };
}
export function setTrends(_token, access_token, formData) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(`${BASE_URL}api/transactions/trends`, {
        _token,
        access_token,
        ...formData,
      });
      // console.log(data);
      // console.log(JSON.stringify(data.labels.months));
      dispatch(trendTransactionsReceived(data));
    } catch (error) {
      console.log(error);
    }
  };
}
export function deleteTransactions(_token, access_token, item_id) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(`${BASE_URL}api/transactions/delete`, {
        _token,
        access_token,
        item_id,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
export function login(formData) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(`${BASE_URL}user/login`, formData);
      dispatch(loginDone(data.token));
    } catch (error) {
      alert(error.response.data.message);
    }
  };
}
export function createProfile(formData) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(`${BASE_URL}user/signup`, formData);
      dispatch(loginDone(data.token));
    } catch (error) {
      alert(error.response.data.message);
    }
  };
}
export function deleteProfile(formData, token) {
  return async function (dispatch) {
    try {
      let { data } = await axios.post(`${BASE_URL}user/delete`, {
        ...formData,
        token,
      });
      alert(data.msg);
      if (data.msg === "Account has been deleted") {
        localStorage.clear();
        window.location = "/";
      }
      dispatch(profileDeleted());
    } catch (error) {
      alert(error.response.data.message);
    }
  };
}
export function editUsername(formData, token) {
  return async function (dispatch) {
    try {
      let { data } = await axios.patch(`${BASE_URL}user/edit/username`, {
        ...formData,
        token,
      });
      alert(data.msg);
      if (data.msg.split(" ")[0] === "Username") {
        dispatch(loginDone(data.token));
        window.location = "/";
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
}
export function editPassword(formData, token) {
  return async function (dispatch) {
    try {
      let { data } = await axios.patch(`${BASE_URL}user/edit/password`, {
        ...formData,
        token,
      });
      alert(data.msg);
      window.location = "/";
    } catch (error) {
      alert(error.response.data.message);
    }
  };
}
export function loginDone(token) {
  return {
    type: "SET_BASE_TOKEN",
    token,
  };
}
export function profileDeleted() {
  return {
    type: "FULL_RESET",
  };
}
export function linkTokenReceived(link_token) {
  return {
    type: "SET_LINK_TOKEN",
    link_token,
  };
}
export function accessTokenReceived(access_token, _token, item_id) {
  return {
    type: "SET_ACCESS_TOKEN",
    access_token,
    _token,
    item_id,
    new_visitor: true,
    logged_in: true,
    accountTransactions: {},
  };
}

export function accountsReceived(accounts) {
  return {
    type: "GET_ACCOUNTS",
    accounts,
  };
}
export function transactionsReceived(accountTransactions, account_id) {
  return {
    type: "SET_ACCOUNT_TRANSACTIONS",
    accountTransactions,
    account_id,
  };
}
export function trendTransactionsReceived(trendTransactions) {
  return {
    type: "SET_TRENDS",
    trendTransactions,
  };
}

export function categoriesReceived(categories) {
  return {
    type: "SET_CATEGORIES",
    categories,
  };
}
