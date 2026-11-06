/* ═════ 6 Nov · SHEETBACKUP1106c · S-ENQUIRIES and T-PEER become backup-only (paste AFTER "END SHEETBACKUP1106b"; nothing above is changed) ═════
   kind "dbcopy": the database (coe_enquiries, coe_peer) is the original; saves are made there first (since 5 Nov).
   Google still writes its own rows as the backup, and stops copying the two tabs.
   Two things only Google makes: the final ids (EQ-… / PR-…) and a teacher's submitted peer review (status, time, score).
   sbTabCols1106c_ sends both tabs' rows to rpc/coe_tab_gcols every 2 min (and right after one of their saves); the database
   matches each row to its own and never overwrites a newer app save.
   Turn on: zzBackupOn1106c() · turn off: zzBackupOff1106c() · read-only check: zzBackupCheck1106c() */
var SB1106C_TABS = ['S-ENQUIRIES', 'T-PEER'];
function sbTabCols1106c_(force) {
  if (!sbCfg_()) return null; const c = CacheService.getScriptCache(); if (!force && c.get('sbtc1106c')) return null; c.put('sbtc1106c', '1', 120);
  const on = sbBackupTabs1105_(), out = {};
  SB1106C_TABS.forEach(tab => { if (!on[tab]) return;
    const sh = ss_().getSheetByName(tab); if (!sh) return;
    const n = sh.getLastRow(), w = sh.getLastColumn(); if (n < 2 || w < 1) return;
    const v = sh.getRange(2, 1, n - 1, w).getValues(), rows = [];
    v.forEach((x, i) => { const d = sbRow1105_(x); if (d.length && String(d[0] || '').trim()) rows.push({ r: i + 2, data: d }); });
    out[tab] = sbReq_('post', 'rpc/coe_tab_gcols', { p_tab: tab, p_rows: rows }); });
  return out;
}
var sbDrainBase1106c_ = sbDrain;
sbDrain = function () { const r = sbDrainBase1106c_.apply(this, arguments); try { sbTabCols1106c_(); } catch (e) { console.warn('tab cols', e); } return r; };
['mgmtEnqSave', 'mgmtPeerAssign', 'mgmtPeerCancel', 'tPeerSubmit'].forEach(function (fn) {   // send the new id / answer at once
  const G = globalThis, base = G[fn]; if (typeof base !== 'function') return;
  G[fn] = function () { const r = base.apply(this, arguments); try { if (r && r.ok) sbTabCols1106c_(true); } catch (e) { console.warn('tab cols', e); } return r; };
});
function zzBackupCheck1106c() {
  const out = SB1106C_TABS.map(t => { try { const x = sbBackupCompare1105_(t); return { tab: t, sheetRows: x.sheetRows, dbRows: x.dbRows, same: x.same, diff: (x.diff || []).length, first: (x.diff || []).slice(0, 5), err: x.err }; } catch (e) { return { tab: t, err: String(e) }; } });
  Logger.log('SHEETBACKUP CHECK 1106c ' + JSON.stringify(out)); return out;
}
function zzBackupOn1106c() {
  const out = {};
  SB1106C_TABS.forEach(t => { try { const x = sbBackupCompare1105_(t);
    if (x.err || (x.diff || []).length) { out[t] = 'NOT switched · ' + (x.err || ((x.diff || []).length + ' rows differ')); return; }
    const r = sbReq_('post', 'rpc/coe_sheet_backup_set', { p_tab: t, p_on: true, p_by: 'Code.gs zzBackupOn1106c' }); out[t] = r && r.ok ? 'ON' : 'refused ' + JSON.stringify(r); } catch (e) { out[t] = 'error ' + e; } });
  CacheService.getScriptCache().remove('sbk1105');
  try { out.tabCols = sbTabCols1106c_(true); } catch (e) { out.tabCols = 'error ' + e; }
  Logger.log('SHEETBACKUP ON 1106c ' + JSON.stringify(out)); return out;
}
function zzBackupOff1106c() {
  const c = CacheService.getScriptCache(), out = {};
  SB1106C_TABS.forEach(t => { try { const r = sbReq_('post', 'rpc/coe_sheet_backup_set', { p_tab: t, p_on: false, p_by: 'Code.gs zzBackupOff1106c' }); out[t] = r && r.ok ? 'OFF' : JSON.stringify(r); } catch (e) { out[t] = 'error ' + e; }
    try { putBig_(c, 'sbtv:' + t, {}, 21600); } catch (e) { } });
  c.remove('sbk1105'); try { sbDirty_(SB1106C_TABS); } catch (e) { }
  Logger.log('SHEETBACKUP OFF 1106c ' + JSON.stringify(out)); return out;
}
/* ═════ END SHEETBACKUP1106c ═════ */
