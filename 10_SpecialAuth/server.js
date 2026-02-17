const app = require("./app");
require("dotenv").config();

const connectDB = require("./src/config/db");

connectDB()
  .then(() =>
    app.listen(process.env.PORT, (req, res) => {
      console.log("Server is running at 3000");
    }),
  )
  .catch((err) => console.log(err));
