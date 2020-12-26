const { app } = require("../app");
const db = require("../db");
const request = require("supertest");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
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

  describe("POST/ Plaid Tokens", () => {
    test("Should Get Link Token", async () => {
      let response = await request(app).post("/createLinkToken").send({
        token: base_token,
        user_id: "123UserID",
      });
      expect(response.statusCode).toEqual(200);
      expect(response.body.link_token).toEqual(expect.any(String));
    });
    test("Should Get Plaid Token", async () => {
      let response = await request(app).post("/getPlaidToken").send({
        token: base_token,
        item_id: "fakeItemID",
      });
      expect(response.statusCode).toEqual(200);
      expect(jwt.decode(response.body._token).item_id).toEqual("fakeItemID");
    });
    test("Should Refresh Plaid Token", async () => {
      let response = await request(app).post("/getPlaidToken").send({
        token: base_token,
        item_id: "fakeItemID",
      });
      let response1 = await request(app).post("/refreshPlaidToken").send({
        token: base_token,
        _token: response.body._token,
        item_id: "fakeItemID",
      });
      expect(response1.statusCode).toEqual(200);
      expect(jwt.decode(response1.body._token).item_id).toEqual("fakeItemID");
    });
  });
  describe("POST/ Base Token", () => {
    test("Should Verify Base Token", async () => {
      let response = await request(app).post("/checkBaseToken").send({
        token: base_token,
      });
      expect(response.statusCode).toEqual(200);
      expect(jwt.decode(response.body.token).username).toEqual("testuser");
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
