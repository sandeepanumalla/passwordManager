const { createCipheriv } = require("crypto");
require("dotenv").config();
// const crypto = require("crypto");

// async function encrypting() {
//   try {
//     const algorithm = "aes-192-cbc";
//     const key = crypto.randomBytes(32);
//     const iv = crypto.randomBytes(16);
//     const secret = process.env.SECRET_KEY_FOR_ENCRYPTION;
//     console.log("secret", secret);
//     const cipher = createCipheriv("aes-256-gcm", Buffer.from(key), iv);
//     const encrypted = cipher.update("hello sandeep");
//     encrypted = Buffer.concat([encrypted, cipher.final]);
//     console.log(encrypted.toString("hex"));
//   } catch (error) {
//     console.log("error came", error);
//   }
// }

// encrypting();

const crypto = require("crypto");

// // Defining algorithm
// const algorithm = "aes-256-cbc";

// // Defining key
const key = process.env.SECRET_KEY_FOR_ENCRYPTION;
// const key = crypto.randomBytes(32);

// // Defining iv
const iv = crypto.randomBytes(16);

console.log(key.toString("hex"));
// An encrypt function
function encrypt(text) {
  // Creating Cipheriv with its parameter
  let cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.SECRET_KEY_FOR_ENCRYPTION),
    iv,
  );

  // Updating text
  let encrypted = cipher.update(text);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Returning iv and encrypted data
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// Displays output
var output = encrypt("GeeksforGeeks");
console.log("geesd", output);

function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");

  // Creating Decipher
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.SECRET_KEY_FOR_ENCRYPTION),
    iv,
  );

  // Updating encrypted text
  let decrypted = decipher.update(output.encryptedData);
  console.log("dec", decrypted.toString("hex"));
  decrypted = Buffer.concat([decrypted, decipher.final("hex")]);

  // returns data after decryption
  return decrypted.toString();
}

//console.log(decrypt(output));

function encrypt(text) {
  const cipher = crypto.createCipher(
    "aes-256-cbc",
    process.env.SECRET_KEY_FOR_ENCRYPTION,
  );
  var encrypted = cipher.update("Hello Techweber", "utf8", "hex");
  encrypted = encrypted + cipher.final("hex");
  console.log(encrypted);
  return encrypted;
}

// encrypt();
// function decrypt() {
//   const decipher = crypto.createDecipher(
//     "aes-256-cbc",
//     process.env.SECRET_KEY_FOR_ENCRYPTION,
//   );
//   var encryptedText = encrypted;
//   var decrypted = decipher.update(encryptedText, "hex", "utf8");
//   decrypted = decrypted + decipher.final("utf8");
//   console.log(decrypted);
// }

const hmac = crypto
  .createHmac("sha256", process.env.SECRET_KEY_FOR_ENCRYPTION)
  .update("hello ji")
  .digest("hex");

console.log("hmac  ", hmac);
