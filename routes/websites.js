const { verifyToken, checkMaster } = require("../controller/authuser");
const {
  createAccount,
  readCard,
  updateCard,
  deleteCard,
} = require("../controller/websites");

const route = require("express").Router();

route.post("/create", verifyToken, createAccount);
route.get("/read", verifyToken, readCard);
route.put("/update", verifyToken, updateCard);
route.delete("/delete/:website_id", verifyToken, deleteCard);

module.exports = route;
