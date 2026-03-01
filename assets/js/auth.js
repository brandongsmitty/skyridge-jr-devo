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

    // Sits to the right of the theme toggle; margin-left:8px gives uniform gap.
    const badge = document.createElement('div');
    badge.id = 'auth-user-badge';
    badge.style.cssText = 'display:flex;align-items:center;gap:8px;flex-shrink:0;margin-left:8px;';

    const firstName = (user.displayName || user.email).split(/[\s@]/)[0];

    // Name pill — visually identical to .theme-toggle (same border, font, size).
    const namePill = document.createElement('span');
    namePill.textContent = firstName;
    namePill.style.cssText = [
      'display:inline-flex', 'align-items:center',
      'background:transparent', 'border:1px solid #2a2a2a', 'border-radius:4px',
      'color:#666',
      'font-family:"Barlow Condensed",sans-serif', 'font-size:11px', 'font-weight:600',
      'letter-spacing:0.5px', 'padding:5px 10px', 'white-space:nowrap',
    ].join(';');

    // Sign Out pill — reuse .theme-toggle class; clear the auto margin it carries.
    const btn = document.createElement('button');
    btn.textContent = 'Sign Out';
    btn.className = 'theme-toggle';
    btn.style.marginLeft = '0';
    btn.addEventListener('click', signOut);

    badge.appendChild(namePill);
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
