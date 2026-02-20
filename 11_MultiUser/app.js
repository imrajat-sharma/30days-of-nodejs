const express = require("express");
const errorHandler = require("./src/error");
const app = express();
const { signToken, verifyToken } = require("./src/utils/jwt");
const bcryptjs = require("bcryptjs");
const cookieParser = require("cookie-parser")

require("dotenv").config();

const User = require("./src/model/userModel");

const asyncHandler = require("./src/utils/asyncHandler");
const authMiddleware = require("./src/middleware/auth");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//App Routes
app.get("/", (req, res) => {
  res.send("Welcome ! Server is Started...");
});

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    const hashPassword = await bcryptjs.hash(password, 10);

    await User.create({
      name: name,
      email: email,
      password: hashPassword,
    });

    res.status(201).send({ message: "User registered successfully"});

  })
);

app.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).send("Invalid email or password");
  }

  const isPasswordMatch = await bcryptjs.compare(password, user.password);

   if (!isPasswordMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = signToken(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  
  res.cookie("token", token, {
    httpOnly: true,        
    secure: false,         
    sameSite: "strict",
    maxAge: 60 * 60 * 1000 
  });

  res.status(200).json({ message: "Login successful" });
}));

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});


app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile route accessed",
    user: req.user
  });
});


app.use((req, res, next) => {
  res.status(404).send(`${req.path} Route not found`);
});

app.use(errorHandler);

module.exports = app;
