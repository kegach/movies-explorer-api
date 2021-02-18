import { DEV_DATABASE_URL } from './config/devConfig';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');

const router = require('./routes');
const { reqLogger, errorLogger } = require('./middlewares/logger');

const { DATABASE_URL = DEV_DATABASE_URL } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(helmet());

const option = {
  origin: [
    'http://localhost:8080',
    'http://kegach-server.students.nomoredomains.rocks',
    'https://kegach-server.students.nomoredomains.rocks',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Origin', 'Referer', 'Accept', 'Authorization'],
  credentials: true,
};

app.use('*', cors(option));
app.use(reqLogger);
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка!'
      : message,
  });
  next();
});

app.listen(PORT);
