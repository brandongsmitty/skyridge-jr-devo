// ─────────────────────────────────────────────────────────────────────────────
//  theme.js — Dark / Light / System theme toggle
//
//  Load early in <head> (before stylesheets) to prevent flash of wrong theme.
//  Injects a toggle button into .site-nav-inner after DOM is ready.
//
//  Cycles: dark → light → system
//  Persists to localStorage under key 'sk-theme'
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  const KEY = 'sk-theme';

  // ── Apply theme immediately (before DOM paint) ───────────────────────────
  const stored = localStorage.getItem(KEY) || 'system';
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  function resolveTheme(pref) {
    if (pref === 'dark')  return 'dark';
    if (pref === 'light') return 'light';
    return mq.matches ? 'dark' : 'light'; // 'system'
  }

  function applyTheme(pref) {
    document.documentElement.setAttribute('data-theme', resolveTheme(pref));
  }

  applyTheme(stored);

  // ── Listen for OS-level preference changes (when on 'system') ────────────
  mq.addEventListener('change', () => {
    if ((localStorage.getItem(KEY) || 'system') === 'system') {
      applyTheme('system');
    }
  });

  // ── Inject toggle button after DOM is ready ───────────────────────────────
  function injectButton() {
    const nav = document.querySelector('.site-nav-inner');
    if (!nav || nav.querySelector('.theme-toggle')) return;

    let current = localStorage.getItem(KEY) || 'system';

    const labels = { dark: '🌙 Dark', light: '☀️ Light', system: '⬤ Auto' };

    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.title = 'Toggle color theme';

    const update = () => {
      btn.textContent = labels[current];
      btn.setAttribute('data-mode', current);
      applyTheme(current);
    };

    update();

    btn.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark';
      localStorage.setItem(KEY, current);
      update();
    });

    nav.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
