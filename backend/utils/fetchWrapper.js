// Caching + retry wrapper with live metrics for axios requests to the NASA API.
// This module provides a caching layer for API requests to reduce load and improve performance.
// It also implements an exponential backoff retry mechanism for handling transient errors.
// The cache is stored in memory and has a time-to-live (TTL) of 1 hour.
// The module exports a single function `cachedFetch` that takes a cache key and a URL
// and returns the cached data or fetches it from the API if not available or expired.
// It logs cache hits, misses, and memory usage for monitoring purposes.

const axios = require("axios");

const cache = new Map();
const TTL   = 60 * 60 * 1000;             

// helper: exponential-backoff retry 
async function retry(fn, n = 3, backoff = 200) {
  let last;
  for (let i = 0; i < n; i++) {
    try   { return await fn(); }
    catch (err) {
      if (err.response?.status < 500) throw err;   // 4xx = permanent
      last = err;
      await new Promise(r => setTimeout(r, backoff * 2 ** i));
    }
  }
  throw last;
}

// main cached fetch 
async function cachedFetch(key, url) {
  const hit = cache.get(key);

  //fast path: fresh cache
  if (hit && hit.data && Date.now() - hit.ts < TTL) {
    console.log(`[CACHE HIT] ${key} — heap ${(process.memoryUsage().heapUsed/1e6).toFixed(1)} MB`);
    return hit.data;
  }

  // share in-flight promise 
  if (hit && hit.promise) {
    console.log(`[WAIT   ⏳] ${key}`);
    return hit.promise;
  }

  // miss: go to NASA
  console.log(`[CACHE MISS ] ${key}`);
  console.time(`API ${key}`);

  const p = retry(() => axios.get(url, { timeout: 5000 })).then(res => {
    console.timeEnd(`API ${key}`);

    // size metric
    const bytes =
      Number(res.headers["content-length"]) ||
      JSON.stringify(res.data).length;
    console.log(`↳ downloaded ${(bytes/1024).toFixed(1)} KB`);

    // cache & heap metric 
    cache.set(key, { ts: Date.now(), data: res.data });
    console.log(
      `[STORE ] ${key} — cache items ${cache.size}, heap ${(process.memoryUsage().heapUsed/1e6).toFixed(1)} MB`
    );
    return res.data;
  })
  .finally(() => {
    const ent = cache.get(key);
    if (ent) delete ent.promise;
  });

  cache.set(key, { promise: p });
  return p;
}

module.exports = cachedFetch;
