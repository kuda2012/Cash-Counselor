const db = require("../db");
const { v4: uuid } = require("uuid");
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { BCRYPT_HASH_ROUNDS } = require("../config");
const { PLAID_SECRET_KEY } = require("../config");
class User {
  static async getLoggedIn(body) {
    const { username, password } = body;
    if (!username || !password) {
      throw new ExpressError("Must enter a username and password", 400);
    }

    const getPassword = await db.query(
      `SELECT password from users WHERE username =$1`,
      [username.toLowerCase()]
    );
    if (getPassword.rows[0]) {
      const passwordCorrect = await bcrypt.compare(
        password,
        getPassword.rows[0].password
      );
      if (passwordCorrect) {
        const result = await this.getUser(username);
        const token = jwt.sign(result, PLAID_SECRET_KEY, {
          expiresIn: "2w",
        });
        return token;
      } else {
        throw new ExpressError(
          "The username and password combination you have entered do not match any of our records. Please try again",
          400
        );
      }
    } else {
      throw new ExpressError("User does not exist", 404);
    }
  }
  static async refreshUserToken(body) {
    const username = jwt.decode(body.token).username;
    const password = body.password;
    const newUsername = body.new_username;
    const getPassword = await db.query(
      `SELECT password from users WHERE username =$1`,
      [username.toLowerCase()]
    );
    if (getPassword) {
      const passwordCorrect = await bcrypt.compare(
        password,
        getPassword.rows[0].password
      );
      if (passwordCorrect) {
        const result = await db.query(
          `UPDATE users
                        SET username=$1
                        where username=$2 
                        RETURNING username, id AS user_id, first_name`,
          [newUsername, username]
        );
        const token = jwt.sign(result.rows[0], PLAID_SECRET_KEY, {
          expiresIn: "2w",
        });
        return token;
      } else {
        throw new ExpressError("Incorrect Password", 400);
      }
    } else {
      throw new ExpressError("User does not exist", 404);
    }
  }
  static async updatePassword(body) {
    const username = jwt.decode(body.token).username;
    const password = body.password;
    if (body.new_password.length < 5 || body.new_password.length > 25) {
      console.log(body);
      throw new ExpressError(
        "Password length must be longer than 4 characters but less than 26",
        400
      );
    }
    if (body.new_password !== body.new_password_copy) {
      throw new ExpressError("New Passwords do not match", 400);
    }
    const newPassword = await bcrypt.hash(
      body.new_password,
      BCRYPT_HASH_ROUNDS
    );
    const getPassword = await db.query(
      `SELECT password from users WHERE username =$1`,
      [username.toLowerCase()]
    );
    if (getPassword) {
      const passwordCorrect = await bcrypt.compare(
        password,
        getPassword.rows[0].password
      );
      if (passwordCorrect) {
        await db.query(
          `UPDATE users
                        SET password=$1
                        where username=$2`,
          [newPassword, username]
        );
        return "Password has been changed";
      } else {
        throw new ExpressError("Incorrect Current Password", 400);
      }
    } else {
      throw new ExpressError("User does not exist", 404);
    }
  }

  static async create(body) {
    const { username, password, first_name } = body;
    const hashedPassword = await bcrypt.hash(password, BCRYPT_HASH_ROUNDS);
    const newUser = await db.query(
      `INSERT INTO users (id, username, password, first_name)
       VALUES ($1, $2, $3, $4) RETURNING id, username`,
      [uuid(), username.toLowerCase(), hashedPassword, first_name]
    );
    return newUser.rows[0];
  }
  static async getUser(username) {
    const getUser = await db.query(
      `SELECT username, id AS user_id, first_name FROM users WHERE username = $1`,
      [username.toLowerCase()]
    );
    return getUser.rows[0];
  }
  static async delete(body) {
    const username = jwt.decode(body.token).username;
    const password = body.password;
    const getPassword = await db.query(
      `SELECT password from users WHERE username =$1`,
      [username.toLowerCase()]
    );
    if (getPassword) {
      const passwordCorrect = await bcrypt.compare(
        password,
        getPassword.rows[0].password
      );
      if (passwordCorrect) {
        await db.query(`DELETE FROM users where username=$1`, [username]);
        return "Account has been deleted";
      } else {
        throw new ExpressError("Incorrect Password", 400);
      }
    } else {
      throw new ExpressError("User does not exist", 404);
    }
  }
}

module.exports = User;
