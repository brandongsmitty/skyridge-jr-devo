// ─────────────────────────────────────────────────────────────────────────────
//  trail-fetcher.js — Trail data abstraction layer
//
//  Phase 1 (current): Loads static data/trails.json
//  Phase 2 (pending): Swap load() to Trailforks API once key is available.
//                     normalizeTrailforks() maps the API response to our schema.
//                     The trail-planner.html page never needs to change.
// ─────────────────────────────────────────────────────────────────────────────

const TrailFetcher = (() => {
  'use strict';

  const SOURCE = 'static'; // Phase 2: change to 'trailforks'

  // ── Phase 1: load from static JSON ────────────────────────────────────────
  function load() {
    return fetch('../data/trails.json')
      .then(r => {
        if (!r.ok) throw new Error(`trails.json fetch failed: ${r.status}`);
        return r.json();
      });
  }

  // ── Phase 2 stub: normalize Trailforks API response to our schema ──────────
  // Replace load() with a Trailforks fetch and pipe through this function.
  // Trailforks difficulty: 0=white, 1=green, 2=blue, 3=black, 4=dbl-black, 5=dbl-black
  function normalizeTrailforks(apiResponse) {
    const diffMap = { 0: 'green', 1: 'green', 2: 'blue', 3: 'black', 4: 'dbl-black', 5: 'dbl-black' };
    const condMap  = { 1: 'dry', 2: 'dry', 3: 'muddy', 4: 'muddy', 5: 'wet', 6: 'snow', 7: 'closed', 0: 'unknown' };

    // TODO Phase 2: map apiResponse.data.trails[] to our trail schema
    // Example field mappings:
    //   trail.trailid       → trailforks_id
    //   trail.title         → name
    //   trail.difficulty    → difficulty (via diffMap)
    //   trail.condition     → conditions.status (via condMap)
    //   trail.length        → length_mi (convert from meters: / 1609.34)
    //   trail.climb         → elevation_gain_ft (convert from meters: * 3.281)
    //   trail.surface       → surface
    //   trail.lastchanged   → conditions.updated_at

    return apiResponse; // placeholder — replace with real mapping
  }

  return { load, source: SOURCE };
})();
