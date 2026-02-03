const fs = require("fs").promises;
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const listingsPath = path.join(__dirname, "../db/home.db.json");
const { addNewHome } = require("../services/addHome.service");

const addHome = asyncHandler(async (req, res) => {
  await addNewHome(req.body);
  res.redirect("/listings?added=true");
});

const getHome = asyncHandler(async (req, res, next) => {
  const data = await fs.readFile(listingsPath, "utf8");
  const listings = JSON.parse(data);
  const added = req.query.added === "true";
  res.render("listings", { title: "Airbnb : Listings", listings, added });
});

module.exports = { addHome, getHome };