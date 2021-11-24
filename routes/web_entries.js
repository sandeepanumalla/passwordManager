const { verifyToken, checkMaster } = require("../controller/authuser");
const {
  createEntries,
  readEntries,
  updateEntries,
} = require("../controller/entries");
const route = require("express").Router();

route.post("/create/web_entry", verifyToken, checkMaster, createEntries); // check master password // check authentication //validate
route.get("/get/web_entry/:user_id", verifyToken, checkMaster, readEntries); //check master password // check authentication //validate
route.post("/update/web_entry/:eid", verifyToken, checkMaster, updateEntries);
route.delete("/delete/web_entry/:eid", verifyToken, checkMaster);

module.exports = route;
