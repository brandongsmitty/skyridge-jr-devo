# Skyridge Jr Devo — Coaching Staff Site

GitHub Pages site for coaching staff tools: worksheet, role tracker, kickoff agenda, and role descriptions.

**Live site:** https://brandongsmitty.github.io/skyridge-jr-devo/

---

## Updating for a New Season

All year-specific content lives in one file: **`season.json`**. You don't need to touch any HTML files.

### How to edit season.json on GitHub

1. Go to the repo: `https://github.com/brandongsmitty/skyridge-jr-devo`
2. Click on **`season.json`** in the file list
3. Click the **pencil icon** (Edit this file) in the top right
4. Make your changes (see the fields below)
5. Scroll down, add a commit message like "Update for 2027 season", and click **Commit changes**
6. Wait about 60 seconds, then refresh the live site

### Fields to update each year

**Under `season`:**
- `year` — change to the new season year (e.g. `2027`)
- `headCoach.name`, `.email`, `.phone` — update if changed
- `kickoffMeeting.date`, `.time`, `.location` — update when scheduled
- `keyDates` — update the list of important dates for the season
- `priorSeasonYear` — set to the year just completed (e.g. `2026`)

**Under `roles`:** Only update if role names, time commitments, or summaries change. The structure stays the same year to year.

**Under `schools`:** Add or remove schools as needed. Each school has:
- `name` — display name
- `students` — approximate count (or `null` if unknown)
- `hasPTA` — `true` or `false`
- `ptaContact` — name of contact if known, otherwise `""`
- `notes` — any special notes (e.g. tabling opportunities)

**Under `agenda.segments`:** Update if the meeting structure changes. Each segment has `title`, `start`, `end`, `duration` (in minutes), and `description`.

**Under `agenda.materials`:** Update the checklist of items to have at the kickoff meeting.

> **Tip:** You can use `{{year}}` and `{{priorSeasonYear}}` as placeholders anywhere in `agenda` text — they'll be replaced automatically.

---

## Validating your JSON

If you're not sure your edits are valid JSON, paste the content into **[jsonlint.com](https://jsonlint.com)** and click Validate. Fix any errors before committing.

Common mistakes:
- Missing comma between items in an array or object
- Trailing comma after the last item (not allowed in JSON)
- Missing closing `}` or `]`

---

## Important: Must use a web server

These pages use `fetch()` to load `season.json`, which requires HTTP/HTTPS. You **cannot** open the HTML files directly from your computer (double-clicking them won't work).

**Use the GitHub Pages URL** (above) or run locally:

```bash
cd skyridge-jr-devo
python3 -m http.server
# Then open: http://localhost:8000
```

---

## Site structure

```
/
├── index.html          Hub/portal landing page
├── season.json         ← Edit this each year
├── README.md           This file
├── assets/
│   ├── css/shared.css  Shared nav styles
│   └── js/season-loader.js  Fetches season.json
└── tools/
    ├── worksheet.html  Individual coach pre-meeting worksheet
    ├── tracker.html    Head coach role assignment tracker
    ├── agenda.html     Kickoff meeting agenda
    └── roles.html      Role descriptions for all coaching roles
```

---

## Enabling GitHub Pages (one-time setup)

1. Go to the repo on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select `main` branch and `/ (root)` folder
4. Click **Save**
5. GitHub will show the live URL (takes about a minute to go live)
