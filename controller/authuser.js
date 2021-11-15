const express = require("express");
const db = require("../connections/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function salting(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("hashed passwrod is ", hashedPassword);
  return hashedPassword;
}

exports.register = async (req, res) => {
  try {
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
  } catch (error) {
    console.log("error in registering new user ", error);
    res.status(500).json(error);
  }
};

exports.createMasterPassword = async (req, res) => {
  try {
    const { master_password, user_id } = req.body;
    const hashed = await salting(master_password);
    db.query(
      "UPDATE users SET master_password = ? WHERE user_id = ?",
      [hashed, user_id],
      (err, result) => {
        console.log(err);
      },
    );
    res.json("master password successfully created");
  } catch (error) {
    console.log("error in creation of master password ", error);
    res.status(500).json(error);
  }
};

exports.sign_in = async (req, res) => {
  try {
    const { email, password } = req.body;
    const selectedEmails = db.query(
      "SELECT email FROM users",
      (err, result) => {
        console.log(err);
        const arr = JSON.parse(JSON.stringify(result));
        const isValid = arr.some((e) => e.email == email);
        let token;
        if (isValid) {
          token = jwt.sign({ email, password }, process.env.SECRET, {
            expiresIn: "2h",
          });
          res.json({ result, token });
          return { token };
        } else {
          res.json("you have not signup using this email");
        }
      },
    );
  } catch (error) {
    console.log("error in sign in ", error);
    res.status(500).json(error);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log(authHeader, req.headers);
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch (error) {
    console.log("error in verifying token ", error);
    res.status(500).json(error);
  }
};

exports.checkMaster = async (req, res, next) => {
  try {
    db.query(
      "SELECT master_password FROM users where user_id = ?",
      [req.body.user_id],
      (err, result) => {
        let added = JSON.parse(JSON.stringify(result));

        if (added[0].master_password === null) {
          next();
        }
        return res.json("all good");
      },
    );
  } catch (error) {
    console.log("error in checking master_password ", error);
    res.status(500).json(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.hello = (req, res) => {
  res.send("this is hello route");
};
