const { celebrate, Joi } = require('celebrate');
const express = require('express');

const {
  getMovies,
  create,
  deleteMovie,
} = require('../controllers/movies');

const router = express.Router();

router.get('/', getMovies);
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi
      .string()
      .required(),
    trailer: Joi
      .string()
      .required(),
    thumbnail: Joi
      .string()
      .required(),
    nameRU: Joi.required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
  }),
}), create);
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), deleteMovie);

module.exports = router;
