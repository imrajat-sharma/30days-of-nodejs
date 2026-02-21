const express = require("express");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./src/error");
const app = express();
require("dotenv").config();

const { registerUser, loginUser, logoutUser} = require("./src/controllers/userController");
const asyncHandler = require("./src/utils/asyncHandler");
const authMiddleware = require("./src/middleware/auth");
const userRoutes = require("./src/routes/userRoutes");  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//root route
app.get("/", (req, res) => {
  res.send("Welcome ! Server is Started...");
});

app.use("/users", userRoutes);


//404 Route Handler
app.use((req, res, next) => {
  res.status(404).send(`${req.path} Route not found`);
});


//Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
