const db = require("./model");
const express = require("express");
const routes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

routes.get("/", (req, res) => {
  res.send("Hello");
});

routes.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const response = await db.create({
      email,
      password: hash,
    });
    return res.json({ status: "User registered", response });
  } catch (error) {
    error.code === 11000
      ? res.json({ Error: "User already registered" })
      : res.json({ Error: error });
  }
});

routes.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findOne({ email });
  if (!user) {
    return res.json({ error: "Invalid username/password" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      SECRET_KEY
    );
    console.log("User logged in");
    res.cookie("jwt", accessToken);
    return res.json({ email: user.email, accessToken });
  } else {
    return res.json({ error: "password incorrect" });
  }
});

routes.get("/api/userdetails", async (req, res) => {
  // details of logged in user
  try {
    if (req.headers.token !== null) {
      const requiredToken = jwt.verify(req.headers.token, SECRET_KEY);
      const userDetails = await db.findOne({
        email: requiredToken.email,
      });
      return res.json(userDetails);
    } else {
      return res.json({});
    }
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
});

routes.post("/api/updateDetails", async (req, res) => {
  try {
    const requiredToken = jwt.verify(req.headers.token, SECRET_KEY);
    const updates = await db.updateOne(
      { email: requiredToken.email },
      { $set: req.body }
    );
    return res.send(updates);
  } catch (e) {
    return res.send(e);
  }
});

routes.post("/api/logout", async (req, res) => {
  try {
    res.clearCookie("JWT", {
      path: "/",
    });
    return res.json(req.cookies.jwt);
  } catch (err) {
    return res.json(err);
  }
});

module.exports = routes;
