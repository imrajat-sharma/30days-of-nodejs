const fs = require("fs");
const path = require("path");

require("dotenv").config();

const dbPath = path.join(process.env.ROOTDIR || __dirname, "../database/db.json");


const readDB = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

module.exports = { readDB, writeDB };
