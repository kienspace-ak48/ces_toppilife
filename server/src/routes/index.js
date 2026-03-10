const adminRoute = require("./adminRoute.route");

function routes(app) {
  app.use("/admin", adminRoute);
}

module.exports = routes;
