const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbidden');
const BadRequest = require('../errors/badRequest');
const Movie = require('../models/movie');

const getMovies = async (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFound('Не найдено');
      }
      res.send(movies);
    })
    .catch((err) => next(err));
};
const create = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequest('Неправильный запрос');
      }
      const currentMovie = movie.toObject();
      delete currentMovie.owner;
      res.send(currentMovie);
    })
    .catch((err) => next(err));
};
const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findOne({ owner: req.user._id, movieId })
      .orFail(new NotFound('Не найдено'));
    if (movie.owner.toString() !== req.user._id.toString()) {
      throw new Forbidden('Нет прав для совершения данной операции');
    }
    await Movie.deleteOne({ owner: req.user._id, movieId });
    return res.send(movie);
  } catch (err) {
    return next(err);
  }
};

module.exports = { getMovies, create, deleteMovie };
