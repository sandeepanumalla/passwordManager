const express = require("express");
const app = express();
const connection = require("./connections/connection");
const user = require("./routes/user");
const Web_Entries = require("./routes/web_entries");
const port = 7070;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

app.get("/", (req, res) => {
  res.send("hello rest");
});
app.use("/", user);
app.use("/entry", Web_Entries);

app.listen(port, () => {
  console.log(`server is listening in ${port}`);
});
