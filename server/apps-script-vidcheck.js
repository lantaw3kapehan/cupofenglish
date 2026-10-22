// Run in the Apps Script editor tab: patches live Code.gs (exact find/replace) — 22 Oct · class video checks (flags), Misty.
(function(){
const m = monaco.editor.getModels().find(x => x.getValue().indexOf('CLASS VIDEO UPLOAD FROM THE APP') > -1);
let s = m.getValue(); const out = [];
const rep = (a, b) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error('match ' + n + ': ' + a.slice(0, 90)); s = s.replace(a, () => b); out.push('ok'); };
if (s.indexOf('function vidFlagsAll_') > -1) return 'already there';
rep("API_FNS.push('tVidStart', 'tVidDone', 'tVidList');",
"API_FNS.push('tVidStart', 'tVidDone', 'tVidList', 'tVidFlags', 'tVidExplain', 'mgmtVidFlags', 'mgmtVidFlagSet');");
rep("test: !!file.test, start: e.start, student: String(e.student || '') })",
"test: !!file.test, start: e.start, student: String(e.student || ''), end: e.end, img: !!img,\n    dur: Math.round(Number(file.dur) || 0), lm: Math.round(Number(file.lm) || 0), why: String(file.why || '').slice(0, 60), note: String(file.note || '').slice(0, 400) })");
rep("  let lt = null;   // Misty 22 Oct:",
"  let fl = [];     // 22 Oct · video checks: shown to the teacher and to management (OK / Needs action) · the upload is never blocked\n  if (!j.test) { try { fl = vidCheck_(j, f); } catch (x) { console.warn('vid check', x); } }\n  let lt = null;   // Misty 22 Oct:");
rep("late: lt || Date.now() > new Date(j.ds + 'T23:59:59+08:00').getTime(), note:",
"late: lt || Date.now() > new Date(j.ds + 'T23:59:59+08:00').getTime(), flags: fl, note:");
s += `

// ───────────────────────── 22 Oct 2026 · CLASS VIDEO CHECKS (Misty: wrong, reused or manipulated videos)
// Each app upload is checked: screen proof instead of a video · shorter than 80% of the class · recorded before the class started ·
// the same file as another class (Drive md5). A flag never blocks the upload: the teacher explains (reason + note, asked before upload
// when the app can see it), the teacher sees the flag on Today, and management marks it OK or Needs action. Kept 60 days (script properties vf:).
function vidCheck_(j, f) {
  const P = PropertiesService.getScriptProperties(), fl = [], st = new Date(j.start).getTime(), en = new Date(j.end || j.start).getTime(), len = Math.round((en - st) / 60000);
  if (j.img) { const k = 'sp:' + String(j.teacher).toLowerCase() + ':' + j.ds.slice(0, 7), n = Number(P.getProperty(k) || 0) + 1; P.setProperty(k, String(n));
    fl.push({ k: 'proof', t: 'Screen proof instead of a video' + (n > 1 ? ' · ' + n + ' this month' : '') }); }
  else {
    if (j.dur > 0 && len > 0 && j.dur / 60 < len * 0.8) fl.push({ k: 'short', t: Math.max(1, Math.round(j.dur / 60)) + ' min video for a ' + len + ' min class' });
    if (j.lm > 0 && j.lm < st - 10 * 60000) fl.push({ k: 'time', t: 'Recorded ' + fmt_(new Date(j.lm), 'd MMM HH:mm') + ' · before the class started' });
    try { const r = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + f.getId() + '?fields=md5Checksum&supportsAllDrives=true', { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }, muteHttpExceptions: true });
      const h = (JSON.parse(r.getContentText() || '{}') || {}).md5Checksum;
      if (h) { const k = 'vh:' + h, was = P.getProperty(k);
        if (was && was.split('|')[0] !== j.id) fl.push({ k: 'same', t: 'Same file as ' + was.split('|').slice(1).join(' ') });
        else if (!was) P.setProperty(k, j.id + '|' + [j.code, j.student, j.ds].filter(String).join(' ')); } } catch (x) { console.warn('md5', x); }
  }
  if (fl.length) {
    P.setProperty('vf:' + j.id, JSON.stringify({ id: j.id, ds: j.ds, start: j.start, teacher: j.teacher, code: j.code, student: j.student, url: f.getUrl(), name: f.getName(),
      flags: fl, why: j.why || '', note: j.note || '', at: Date.now(), st: 'open', by: '', dnote: '' }));
    try { f.setDescription((f.getDescription() || '') + ' · CHECK: ' + fl.map(x => x.t).join(' · ') + (j.why ? ' · Teacher: ' + j.why + (j.note ? ' — ' + j.note : '') : '')); } catch (x) {}
  }
  return fl;
}
function vidFlagsAll_() {
  const P = PropertiesService.getScriptProperties(), all = P.getProperties(), cut = Date.now() - 60 * 864e5, out = [];
  Object.keys(all).forEach(k => { if (k.indexOf('vf:') !== 0) return; let x; try { x = JSON.parse(all[k]); } catch (e) { return; }
    if ((x.at || 0) < cut) { P.deleteProperty(k); return; } out.push(x); });
  return out.sort((a, b) => String(b.start).localeCompare(String(a.start)));
}
/** Teacher: my video checks (last 60 days). */
function tVidFlags(token) { const u = auth_(token), lc = String(u.name).trim().toLowerCase(); return { ok: true, list: vidFlagsAll_().filter(x => String(x.teacher).toLowerCase() === lc) }; }
/** Teacher: explain a flagged video (or change the explanation while it is still open). */
function tVidExplain(token, id, why, note) {
  const u = auth_(token), P = PropertiesService.getScriptProperties(), k = 'vf:' + String(id || ''), raw = P.getProperty(k); if (!raw) return { ok: false, msg: 'Not found.' };
  const x = JSON.parse(raw); if (String(x.teacher).toLowerCase() !== String(u.name).trim().toLowerCase()) return { ok: false, msg: 'Not your class.' };
  if (x.st !== 'open') return { ok: false, msg: 'Management already reviewed this video.' };
  x.why = String(why || '').slice(0, 60); x.note = String(note || '').slice(0, 400); x.eat = Date.now(); P.setProperty(k, JSON.stringify(x)); return { ok: true };
}
/** Management: every flagged video (open first). */
function mgmtVidFlags(token) { mgr_(token); const L = vidFlagsAll_(); return { ok: true, list: L.filter(x => x.st === 'open').concat(L.filter(x => x.st !== 'open')) }; }
/** Management: OK (nothing wrong) or Needs action (follow up · tag under the contract from Schedule or Cases). */
function mgmtVidFlagSet(token, id, st, note) {
  const u = mgr_(token), P = PropertiesService.getScriptProperties(), k = 'vf:' + String(id || ''), raw = P.getProperty(k); if (!raw) return { ok: false, msg: 'Not found.' };
  if (['ok', 'action', 'open'].indexOf(st) < 0) return { ok: false, msg: 'Choose OK or Needs action.' };
  const x = JSON.parse(raw); x.st = st; x.by = u.name; x.dat = Date.now(); x.dnote = String(note || '').slice(0, 300); P.setProperty(k, JSON.stringify(x)); return { ok: true, item: x };
}
`;
m.setValue(s);
return out.length + ' edits · length ' + s.length;
})()
