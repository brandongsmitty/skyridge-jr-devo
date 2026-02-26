// ─────────────────────────────────────────────────────────────────────────────
//  MeetingStore — Firebase Realtime Database helpers
//  Shared by meeting.html and tracker.html
//
//  Requires firebase-config.js loaded first (provides FIREBASE_CONFIG, DB_ROOT)
//  Requires Firebase compat SDK scripts loaded via CDN
// ─────────────────────────────────────────────────────────────────────────────

const MeetingStore = (() => {
  let db = null;
  let configured = false;

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    if (typeof FIREBASE_CONFIG === 'undefined') return;
    if (FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') return; // still placeholder

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.database();
      configured = true;
    } catch (e) {
      console.warn('MeetingStore: Firebase init failed', e);
    }
  }

  function isReady() { return configured && db !== null; }

  function ref(path) {
    return db.ref(`${DB_ROOT}/${path}`);
  }

  // ── Debounce helper ───────────────────────────────────────────────────────
  const debounceTimers = {};
  function debounce(key, fn, ms = 500) {
    clearTimeout(debounceTimers[key]);
    debounceTimers[key] = setTimeout(fn, ms);
  }

  // ── Role Assignments ─────────────────────────────────────────────────────
  // Stored as: role_assignments/{roleId} = { primary, backup, notes }

  function saveRoleAssignment(roleId, data) {
    if (!isReady()) return;
    ref(`role_assignments/${roleId}`).set({
      primary: data.primary || '',
      backup:  data.backup  || '',
      notes:   data.notes   || '',
      locked:  data.locked  ? true : false
    });
  }

  function saveRoleAssignmentDebounced(roleId, data) {
    debounce(`role_${roleId}`, () => saveRoleAssignment(roleId, data));
  }

  function onRoleAssignments(callback) {
    if (!isReady()) return;
    ref('role_assignments').on('value', snap => {
      callback(snap.val() || {});
    });
  }

  // ── School Assignments ───────────────────────────────────────────────────
  // Stored as: school_assignments/{schoolSlug} = coachName (string)

  function saveSchoolAssignment(schoolSlug, coachName) {
    if (!isReady()) return;
    ref(`school_assignments/${schoolSlug}`).set(coachName || '');
  }

  function onSchoolAssignments(callback) {
    if (!isReady()) return;
    ref('school_assignments').on('value', snap => {
      callback(snap.val() || {});
    });
  }

  // ── School Lock State ────────────────────────────────────────────────────
  // Stored as: school_locked/{schoolSlug} = true/false

  function saveSchoolLocked(slug, locked) {
    if (!isReady()) return;
    ref(`school_locked/${slug}`).set(locked ? true : false);
  }

  function onSchoolLocked(callback) {
    if (!isReady()) return;
    ref('school_locked').on('value', snap => {
      callback(snap.val() || {});
    });
  }

  function loadSchoolLockedOnce() {
    if (!isReady()) return Promise.resolve({});
    return ref('school_locked').once('value').then(snap => snap.val() || {});
  }

  // ── Parking Lot ──────────────────────────────────────────────────────────
  // Stored as: parking_lot = [{ type, label, text }, ...]

  function saveParking(items) {
    if (!isReady()) return;
    ref('parking_lot').set(items || []);
  }

  function onParking(callback) {
    if (!isReady()) return;
    ref('parking_lot').on('value', snap => {
      callback(snap.val() || []);
    });
  }

  // ── Tracker: Role Overrides ───────────────────────────────────────────────
  // Stored as: tracker_data/role_overrides/{roleId} = { status, oneOnOne, notes }

  function saveRoleOverride(roleId, data) {
    if (!isReady()) return;
    ref(`tracker_data/role_overrides/${roleId}`).set(data);
  }

  function saveRoleOverrideDebounced(roleId, data) {
    debounce(`rover_${roleId}`, () => saveRoleOverride(roleId, data));
  }

  function onTrackerRoleOverrides(callback) {
    if (!isReady()) return;
    ref('tracker_data/role_overrides').on('value', snap => {
      callback(snap.val() || {});
    });
  }

  // ── Tracker: School Overrides ─────────────────────────────────────────────
  // Stored as: tracker_data/school_overrides/{schoolSlug} = { status, notes }

  function saveSchoolOverride(schoolSlug, data) {
    if (!isReady()) return;
    ref(`tracker_data/school_overrides/${schoolSlug}`).set(data);
  }

  function saveSchoolOverrideDebounced(schoolSlug, data) {
    debounce(`sover_${schoolSlug}`, () => saveSchoolOverride(schoolSlug, data));
  }

  function onTrackerSchoolOverrides(callback) {
    if (!isReady()) return;
    ref('tracker_data/school_overrides').on('value', snap => {
      callback(snap.val() || {});
    });
  }

  // ── Tracker: Kickoff scheduling (Section 03) ──────────────────────────────
  function saveKickoff(data) {
    if (!isReady()) return;
    ref('tracker_data/kickoff').set(data);
  }

  function saveKickoffDebounced(data) {
    debounce('kickoff', () => saveKickoff(data));
  }

  function onKickoff(callback) {
    if (!isReady()) return;
    ref('tracker_data/kickoff').on('value', snap => {
      callback(snap.val() || {});
    });
  }

  // ── Tracker: Post-meeting summary (Section 04) ───────────────────────────
  function savePostMeeting(data) {
    if (!isReady()) return;
    ref('tracker_data/post_meeting').set(data);
  }

  function savePostMeetingDebounced(data) {
    debounce('post_meeting', () => savePostMeeting(data));
  }

  function onPostMeeting(callback) {
    if (!isReady()) return;
    ref('tracker_data/post_meeting').on('value', snap => {
      callback(snap.val() || {});
    });
  }

  // ── One-time loads (Promises) — used by meeting.html init ─────────────────
  function loadRoleAssignmentsOnce() {
    if (!isReady()) return Promise.resolve({});
    return ref('role_assignments').once('value').then(snap => snap.val() || {});
  }

  function loadSchoolAssignmentsOnce() {
    if (!isReady()) return Promise.resolve({});
    return ref('school_assignments').once('value').then(snap => snap.val() || {});
  }

  function loadParkingOnce() {
    if (!isReady()) return Promise.resolve(null);
    return ref('parking_lot').once('value').then(snap => snap.val());
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    init,
    isReady,
    saveRoleAssignment,
    saveRoleAssignmentDebounced,
    onRoleAssignments,
    loadRoleAssignmentsOnce,
    saveSchoolAssignment,
    onSchoolAssignments,
    loadSchoolAssignmentsOnce,
    saveSchoolLocked,
    onSchoolLocked,
    loadSchoolLockedOnce,
    saveParking,
    onParking,
    loadParkingOnce,
    saveRoleOverride,
    saveRoleOverrideDebounced,
    onTrackerRoleOverrides,
    saveSchoolOverride,
    saveSchoolOverrideDebounced,
    onTrackerSchoolOverrides,
    saveKickoff,
    saveKickoffDebounced,
    onKickoff,
    savePostMeeting,
    savePostMeetingDebounced,
    onPostMeeting,
  };
})();
