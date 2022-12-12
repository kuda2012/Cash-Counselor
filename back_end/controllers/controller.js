let moment = require("moment");
let util = require("util");
let { plaidClient } = require("../config");
// let { PLAID_CLIENT_ID } = require("../config");
const jwt = require("jsonwebtoken");
let { PLAID_SECRET_KEY } = require("../config");
let User = require("../models/User");
let Item = require("../models/Item");
let Transaction = require("../models/Transaction");
let { setPeriod, getPeriodLabels } = require("../helpers/setPeriod");
let ACCESS_TOKEN = null;
let PUBLIC_TOKEN = null;
let ITEM_ID = null;

const signup = async (req, res, next) => {
  try {
    await User.create(req.body);
    let token = await User.getLoggedIn(req.body);
    res.json({ token });
  } catch (error) {
    if (error.code === "23505") {
      error.status = 409;
      error.message =
        "This username is already taken. Please try a different one.";
    }
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    let token = await User.getLoggedIn(req.body);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
const newToken = async (req, res, next) => {
  try {
    let token = await User.refreshUserToken(req.body);
    res.json({
      token,
      msg: `Username changed to ${jwt.decode(token).username}`,
    });
  } catch (error) {
    if (error.code === "23514") {
      error.status = 409;
      error.message = "Username must be between 5 and 25 characters";
    } else if (error.code === "23505") {
      error.status = 409;
      error.message =
        "This username is already taken. Please try a different one.";
    }
    next(error);
  }
};
const editPassword = async (req, res, next) => {
  try {
    let msg = await User.updatePassword(req.body);
    res.json({
      msg,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    let msg = await User.delete(req.body);
    return res.json({ msg });
  } catch (error) {
    next(error);
  }
};
const createItem = async (req, res, next) => {
  try {
    let data = await Item.create(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
const searchForItem = async (req, res, next) => {
  try {
    let data = await Item.search(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const createLinkToken = async (req, res, next) => {
  try {
    const linkTokenResponse = await plaidClient.createLinkToken({
      user: {
        client_user_id: req.body.user_id,
      },
      client_name: "Cash Counselor",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    });
    const link_token = linkTokenResponse.link_token;
    // 3. Send the data to the client
    return res.json({ link_token });
  } catch (error) {
    next(error);
  }
};

const getAccessToken = async (req, res, next) => {
  try {
    // PUBLIC_TOKEN = req.body.public_token;
    // Second, exchange the public token for an access token
    plaidClient.exchangePublicToken(
      req.body.public_token,
      function (error, tokenResponse) {
        return res.json({
          access_token: tokenResponse.access_token,
          item_id: tokenResponse.item_id,
          _token: jwt.sign(
            { item_id: tokenResponse.item_id },
            PLAID_SECRET_KEY,
            {
              expiresIn: "20m",
            }
          ),
        });
      }
    );
  } catch (error) {
    next(error);
  }
};
const getAccountTransactions = async (req, res, next) => {
  try {
    // Pull transactions for the last 30 days

    let { _token } = req.body;
    let item_id = jwt.decode(_token).item_id || undefined;
    let startDate =
      req.body.start_date || moment().subtract(2, "years").format("YYYY-MM-DD");
    let endDate = req.body.end_date || moment().format("YYYY-MM-DD");
    let name = req.body.name;
    let amountFloor = req.body.amount_floor
      ? Number(req.body.amount_floor).toFixed(2)
      : undefined;
    let amountCeiling = req.body.amount_ceiling
      ? Number(req.body.amount_ceiling).toFixed(2)
      : undefined;
    let account_id = req.body.account_id;
    let categories = req.body.categories || undefined;
    const response = await Transaction.getAccountTransactions({
      startDate,
      endDate,
      name,
      amountFloor,
      amountCeiling,
      account_id,
      categories,
      item_id,
    });
    const response2 = await Transaction.getAccountTransactions({
      startDate: moment().subtract(2, "years").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      account_id,
    });
    categories = [];
    for (let item of response2) {
      if (!categories.includes(item.category) && item.category != null) {
        categories.push(item.category);
      }
    }
    return res.json({
      transactions: response,
      categories: categories.map((category) => {
        return { label: category, value: category };
      }),
    });
  } catch (error) {
    next(error);
  }
};
const getAccountTransactionTrends = async (req, res, next) => {
  try {
    // Pull transactions for the last 30 days
    let { _token } = req.body;
    let period = req.body.period;
    period = setPeriod(period);
    let periodLabels = getPeriodLabels(period);
    let startDate = period.start_date;
    let endDate = period.end_date;
    let name = req.body.name;
    let amountFloor = req.body.amount_floor;
    let amountCeiling = req.body.amount_ceiling;
    let account_ids = req.body.account_ids;
    let item_id = jwt.decode(_token).item_id || undefined;
    const response = await Transaction.getAccountTrends({
      startDate,
      endDate,
      name,
      amountFloor,
      amountCeiling,
      account_ids,
      item_id,
    });
    let categories = [];

    for (let item of response) {
      if (
        !categories.map((category) => category.name).includes(item.category)
      ) {
        categories.push({ name: item.category, value: 0 });
      }
    }
    categories = categories.map((category) => {
      category.value = response
        .reduce((accumulator, transaction) => {
          if (transaction.category == category.name) {
            return accumulator + Number(transaction.amount);
          } else {
            return accumulator;
          }
        }, 0)
        .toFixed(2);
      return category;
    });
    let categoryTotal = categories
      .reduce((accumulator, category) => {
        return accumulator + Number(category.value);
      }, 0)
      .toFixed(2);
    if (periodLabels.dates) {
      periodLabels.dates = periodLabels.dates.map((item) => {
        item.amount = response
          .reduce((accumulator, transaction) => {
            if (moment(transaction.date).date() == item.name) {
              return accumulator + Number(transaction.amount);
            } else {
              return accumulator;
            }
          }, 0)
          .toFixed(2);

        return item;
      });
      periodLabels.maxVal = Math.max(
        ...periodLabels.dates.map((item) => {
          return item.amount;
        })
      );
      periodLabels.minVal = Math.min(
        ...periodLabels.dates.map((item) => {
          return item.amount;
        })
      );
      periodLabels.total = periodLabels.dates
        .reduce((accumulator, item) => {
          return accumulator + Number(item.amount);
        }, 0)
        .toFixed(2);
    } else {
      periodLabels.months = periodLabels.months.map((item) => {
        item.amount = response
          .reduce((accumulator, transaction) => {
            if (moment(transaction.date).format("MMM") == item.name) {
              return accumulator + Number(transaction.amount);
            } else {
              return accumulator;
            }
          }, 0)
          .toFixed(2);

        return item;
      });
      periodLabels.maxVal = Math.max(
        ...periodLabels.months.map((item) => {
          return item.amount;
        })
      );
      periodLabels.minVal = Math.min(
        ...periodLabels.months.map((item) => {
          return item.amount;
        })
      );
      periodLabels.total = periodLabels.months
        .reduce((accumulator, item) => {
          return accumulator + Number(item.amount);
        }, 0)
        .toFixed(2);
    }

    return res.json({
      transactions: response,
      labels: periodLabels,
      categories: { categories, total: categoryTotal },
    });
  } catch (error) {
    next(error);
  }
};
const deleteAllTransactions = async (req, res, next) => {
  try {
    // Pull transactions for the last 30 days
    let item_id = req.body.item_id;
    const response = await Transaction.deleteTransactions(item_id);
    return res.json(response);
  } catch (error) {
    next(error);
  }
};
const getAllTransactions = async (req, res, next) => {
  try {
    // Pull transactions for the last 30 days
    let { _token } = req.body;
    let startDate = moment().subtract(2, "years").format("YYYY-MM-DD");
    let endDate = moment().format("YYYY-MM-DD");
    const response = await plaidClient.getTransactions(
      req.body.access_token,
      startDate,
      endDate,
      {}
    );

    let transactions = response.transactions;
    const totalTransactions = response.total_transactions;
    while (transactions.length < totalTransactions) {
      const paginatedTransactionsResponse = await plaidClient.getTransactions(
        ACCESS_TOKEN || req.body.access_token,
        startDate,
        endDate,
        {
          offset: transactions.length,
        }
      );
      transactions = transactions.concat(
        paginatedTransactionsResponse.transactions
      );
    }
    let categories = [];
    transactions = transactions.map((transaction) => {
      if (transaction.category) {
        if (!categories.includes(transaction.category[0])) {
          categories.push(transaction.category[0]);
        }
      }
      return {
        id: transaction.transaction_id,
        name: transaction.name,
        amount: transaction.amount,
        date: transaction.date,
        item_id: jwt.decode(_token).item_id,
        account_id: transaction.account_id,
        category: transaction.category ? transaction.category[0] : null,
      };
    });
    transactions = await Transaction.addTransactions(transactions);
    return res.json({
      transactions,
    });
  } catch (error) {
    next(error);
  }
};
const getAccounts = async (req, res, next) => {
  try {
    plaidClient.getAccounts(
      req.body.access_token,
      function (error, accountsResponse) {
        if (error != null) {
          prettyPrintResponse(error);
          return res.json({
            error: error,
          });
        }
        prettyPrintResponse(accountsResponse);
        return res.json(accountsResponse);
      }
    );
  } catch (error) {
    next(error);
  }
};

const authDetails = async (req, res, next) => {
  try {
    plaidClient.getAuth(req.body.access_token, function (error, authResponse) {
      if (error != null) {
        prettyPrintResponse(error);
        return res.json({
          error: error,
        });
      }
      prettyPrintResponse(authResponse);
      return res.json(authResponse);
    });
  } catch (error) {
    next(error);
  }
};

const getIdentity = async (req, res, next) => {
  try {
    plaidClient.getIdentity(
      req.body.access_token,
      function (error, identityResponse) {
        if (error != null) {
          prettyPrintResponse(error);
          return res.json({
            error: error,
          });
        }
        prettyPrintResponse(identityResponse);
        return res.json({ identity: identityResponse.accounts });
      }
    );
  } catch (error) {
    next(error);
  }
};

const getBalance = async (req, res, next) => {
  try {
    plaidClient.getBalance(
      req.body.access_token,
      function (error, balanceResponse) {
        if (error != null) {
          prettyPrintResponse(error);
          return res.json({
            error: error,
          });
        }
        prettyPrintResponse(balanceResponse);
        return res.json(balanceResponse);
      }
    );
  } catch (error) {
    next(error);
  }
};

const returnItem = async (req, res, next) => {
  try {
    plaidClient.getItem(req.body.access_token, function (error, itemResponse) {
      if (error != null) {
        prettyPrintResponse(error);
        return res.json({
          error: error,
        });
      }
      // Also pull information about the institution
      plaidClient.getInstitutionById(
        itemResponse.item.institution_id,
        ["US", "GB", "CA"],
        function (err, instRes) {
          if (err != null) {
            let msg =
              "Unable to pull institution information from the Plaid API.";
            console.log(msg + "\n" + JSON.stringify(error));
            return res.json({
              error: msg,
            });
          } else {
            prettyPrintResponse(itemResponse);
            return res.json({
              item: itemResponse.item,
              institution: instRes.institution,
            });
          }
        }
      );
    });
  } catch (error) {
    next(error);
  }
};
const refreshPlaidToken = async (req, res, next) => {
  const unwrap = jwt.verify(req.body._token, PLAID_SECRET_KEY);
  const newToken = jwt.sign({ item_id: unwrap.item_id }, PLAID_SECRET_KEY, {
    expiresIn: "10m",
  });
  return res.json({ _token: newToken });
};
const getPlaidToken = async (req, res, next) => {
  const newToken = jwt.sign({ item_id: req.body.item_id }, PLAID_SECRET_KEY, {
    expiresIn: "10m",
  });
  return res.json({ _token: newToken });
};
let prettyPrintResponse = (response) => {
  // console.log(util.inspect(response, { colors: true, depth: 4 }));
};

module.exports = {
  createLinkToken,
  getAccessToken,
  getAccountTransactions,
  getAccountTransactionTrends,
  getAllTransactions,
  getAccounts,
  authDetails,
  getIdentity,
  getBalance,
  returnItem,
  refreshPlaidToken,
  signup,
  editPassword,
  createItem,
  login,
  searchForItem,
  getPlaidToken,
  deleteAllTransactions,
  newToken,
  deleteProfile,
};
