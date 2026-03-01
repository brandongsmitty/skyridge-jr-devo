// ─────────────────────────────────────────────────────────────────────────────
//  Firebase Configuration — Skyridge Jr Devo
//
//  SETUP CHECKLIST (Firebase Console → skyridge-jr-devo project)
//
//  1. Realtime Database
//     Build → Realtime Database → Create database
//     → Choose us-central1 → Start in "test mode"
//     Then immediately update the rules (see database.rules.json):
//       { "rules": { "skyridge-jr-devo": { ".read": "auth != null", ".write": "auth != null" } } }
//
//  2. Authentication — Google Sign-In
//     Build → Authentication → Sign-in method → Google → Enable
//     Add your domain to the Authorized domains list if hosting outside Firebase.
//
//  Both steps are required for the auth guard (auth.js) to work correctly.
// ─────────────────────────────────────────────────────────────────────────────

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyAGN3iKlPSbvULPYMBi7PxqGjbU6NuMeYo",
  authDomain:        "skyridge-jr-devo.firebaseapp.com",
  databaseURL:       "https://skyridge-jr-devo-default-rtdb.firebaseio.com",
  projectId:         "skyridge-jr-devo",
  storageBucket:     "skyridge-jr-devo.firebasestorage.app",
  messagingSenderId: "154530117223",
  appId:             "1:154530117223:web:1a973509d2435b45a306c2"
};

// Root path in the database for all Skyridge data
const DB_ROOT = 'skyridge-jr-devo';
