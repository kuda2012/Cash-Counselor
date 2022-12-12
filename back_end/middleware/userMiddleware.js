const jwt = require("jsonwebtoken");
const jsonschema = require("jsonschema");
const userSchema = require("../schema/userschema.json");
const ExpressError = require("../expressError");
let { PLAID_SECRET_KEY } = require("../config");
function tokenIsCurrent(req, res, next) {
  try {
    const { _token, token } = req.body;
    const verified = jwt.verify(_token || token, PLAID_SECRET_KEY);
    if (verified) {
      return next();
    } else {
      throw new ExpressError("You are not logged in, please login first", 401);
    }
  } catch (error) {
    if (
      error.message == "invalid token" ||
      error.message == "invalid signature"
    ) {
      error.status = 400;
    }
    next(error);
  }
}

function userIsValidated(req, res, next) {
  try {
    const result = jsonschema.validate(req.body, userSchema);
    if (result.valid) {
      return next();
    } else {
      const listOfErrors = result.errors.map((error) => error.stack);
      const err = new ExpressError(listOfErrors, 400);
      return next(err);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  tokenIsCurrent,
  userIsValidated,
};
