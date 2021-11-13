const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

db.connect(function (err) {
  if (err) {
    console.log("error while connectiing to mysql", err);
  } else {
    console.log("db connected successfully");
  }
});

db.on("error", function (err) {
  console.log("db error", db);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("errr");
  } else {
    throw err;
  }
});

module.exports = db;

// db.query("select * from users", () => {});
