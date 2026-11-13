/* BACKUPCHECK · 13 Nov 2026 · Outage safeguard 3 (Misty: "go ahead").
   Right after the nightly backup (BACKUPALL2048) makes its .zip, this reopens the zip from Drive, unzips it, reads every
   table file and checks its row count against what was written. The result goes into the database (docs sys:backupcheck),
   and the GitHub uptime alarm opens an issue if a check fails or is missing. This proves each night's file can be read back.
   SETUP: paste this file next to BACKUPALL2048.gs, run checkLatestBackup() once from the editor to see it work, then run installBackupCheckTrigger() once. */
function checkLatestBackup() {
  const it = DriveApp.getFoldersByName('CupOfEnglish database backups'); if (!it.hasNext()) throw new Error('No backup folder');
  const files = it.next().getFiles(); let f = null;
  while (files.hasNext()) { const x = files.next(); if (/^coe-database-.*\.zip$/.test(x.getName()) && !x.isTrashed() && (!f || x.getDateCreated() > f.getDateCreated())) f = x; }
  if (!f) throw new Error('No backup file');
  const t0 = Date.now(), parts = Utilities.unzip(f.getBlob()), got = {}, bad = [];
  let about = null;
  parts.forEach(b => { const n = b.getName();
    try { const j = JSON.parse(b.getDataAsString());
      if (n === '_about.json') about = j; else got[n.replace(/\.json$/, '')] = Array.isArray(j) ? j.length : -1;
    } catch (e) { bad.push(n + ': cannot be read'); } });
  if (!about) bad.push('_about.json missing');
  const want = (about && about.rows) || {};
  Object.keys(want).forEach(t => { if (!(t in got)) bad.push(t + ': missing from the zip'); else if (got[t] !== want[t]) bad.push(t + ': ' + got[t] + ' rows, expected ' + want[t]); });
  const res = { file: f.getName(), at: new Date().toISOString(), ok: bad.length === 0, tables: Object.keys(got).length, rows: Object.values(got).reduce((a, n) => a + Math.max(0, n), 0), problems: bad.slice(0, 20), sec: Math.round((Date.now() - t0) / 1000) };
  sbReq_('post', 'docs?on_conflict=key', [{ key: 'sys:backupcheck', scope: 'pres', data: res, updated_at: new Date().toISOString() }], 'resolution=merge-duplicates,return=minimal');
  return res;
}
/* runs every night at about 03:30 Manila, after the 02:00 backup (its own trigger, so file order does not matter) */
function installBackupCheckTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'checkLatestBackup').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('checkLatestBackup').timeBased().atHour(3).nearMinute(30).everyDays(1).inTimezone('Asia/Manila').create();
}
