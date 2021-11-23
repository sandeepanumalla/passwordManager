const express = require("express");
const db = require("../connections/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authSchema } = require("../validations/validator");
const crypto = require("crypto");
const Encrypter = require("./Encrypter");
require("dotenv").config();
const encrypter = new Encrypter(process.env.SECRET_KEY_FOR_ENCRYPTION);

async function salting(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// function encrypt(text) {
//   const cipher = crypto.createCipher(
//     "aes-256-cbc",
//     process.env.SECRET_KEY_FOR_ENCRYPTION,
//   );
//   var encrypted = cipher.update(text, "utf8", "hex");
//   encrypted = encrypted + cipher.final("hex");
//   console.log(encrypted);
//   return encrypted;
// }

// function decrypt(encryptedText) {
//   const decipher = crypto.createDecipher(
//     "aes-256-cbc",
//     process.env.SECRET_KEY_FOR_ENCRYPTION,
//   );
//   var decrypted = decipher.update(encryptedText, "hex", "utf8");
//   decrypted = decrypted + decipher.final("utf8");
//   console.log(decrypted);
// }

exports.register = async (req, res) => {
  try {
    const { email, username, password, master_password } = req.body;
    const result = await authSchema.validateAsync(req.body);
    const hp = await salting(password);
    console.log("is joi? ", result);
    db.query(
      "INSERT INTO users VALUES(default, ?, ?, ?, ?)",
      [username, email, hp, master_password],
      (err, result) => {
        if (err) {
          if (err.code == "ER_DUP_ENTRY" || err.code == 1062) {
            res
              .status(422)
              .json(
                `${email} already registered. please try again with another email`,
              );
          }
        } else {
          console.log(req.body);
          res.json(req.body);
        }
      },
    );
  } catch (error) {
    console.log("error in registering new user ", error);
    if (error.isJoi === true) {
      error.status = 422;
      res.status(422).json(error.details[0].message);
    } else {
      res.status(500).json(error);
    }
  }
};

exports.createMasterPassword = async (req, res) => {
  try {
    const { master_password, user_id } = req.body;
    const encrypted = encrypter.encrypt(master_password);

    db.query(
      "UPDATE users SET master_password = ? WHERE user_id = ?",
      [encrypted, user_id],
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
    const validate = await authSchema.validateAsync(req.body);
    const { email, password } = req.body;
    const selectedEmails = db.query(
      "SELECT email FROM users",
      (err, result) => {
        console.log(validate, err);
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
          res.json("you have not signin using this email");
        }
      },
    );
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
      res.status(422).json(error.details[0].message);
    } else {
      res.status(500).json(error);
    }
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
    const data = req.body;
    const u = db.query(
      "SELECT master_password FROM users where user_id = ?",
      [data.user_id],
      (err, result) => {
        let added = JSON.parse(JSON.stringify(result));
        if (added[0].master_password === null) {
          next();
        }
        console.log("result ", result);
        return res.json("all good");
      },
    );
    console.log("sdfsdf", u);
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
