const express  = require('express');
const router   = express.Router();
const { getEpic } = require('../utils/nasaClient');

router.get('/', async (req, res, next) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  try {
    res.json(await getEpic({ date }));
  } catch (err) { next(err); }
});

module.exports = router;
