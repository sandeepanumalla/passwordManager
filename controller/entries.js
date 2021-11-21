const db = require("../connections/connection");
const { entrySchema } = require("../validations/validator");
const crypto = require("crypto");
const { compareSync } = require("bcrypt");
const { checkMaster } = require("./authuser");

function encrypt(text, master) {
  const cipher = crypto.createCipher("aes-256-cbc", master);
  var encrypted = cipher.update(text, "utf8", "hex");
  encrypted = encrypted + cipher.final("hex");
  console.log(encrypted);
  return encrypted;
}

function decrypt(encryptedText, master) {
  const decipher = crypto.createDecipher("aes-256-cbc", master);
  var decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted = decrypted + decipher.final("utf8");
  console.log(decrypted);
}

exports.createEntries = async (req, res) => {
  try {
    const { user_id, url, web_username, web_password } = req.body;
    const validate = await entrySchema.validateAsync(req.body);

    const encrypted_url = encrypt(url);
    const encry_web_username = encrypt(web_username);
    const encry_web_password = encrypt(web_password);
    db.query(
      "INSERT INTO Web_Entries VALUES(?, default, ?, ?, ?, null, default)",
      [user_id, encrypted_url, encry_web_username, encry_web_password],
      (err, result) => {
        if (err) {
          console.log("error in inserting", err);
          res.json("error in inserting data");
        } else {
          res.json(result);
        }
      },
    );
  } catch (error) {
    console.log("error catch", error);
    res.json("error in catch", error);
  }
};

const getMyPassword = (user_id) => {
  let password;
  db.query(
    "SELECT master_password FROM users WHERE user_id = ?",
    [user_id],
    (err, result) => {
      if (err) {
      } else {
        console.log("ohooh ", result);
        password = JSON.parse(JSON.stringify(result));
      }
    },
  );
  return password;
};

exports.readEntries = async (req, res) => {
  try {
    const { user_id } = req.params;
    const master_password = getMyPassword(user_id);
    console.log("the master pass is ", getMyPassword(user_id));
    db.query(
      "SELECT * FROM Web_Entries where user_id = ?",
      [user_id],
      (err, result) => {
        if (err) {
          console.log("errror while getting entries");
        } else {
          if (result.length === 0) {
            res.json("no entries for this user");
          } else {
            res.json(result);
          }
        }
      },
    );
  } catch (error) {
    res.json("error in catch");
  }
};

exports.getEntries = () => {};
