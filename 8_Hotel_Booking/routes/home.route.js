const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const { addHome, getHome } = require("../controllers/home.controller");

const router = express.Router();

// default route
router.get("/", (req, res) => {
  res.redirect("/home");
});

// home route
router.get("/home", (req, res) => {
  res.render("home", { title: "Airbnb : Home" });
});

// add home page
router.get("/add-home", (req, res) => {
  res.render("addHome", { title: "Airbnb : Add Home" });
});

// add home form submit
router.post("/add-home", addHome);

// listings page
router.get("/listings", getHome);

module.exports = router;
