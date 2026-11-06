/* ═════ 6 Nov · SHEETBACKUP1106 · T-LEAVE becomes backup-only (paste AFTER "END SHEETBACKUP1105 phase 2"; nothing above is changed) ═════
   T-LEAVE · kind "dbcopy": the database (coe_leave) is the original. Leave saves are made there first (teacher filing, management
   saves, replies, cancels, "informed"). Google still writes its own T-LEAVE rows as the backup, and stops copying the whole tab.
   Google still owns three cells the database cannot make: PROOF (files in Drive), and ASKED / THREAD after a reply that carries a file.
   sbLeaveCols1106_ sends the T-LEAVE rows to rpc/coe_leave_gcols every 2 min (and right after a leave save); the database takes
   only those cells (a newer app save is never overwritten) and adds any leave it doesn't know yet.
   Turn on: zzBackupOn1106() · turn off: zzBackupOff1106() · read-only check: zzBackupCheck1106() */
var SB1106_TABS = ['T-LEAVE'];
function sbLeaveCols1106_(force) {
  if (!sbCfg_()) return null; const c = CacheService.getScriptCache(); if (!force && c.get('sblc1106')) return null; c.put('sblc1106', '1', 120);
  if (!sbBackupTabs1105_()['T-LEAVE']) return null;
  const sh = ss_().getSheetByName('T-LEAVE'); if (!sh) return null;
  const n = sh.getLastRow(), w = sh.getLastColumn(); if (n < 2 || w < 1) return null;
  const v = sh.getRange(1, 1, n, w).getValues(), rows = [];
  for (let r = 2; r <= n; r++) { const d = sbRow1105_(v[r - 1]); if (d.length && String(d[0] || '').trim()) rows.push({ r: r, data: d }); }
  return sbReq_('post', 'rpc/coe_leave_gcols', { p_rows: rows });
}
var sbDrainBase1106_ = sbDrain;
sbDrain = function () { const r = sbDrainBase1106_.apply(this, arguments); try { sbLeaveCols1106_(); } catch (e) { console.warn('leave cols', e); } return r; };
['tLeaveRequest', 'tLeaveReply', 'mgmtLeaveSave'].forEach(function (fn) {   // send the new proof / reply at once, not after 2 min
  const G = globalThis, base = G[fn]; if (typeof base !== 'function') return;
  G[fn] = function () { const r = base.apply(this, arguments); try { if (r && r.ok) sbLeaveCols1106_(true); } catch (e) { console.warn('leave cols', e); } return r; };
});
function zzBackupCheck1106() {
  const out = SB1106_TABS.map(t => { try { const x = sbBackupCompare1105_(t); return { tab: t, sheetRows: x.sheetRows, dbRows: x.dbRows, same: x.same, diff: (x.diff || []).length, first: (x.diff || []).slice(0, 5), err: x.err }; } catch (e) { return { tab: t, err: String(e) }; } });
  Logger.log('SHEETBACKUP CHECK 1106 ' + JSON.stringify(out)); return out;
}
function zzBackupOn1106() {
  const out = {};
  SB1106_TABS.forEach(t => { try { const x = sbBackupCompare1105_(t);
    if (x.err || (x.diff || []).length) { out[t] = 'NOT switched · ' + (x.err || ((x.diff || []).length + ' rows differ')); return; }
    const r = sbReq_('post', 'rpc/coe_sheet_backup_set', { p_tab: t, p_on: true, p_by: 'Code.gs zzBackupOn1106' }); out[t] = r && r.ok ? 'ON' : 'refused ' + JSON.stringify(r); } catch (e) { out[t] = 'error ' + e; } });
  CacheService.getScriptCache().remove('sbk1105');
  try { out.leaveCols = sbLeaveCols1106_(true); } catch (e) { out.leaveCols = 'error ' + e; }
  Logger.log('SHEETBACKUP ON 1106 ' + JSON.stringify(out)); return out;
}
function zzBackupOff1106() {
  const c = CacheService.getScriptCache(), out = {};
  SB1106_TABS.forEach(t => { try { const r = sbReq_('post', 'rpc/coe_sheet_backup_set', { p_tab: t, p_on: false, p_by: 'Code.gs zzBackupOff1106' }); out[t] = r && r.ok ? 'OFF' : JSON.stringify(r); } catch (e) { out[t] = 'error ' + e; }
    try { putBig_(c, 'sbtv:' + t, {}, 21600); } catch (e) { } });
  c.remove('sbk1105'); try { sbDirty_(SB1106_TABS); } catch (e) { }
  Logger.log('SHEETBACKUP OFF 1106 ' + JSON.stringify(out)); return out;
}
/* ═════ END SHEETBACKUP1106 ═════ */
