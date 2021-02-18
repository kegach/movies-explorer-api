import express from 'express';
import { celebrate, Joi } from 'celebrate';
import { get, update } from '../controllers/users';

const router = express.Router();

router.get('/me', get);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30),
  }),
}), update);

module.exports = router;
