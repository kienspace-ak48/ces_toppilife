const express = require("express");
const router = express.Router();
const homeController = require('../controller/home.controller')();
const pageConfigController = require('../controller/pageConfig.controller')();

//pageconfig
router.post('/page-config/create-update', pageConfigController.SaveAndUpdate);
router.get('/page-config', pageConfigController.Index);
//
router.get('/test', homeController.Test);
router.get("/", homeController.Index);

module.exports = router;
