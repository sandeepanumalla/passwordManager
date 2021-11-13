const express = require("express");
const db = require("../connections/connection");
const bcrypt = require("bcrypt");

async function salting(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashed passwrod is ", hashedPassword);
  return hashedPassword;
}

exports.register = async (req, res) => {
  const { email, password, master_password } = req.body;
  const hp = await salting(password);
  db.query(
    "INSERT INTO users VALUES(default, null, ?, ?, ?)",
    [email, hp, master_password],
    (err, result) => {
      console.log(err);
    },
  );
  console.log(req.body);
  res.json(req.body);
};

exports.createMasterPassword = (req, res) => {
  const { master_password, user_id } = req.body;
  db.query(
    "UPDATE users SET master_password = ? WHERE user_id = ?",
    [master_password, user_id],
    (err, result) => {
      console.log(err);
    },
  );
  res.json("master password successfully created");
};

exports.sign_in = async (req, res) => {
  const { email, password } = req.body;

  const selectedEmails = db.query("SELECT email FROM users", (err, result) => {
    console.log(err);
    console.log(result);
    res.json(result);
  });

  // console.log("the selected emails are ", selectedEmails.);
};

exports.hello = (req, res) => {
  res.send("this is hello route");
};
