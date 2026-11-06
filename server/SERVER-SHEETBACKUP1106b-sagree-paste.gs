/* ═════ 6 Nov · SHEETBACKUP1106b · S-AGREE becomes backup-only (paste AFTER "END SHEETBACKUP1106"; nothing above is changed) ═════
   S-AGREE · kind "dbcopy": the database (coe_agree) is the original; agreement saves are made there first (since 5 Nov).
   Google still writes its own S-AGREE rows as the backup, and stops copying the whole tab.
   The signed-copy Drive link (FILE) is made only by Google: sbAgreeCols1106_ sends the newest 60 S-AGREE rows to rpc/coe_agree_gcols
   every 2 min (and right after an agreement save); the database matches each to its own row and fills the link.
   Turn on: zzBackupOn1106b() · turn off: zzBackupOff1106b() · read-only check: zzBackupCheck1106b() */
var SB1106B_TABS = ['S-AGREE'];
function sbAgreeCols1106_(force) {
  if (!sbCfg_()) return null; const c = CacheService.getScriptCache(); if (!force && c.get('sbac1106')) return null; c.put('sbac1106', '1', 120);
  if (!sbBackupTabs1105_()['S-AGREE']) return null;
  const sh = ss_().getSheetByName('S-AGREE'); if (!sh) return null;
  const n = sh.getLastRow(), w = sh.getLastColumn(); if (n < 2 || w < 1) return null;
  const from = Math.max(2, n - 59), v = sh.getRange(from, 1, n - from + 1, w).getValues(), rows = [];
  v.forEach((x, i) => { const d = sbRow1105_(x); if (d.length && String(d[0] || '').trim()) rows.push({ r: from + i, data: d }); });
  return sbReq_('post', 'rpc/coe_agree_gcols', { p_rows: rows });
}
var sbDrainBase1106b_ = sbDrain;
sbDrain = function () { const r = sbDrainBase1106b_.apply(this, arguments); try { sbAgreeCols1106_(); } catch (e) { console.warn('agree cols', e); } return r; };
(function () {   // send a new signed-copy link at once, not after 2 min
  const G = globalThis, base = G.mgmtAgreeSave; if (typeof base !== 'function') return;
  G.mgmtAgreeSave = function () { const r = base.apply(this, arguments); try { if (r && r.ok) sbAgreeCols1106_(true); } catch (e) { console.warn('agree cols', e); } return r; };
})();
function zzBackupCheck1106b() {
  const out = SB1106B_TABS.map(t => { try { const x = sbBackupCompare1105_(t); return { tab: t, sheetRows: x.sheetRows, dbRows: x.dbRows, same: x.same, diff: (x.diff || []).length, first: (x.diff || []).slice(0, 5), err: x.err }; } catch (e) { return { tab: t, err: String(e) }; } });
  Logger.log('SHEETBACKUP CHECK 1106b ' + JSON.stringify(out)); return out;
}
function zzBackupOn1106b() {
  const out = {};
  SB1106B_TABS.forEach(t => { try { const x = sbBackupCompare1105_(t);
    if (x.err || (x.diff || []).length) { out[t] = 'NOT switched · ' + (x.err || ((x.diff || []).length + ' rows differ')); return; }
    const r = sbReq_('post', 'rpc/coe_sheet_backup_set', { p_tab: t, p_on: true, p_by: 'Code.gs zzBackupOn1106b' }); out[t] = r && r.ok ? 'ON' : 'refused ' + JSON.stringify(r); } catch (e) { out[t] = 'error ' + e; } });
  CacheService.getScriptCache().remove('sbk1105');
  try { out.agreeCols = sbAgreeCols1106_(true); } catch (e) { out.agreeCols = 'error ' + e; }
  Logger.log('SHEETBACKUP ON 1106b ' + JSON.stringify(out)); return out;
}
function zzBackupOff1106b() {
  const c = CacheService.getScriptCache(), out = {};
  SB1106B_TABS.forEach(t => { try { const r = sbReq_('post', 'rpc/coe_sheet_backup_set', { p_tab: t, p_on: false, p_by: 'Code.gs zzBackupOff1106b' }); out[t] = r && r.ok ? 'OFF' : JSON.stringify(r); } catch (e) { out[t] = 'error ' + e; }
    try { putBig_(c, 'sbtv:' + t, {}, 21600); } catch (e) { } });
  c.remove('sbk1105'); try { sbDirty_(SB1106B_TABS); } catch (e) { }
  Logger.log('SHEETBACKUP OFF 1106b ' + JSON.stringify(out)); return out;
}
/* ═════ END SHEETBACKUP1106b ═════ */
