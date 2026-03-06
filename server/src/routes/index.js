const adminRoute = require("./adminRoute.route");

function routes(app) {
  app.use("/admin", (req, res)=>{
    res.success()
  });
}

module.exports = routes;
