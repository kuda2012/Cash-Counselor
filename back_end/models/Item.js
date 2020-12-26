const db = require("../db");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PLAID_SECRET_KEY } = require("../config");
class Item {
  static async create(body) {
    const { item_id, user_id, institution_id, access_token, username } = body;
    const newItem = await db.query(
      `INSERT INTO items (item_id, user_id, institution_id, access_token, username, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING username, item_id, user_id, institution_id, access_token, status`,
      [item_id, user_id, institution_id, access_token, username, "good"]
    );
    return newItem.rows[0];
  }
  static async search(body) {
    const { user_id, institution_id } = body;

    const newItem = await db.query(
      `SELECT * FROM items WHERE user_id = $1 AND institution_id = $2`,
      [user_id, institution_id]
    );
    return newItem.rows[0];
  }
}

module.exports = Item;
