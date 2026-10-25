# Server paste · trial saves through the database (25 Oct)

**What it does:** lets Google copy two more trial saves from the database queue into the sheet:
- **Mark as sent** (Trials › trial report sent to the family), and
- **Learner type**, which Google then uses to remake its own PDF.

The app saves them in about half a second instead of waiting for Google. The new report PDF is already made in the app at once (patch 801).
Follow-up was already instant.

Nothing changes until the app is switched (patch 802, after this is deployed).

## Step 1 · Paste at the very bottom of the last file (CupOfEnglish Teacher App)

```javascript
// 25 Oct · trial saves replayed from the database queue
try { Object.assign(SB_REPLAY, { mgmtTrialSent: 1, mgmtTrialGroup: 1 }); } catch (e) { console.warn('SB_REPLAY trial', e); }
```

## Step 2 · Save (Cmd+S) · Deploy › Manage deployments › pencil › New version › Deploy.
No function to run.
