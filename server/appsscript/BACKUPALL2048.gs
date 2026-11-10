/* BACKUPALL2048 · 10 Nov 2026 · Misty: the database is now the main record, so the nightly Drive copy must hold all of it.
   The old copy (sbBackup_ in Code.gs) held 13 of the database's tables. This one asks the database for its list of tables
   (coe_backup_list), so a table added later is copied too. Left out on purpose: sign-in secrets (password hashes, session
   tokens, keys) and the app's speed log. Supabase keeps its own full daily backups as well.
   One .zip per night in "CupOfEnglish database backups" (one JSON file per table + _about.json); copies older than 30 days
   go to the Drive trash. Runs at 02:00 from sbDrain (unchanged). Run runBackupNow() from the editor to make one now. */
function sbBackupAll2048_() {
  if (!sbCfg_()) return 0;
  const t0 = Date.now(), day = fmt_(new Date(), 'yyyy-MM-dd'), counts = {}, failed = [], blobs = [];
  const L = sbReq_('post', 'rpc/coe_backup_list', {}) || [];
  if (!Array.isArray(L) || !L.length) throw new Error('The database gave no table list');
  L.forEach(x => {
    const t = String(x.t || ''); if (!t) return;
    try {
      const all = [];
      for (let off = 0; off < 1000000; off += 5000) {
        const rows = sbReq_('post', 'rpc/coe_backup_rows', { p_t: t, p_off: off, p_lim: 5000 });
        if (!Array.isArray(rows)) throw new Error('no rows');
        Array.prototype.push.apply(all, rows); if (rows.length < 5000) break;
      }
      if (t === 'writes') all.forEach(w => { if (w && Array.isArray(w.args) && w.args.length) w.args[0] = null; });   // never the sign-in
      blobs.push(Utilities.newBlob(JSON.stringify(all), 'application/json', t + '.json')); counts[t] = all.length;
    } catch (e) { failed.push(t + ': ' + String(e && e.message || e).slice(0, 120)); }
  });
  blobs.push(Utilities.newBlob(JSON.stringify({ at: new Date().toISOString(), tables: Object.keys(counts).length, rows: counts, failed: failed }, null, 1), 'application/json', '_about.json'));
  const it = DriveApp.getFoldersByName('CupOfEnglish database backups');
  const folder = it.hasNext() ? it.next() : DriveApp.createFolder('CupOfEnglish database backups');
  const file = folder.createFile(Utilities.zip(blobs, 'coe-database-' + day + '.zip'));
  const files = folder.getFiles(), old = Date.now() - 30 * 864e5;
  while (files.hasNext()) { const f = files.next(); if (f.getDateCreated().getTime() < old && /^coe-database-/.test(f.getName())) f.setTrashed(true); }
  sbReq_('post', 'docs?on_conflict=key', [{ key: 'sys:backup', scope: 'pres', data: { day: day, file: file.getName(), url: file.getUrl(), bytes: file.getSize(), tables: Object.keys(counts).length, rows: counts, failed: failed, sec: Math.round((Date.now() - t0) / 1000), at: new Date().toISOString() }, updated_at: new Date().toISOString() }], 'resolution=merge-duplicates,return=minimal');
  return file.getSize();
}
sbBackup_ = sbBackupAll2048_;
