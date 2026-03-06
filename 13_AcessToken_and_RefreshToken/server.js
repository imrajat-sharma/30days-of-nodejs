const { connectDB } = require("./db");
const app = require("./app");
require("dotenv").config()

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server Failed to start");
  }
}

startServer()


