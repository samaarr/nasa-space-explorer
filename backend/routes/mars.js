const express  = require('express');
const router   = express.Router();
const { getMars } = require('../utils/nasaClient');

router.get('/', async (req, res, next) => {
  const date  = req.query.date  || new Date().toISOString().slice(0, 10);
  const rover = req.query.rover || 'curiosity';
  try {
    res.json(await getMars({ date, rover }));
  } catch (err) { next(err); }
});

module.exports = router;
