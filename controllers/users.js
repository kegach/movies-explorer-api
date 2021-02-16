const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const NotFound = require('../errors/notFound');
const AnotherEmail = require('../errors/anotherEmail');

const create = async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new AnotherEmail('Пользователь с такой почтой уже существует!');
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, name, password: hash });
    return res.status(201).send({ email, name });
  } catch (err) {
    return next(err);
  }
};
const get = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(
      new NotFound('Не найдено'),
    );
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};
const update = async (req, res, next) => {
  const { email, name } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    ).orFail(new NotFound('Не найдено'));
    return res.send(user);
  } catch (err) {
    return next(err);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 360000 * 24 * 7,
      })
      .send({ email: user.email, name: user.name });
  } catch (err) {
    return next(err);
  }
};

const signout = (req, res) => res.clearCookie('jwt', { httpOnly: true, sameSite: true }).send({ message: 'Досвидания' });

export {
  create, get, update, login, signout,
};
