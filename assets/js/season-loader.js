/**
 * season-loader.js
 * Fetches season.json relative to the current page location.
 * Works from both root (index.html) and tools/ subfolder.
 */

function getSeasonJsonPath() {
  const path = window.location.pathname;
  // If we're in a tools/ subdirectory, go up one level
  if (path.includes('/tools/')) {
    return '../season.json';
  }
  return './season.json';
}

function showLoadError(message) {
  document.body.innerHTML = `
    <div style="
      font-family: 'Barlow', 'Segoe UI', sans-serif;
      max-width: 600px;
      margin: 80px auto;
      padding: 0 24px;
      color: #333;
      text-align: center;
    ">
      <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
      <h1 style="font-size: 24px; margin-bottom: 12px; color: #111;">Unable to Load Season Data</h1>
      <p style="color: #666; margin-bottom: 20px; line-height: 1.6;">${message}</p>
      <div style="
        background: #FFF0E6;
        border: 1px solid #FDDCCA;
        border-left: 4px solid #E85D0C;
        border-radius: 4px;
        padding: 16px 20px;
        text-align: left;
        font-size: 14px;
        color: #7a3a10;
        line-height: 1.6;
      ">
        <strong>This site requires a web server to function.</strong><br>
        You cannot open these files directly from your computer (file:// URLs).<br><br>
        <strong>Options:</strong><br>
        • Visit the live GitHub Pages URL: <code style="background:#f5e6d8;padding:2px 6px;border-radius:3px;">https://brandongsmitty.github.io/skyridge-jr-devo/</code><br>
        • Or run locally: <code style="background:#f5e6d8;padding:2px 6px;border-radius:3px;">python3 -m http.server</code> from the repo root, then open <code style="background:#f5e6d8;padding:2px 6px;border-radius:3px;">http://localhost:8000</code>
      </div>
    </div>
  `;
}

/**
 * Fetches and returns the parsed season.json object.
 * @returns {Promise<Object>} The full season data object
 */
async function loadSeason() {
  const url = getSeasonJsonPath();
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      showLoadError('Could not connect to the server. This page must be served over HTTP/HTTPS, not opened as a local file.');
    } else {
      showLoadError(`Failed to load season.json: ${err.message}`);
    }
    throw err;
  }
}
