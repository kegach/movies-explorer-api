require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { Joi, errors, celebrate } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');
const { reqLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login, signout } = require('./controllers/users');
const NotFound = require('./errors/notFound');

const { PORT = 3000 } = process.env;
const app = express();

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка!'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
