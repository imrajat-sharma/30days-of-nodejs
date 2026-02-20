const express = require("express");
const router = express.Router();

const asyncHandler = require("../utils/asyncHandler");
const authMiddleware = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { updateUserRole } = require("../controllers/userController");

const { registerUser, loginUser, logoutUser} = require("../controllers/userController");

router.post("/register", asyncHandler(registerUser));
router.post("/login", asyncHandler(loginUser));
router.post("/logout", logoutUser);

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Profile route accessed",
    user: req.user,
  });
});

router.patch("/:id/role", authMiddleware, authorize("admin"), updateUserRole);


module.exports = router;
