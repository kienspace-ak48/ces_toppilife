const express = require("express");
const myPathConfig = require("./config/myPath.config");
const app = express();
const fs = require("fs");
const cors = require('cors');
const expressLayouts = require('express-ejs-layouts');
const response  = require("./middlewares/response.middleware");
const router = require('./routes');
const path = require('path');
const dbConnection = require("./config/dbConnection.config");
const cookieParser = require("cookie-parser");
const pageConfigModel = require("./model/pageConfig.model");
const visitModel = require("./model/visit.model");

//connect dB 
dbConnection();
//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

//view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(myPathConfig.root, 'src/views'));
// +layout
app.use(expressLayouts);
app.set('layout', 'layout/main');//file layout default

//
app.use(cors())
// serve static React
app.use(express.static(myPathConfig.public));
app.use(response);

//
app.set("trust proxy", true);
app.use(async (req, res, next) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress;
    console.log('IP: ',ip)
  await visitModel.create({
    ip,
    path: req.originalUrl,
    userAgent: req.headers["user-agent"]
  });

  next();
});
// 
// router
router(app);

//test area
app.get("/test", async (req, res) => {
  const visit = await visitModel.find({}).sort({createdAt: 1}).limit(300).select("_id").lean();
  const ids = visit.map(v=>v._id);
  res.json({ success: true, data: visit });
});
app.get('/api/landing', async(req, res)=>{
  try {
    const pc = await pageConfigModel.findOne({}).select('-__v -_id').lean();
    res.success(pc)
  } catch (error) {
    console.error('loi entry point')
  }
})
// const html = fs.readFile(myPathConfig.public+"index.html");
// console.log(html);

app.use(async (req, res) => {
  try {
    res.sendFile(myPathConfig.public + "/index.html");
  } catch (error) {
    console.log("Server error");
    res.sendFile(myPathConfig.public + "/index.html");
    
  }
});
//end

module.exports = app;
