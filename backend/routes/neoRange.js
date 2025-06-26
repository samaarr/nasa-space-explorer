// This route handles requests for near-Earth objects (NEOs) within a specified date range.
// It breaks the range into 6-day chunks to comply with NASA's API limits and merges
// the results from each chunk into a single response object.
// It uses the `getNeo` function from the `nasaClient` utility to fetch the data.
// The route expects `start` and `end` query parameters for the date range,
// and returns an error if they are not provided or invalid.
// The response contains a merged list of NEOs for each date in the range.
// It uses the `getNeo` function from the `nasaClient` utility to fetch
// the data for each chunk of dates, and merges the results into a single object
// with dates as keys and arrays of NEOs as values.

const express = require("express");
const router  = express.Router();
const { getNeo } = require("../utils/nasaClient"); 

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
      tasks.push(getNeo({ date: chunkStart, endDate: chunkEnd })); 
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
