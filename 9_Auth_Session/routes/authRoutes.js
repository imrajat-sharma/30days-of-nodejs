const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { readDB, writeDB } = require("../utils/db");

const router = express.Router();

// Registration route
router
  .route("/register")
  .get((req, res) => {
    res.render("register", {
      title: "Register",
      message: "Create a new account",
    });
  })
  .post(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const db = readDB();
    const existingUser = db.users.find((u) => u.email === email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
    };

    db.users.push(newUser);
    writeDB(db);
    
    res.status(201).redirect("/auth/login?message=Registration+successful!+please+login+to+your+account");
  });

// Login route
router
  .route("/login")
  .get((req, res) => {
    res.render("login", {
      title: "Login",
      message: req.query.message || "Please login to your account",
    });
  })
  .post(async (req, res) => {
    const { email, password } = req.body;

    const db = readDB();
    const user = db.users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });

module.exports = router;
