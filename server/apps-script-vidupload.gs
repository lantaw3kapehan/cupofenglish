
// ───────────────────────── 22 Oct 2026 · CLASS VIDEO UPLOAD FROM THE APP (Misty: teachers' own Drive storage keeps running out)
// The video goes straight from the teacher's phone or laptop to Drive through a one-time upload link that works@ opens, so works@ owns
// the file (the shared 6 TB) and the teacher's own 15 GB is never used. Same place and name as today:
// TEACHERS VIDEO CLASSES › TEACHER › "ST-CODE | NAME | BOOK" › (MONTH, when that student's folder already uses month folders)
// named ST-CODE-Name-Month-D-YYYY-BOOK.ext. Trial / Sub → the teacher's TRIAL / SUB CLASSES folder.
// The month-DAILY day cell gets the link when it holds the lesson number (=HYPERLINK(url, 0.5) keeps the number);
// when the cell is still empty, the warm-up links it later (script property vidq, kept 7 days).
API_FNS.push('tVidStart', 'tVidDone');
const VID_MONTHS_RE_ = /^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\b/;
function vidMonthFolder_(folderId, d) {
  const f = DriveApp.getFolderById(folderId), mon = Utilities.formatDate(d, CFG.TZ, 'MMMM').toUpperCase(), it = f.getFolders();
  let uses = false;
  while (it.hasNext()) { const x = it.next(), nm = x.getName().trim().toUpperCase(); if (nm.indexOf(mon) === 0) return x.getId(); if (VID_MONTHS_RE_.test(nm)) uses = true; }
  return uses ? f.createFolder(mon).getId() : folderId;
}
function vidEvent_(ev) {
  const st = new Date(ev && ev.start); if (isNaN(st)) return null;
  const day = new Date(fmt_(st, 'yyyy-MM-dd') + 'T12:00:00+08:00');
  return dayEvents_(day).find(e => e.id === ev.id) || null;
}
/** Teacher (or management for a teacher): open a one-time upload link for one class video. */
function tVidStart(token, ev, file) {
  const u = auth_(token); ev = ev || {}; file = file || {};
  const size = Math.floor(Number(file.size) || 0), fname = String(file.name || ''), mime = String(file.type || '').slice(0, 60) || (/\.mov$/i.test(fname) ? 'video/quicktime' : 'video/mp4');
  if (!(size > 0)) return { ok: false, msg: 'Choose the class video file.' };
  if (!/^video\//.test(mime) && !/\.(mp4|mov|m4v|mkv|webm|avi)$/i.test(fname)) return { ok: false, msg: 'Choose a video file (MP4, MOV…).' };
  const e = vidEvent_(ev); if (!e) return { ok: false, msg: 'This class was not found in the calendar. Refresh and try again.' };
  const mgmt = u.mode === 'mgmt', teacher = String(mgmt && ev.teacher ? ev.teacher : u.name).trim(), tl = teacher.toLowerCase();
  if (!mgmt && (e.teachers || []).indexOf(tl) < 0) return { ok: false, msg: 'This class is not on your schedule.' };
  const st = new Date(e.start), type = /trial/i.test(e.title || '') ? 'Trial' : /\bsub\b/i.test(e.title || '') ? 'Sub' : '';
  const code = String(e.code || '').toUpperCase(), book = String(e.book || '').split(/\s*,\s*/).filter(p => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p))[0] || '';
  const T = vidTree_(), tt = T.t[tl] || {};
  let fid = ''; const furl = vidFolder_(code, teacher, book, type); if (furl) fid = furl.split('/').pop();
  if (!fid) {
    if (!tt.root) return { ok: false, msg: 'Teacher ' + teacher + ' has no folder in TEACHERS VIDEO CLASSES yet. Ask Ops to add it.' };
    if (type) return { ok: false, msg: 'Teacher ' + teacher + ' has no ' + type.toUpperCase() + ' CLASSES folder yet. Ask Ops to add it.' };
    if (!code) return { ok: false, msg: 'This class has no student code in the calendar. Ask Ops to fix the class title.' };
    fid = DriveApp.getFolderById(tt.root).createFolder(code + ' | ' + String(e.student || '').toUpperCase() + ' | ' + book.replace(/[\s-]+/g, '').toUpperCase()).getId();
    try { CacheService.getScriptCache().remove('vtree2'); } catch (x) {}
  }
  fid = vidMonthFolder_(fid, st);
  const ext = ((fname.match(/\.([A-Za-z0-9]{2,5})$/) || [])[1] || (mime.split('/')[1] || 'mp4').replace('quicktime', 'mov')).toLowerCase();
  const who = String(e.student || 'Student').trim().replace(/\s+/g, '-'), when = Utilities.formatDate(st, CFG.TZ, 'MMMM-d-yyyy');
  const base = (code ? code + '-' : (type ? type.toUpperCase() + '-' : '')) + who + '-' + when + (book ? '-' + book.replace(/[\s-]+/g, '') : '') + (file.test ? '-TEST' : '');
  const meta = { name: base + '.' + ext, parents: [fid], mimeType: mime, description: 'Uploaded in the CupOfEnglish app by ' + u.name + ' · class ' + fmt_(st, 'yyyy-MM-dd HH:mm') + (teacher !== u.name ? ' · Teacher ' + teacher : '') };
  const r = UrlFetchApp.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true&fields=id', {
    method: 'post', contentType: 'application/json; charset=UTF-8', payload: JSON.stringify(meta), muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken(), 'X-Upload-Content-Type': mime, 'X-Upload-Content-Length': String(size), Origin: 'https://app.cupofenglishatph.com' } });
  const h = r.getAllHeaders(), loc = h.Location || h.location;
  if (r.getResponseCode() !== 200 || !loc) { console.warn('vid start', r.getResponseCode(), r.getContentText().slice(0, 300)); return { ok: false, msg: 'Google did not open the upload (' + r.getResponseCode() + '). Try again in a minute.' }; }
  const key = 'vup:' + Utilities.getUuid();
  CacheService.getScriptCache().put(key, JSON.stringify({ ds: fmt_(st, 'yyyy-MM-dd'), code: code, teacher: teacher, id: e.id, name: meta.name, by: u.name, test: !!file.test }), 21600);
  return { ok: true, url: loc, key: key, name: meta.name, chunk: 8 * 1024 * 1024 };
}
/** After the upload: check the file, link it in month-DAILY, and show it in the app at once. */
function tVidDone(token, key, fileId) {
  const u = auth_(token), c = CacheService.getScriptCache(), raw = c.get(String(key || ''));
  if (!raw) return { ok: false, msg: 'This upload is too old. Upload the video again.' };
  const j = JSON.parse(raw); let f;
  try { f = DriveApp.getFileById(String(fileId || '')); } catch (x) { return { ok: false, msg: 'The video did not arrive in Drive. Upload it again.' }; }
  const url = f.getUrl(); let linked = false;
  if (!j.test) {
    try { linked = vidLinkDaily_(j.ds, j.code, j.teacher, url); } catch (x) { console.warn('vid daily', x); }
    if (!linked) { const p = PropertiesService.getScriptProperties(); let q = []; try { q = JSON.parse(p.getProperty('vidq') || '[]'); } catch (x) {}
      q.push({ ds: j.ds, code: j.code, teacher: j.teacher, url: url, at: Date.now() }); p.setProperty('vidq', JSON.stringify(q.slice(-300))); }
    try { const vk = 'vid:' + j.ds, v = getBig_(c, vk); if (v && j.code) { v[j.code + '|' + String(j.teacher).toLowerCase()] = { url: url, by: 'app', at: fmt_(new Date(), 'MMM d HH:mm'), name: f.getName() }; putBig_(c, vk, v, 1500); } } catch (x) {}
  }
  c.remove(String(key));
  console.log('class video ' + f.getName() + ' by ' + u.name + (linked ? ' · DAILY linked' : ' · DAILY later'));
  return { ok: true, url: url, name: f.getName(), linked: linked, note: 'Class video saved · ' + f.getName() };
}
/** month-DAILY: put the link on the class's day cell, keeping its lesson number. true = linked (or nothing to link). */
function vidLinkDaily_(ds, code, teacher, url) {
  if (!code) return true;                                                     // trial without a code: not in DAILY
  const d = new Date(ds + 'T12:00:00+08:00'), sh = dailyTab_(d); if (!sh) return false;
  const n = sh.getLastRow(); if (n < 4) return false;
  const col = 4 + Number(fmt_(d, 'd')), keys = sh.getRange(4, 1, n - 3, 3).getValues(), tl = String(teacher || '').toLowerCase();
  const names = r => String(r[2] || '').toLowerCase().split(/[,/&+]| and /).map(x => x.trim());
  let i = keys.findIndex(r => String(r[0]).trim().toUpperCase() === code && names(r).indexOf(tl) > -1);
  if (i < 0) i = keys.findIndex(r => String(r[0]).trim().toUpperCase() === code);
  if (i < 0) return false;
  const cell = sh.getRange(4 + i, col), fm = cell.getFormula();
  if (/HYPERLINK\(/i.test(fm)) return true;                                     // already linked
  if (fm) return false;                                                       // another formula: never touched
  const rt = cell.getRichTextValue(); if (rt && rt.getLinkUrl()) return true;  // already linked as rich text
  const v = cell.getValue(); if (typeof v !== 'number') return false;          // lesson number not entered yet: link later
  cell.setFormula('=HYPERLINK("' + url + '",' + v + ')'); return true;
}
/** Links that waited for the lesson number: tried again with the 10-minute warm-up; kept 7 days. */
function vidQueue_() {
  const p = PropertiesService.getScriptProperties(); let q = []; try { q = JSON.parse(p.getProperty('vidq') || '[]'); } catch (x) {}
  if (!q.length) return 0;
  const keep = q.filter(x => { if (Date.now() - x.at > 7 * 864e5) return false; try { return !vidLinkDaily_(x.ds, x.code, x.teacher, x.url); } catch (e) { return true; } });
  p.setProperty('vidq', JSON.stringify(keep)); return q.length - keep.length;
}
var warmVidsBase_ = warmVids_;
warmVids_ = function () { try { vidQueue_(); } catch (e) { console.warn('vidq', e); } return warmVidsBase_.apply(this, arguments); };
