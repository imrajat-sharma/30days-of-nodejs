const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcryptjs = require("bcryptjs");
const UserModel = require("./models/UserModel");
const app = express();
require("dotenv").config();

const { isAuth } = require("./middlewares/isAuth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "views");

const store = MongoStore.create({
  mongoUrl: process.env.MONGOURI,
  dbName: "session_cookie",
  collectionName: "sessions",
  ttl: 60 * 60 * 24, // 1 day,
  autoRemove: "interval",
  autoRemoveInterval: 10,
});

//handle store errors (MongoDBStore emits 'error')
store.on("error", (error) => {
  console.error("Session store error:", error);
});

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    name: "ssid",
    secret: process.env.SESSION_SECRET || "session.secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

app.get("/dashboard", isAuth, (req, res) => {
  res.json({ message: "Welcome to the session and cookies demo!" });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  try {
    const hashPassword = await bcryptjs.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    res.status(201).json({ message: "User created successfully!", user });
  } catch (err) {
    if (err.code === 11000) {
      // duplicate key (email)
      return res.status(409).json({ message: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required!" });
  }

  try {
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.isAuth = true;
    req.session.user = { _id: user._id, name: user.name, email: user.email };

    return res
      .status(200)
      .json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/profile", isAuth, (req, res) => {
  res.json({
    message: "Profile accessed successfully!",
    user: req.session.user,
  });
});

app.get("/logout", isAuth, (req, res) => {
  res.render("logout");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json({
        success: false,
        message: "Logout failed. Please try again.",
      });
    }

    res.clearCookie("ssid");

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

module.exports = app;
