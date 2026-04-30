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
const testModel = require("./model/test.model");

//connect dB 
dbConnection();
//middleware
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

//view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(myPathConfig.root, 'src/views'));
// +layout
app.use(expressLayouts);
app.set('layout', 'layout/adminLayout');//file layout default

//
app.use(cors())
// serve static React
app.use(express.static(myPathConfig.public));
app.use(response);

// router
router(app);

//test area
app.get("/test", async (req, res) => {
  const visit = await testModel.findOne().lean();
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
