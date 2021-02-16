const NotFound = require('../errors/notFound');
const Forbidden = require('../errors/forbidden');
const Movie = require('../models/movie');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({}).orFail(
      new NotFound('Не найдено'),
    );
    return res.send(movies);
  } catch (err) {
    return next(err);
  }
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
const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId)
      .select('+owner')
      .orFail(new NotFound('Не найдено'));
    if (movie.owner.toString() !== req.user._id.toString()) {
      throw new Forbidden('Нет прав для совершения данной операции');
    }
    await Movie.deleteOne({ _id: movieId });
    return res.send(movie);
  } catch (err) {
    return next(err);
  }
};

export { getMovies, create, deleteMovie };
