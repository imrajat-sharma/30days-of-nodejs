const express = require("express");
const app = express();

const userRoutes = require("./routes/userRoutes");
const authHandler = require("./middlewares/auth");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    message: "Welcome to the Home Page!",
  });
});

app.use("/auth", require("./routes/authRoutes"));
app.use("/user", authHandler, userRoutes);

app.use(require("./utils/notFound"));
app.use(require("./utils/error"));

module.exports = app;
