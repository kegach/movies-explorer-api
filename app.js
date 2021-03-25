require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { DEV_DATABASE_URL } = require('./config/devConfig');
const limiter = require('./middlewares/limiter');

const router = require('./routes');
const { reqLogger, errorLogger } = require('./middlewares/logger');
const errorOnServer = require('./middlewares/errorOnServer');

const { DATABASE_URL = DEV_DATABASE_URL } = process.env;
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const option = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://kegach-diplom.students.nomoredomains.rocks',
    'https://kegach-diplom.students.nomoredomains.rocks',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Origin', 'Referer', 'Accept', 'Authorization'],
  credentials: true,
};

app.use('*', cors(option));
app.use(helmet());
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(reqLogger);
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use(errorOnServer);

app.listen(PORT, () => {});
