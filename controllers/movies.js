const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbidden');
const Movie = require('../models/movie');

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });

    if (!movies) {
      return res.send([]);
    }

    return res.send(movies);
  } catch (err) {
    return next(err);
  }
};
exports.addMovie = async (req, res, next) => {
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
  // eslint-disable-next-line no-console
  console.trace();
  try {
    const movie = await Movie.create({
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
      owner: req.user._id,
    });

    return res.send(movie);
  } catch (err) {
    return next(err);
  }
};

exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie
      .findOne({ owner: req.user._id, movieId })
      .orFail(new NotFound('Не найдено'));

    if (movie.owner.toString() !== req.user._id.toString()) {
      throw new Forbidden('Ошибка');
    }
    await Movie.deleteOne({ owner: req.user._id, movieId });

    return res.send(movie);
  } catch (err) {
    return next(err);
  }
};
