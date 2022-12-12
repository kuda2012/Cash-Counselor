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

  describe("POST/ Item", () => {
    test("Should Create Item", async () => {
      let response = await request(app)
        .post("/item/create")
        .send({
          token: base_token,
          user_id: jwt.decode(base_token).user_id,
          institution_id: "123InstitutionID",
          access_token: "fakeAccessToken",
          username: jwt.decode(base_token).username,
          item_id: "123ItemID",
        });
      expect(response.statusCode).toEqual(200);
      expect(response.body.user_id).toEqual(jwt.decode(base_token).user_id);
    });
    test("Should Create Item and then search for item", async () => {
      let response = await request(app)
        .post("/item/create")
        .send({
          token: base_token,
          user_id: jwt.decode(base_token).user_id,
          institution_id: "123InstitutionID",
          access_token: "fakeAccessToken",
          username: jwt.decode(base_token).username,
          item_id: "123ItemID",
        });
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual("good");
      let response1 = await request(app).post("/item/search").send({
        token: base_token,
        user_id: response.body.user_id,
        institution_id: response.body.institution_id,
      });
      expect(response1.statusCode).toEqual(200);
      expect(response1.body.user_id).toEqual(response.body.user_id);
    });
  });

  afterEach(async () => {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM items");
  });
});
afterAll(async () => {
  await db.end();
});
