const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 });

// Simple cache-hit/miss counter (Supplementary Problem)
cache.stats = {
  hits: 0,
  misses: 0
};

// Override get and set to track stats for supplementary problem
const originalGet = cache.get.bind(cache);
cache.get = (key) => {
  const val = originalGet(key);
  if (val !== undefined) {
    cache.stats.hits++;
  } else {
    cache.stats.misses++;
  }
  return val;
};

module.exports = cache;
