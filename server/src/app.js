const express = require("express");
const myPathConfig = require("./config/myPath.config");
const app = express();
const fs = require("fs");
const response  = require("./middlewares/response.middleware");
const router = require('./routes');

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//sẻve static React
app.use(express.static(myPathConfig.public));
app.use(response);
router(app);
//test area
app.get("/test", (req, res) => {
  res.json({ success: true, mess: "hello world" });
});
// const html = fs.readFile(myPathConfig.public+"index.html");
// console.log(html);
app.use(async (req, res) => {
  res.sendFile(myPathConfig.public + "/index.html");
});
//end

module.exports = app;
