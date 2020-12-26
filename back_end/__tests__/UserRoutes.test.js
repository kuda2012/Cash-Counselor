const { app } = require("../app");
const db = require("../db");
const request = require("supertest");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
describe("All User Routes", function () {
  let base_token;
  beforeEach(async function () {
    await db.query("DELETE FROM users");
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

  describe("POST /signup", () => {
    test("Should signup user", async () => {
      let response = await request(app).post("/user/signup").send({
        username: "testuser2",
        password: "password",
        email: "user2@gmail.com",
        first_name: "user",
      });
      expect(response.statusCode).toEqual(200);
      expect(jwt.decode(response.body.token).username).toEqual("testuser2");
    });
    test("Should not signup user bc username is taken", async () => {
      let response = await request(app).post("/user/signup").send({
        username: "testuser",
        password: "password",
        email: "user2@gmail.com",
        first_name: "user",
      });
      expect(response.statusCode).toEqual(409);
    });
    test("Should not signup user bc username is too short", async () => {
      let response = await request(app).post("/user/signup").send({
        username: "t",
        password: "password",
        email: "user2@gmail.com",
        first_name: "user",
      });
      expect(response.statusCode).toEqual(400);
    });
  });
  describe("POST /login", () => {
    test("Should login user", async () => {
      let response = await request(app).post("/user/login").send({
        username: "testuser",
        password: "password",
      });
      expect(response.statusCode).toEqual(200);
      expect(jwt.decode(response.body.token).username).toEqual("testuser");
    });
    test("Should not login user bc password is wrong", async () => {
      let response = await request(app).post("/user/login").send({
        username: "testuser",
        password: "wrongPassword",
      });
      expect(response.statusCode).toEqual(400);
    });
  });
  describe("POST /user/edit", () => {
    test("Should edit username", async () => {
      let response = await request(app).patch("/user/edit/username").send({
        token: base_token,
        new_username: "testuser-renamed",
        password: "password",
      });
      expect(response.statusCode).toEqual(200);
      expect(jwt.decode(response.body.token).username).toEqual(
        "testuser-renamed"
      );
    });
    test("Should not edit username bc of wrong password", async () => {
      let response = await request(app).patch("/user/edit/username").send({
        token: base_token,
        new_username: "testuser-renamed",
        password: "wrongPassword",
      });
      expect(response.statusCode).toEqual(400);
    });
    test("Should edit password", async () => {
      let response = await request(app).patch("/user/edit/password").send({
        token: base_token,
        password: "password",
        new_password: "newPassword",
        new_password_copy: "newPassword",
      });
      expect(response.statusCode).toEqual(200);
    });
    test("Should not edit password bc of wrong original password", async () => {
      let response = await request(app).patch("/user/edit/password").send({
        token: base_token,
        password: "wrongPassword",
        new_password: "newPassword",
        new_password_copy: "newPassword",
      });
      expect(response.statusCode).toEqual(400);
    });
    test("Should not edit password bc new password retypes dont match", async () => {
      let response = await request(app).patch("/user/edit/password").send({
        token: base_token,
        password: "password",
        new_password: "newPassword",
        new_password_copy: "newPasswordNotMatching",
      });
      expect(response.statusCode).toEqual(400);
    });
  });

  describe("POST /user/delete", () => {
    test("Should delete user", async () => {
      let response = await request(app).post("/user/delete").send({
        token: base_token,
        password: "password",
      });
      expect(response.statusCode).toEqual(200);
      expect(response.body.msg).toEqual("Account has been deleted");
    });
    test("Should not delete user bc of wrong password", async () => {
      let response = await request(app).post("/user/delete").send({
        token: base_token,
        password: "wrongPassword",
      });
      expect(response.statusCode).toEqual(400);
    });
  });

  afterEach(async () => {
    await db.query("DELETE FROM users");
  });
});
afterAll(async () => {
  await db.end();
});
