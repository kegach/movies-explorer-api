const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { create, login, signout } = require('../controllers/users.js');
const auth = require('../middlewares/auth.js');
const NotFound = require('../errors/notFound');

router.use('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), create);
router.use('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.get('/signout', signout);
router.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});

module.exports = router;
