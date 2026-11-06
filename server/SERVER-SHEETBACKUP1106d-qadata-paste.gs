/* ═════ 6 Nov · SHEETBACKUP1106d · QA-DATA becomes backup-only (paste AFTER "END SHEETBACKUP1106c"; nothing above is changed) ═════
   QA-DATA · kind "dbcopy": the database (coe_qa) is the original; the President's QA saves are made there first (since 5 Nov).
   The QA Google Form still adds its response row (with the Form's own timestamp) and onQaSubmit sorts the tab newest first.
   QA-DATA joins the SHEETBACKUP1106c hand-over (sbTabCols1106c_): its rows go to rpc/coe_tab_gcols, which matches each Form row
   to the app's QA row. Sent every 2 min while switched on, and right after a QA save and after the Form's sort.
   Turn on: zzBackupOn1106d() · turn off: zzBackupOff1106d() · read-only check: zzBackupCheck1106d() */
var SB1106D_TABS = ['QA-DATA'];
if (SB1106C_TABS.indexOf('QA-DATA') < 0) SB1106C_TABS.push('QA-DATA');
(function () {
  const G = globalThis;
  const q = G.mgmtQaSubmit; if (typeof q === 'function') G.mgmtQaSubmit = function () { const r = q.apply(this, arguments); try { if (r && r.ok) sbTabCols1106c_(true); } catch (e) { console.warn('qa cols', e); } return r; };
  const s = G.onQaSubmit; if (typeof s === 'function') G.onQaSubmit = function () { const r = s.apply(this, arguments); try { sbTabCols1106c_(true); } catch (e) { console.warn('qa cols', e); } return r; };
})();
function zzBackupCheck1106d() {
  const out = SB1106D_TABS.map(t => { try { const x = sbBackupCompare1105_(t); return { tab: t, sheetRows: x.sheetRows, dbRows: x.dbRows, same: x.same, diff: (x.diff || []).length, first: (x.diff || []).slice(0, 5), err: x.err }; } catch (e) { return { tab: t, err: String(e) }; } });
  Logger.log('SHEETBACKUP CHECK 1106d ' + JSON.stringify(out)); return out;
}
function zzBackupOn1106d() {
  const out = {};
  SB1106D_TABS.forEach(t => { try { const x = sbBackupCompare1105_(t);
    if (x.err || (x.diff || []).length) { out[t] = 'NOT switched · ' + (x.err || ((x.diff || []).length + ' rows differ')); return; }
    const r = sbReq_('post', 'rpc/coe_sheet_backup_set', { p_tab: t, p_on: true, p_by: 'Code.gs zzBackupOn1106d' }); out[t] = r && r.ok ? 'ON' : 'refused ' + JSON.stringify(r); } catch (e) { out[t] = 'error ' + e; } });
  CacheService.getScriptCache().remove('sbk1105');
  try { out.tabCols = sbTabCols1106c_(true); } catch (e) { out.tabCols = 'error ' + e; }
  Logger.log('SHEETBACKUP ON 1106d ' + JSON.stringify(out)); return out;
}
function zzBackupOff1106d() {
  const c = CacheService.getScriptCache(), out = {};
  SB1106D_TABS.forEach(t => { try { const r = sbReq_('post', 'rpc/coe_sheet_backup_set', { p_tab: t, p_on: false, p_by: 'Code.gs zzBackupOff1106d' }); out[t] = r && r.ok ? 'OFF' : JSON.stringify(r); } catch (e) { out[t] = 'error ' + e; }
    try { putBig_(c, 'sbtv:' + t, {}, 21600); } catch (e) { } });
  c.remove('sbk1105'); try { sbDirty_(SB1106D_TABS); } catch (e) { }
  Logger.log('SHEETBACKUP OFF 1106d ' + JSON.stringify(out)); return out;
}
/* ═════ END SHEETBACKUP1106d ═════ */
