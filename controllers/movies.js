const NotFound = require('../errors/notFound');
const BadRequest = require('../errors/badRequest');
const Movie = require('../models/movie');

exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (!movies) {
        throw new NotFound('Не найдено');
      }
      res.send(movies);
    })
    .catch((err) => next(err));
};
exports.addMovie = (req, res, next) => {
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

exports.deleteMovie = (req, res, next) => {
  Movie.findOne(
    {
      movieId: req.params.movieId,
      owner: req.user._id,
    },
  )
    .select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new BadRequest('Неправильный запрос');
      }
      const deletedMovie = movie;
      movie.remove();
      res.send(deletedMovie);
    })
    .catch((err) => next(err));
};
