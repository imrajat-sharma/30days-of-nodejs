const User = require("../model/userModel");
const { signToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

exports.registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ApiError("Email already in use", 400));
  }

  await User.create({ name, email, password });

  res.status(201).send({ message: "User registered successfully" });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
}


exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "Role updated successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
