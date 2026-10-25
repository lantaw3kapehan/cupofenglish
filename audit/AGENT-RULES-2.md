# Phase 2 rules — design + full screen/tab QA (25 Oct 2026, 14:30). Read audit/AGENT-RULES.md first; all of it still applies.

## What Misty asked (her words, summarised)
- Improve the DESIGN screen by screen and tab by tab across the whole app — every main page, tab, detail view, dialog and form —
  using **Finance › Overview (patch 823, view `finov`, CSS class `.fx`) as the visual reference**. Consistent typography, spacing,
  cards, buttons, tables, status labels and navigation, adapted to each screen's purpose. Reduce repeated information; make important
  actions easy to find. Preserve every feature, permission, calculation, database relationship and all wallet functions.
- **Keep the Finance Overview font styles and sizes she likes** (Fredoka One for page titles only; the system sans stack for
  everything else, tabular numerals for figures; sizes: page title 26px, card title 15px/700, KPI value 22px/700, KPI label 11.5px/700
  uppercase, body/table 13.5px, sub text 13px, small 12px). This **replaces** the earlier "switch to Inter" idea (patch 880 now uses
  the same system sans stack).
- Audit every screen AND every tab inside it: tabs, detail views, nested dialogs, forms, filters, navigation, loading / empty / error
  states, responsive layout (1280, 768, 390 px), every supported role. List anything inaccessible or untested explicitly.
- Actions that change data may only be tested in the isolated preview (never production).

## The shared design layer (use it, don't fork it)
- Patch `patches/900-ui-foundation.js` defines tokens (`--ui-font`, `--ui-brand`, `--ui-ink`, `--ui-teal`, `--ui-teal-d`, `--ui-in`,
  `--ui-out`, `--ui-ac`, `--ui-line`, `--ui-mute`, `--ui-r` 14px, `--ui-pad`, `--ui-gap`, `--ui-ctl` 34px) and opt-in classes
  `.ui-h .ui-sub .ui-card .ui-ch .ui-k .ui-seg .ui-bar .ui-pill(.ok/.ac/.no/.mu/.in/.out) .ui-t .ui-note .ui-in .ui-out`.
  Read it and `patches/823-finance-overview-transactions.js` (the reference look) before designing.
- Prefer restyling existing markup with CSS scoped to YOUR views (`#v-<view> …`, and dialogs you own via a class you add on open),
  plus small DOM wrappers where a layout must change. Do not rewrite renderers. Do not change global selectors (`.btn`, `h2`,
  `.card`…) app-wide — only the lead edits 900. If you need a new shared class, propose it in your report.
- Colours: purple #2f2752 for headings/navigation, teal for primary actions, green for income/OK, muted red for expenses/problems,
  amber for waiting. No new saturated backgrounds, fewer shadows, one card radius (14px).

## Base file and preview harness
- Your base is the INTEGRATED file: `cp app.html $S/base.html` then apply EVERY patch with number ≥ 828 that exists in `patches/`
  (sorted) — that includes the other agents' work as it lands. Build yours on top; re-test against the latest set before reporting.
- Preview with sample data: `node tools/preview-build.js <html> audit/fx/recs.json <out.html> <label>` then open `file://<out.html>`
  in Playwright. Anonymised management (President) data from 25 Oct 13:50, clock frozen at that moment. Wait ~12 s after load.
  - `?role=ops` → Operations (not President). `?writes=fake` → saves return ok without storing anything (the ONLY allowed way to
    test save/send/refund/payment/scheduling/training/approval flows). Without it saves are refused.
  - `window.__PREVIEW_MISS` lists requests with no sample data → mark those screens/tabs "Blocked · no sample data".
  - `window.__PREVIEW_DELAY = 3000` (set before an action) simulates a slow request; failed requests: block with Playwright route
    or temporarily make the shim return {ok:false}.
- Screenshots: `audit/shots/<group>-<screen>-<tab>-<width>.png` (before = app.html + patches < 900? no — before = plain `app.html`
  preview `audit/preview/before.html`; after = your integrated build).

## Your outputs
1. Patch files in your number range only.
2. `audit/checklist/<group>.json`: an array of rows
   `{ "screen": "Students", "tab": "Parent reports › To check", "kind": "page|tab|detail|dialog|form", "role": "President|Operations|Teacher",
      "design": "Pass|Fail|Blocked|Not tested|Improved", "qa": "Pass|Fail|Blocked|Not tested", "findings": "…", "evidence": "shot path / test name", "patch": "9xx" }`
   One row per screen × tab × role (dialogs/forms included). Be honest: Pass only with evidence.
3. Final report: what you changed per screen, what you deliberately left, bugs found (fixed / not fixed), untested items and why.
