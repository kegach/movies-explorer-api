const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { create, login, signout } = require('../controllers/users.js');
const auth = require('../middlewares/auth.js');
const NotFound = require('../errors/notFound');

router.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), login);
router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), create);

router.use(auth);
router.use('/', usersRouter);
router.use('/', moviesRouter);

router.get('/signout', signout);
router.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
