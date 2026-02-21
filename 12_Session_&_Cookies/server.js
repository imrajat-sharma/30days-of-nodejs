const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGOURI);
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Server is running at 3000");
    });

  } catch (err) {
    console.error("MongoDB Connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
