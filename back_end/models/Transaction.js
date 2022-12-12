const db = require("../db");
const ExpressError = require("../expressError");
let moment = require("moment");

class Transaction {
  static async addTransactions(transactions) {
    await db.query(`DELETE FROM transactions WHERE item_id = $1`, [
      transactions[0].item_id,
    ]);
    for (let transaction of transactions) {
      await db.query(
        `INSERT INTO transactions (id, amount, name, date, account_id, item_id, category)
       VALUES ($1, $2, $3, $4, $5, $6 ,$7)`,
        [
          transaction.id,
          transaction.amount,
          transaction.name,
          transaction.date,
          transaction.account_id,
          transaction.item_id,
          transaction.category,
        ]
      );
    }
    let response = await db.query(
      `SELECT * FROM transactions WHERE item_id = $1`,
      [transactions[0].item_id]
    );
    return response.rows;
  }
  static async deleteTransactions(item_id) {
    await db.query(`DELETE FROM transactions WHERE item_id = $1`, [item_id]);
    let response = await db.query(
      `SELECT * FROM transactions WHERE item_id = $1`,
      [item_id]
    );
    return response.rows;
  }

  static async getAccountTransactions(body) {
    let {
      startDate,
      endDate,
      name,
      amountFloor,
      amountCeiling,
      account_id,
      categories,
      item_id,
    } = body;
    let parameterArray = [];
    let numberOrder = 0;
    let whereString;
    if (startDate) {
      numberOrder++;
      parameterArray.push(startDate);
      whereString = `date >=$${numberOrder}`;
    }
    if (endDate) {
      numberOrder++;
      parameterArray.push(endDate);
      whereString = whereString.concat(` and date <=$${numberOrder}`);
    }
    if (name) {
      numberOrder++;
      parameterArray.push("%" + name.concat("%"));
      whereString = whereString.concat(` and name ILIKE $${numberOrder}`);
    }
    if (amountFloor) {
      numberOrder++;
      parameterArray.push(amountFloor);
      whereString = whereString.concat(` and amount >=$${numberOrder}`);
    }
    if (amountCeiling) {
      numberOrder++;
      parameterArray.push(amountCeiling);
      whereString = whereString.concat(` and amount <=$${numberOrder}`);
    }
    if (account_id) {
      numberOrder++;
      parameterArray.push(account_id);
      whereString = whereString.concat(` and account_id =$${numberOrder}`);
    }
    if (item_id) {
      numberOrder++;
      parameterArray.push(item_id);
      whereString = whereString.concat(` and item_id =$${numberOrder}`);
    }
    if (categories) {
      for (let i = 0; i < categories.length; i++) {
        numberOrder++;
        parameterArray.push(categories[i]);
        if (i === 0 && categories.length === 1) {
          whereString = whereString.concat(` and category =$${numberOrder}`);
        } else if (i === 0 && categories.length > 1) {
          whereString = whereString.concat(` and (category =$${numberOrder}`);
        } else if (i === categories.length - 1) {
          whereString = whereString.concat(` or category =$${numberOrder})`);
        } else {
          whereString = whereString.concat(` or category =$${numberOrder}`);
        }
      }
    }
    const transactions = await db.query(
      `SELECT * FROM transactions where ${whereString}`,
      [...parameterArray]
    );
    return transactions.rows.map((transaction) => {
      transaction.date = moment(transaction.date).format("M/DD/YYYY");
      return transaction;
    });
  }
  static async getAccountTrends(body) {
    let {
      startDate,
      endDate,
      name,
      amountFloor,
      amountCeiling,
      account_ids,
      categories,
      item_id,
    } = body;
    let parameterArray = [];
    let numberOrder = 0;
    let whereString;
    if (startDate) {
      numberOrder++;
      parameterArray.push(startDate);
      whereString = `date >=$${numberOrder}`;
    }
    if (endDate) {
      numberOrder++;
      parameterArray.push(endDate);
      whereString = whereString.concat(` and date <=$${numberOrder}`);
    }
    if (name) {
      numberOrder++;
      parameterArray.push("%" + name.concat("%"));
      whereString = whereString.concat(` and name ILIKE $${numberOrder}`);
    }
    if (amountFloor) {
      numberOrder++;
      parameterArray.push(amountFloor);
      whereString = whereString.concat(` and amount >=$${numberOrder}`);
    }
    if (amountCeiling) {
      numberOrder++;
      parameterArray.push(amountCeiling);
      whereString = whereString.concat(` and amount <=$${numberOrder}`);
    }
    if (item_id) {
      numberOrder++;
      parameterArray.push(item_id);
      whereString = whereString.concat(` and item_id =$${numberOrder}`);
    }
    if (account_ids) {
      for (let i = 0; i < account_ids.length; i++) {
        numberOrder++;
        parameterArray.push(account_ids[i]);
        if (i === 0 && account_ids.length === 1) {
          whereString = whereString.concat(` and account_id =$${numberOrder}`);
        } else if (i === 0 && account_ids.length > 1) {
          whereString = whereString.concat(` and (account_id =$${numberOrder}`);
        } else if (i === account_ids.length - 1) {
          whereString = whereString.concat(` or account_id =$${numberOrder})`);
        } else {
          whereString = whereString.concat(` or account_id =$${numberOrder}`);
        }
      }
    }

    const transactions = await db.query(
      `SELECT * FROM transactions where ${whereString}`,
      [...parameterArray]
    );
    return transactions.rows;
  }
}

module.exports = Transaction;
