const { createEntries, readEntries } = require("../controller/entries");
const route = require("express").Router();

route.post("/create", createEntries);

route.get("/get/:user_id", readEntries);

module.exports = route;
