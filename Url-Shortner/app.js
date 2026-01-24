const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
require("dotenv").config();
const { nanoid } = require("nanoid");

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const urlDb = {};


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;
  const code = nanoid(7);
  urlDb[code] = originalUrl;
  res.json({ shortUrl: `http://localhost:3000/${code}` });
});

app.get("/:code", (req, res) => {
  const { code } = req.params;
  const originalUrl = urlDb[code];
  if (!originalUrl) {
    res.status(404).json({ error: "URL not found" });
  } else {
    res.redirect(originalUrl);
  }
});

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

module.exports = app;
