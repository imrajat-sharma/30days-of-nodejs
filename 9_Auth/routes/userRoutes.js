const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/welcome", userController.welcomeMessage);

module.exports = router;
