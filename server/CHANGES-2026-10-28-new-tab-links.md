# Screens open in a new tab (1505 · 1506) · 28 Oct 2026

**Request (Misty 19:23):** "when we click a SCREEN, we can OPEN LINK IN NEW TAB so we can do other things too."

## What changes for people
- Every menu item is now a real link, in both the management and teacher apps, on laptop (side menu) and phone (bottom bar and More). **Ctrl-click / Cmd-click, middle-click, or right-click › "Open link in new tab"** opens that screen in a new tab. On a phone, a long press offers "Open in new tab".
- A plain click (or tap) works exactly as before: no reload, and the same scroll and context.
- The new tab opens on that screen, already signed in, from the copies saved on the device.
- Several tabs can be open together:
  - only one tab rings or shows alerts;
  - signing out in one tab signs out all of them;
  - saves are sent once;
  - a draft is never overwritten by an older copy in another tab.

## Places that became links
| Where | Address |
|---|---|
| Side menu / bottom bar (management + teacher) | `#overview` `#monitor` `#todo` `#schedule` `#messages` `#students` `#trials` `#teachers` `#payroll` `#more` · teacher `#today` `#my-schedule` `#my-students` `#books` `#inbox` `#act` `#growth` `#qa` `#train` `#pay` `#contract` `#more` (and `#chat` when Team Chat is on) |
| More (phone, both apps) | each row, e.g. `#todo` `#messages` `#chat` `#growth` |
| Group tabs (Students · Trials · Teachers · Finance) | `#reports` `#db` `#enquiries` `#performance` `#train` `#leave` `#actions` `#finov` `#expenses` `#sales` `#forecast` `#wallets` |
| Overview tiles and "›" links | Classes `#schedule`, On time `#team`, the To do banner `#todo`, Sales & costs `#sales`, pay `#payroll`, Packages `#active-students`, Performance `#performance`, Parent reports `#reports`, Students `#students`, Teachers `#teachers` |
| Links inside screens written as `go('…')` (e.g. "See all messages ›" → `#inbox`, Growth's QA card → `#qa`, Students › "Database sheet") | the screen's address |
| Records | student rows, To do names, trial cards → `#student=ST-…` · teacher cards → `#teacher=Name` · Team Chat To do lines ("Reply to … in Team Chat") → `#chat=<group>|<day>|<message>` |

- Record addresses that open directly: `#student=ST-2099-588` (also `#student/ST-…`), `#teacher=Name`, `#chat=all` (also `#chat/all`), and `#chat=<group>|<day>|<id>` for one message.
- While a student or teacher panel is open, the address bar shows it, so you can copy the address or duplicate the tab. Inside Team Chat it shows the open group (`#chat=<group>`).
- Access is checked the same way a click is:
  - the screen must be in that person's menu, or in a group tab of a menu item they have. Wallets and Forecast are for the President only, as before;
  - for anything else, the tab opens the usual first screen;
  - the server still checks every record (student, teacher, chat group), as before.

## How it works (for whoever changes the screens next)
- **1505 · links.**
  - Menu items are `<a data-v href data-nl>` and no longer `<button>`.
  - CSS rules and `querySelector` / `closest` / `matches` selectors that say `nav button`, `#navIn button` or `.mo-tabs button` (also inside `:is()` / `:where()` / `:not()`) are read as `…:is(button,a)`. This keeps the same specificity, so the links look and behave like the buttons. It also works for rules added later (style elements are watched).
  - Write new menu rules as `#navIn > a[data-v]` or `nav :is(button,a)`.
  - In-screen elements whose onclick is only `go('x')`, `openStudent('…')`, `openTeacher('…')`, `chat1400.open('…')` or `chat1400.todoGo(…)` get an `href`:
    - plain `<a>`s keep their element;
    - rows or tiles with no other control inside become `<a>` with the same classes, attributes and handlers;
    - rows with buttons inside stay as they are.
  - A plain left click calls `preventDefault()`, and the element's own onclick runs as before. A click with Ctrl, Cmd or Shift, or a middle click, is left to the browser, and the in-tab handlers do not run.
  - Enter works as on any link; Space works as it did on the buttons.
- **Boot.**
  - A small script at the top of `<head>` reads the address before the app rewrites it.
  - The first render opens that screen when the address was newly opened (not on reload or Back), if the person may open it. Some screens are added to the menu a moment after the app opens: Monitor, Finance Overview, Forecast, Wallets, the teacher's Activity log, Trainings and Team Chat. For these, the screen area shows a quiet "Opening…" (like the existing "Updating…") instead of showing another screen first, and then opens the screen when it appears (0.5–4 s on this machine; at most 6 s, after which the usual screen shows). `#active-students` (Overview › Packages) opens Students, as the app itself does.
  - `coe.view` and `coe.place` (last screen and scroll position) are now kept per tab in sessionStorage, and still copied to localStorage. Reload and the 3-hour return rule work per tab as before. A new tab with no address starts where the app was last used.
- **Fix:** before, the menu lost its "current screen" mark when the menu was rebuilt about 1.5 s after opening. It now keeps the mark.
- **1506 · several tabs.**
  - The **sounding tab** is the tab last tapped, typed in or brought to the front (localStorage `coe.tabLead` with a heartbeat). It hands over on close; if it disappears without closing, another tab takes over within 2.5 minutes.
  - Only the sounding tab:
    - plays Team Chat sounds, the class chime and message dings;
    - shows phone or desktop notifications and the "Before you start" pop-up.
  - Class, pay and to-do reminders are left for the sounding tab rather than marked as told in a quiet tab. Testing a sound from the Chat sounds settings always plays.
  - Hidden tabs that are not the sounding tab skip their slow background timers (20 s or more: refreshes, polls, re-sends). They catch up when brought to the front. Most screens' own polls already stopped while hidden; this also covers the 10–30 min refreshes and the device queues.
  - **Device queues** are sent by one tab at a time (Web Locks, with a localStorage lease where Web Locks are missing):
    - `coe.wq`, the saves kept on the device. The server also ignores a repeated `rid` (`writes.rid`, `server/coe.ts` ~l.941, checked);
    - `coe.mvq`, class visits;
    - time-in "posted" ticks;
    - Team Chat › Time-in posts (`coe.chq1495`, from 1495).

    Both `coe.wq` and `coe.mvq` previously rewrote the whole queue after sending, which dropped an item saved during the send, even in one tab. They now remove only what was sent. Team Chat has no device outbox: a retried message reuses its `cid`, and the server posts it once (`server/coe-chat.ts` l.272, checked).
  - **Sign-out:** removing `coe.token` in one tab runs `logout(true)` in the others (they do not sign out again on the server). A new or different token reloads the other tabs.
  - **Drafts** (class notes `coe.nd:…`, QA `coe.qa.draft.…`, monthly feedback `coe.fbx.…`):
    - a tab does not write a draft that another tab changed after this tab last saved it. It says once: "This draft was changed in another tab · that version is kept. Close and reopen this form to continue from it.";
    - reopening the form continues from the newest version.

## Tests (preview, synthetic data, saving off, no sign-in)
- `tools/newtab-check.js` (Playwright), laptop 1440 and phone 390, management and teacher: **78 of 78 checks passed**. It covers:
  - menu items are links;
  - a plain click stays in the tab (no reload marker lost; the hash changes);
  - Ctrl-click and middle-click open a new page on the right hash, signed in with the preview token, while the first tab stays put;
  - Enter and Space on a focused link; focus ring visible;
  - Overview tiles, More rows and Finance group tabs (Ctrl-click and plain click);
  - student row → new tab with that student's panel open; `#teacher=` opens the teacher panel;
  - `#wallets`: allowed for the President, refused for Operations (`?role=ops`); a teacher opening `#payroll` is refused;
  - Back after two screens;
  - a new tab shows its screen about 0.8–1 s after it opens. The old build showed the *default* screen in the same time (the address was ignored, and the tab then stayed on Overview or Today); under heavy load this took 1.9–2.6 s;
  - one sounding tab; a notification shown by one tab only; reminders not used up by the quiet tab;
  - a stale draft not written;
  - `coe.wq` flushed by two tabs at once: each rid sent once, and an item queued during the send is not lost;
  - sign-out in one tab signs out the other;
  - no page errors.
- **Look:** computed styles of every menu item, group tab and in-screen link were compared before and after (management and teacher, laptop and phone).
  - Identical except the cursor (now a pointer on the former href-less links) and the current-screen mark (fix above).
  - Screenshots of 12 management and 9 teacher screens at both widths differ only where two runs of the old build also differ: clock, timers and a toast.
- `tools/regress-saves.js`: **all 17 save/refresh checks passed**.
- `tools/stability-check.js` was run while the machine was busy (load average 7–12, other agents running), for the new build and then the old build:
  - new build: 8 of 60 screen checks above 0.02 (management teachers / payroll / team, teacher pay);
  - old build in the same conditions: 22 of 60 (and one time-out).
  - Repeated with the same steps on both builds (open the screen, reload, watch 9 s), the 8 screens move by the same amounts in the old build (teachers 0.04–0.42, payroll 0.001–0.10, team open 0.04–0.08). These are existing load-timing shifts, not caused by this change.
  - Note: the old build ignored the address, so its "first" and "refresh" cases measured Overview or Today, not the named screen. The new build measures the named screen, which makes this check stricter from now on.

## Not covered
- Buttons styled as `.btn` that only change screens (e.g. To do › "Open trial reports") stay buttons. Ctrl-click and middle-click on them still open a new tab (412), now landing on the right screen; right-click shows no link menu.
- Team Chat's group list inside the chat stays as buttons, because the chat redraws them every few seconds. The open group is in the address bar, and `#chat=all` opens it.
- The teacher's "Needs your action" rows open panels or forms, not screens, so they stay as they are.
- Back from the first screen of a newly opened tab behaves as after a reload, as before: the app's own first history entry.

## Rollback
Branch `rollback-pre-1505` = main before these patches. Revert the patch commit or apply the branch's `app.html`.
