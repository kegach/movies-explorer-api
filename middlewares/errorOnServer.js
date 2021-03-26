const errorOnServer = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? req.body
      : message,
  });
  next();
};

module.exports = errorOnServer;
