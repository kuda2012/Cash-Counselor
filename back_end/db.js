const { Client } = require("pg");
const { DB_URI } = require("./config");

const db = new Client({
  connectionString: DB_URI,
  ssl: process.env.DB_URI ? { rejectUnauthorized: false } : false,
});

db.connect();

module.exports = db;
