const rateLimit = require('express-rate-limit');

const rateLimits = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

module.exports = rateLimits;
