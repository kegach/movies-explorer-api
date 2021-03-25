require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/limiter');
const config = require('./utils/config');

const routes = require('./routes');
const { errorHandler } = require('./utils/errors/errorHandler');

const { PORT = 3000, NODE_ENV, MONGO_DB_ADDRESS } = process.env;
const app = express();

mongoose.connect(NODE_ENV === 'production' ? MONGO_DB_ADDRESS : config.MONGO_DB_ADDRESS, {
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
app.use(requestLogger);
app.use(limiter);
app.use(routes);
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
