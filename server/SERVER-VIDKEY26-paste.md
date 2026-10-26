# Paste · 26 Oct · class video "This upload is too old" (the video IS in Drive but the app says it failed)

**What's wrong (real data, 25 Oct):** Julia's video for Annie (18:30 class) reached the school Drive at 21:40, but the app said
"Class video not uploaded · This upload is too old. Upload the video again." Ara saw the same at 18:53. The app then retried the
last step six more times (21:41 → 22:30), each time with the same message. Annie's video is in Drive and DAILY, but the app's
video record (and the teacher's ✓) is missing.

**Why:** when an upload starts, Google remembers its details (class, student, teacher) in its short-term cache. The cache is not
guaranteed — Google can drop it at any time, especially when a teacher uploads many large videos in an evening. The last step
("link the video") then cannot find the details and answers "too old". A repeated last step (a retry after a weak signal) also
answers "too old", because the first one already used the details up.

**What this paste does (nothing else changes):**
1. When an upload starts, the same details are also kept in the script's permanent storage for 2 days (as well as the cache).
2. If the cache has lost them, the last step takes them back from the permanent storage — or, if those are missing too, from the
   video file itself (the app wrote the class date and teacher into the file's description when it created it).
3. If the last step runs again for a video that was already linked, it answers "saved" again instead of "too old".
4. A class that has not started yet (more than 15 minutes ahead) cannot get a video from a teacher (Kat's 25 Oct upload went to
   her 31 Oct class by mistake). Management can still upload for any class.

## Step 1 · Paste at the very bottom of the LAST file in the app's Apps Script project (the web app the teachers use — the same
## project as the earlier SERVER-VIDRETRY paste)

```javascript
// 26 Oct · class video: upload details kept 2 days (cache can be dropped) · repeated last step answers "saved" · no video for a future class
(function () {
  const S0 = globalThis.tVidStart, D0 = globalThis.tVidDone; if (typeof S0 !== 'function' || typeof D0 !== 'function' || S0.__k26) return;
  const P = () => PropertiesService.getScriptProperties(), C = () => CacheService.getScriptCache();
  const tidy = () => { try { const p = P(), all = p.getProperties(), cut = Date.now() - 2 * 864e5;
    Object.keys(all).forEach(k => { if (!/^(vk26|vd26):/.test(k)) return; let t = 0; try { t = JSON.parse(all[k]).t26 || 0; } catch (e) {} if (t < cut) p.deleteProperty(k); }); } catch (e) {} };
  const S1 = function (token, ev, file) {
    try { const u = auth_(token), st = new Date(ev && ev.start);
      if (u.mode !== 'mgmt' && !isNaN(st) && st.getTime() - Date.now() > 15 * 6e4) return { ok: false, msg: 'This class has not started yet. Upload its video after the class.' }; } catch (e) {}
    const r = S0.apply(this, arguments);
    try { if (r && r.ok && r.key) { const raw = C().get(r.key); if (raw) { const j = JSON.parse(raw); j.t26 = Date.now(); P().setProperty('vk26:' + r.key, JSON.stringify(j)); } if (Math.random() < 0.1) tidy(); } } catch (e) { console.warn('vk26 keep', e); }
    return r;
  };
  const D1 = function (token, key, fileId) {
    const k = String(key || ''), c = C();
    try {
      if (k && !c.get(k)) {
        const done = P().getProperty('vd26:' + k);
        if (done) { const d = JSON.parse(done); delete d.t26; return d; }                         // already linked: same answer again
        let j = null; const kept = P().getProperty('vk26:' + k); if (kept) { j = JSON.parse(kept); delete j.t26; }
        if (!j && fileId) {                                                                      // rebuild from the file the app created
          const u = auth_(token), f = DriveApp.getFileById(String(fileId)), ds0 = String(f.getDescription() || '');
          const m = ds0.match(/^Uploaded in the CupOfEnglish app by (.+?) · class (\d{4}-\d{2}-\d{2}) \d{2}:\d{2}(?: · Teacher (.+))?$/);
          const fresh = Date.now() - f.getDateCreated().getTime() < 2 * 864e5;
          if (m && fresh && (u.mode === 'mgmt' || m[1].trim().toLowerCase() === String(u.name).trim().toLowerCase())) {
            const code = ((f.getName().match(/^(ST-\d{4}-\d{3})-/) || [])[1] || '');
            j = { ds: m[2], code: code, teacher: (m[3] || m[1]).trim(), id: '', name: f.getName(), by: m[1].trim(), test: /-TEST\./.test(f.getName()) };
          }
        }
        if (j) c.put(k, JSON.stringify(j), 21600);
      }
    } catch (e) { console.warn('vk26 restore', e); }
    const r = D0.apply(this, arguments);
    try { if (r && r.ok) { const o = JSON.parse(JSON.stringify(r)); o.t26 = Date.now(); P().setProperty('vd26:' + k, JSON.stringify(o).slice(0, 8500)); P().deleteProperty('vk26:' + k); } } catch (e) { console.warn('vk26 done', e); }
    return r;
  };
  S1.__k26 = 1; D1.__k26 = 1;
  globalThis.tVidStart = S1; globalThis.tVidDone = D1;
  try { tVidStart = S1; tVidDone = D1; } catch (e) {}
})();
function zzVidKey26() { console.log('Video upload details kept: ' + (typeof tVidDone === 'function' && tVidDone.__k26 ? 'ON' : 'OFF')); }
```

## Step 2 · Save (Cmd+S), choose **zzVidKey26** next to Debug, click **Run** — the log says `Video upload details kept: ON`.
## Step 3 · Deploy › Manage deployments › pencil › **New version** › Deploy (this is the app's web app, so it needs a new version).

After this, a teacher who saw "too old" just opens the app again: the app finishes the last step by itself (it keeps the video
details on that device for 5 hours) and the class shows ✓.

## If something looks wrong
Delete the pasted block, save, and deploy a new version again. Uploads work exactly as before.
