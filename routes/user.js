const {
  hello,
  register,
  createMasterPassword,
  sign_in,
  verifyToken,
  getUser,
  checkMaster,
} = require("../controller/authuser");

const route = require("express").Router();

route.get("/hello", hello);

route.post("/register", register);

route.post("/create/masterpassword", verifyToken, createMasterPassword);

route.post("/signin", sign_in);

route.get("/getMyDetails", verifyToken, getUser);

route.post("/check", checkMaster);

module.exports = route;
