# Server paste · a student with two classes in one day: each class gets its own video (25 Oct)

**What's wrong:** Eleven (ST-2026-088) had two classes on Sat 24 Oct: Julia 19:30 (ShortVowels) and Kat 20:00 (OD1).
Julia uploaded her video in the app (19:57). Kat did not upload one: there is no upload from Kat for Eleven that day.
Google's "video found in Drive" check looks for any video of that student on that day and gives it to **every** class of that
student that day. So Julia's video also showed on Kat's class as "Video ✓ · Drive". Kat's class looked done and she was never reminded.
It also kept only the first video per student per day, so if both teachers had uploaded, one video would have been missed.

**What this paste does:** every Drive video of the day is kept, and each one goes to **one** class only:
1. the class whose book is in the file name (…-ShortVowels.mp4 → Julia's ShortVowels class);
2. otherwise the class that ended last before the file was uploaded (closest in time).
A class with no video of its own now shows "No video" and the teacher is reminded as usual. App uploads were already matched to their own class.

## Step 1 · Paste at the very bottom of the last file

```javascript
// 25 Oct · class videos: a student with 2+ classes in a day → each Drive video goes to ONE class (book in the name, else nearest in time)
function vidsDriveAll25_(ds) {
  const d = new Date(ds + 'T00:00:00+08:00'), y = +ds.slice(0, 4), m = +ds.slice(5, 7), dd = +ds.slice(8, 10), out = {};
  const since = Utilities.formatDate(new Date(d.getTime() - 3600e3), 'UTC', "yyyy-MM-dd'T'HH:mm:ss");
  const it = DriveApp.searchFiles("modifiedDate > '" + since + "' and trashed = false and (mimeType contains 'video/' or title contains '.mp4')");
  let n = 0;
  while (it.hasNext() && n++ < 600) {
    const f = it.next(), nm = f.getName(), code = (nm.match(/ST-\d{4}-\d{3}/i) || [])[0]; if (!code) continue;
    if (!/^video\//.test(f.getMimeType()) && !/\.(mp4|mov|m4v|mkv|webm|avi)$/i.test(nm)) continue;
    const dm = nm.replace(/_/g, '-').match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|sem|oct|nov|dec)[a-z]*[\s-]+(\d{1,2})(?:st|nd|rd|th)?[,\s-]+(\d{4})/i);
    let ok;
    if (dm) { const mi = MONTHS_.findIndex(x => x.slice(0, 3) === dm[1].toLowerCase().replace('sem', 'sep')); ok = mi + 1 === m && +dm[2] === dd && +dm[3] === y; }
    else ok = fmt_(f.getDateCreated(), 'yyyy-MM-dd') === ds;
    if (!ok) continue;
    const key = code.toUpperCase(), bk = (nm.replace(/\.[a-z0-9]+$/i, '').match(/\d{4}-([A-Za-z0-9 ]+)$/) || [])[1] || '';
    (out[key] = out[key] || []).push({ url: f.getUrl(), by: 'drive', at: fmt_(f.getDateCreated(), 'MMM d HH:mm'), ts: f.getDateCreated().toISOString(), name: nm, bk: bk.replace(/[\s-]+/g, '').toUpperCase() });
  }
  return out;
}
function vids_(ds, fresh) {
  const c = CacheService.getScriptCache(), k = 'vid:' + ds; if (!fresh) { const hit = getBig_(c, k); if (hit) return hit; }
  const today = fmt_(new Date(), 'yyyy-MM-dd'); if (ds > today) return {};
  const drive = fresh || ds >= fmt_(new Date(Date.now() - 864e5), 'yyyy-MM-dd');
  const d = new Date(ds + 'T12:00:00+08:00'), out = {};
  try { const sh = dailyTab_(d), n = sh ? sh.getLastRow() : 0;
    if (n >= 4) { const col = 4 + Number(fmt_(d, 'd')), keys = sh.getRange(4, 1, n - 3, 3).getValues(), rg = sh.getRange(4, col, n - 3, 1), f = rg.getFormulas(), rt = rg.getRichTextValues();
      keys.forEach((r, i) => { const code = String(r[0]).trim().toUpperCase(); if (!/^ST-/.test(code)) return;
        const url = (String(f[i][0]).match(/HYPERLINK\("([^"]+)"/i) || [])[1] || (rt[i][0] && rt[i][0].getLinkUrl()) || '';
        if (url) out[code + '|' + String(r[2]).trim().toLowerCase()] = { url: url, by: 'daily' }; }); } } catch (e) { console.warn('daily vids', e); }
  if (drive) try { const drv = vidsDriveAll25_(ds), byCode = {};
    dayEvents_(d).forEach(e => { if (e.cancelled) return; const code = String(e.code || '').toUpperCase(); if (drv[code]) (byCode[code] = byCode[code] || []).push(e); });
    Object.keys(byCode).forEach(code => {
      const E = byCode[code].slice().sort((a, b) => String(a.start).localeCompare(String(b.start))), F = drv[code].slice(), used = {};
      const bkE = e => String(e.book || '').replace(/[\s-]+/g, '').toUpperCase();
      const give = (e, v) => { used[e.id] = 1; (e.teachers || []).forEach(t => { const key = code + '|' + t; if (!out[key]) out[key] = v; }); };
      // 1) the book in the file name
      F.slice().forEach(v => { if (!v.bk) return; const e = E.find(x => !used[x.id] && bkE(x) && (bkE(x) === v.bk || bkE(x).indexOf(v.bk) === 0 || v.bk.indexOf(bkE(x)) === 0)); if (e) { give(e, v); F.splice(F.indexOf(v), 1); } });
      // 2) nearest in time: the class that ended last before the upload
      F.forEach(v => { const ts = Date.parse(v.ts), free = E.filter(x => !used[x.id] && !(x.teachers || []).some(t => out[code + '|' + t]));
        if (!free.length) return; const before = free.filter(x => Date.parse(x.end) <= ts + 10 * 60e3);
        const e = (before.length ? before.sort((a, b) => Date.parse(b.end) - Date.parse(a.end)) : free.sort((a, b) => Math.abs(Date.parse(a.end) - ts) - Math.abs(Date.parse(b.end) - ts)))[0];
        give(e, v); });
    }); } catch (e) { console.warn('drive vids', e); }
  putBig_(c, k, out, 1500); return out;
}
/** Run once now: Eleven 24 Oct check + refresh the database copy of the video lists. */
function zzVidMatch25() {
  const v = vids_('2026-10-24', true); vids_(fmt_(new Date(Date.now() - 864e5), 'yyyy-MM-dd'), true);
  console.log('Eleven · julia: ' + JSON.stringify((v['ST-2026-088|julia'] || {}).name || null) + ' · kat: ' + JSON.stringify((v['ST-2026-088|kat'] || {}).name || null));
  try { vids_(fmt_(new Date(), 'yyyy-MM-dd'), true); vidSb25_(); } catch (e) { console.log('sync ' + e); }
}
```

## Step 2 · Save (Cmd+S), choose **zzVidMatch25**, click **Run**
The log should say `Eleven · julia: "ST-2026-088-Eleven-October-24-2026-ShortVowels.mp4" · kat: null`.

## Step 3 · Deploy › Manage deployments › pencil › New version › Deploy.
