// ─────────────────────────────────────────────────────────────────────────────
//  trail-store.js — Firebase Realtime Database helpers for Trail Planner
//
//  Load in <head> after firebase-app-compat.js, firebase-database-compat.js,
//  firebase-config.js. Must be loaded BEFORE auth.js.
//
//  Admin role is determined by the presence of the current user's UID at:
//    {DB_ROOT}/admins/{uid}  → true
//  Set this manually in Firebase Console for the head coach's UID.
//
//  Trail conditions (live, admin-editable) are stored at:
//    {DB_ROOT}/trail_conditions/{trail-id}/
//      status, updated_at, updated_by, notes
// ─────────────────────────────────────────────────────────────────────────────

const TrailStore = (() => {
  'use strict';

  let db = null;
  let configured = false;
  let _isAdmin = false;

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    if (typeof FIREBASE_CONFIG === 'undefined') return;
    if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') return;

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.database();
      configured = true;
    } catch (e) {
      console.warn('TrailStore: Firebase init failed', e);
    }
  }

  function isReady() { return configured && db !== null; }

  function ref(path) {
    return db.ref(`${DB_ROOT}/${path}`);
  }

  // ── Debounce helper ───────────────────────────────────────────────────────
  const debounceTimers = {};
  function debounce(key, fn, ms = 600) {
    clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(fn, ms);
  }

  // ── Admin role check ──────────────────────────────────────────────────────
  // Returns Promise<boolean>. Call once from trail-planner.html's onAuthStateChanged.
  // The database rule for trail_conditions write also enforces this server-side.
  function checkAdminRole(uid) {
    if (!isReady()) return Promise.resolve(false);
    return ref(`admins/${uid}`)
      .once('value')
      .then(snap => {
        _isAdmin = !!snap.val();
        return _isAdmin;
      })
      .catch(() => false);
  }

  function isAdmin() { return _isAdmin; }

  // ── Live condition listener ───────────────────────────────────────────────
  // callback receives: { [trailId]: { status, updated_at, updated_by, notes } }
  // These values OVERRIDE the static conditions from trails.json.
  function onTrailConditions(callback) {
    if (!isReady()) {
      callback({});
      return;
    }
    ref('trail_conditions').on('value', snap => {
      callback(snap.val() || {});
    });
  }

  // ── Write a trail condition (admin only) ──────────────────────────────────
  function saveTrailCondition(trailId, data) {
    if (!isReady() || !_isAdmin) return;
    ref(`trail_conditions/${trailId}`).set({
      status:     data.status     || 'unknown',
      updated_at: new Date().toISOString(),
      updated_by: data.updatedBy  || '',
      notes:      data.notes      !== undefined ? data.notes : ''
    });
  }

  function saveTrailConditionDebounced(trailId, data) {
    debounce(`cond_${trailId}`, () => saveTrailCondition(trailId, data));
  }

  // ── Boot ──────────────────────────────────────────────────────────────────
  init();

  return {
    isReady,
    checkAdminRole,
    isAdmin,
    onTrailConditions,
    saveTrailCondition,
    saveTrailConditionDebounced,
  };
})();
