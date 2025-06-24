const express = require("express");
const router  = express.Router();
const { getNeo } = require("../utils/nasaClient"); // existing 7-day wrapper

const DAY   = 864e5;
const MAX   = 6;   // NASA allows 7 days; we’ll use 6 so end-date inclusive

router.get("/", async (req, res, next) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ error: "start & end required" });

    const startMs = Date.parse(start);
    const endMs   = Date.parse(end);
    if (isNaN(startMs) || isNaN(endMs) || startMs > endMs)
      return res.status(400).json({ error: "invalid date range" });

    /* break into 6-day chunks */
    const tasks = [];
    for (let t = startMs; t <= endMs; t += DAY * MAX) {
      const chunkStart = new Date(t).toISOString().slice(0, 10);
      const chunkEnd   = new Date(Math.min(t + DAY * (MAX - 1), endMs))
                          .toISOString().slice(0, 10);
      tasks.push(getNeo({ date: chunkStart, endDate: chunkEnd })); // tweak nasaClient below
    }

    const parts = await Promise.all(tasks);
    /* merge near_earth_objects {date: [..]} from each feed */
    const merged = {};
    parts.forEach(feed => {
      Object.entries(feed.near_earth_objects).forEach(([d, arr]) => {
        merged[d] = merged[d] ? merged[d].concat(arr) : arr;
      });
    });

    res.json({ near_earth_objects: merged });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
