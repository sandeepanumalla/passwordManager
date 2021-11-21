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

// HOST = btv7etrgtaatcoh0f1hz-mysql.services.clever-cloud.com
// USER = uievgkvjn2jn4sh9
// PASSWORD = RrIlYWSdtOH6RH6QjiDQ
// DATABASE = btv7etrgtaatcoh0f1hz
// SECRET =  btv7euievgkvjn2jn4sh9sdtrgtaatcoh0f1hz
// SECRET_KEY_FOR_ENCRYPTION = 16dca491826c2ee6fd6b65c11bcc3d5516c1b4491b829d576de29ebbe012f6d7
