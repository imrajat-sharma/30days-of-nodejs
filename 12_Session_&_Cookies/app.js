const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const bcryptjs = require("bcryptjs");
const UserModel = require("./models/UserModel");
const app = express();
require("dotenv").config();

const { isAuth } = require("./middlewares/isAuth");

app.use(express.json());

const store = new MongoDBStore({
  uri: process.env.MONGOURI,
  collection: "sessions",
});

app.use(
  session({
    secret: "thissessionsecret",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false }, //true in https
  }),
);

app.get("/dashboard", isAuth, (req, res) => {
  if (!req.session.isAuth) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  res.json({ message: "Welcome to the session and cookies demo!" });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  const hashPassword = await bcryptjs.hash(password, 10);

  const user = await UserModel.create({ name, email, password: hashPassword });

  res.status(201).json({ message: "User created successfully! ", user });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email or password required!" });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password!" });
  }

  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    res.status(400).json({ message: "Invalid Credentials !" });
  }

  req.session.isAuth = true;
  res.status(200).json({ message: "Login Successfull!", user });
});

app.post("/logout", (req, res) => {
  if (!req.session.isAuth) {
    return res.status(400).json({ message: "You are not logged in!" });
  }
  req.session.destroy((err) => {
    if (err) console.log(err);
  });
  res.clearCookie("connect.sid");
  res.json({ message: "Logout Successfull!" });
});

module.exports = app;
