# Rules for audit agents (25 Oct 2026) — read fully before starting

You are helping audit the CupOfEnglish app (one big single-page file `app.html`, ~25k lines, plain JS, no build).
The full brief from Misty (the owner) is in `audit/USER-BRIEF.txt`. Read it. You own only the findings named in your task.

## Repo and how changes are made
- Repo: `/home/claude/cupofenglish` (git branch `audit-2026-10-25`). `app.html` = what is live in production right now.
- Changes are **patch files** `patches/NNN-short-name.js`, run as `node patches/NNN.js <path-to-app.html>`.
  - Small edits: `require('../tools/lib.js')(process.argv[2], [[find, replace], ...])` — each `find` must occur **exactly once** in the file
    (the run fails otherwise); lib also bumps COE_V. Look at `patches/820-history-net-line.js`, `patches/825-finance-polish.js`.
  - Bigger additions: append a `<script>` before the last `</body>` — see `patches/824-payroll-minimal.js`
    (pattern: `s.slice(0,i) + String.raw\`<script>…</script>\` + s.slice(i)`; the code inside String.raw must not contain backticks;
    call `require('../tools/lib.js')(file, [])` afterwards if you made no lib edits so COE_V still bumps — or include ≥1 lib edit).
  - Later scripts can wrap/override earlier global functions (`const _f = window.f; window.f = function(){…}`), which is how most
    previous fixes were layered. Prefer the smallest correct change.
- Use ONLY your assigned patch number range. Several agents work at the same time on different findings.
- Test each patch: `cp app.html "$S/t.html" && node patches/NNN.js "$S/t.html" && node tools/check.js "$S/t.html"`
  (S = a scratch dir of your own under /tmp/claude-0/…). check.js syntax-checks every script. Also test your patches applied together, in order.
- Behaviour test where practical with Node or Playwright (`require('playwright')` works; chromium.launch() needs no options) by
  extracting/running the relevant functions with fixture data. There is no live login in the container; the backend is not reachable from it.

## Absolutely do NOT
- Do not run `tools/ship.sh`, `git commit`, `git push`, or edit `app.html` itself. Do not touch `patches/applied.txt`. **Nothing is deployed.**
- Do not call any write/mutation endpoint, Apps Script, edge function deploy, or SQL that changes data. Supabase MCP (project
  `rlxkiahqjsabopmuhern`) may be used for **read-only SELECT** to investigate real data (tables: `sheet_rows(tab, r, data jsonb array)`,
  `log_rows(tab, data)`, `classes(day, data)`, `docs(key, data)`, `writes(fn, who, args, status, created_at)`, `app_sessions` — never select token columns).
  Keep queries small (LIMIT). Do not paste personal data (student names, parents, phone numbers, amounts per person) into your report beyond
  what is needed; prefer codes/row numbers.
- Do not use any browser tools (the browser pane is in use by the lead).
- Do not change schemas, spreadsheet structure, source columns, formulas, IDs, financial calculations, currency precision, refund signs,
  payroll rules, shared-package relationships, government-payment deduplication, QA weights, training/rank rules, contract/signature
  history, notice deadlines or historical records. Do not "fix" data to make counts match. Do not invent missing date parts.
- Labels/wording/display mapping/state handling/accessibility fixes are in scope. A change that would alter a business rule or a formula:
  do NOT implement — write it up as a "business-rule question" for Misty.

## Style the app uses
- Plain English, short, no jargon. Peso as ₱ with thousands separators; negative = "−₱3,675.00" (minus sign before ₱).
- Brand: purple #2f2752, teal #01b0bf; Fredoka One for brand/titles only.

## Your report (final message) — keep it tight, this is what the lead integrates
1. For each finding: reproduced? (yes/no/partly + evidence: function name + app.html line numbers, data checked), root cause, what your patch changes, what you deliberately did NOT change and why.
2. Patch files written (paths), each tested: apply + check.js result; any behaviour test you ran and its result.
3. Business-rule questions / data issues to flag (no fixes applied).
4. Anything untested and why. Do not claim something passes without evidence.
