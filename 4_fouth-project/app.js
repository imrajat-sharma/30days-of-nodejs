const express = require("express");

//Importing Routes
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

//importing Middlewares
const adminMiddleware = require("./middlewares/admin.middleware");

//App Initialization
const app = express();

//.env file configuration
require("dotenv").config();

//Root Route
app.get("/", (req, res) => {
  res.send(
    'Hello, World<br><br><a href="/admin">Admin </a> <br> <br> <a href="/user">User </a>'
  );
});

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

//Error Handling Middleware
app.use((_, res) => {
  res
    .status(404)
    .send(
      "<h2>404 Not Found</h2><p>The page you are looking for does not exist.</p>"
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});
