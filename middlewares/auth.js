const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const Unauthorized = require('../errors/unauthorized');

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new Unauthorized('Токен не передан');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new Unauthorized('Передан некорректный токен');
  }
  req.user = payload;

  return next();
};

module.exports = auth;
