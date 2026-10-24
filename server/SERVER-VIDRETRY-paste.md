# Server paste · class video upload when a folder was moved or deleted (24 Oct 2026)

**What's wrong:** Teacher Kat could not upload Luna's video (ST-2026-030). Google said "Walang mahanap na item sa ibinigay na ID" ("no item found with that ID").
The app remembers the video folders for 6 hours. Luna's folder was moved, renamed into another place or deleted after the app remembered it, so the upload pointed at a folder that is no longer there.

**What this paste does:** when the remembered folder is gone, the app forgets the folder list, reads the folders again and tries once more. If the student's folder really is gone, it makes a new one in the teacher's folder, as it does for a new student. The teacher only sees an error if Google itself fails.

## Step 1 · Paste at the very bottom of the last file

```javascript
// 24 Oct · class video: a folder moved / deleted after the 6-hour folder list → read the folders again and try once more
(function () {
  const f0 = globalThis.tVidStart; if (typeof f0 !== 'function') return;
  globalThis.tVidStart = function () {
    try { return f0.apply(this, arguments); }
    catch (e) {
      const m = String(e && e.message || e);
      console.warn('vid start retry · ' + m);
      try { CacheService.getScriptCache().remove('vtree2'); } catch (x) {}
      try { return f0.apply(this, arguments); }
      catch (e2) { console.warn('vid start retry failed · ' + e2); return { ok: false, msg: 'Google Drive could not open the folder for this class. Ask Ops to check the student\'s video folder, then try again.' }; }
    }
  };
})();
/** Run once now: forget the remembered folder list so the next upload reads the folders fresh. */
function zzVidTreeFresh24() { CacheService.getScriptCache().remove('vtree2'); try { vidTree_(); console.log('folder list read again'); } catch (e) { console.log('vtree ' + e); } }
```

## Step 2 · Save (Cmd+S), choose **zzVidTreeFresh24**, click **Run** (log: "folder list read again").
## Step 3 · Deploy › Manage deployments › pencil › New version › Deploy.

Then Kat taps **Upload video** for Luna again.
