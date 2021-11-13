const {
  hello,
  register,
  createMasterPassword,
  sign_in,
} = require("../controller/authuser");

const route = require("express").Router();

route.get("/hello", hello);

route.post("/register", register);

route.post("/create/masterpassword", createMasterPassword);

route.get("/signin", sign_in);

module.exports = route;
