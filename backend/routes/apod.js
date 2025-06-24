// routes/apod.js
const express = require('express');
const router  = express.Router();
const { getApod } = require('../utils/nasaClient');

function yyyymmdd(d) { return d.toISOString().slice(0, 10); }

router.get('/', async (req, res, next) => {
  const today = req.query.date || yyyymmdd(new Date());

  try {
    return res.json(await getApod({ date: today }));
  } catch (err) {
    if (err.response?.status === 404) {
      // try previous day
      const yesterday = yyyymmdd(new Date(Date.parse(today) - 864e5));
      try {
        return res.json({ ...(await getApod({ date: yesterday })), stale: true });
      } catch (_) { /* fall through */ }
    }
    next(err);          // real error
  }
});

module.exports = router;
