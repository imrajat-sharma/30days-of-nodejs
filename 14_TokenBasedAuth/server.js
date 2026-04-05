const express = require("express");
const dotenv = require("dotenv");


const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authroutes");

dotenv.config();

const app = express();

// connect database
connectDB();

// middlewares
app.use(express.json());

// home route
app.get("/", (req, res) => {
  res.json({
    message: "Express JWT Auth API is running",
  });
});

// routes
app.use("/api/auth", authRoutes);

// global error fallback
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});