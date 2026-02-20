// External dependencies
const express = require("express");

const app = express();

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/about", (req, res) => {
  res.send(
    "<h2>About Page</h2><p>This is the about page of our Express application.</p>"
  );
});

app.get("/contact", (req, res) => {
  res.send(
    "<h2>Contact Page</h2><p>You can contact us at example@email.com</p>"
  );
});

app.use((_, res) => {
  res
    .status(404)
    .send(
      "<h2>404 Not Found</h2><p>The page you are looking for does not exist.</p>"
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
