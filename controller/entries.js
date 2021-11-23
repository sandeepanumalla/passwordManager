const db = require("../connections/connection");
const { entrySchema } = require("../validations/validator");
const crypto = require("crypto");
const Encrypter = require("./Encrypter");
require("dotenv").config();
const Universal_encrypter = new Encrypter(
  process.env.SECRET_KEY_FOR_ENCRYPTION,
);

function local_encrypter(masterPassword, url, web_username, web_password) {
  const decrypted_password = Universal_encrypter.decrypt(masterPassword);
  const local_encrypter = new Encrypter(decrypted_password);
  const encrypted_url = local_encrypter.encrypt(url);
  const encry_web_username = local_encrypter.encrypt(web_username);
  const encry_web_password = local_encrypter.encrypt(web_password);
  return { encrypted_url, encry_web_username, encry_web_password };
}

function localDecrypter(decrypted, result) {
  const local_encrypter = new Encrypter(decrypted);
  let array = [];
  result.forEach((element) => {
    const web_password = local_encrypter.decrypt(element.user_password);
    const web_username = local_encrypter.decrypt(element.username);
    const url = local_encrypter.decrypt(element.url);
    array.push({ url, web_username, web_password });
  });
  return array;
}

exports.createEntries = async (req, res) => {
  try {
    const { user_id, url, web_username, web_password } = req.body;
    const validate = await entrySchema.validateAsync(req.body);
    const masterPassword = await getMyPassword(user_id);
    console.log("master password is -> ", masterPassword);
    const { encrypted_url, encry_web_username, encry_web_password } =
      local_encrypter(masterPassword, url, web_username, web_password);

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

function getMyPassword(user_id) {
  return new Promise(function (resolve, reject) {
    db.query(
      "SELECT master_password FROM users WHERE user_id = ?",
      [user_id],
      function (err, rows) {
        if (rows === undefined) {
          reject(new Error("Error rows is undefined"));
        } else {
          resolve(rows[0].master_password);
        }
      },
    );
  });
}

exports.readEntries = async (req, res) => {
  try {
    const { user_id } = req.params;
    const masterPassword = await getMyPassword(user_id);
    console.log("master password is -> ", masterPassword);
    const decrypted = Universal_encrypter.decrypt(masterPassword);
    console.log("decrypted =  ", decrypted);

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
            console.log("user_password is ", localDecrypter(decrypted, result));
            res.json(localDecrypter(decrypted, result));
          }
        }
      },
    );
  } catch (error) {
    console.log("what's the error ", error);
    res.json("error in catch");
  }
};

exports.getEntries = () => {};
