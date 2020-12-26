const express = require("express");
const cors = require("cors");
const { PORT } = require("./config");
let User = require("./models/User");
const app = express();
app.use(express.json());
app.use(cors());
const jwt = require("jsonwebtoken");
const ExpressError = require("./expressError");

// Get the public token and exchange it for an access token

const {
  createLinkToken,
  getAccessToken,
  getAccountTransactions,
  getAllTransactions,
  getAccounts,
  authDetails,
  getIdentity,
  getBalance,
  returnItem,
  refreshPlaidToken,
  signup,
  createItem,
  login,
  deleteProfile,
  searchForItem,
  getPlaidToken,
  newToken,
  getAccountTransactionTrends,
  deleteAllTransactions,
  editPassword,
} = require("./controllers/controller");

const {
  tokenIsCurrent,
  userIsValidated,
} = require("./middleware/userMiddleware");
app.post("/user/signup", [userIsValidated], signup);
app.post("/user/login", login);
app.patch("/user/edit/username", [tokenIsCurrent], newToken);
app.patch("/user/edit/password", [tokenIsCurrent], editPassword);
app.post("/user/delete", [tokenIsCurrent], deleteProfile);
app.post("/getPlaidToken", [tokenIsCurrent], getPlaidToken);
app.post("/refreshPlaidToken", [tokenIsCurrent], refreshPlaidToken);
app.post("/checkPlaidTokens", [tokenIsCurrent, getAccounts]);
app.post("/checkBaseToken", [tokenIsCurrent], async (req, res, next) => {
  try {
    let response = await User.getUser(jwt.decode(req.body.token).username);
    if (!response) {
      throw new ExpressError("User does not exist", 404);
    }
    return res.json({ token: req.body.token });
  } catch (error) {
    next(error);
  }
});
app.post("/createLinkToken", [tokenIsCurrent], createLinkToken);
app.post("/getAccessToken", [tokenIsCurrent], getAccessToken);
app.post("/item/create", [tokenIsCurrent], createItem);
app.post("/item/search", [tokenIsCurrent], searchForItem);
app.post("/api/transactions/account", [tokenIsCurrent], getAccountTransactions);
app.post(
  "/api/transactions/trends",
  [tokenIsCurrent],
  getAccountTransactionTrends
);
app.post("/api/transactions/all", [tokenIsCurrent], getAllTransactions);
app.post("/api/transactions/delete", [tokenIsCurrent], deleteAllTransactions);
app.post("/api/accounts", [tokenIsCurrent], getAccounts);
// app.post("/api/auth", [tokenIsCurrent], authDetails);
// app.post("/api/identity", [tokenIsCurrent], getIdentity);
// app.post("/api/balance", [tokenIsCurrent], getBalance);
// app.post("/api/item", [tokenIsCurrent], returnItem);

app.use(function (req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/** Generic error handler. */

app.use(function (err, req, res, next) {
  if (err.stack) console.error(err.stack);
  return res.status(err.status || 500).send({
    message: err.message,
    err,
  });
});

module.exports = { app };
