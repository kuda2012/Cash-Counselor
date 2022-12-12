const { app } = require("../app");
const db = require("../db");
const request = require("supertest");
const User = require("../models/User");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
describe("All Token Routes", function () {
  let base_token;
  beforeEach(async function () {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM items");
    await db.query("DELETE FROM transactions");
    await User.create({
      username: "testuser",
      password: "password",
      email: "user@gmail.com",
      first_name: "user",
    });
    base_token = await User.getLoggedIn({
      username: "testuser",
      password: "password",
    });
  });

  describe("POST/ Transactions", () => {
    test("Should Delete All Transactions", async () => {
      let response = await request(app).post("/api/transactions/delete").send({
        token: base_token,
        item_id: "fakeItemID",
      });
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual([]);
    });
  });
  afterEach(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM items");
    await db.query("DELETE FROM transactions");
  });
});
afterAll(async () => {
  await db.end();
});
