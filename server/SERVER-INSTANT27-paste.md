# Paste · 27 Oct · instant saves: Google also replays them from the database queue

**What's new (already live in the app, version 1310):** the service agreement, the leave "informed" tick, a class tag and a late
time-in decision are saved in the database at once, and the app shows them as saved straight away. The database calls Google's
own save in the background with the same sign-in, so normally nothing else is needed.

**Why this paste:** if Google does not answer that background call (busy, or a time-out), the save waits in the database queue.
Google's minute job only runs saves on its list (SB_REPLAY). This adds these four saves to that list, so a waiting save is done
within a minute instead of staying in the queue.

A signed agreement **with a photo/PDF** is never replayed this way (the file is not kept in the database). If Google does not
answer for it, the app tells the person to save it again.

## Step 1 · Apps Script "CupOfEnglish Teacher App" › Code.gs › scroll to the very bottom › paste:

```javascript
// 27 Oct · instant saves (coe-wq): Google's minute job may also replay these from the database queue (safe if SB_REPLAY is missing)
try { Object.assign(SB_REPLAY, { mgmtAgreeSave: 1, mgmtLeaveInformed: 1, tLeaveInformed: 1, mgmtTagClass: 1, decideLate: 1 }); } catch (e) { console.warn('SB_REPLAY instant27', e); }
function zzInstant27() { try { console.log('Instant saves on the replay list: ' + ['mgmtAgreeSave', 'mgmtLeaveInformed', 'tLeaveInformed', 'mgmtTagClass', 'decideLate'].filter(f => SB_REPLAY[f]).length + ' of 5'); } catch (e) { console.log('SB_REPLAY not found: ' + e); } }
```

## Step 2 · Save (Cmd+S), choose **zzInstant27** next to Debug, click **Run**. The log says `Instant saves on the replay list: 5 of 5`.

No new deployment is needed: the minute job runs the saved code.

## If something looks wrong
Delete the pasted lines and save. The app keeps working; a save Google did not answer at once then waits in the queue until
someone checks it (Claude reports these).
