// ─────────────────────────────────────────────────────────────────────────────
//  auth.js — Firebase Authentication guard
//
//  Load in <head> after firebase-app-compat.js, firebase-auth-compat.js,
//  firebase-config.js, and meeting-store.js.
//
//  - Hides the page immediately to prevent a flash of unauthenticated content.
//  - Redirects unauthenticated users to login.html.
//  - Shows the page and injects a user badge (email + Sign Out) into the nav
//    once a signed-in user is confirmed.
// ─────────────────────────────────────────────────────────────────────────────

const SkyridgeAuth = (() => {
  'use strict';

  // Hide the page right away. Using a <style> tag works even before <body>
  // is parsed, so there's no flash of content regardless of load order.
  const hideStyle = document.createElement('style');
  hideStyle.id = 'auth-hide';
  hideStyle.textContent = 'body { visibility: hidden !important; }';
  document.head.appendChild(hideStyle);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function getLoginUrl() {
    // Protected pages live in /tools/; login.html is in the same directory.
    return window.location.pathname.includes('/tools/')
      ? 'login.html'
      : 'tools/login.html';
  }

  function redirectToLogin() {
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.replace(getLoginUrl() + '?return=' + returnUrl);
  }

  function showPage() {
    const el = document.getElementById('auth-hide');
    if (el) el.remove();
  }

  function injectUserBadge(user) {
    if (document.getElementById('auth-user-badge')) return;
    const nav = document.querySelector('.site-nav-inner');
    if (!nav) return;

    const badge = document.createElement('div');
    badge.id = 'auth-user-badge';
    badge.style.cssText = 'display:flex;align-items:center;gap:8px;flex-shrink:0;';

    const email = document.createElement('span');
    email.textContent = user.email;
    email.style.cssText = [
      'font-size:11px',
      'color:#666',
      'font-family:Barlow,sans-serif',
      'white-space:nowrap',
      'max-width:160px',
      'overflow:hidden',
      'text-overflow:ellipsis',
    ].join(';');

    // Reuse the existing .theme-toggle class for a consistent button style.
    const btn = document.createElement('button');
    btn.textContent = 'Sign Out';
    btn.className = 'theme-toggle';
    btn.style.marginLeft = '0';
    btn.addEventListener('click', signOut);

    badge.appendChild(email);
    badge.appendChild(btn);
    nav.appendChild(badge);
  }

  // ── Core auth flow ────────────────────────────────────────────────────────

  function init() {
    if (typeof firebase === 'undefined' || typeof FIREBASE_CONFIG === 'undefined') {
      // Firebase not available; show the page rather than leaving it hidden.
      showPage();
      return;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
    } catch (e) {
      console.warn('SkyridgeAuth: Firebase init error', e);
    }

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        redirectToLogin();
        return;
      }

      showPage();

      // Inject badge after DOM is ready (theme.js may not have run yet).
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => injectUserBadge(user));
      } else {
        injectUserBadge(user);
      }
    });
  }

  function signOut() {
    firebase.auth().signOut().then(() => {
      window.location.href = getLoginUrl();
    }).catch(e => console.warn('Sign out error', e));
  }

  // ── Boot ──────────────────────────────────────────────────────────────────

  init();

  return { signOut };
})();
