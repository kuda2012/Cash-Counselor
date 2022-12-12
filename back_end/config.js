let plaid = require("plaid");
require("dotenv").config();
const PORT = process.env.PORT || 8000;
let PLAID_CLIENT_ID =
  process.env.PLAID_CLIENT_ID ||
  "TEMPORARILY copy your CLIENT_ID from .env here for test";

let PLAID_SECRET_KEY =
  process.env.PLAID_SECRET_KEY ||
  "TEMPORARILY copy your SECRET_KEY from .env here for test";
//Uncomment line below to set NODE_ENV to test
// let NODE_ENV = "test"

const plaidClient = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET_KEY,
  env: plaid.environments.sandbox,
});
let DB_URI;
const BCRYPT_HASH_ROUNDS = 12;

if (process.env.NODE_ENV === "test") {
  DB_URI = "cash_counselor_test";
} else {
  DB_URI = process.env.DATABASE_URL || "cash_counselor";
}

console.log("Using database", DB_URI);
module.exports = {
  PLAID_CLIENT_ID,
  PLAID_SECRET_KEY,
  plaidClient,
  PORT,
  DB_URI,
  BCRYPT_HASH_ROUNDS,
};
