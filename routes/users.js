const { celebrate, Joi } = require('celebrate');
const express = require('express');
const { get, update } = require('../controllers/users');

const router = express.Router();

router.get('/me', get);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
  }),
}), update);

module.exports = router;
