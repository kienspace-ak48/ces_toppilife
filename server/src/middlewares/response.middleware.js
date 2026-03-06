function responseMiddleware(req, res, next) {
  res.success = (status = 200, data = null) => {
    res.status(status).json({
      success: true,
      data,
    });
  };
  res.error= (status=500, mess='')=>{
    res.status(status).json({
    success: false,
    error: mess,
  });
  }
  next();
}

module.exports = responseMiddleware;
