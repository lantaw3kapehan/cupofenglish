
// ───────────────────────── 22 Oct 2026 · TEACHERS VIDEO CLASSES: teachers become Viewers (Misty: uploads now go through the app)
// Teachers can still open and watch their classes, but can no longer add files there (uploading in Drive used their own storage).
// works@ and operations@ keep their access. No emails are sent. Run vidLockDry first (lists only), then vidLockRun.
// Folders a teacher OWNS cannot be changed by works@ — they are listed so Ops can fix them by hand.
const VIDLOCK_ROOT_ = '1BtfJ4G6qQXi73Ctj_Tb3ehwZnGKjUuDd';
const VIDLOCK_KEEP_ = ['works@cupofenglishatph.com', 'operations@cupofenglishatph.com'];
function vidLockDry() { return vidLock_(true); }
function vidLockRun() { return vidLock_(false); }
function vidLock_(dry) {
  const tok = ScriptApp.getOAuthToken(), H = { Authorization: 'Bearer ' + tok }, base = 'https://www.googleapis.com/drive/v3/files/';
  const done = [], owned = [], bad = []; let n = 0;
  const walk = (id, path, depth) => {
    n++;
    const r = UrlFetchApp.fetch(base + id + '/permissions?supportsAllDrives=true&fields=permissions(id,emailAddress,role,type,permissionDetails)', { headers: H, muteHttpExceptions: true });
    if (r.getResponseCode() !== 200) { bad.push(path + ' · ' + r.getResponseCode()); }
    else (JSON.parse(r.getContentText()).permissions || []).forEach(p => {
      const em = String(p.emailAddress || '').toLowerCase(), inh = (p.permissionDetails || []).some(d => d.inherited);
      if (p.role === 'owner' && em && VIDLOCK_KEEP_.indexOf(em) < 0) { owned.push(path + ' · owned by ' + em); return; }
      if (!/^(writer|fileOrganizer|organizer)$/.test(p.role) || inh) return;
      if (VIDLOCK_KEEP_.indexOf(em) > -1) return;
      const who = em || p.type;
      if (!dry) {
        const u = UrlFetchApp.fetch(base + id + '/permissions/' + p.id + '?supportsAllDrives=true', { method: 'patch', contentType: 'application/json', payload: JSON.stringify({ role: 'reader' }), headers: H, muteHttpExceptions: true });
        if (u.getResponseCode() !== 200) { bad.push(path + ' · ' + who + ' · ' + u.getResponseCode() + ' ' + u.getContentText().slice(0, 120)); return; }
      }
      done.push(path + ' · ' + who);
    });
    if (depth >= 3) return;
    const it = DriveApp.getFolderById(id).getFolders();
    while (it.hasNext()) { const f = it.next(); walk(f.getId(), path + ' › ' + f.getName(), depth + 1); }
  };
  walk(VIDLOCK_ROOT_, 'TEACHERS VIDEO CLASSES', 0);
  const out = (dry ? 'DRY RUN · would change ' : 'Changed to Viewer · ') + done.length + ' · folders checked ' + n +
    '\n' + done.join('\n') + (owned.length ? '\n\nOWNED BY A TEACHER (cannot change):\n' + owned.join('\n') : '') + (bad.length ? '\n\nERRORS:\n' + bad.join('\n') : '');
  console.log(out); return out;
}
