const crypto = require("crypto");
require("dotenv").config();

class Encrypter {
  constructor(encryptionKey) {
    this.algorithm = "aes-192-cbc";
    this.key = crypto.scryptSync(encryptionKey, "salt", 24);
  }

  encrypt(clearText) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = cipher.update(clearText, "utf8", "hex");
    return [
      encrypted + cipher.final("hex"),
      Buffer.from(iv).toString("hex"),
    ].join("|");
  }

  dencrypt(encryptedText) {
    const [encrypted, iv] = encryptedText.split("|");
    if (!iv) throw new Error("IV not found");
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, "hex"),
    );
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }
}
// Usage

module.exports = Encrypter;
const encrypter = new Encrypter("test_master_through_postman");

// const clearText = "adventure time";
// const encrypted = encrypter.encrypt(clearText);
const dencrypted = encrypter.dencrypt(
  "8fd2c5a4ec5453e75b951dd024fd1314|311b7f5adec96e421b65fcee4616ff63",
);

console.log(dencrypted);
// console.log({ worked: clearText === dencrypted });
