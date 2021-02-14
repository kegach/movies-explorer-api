const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./movies');

router.use('/', usersRouter);
router.use('/', cardsRouter);

module.exports = router;
