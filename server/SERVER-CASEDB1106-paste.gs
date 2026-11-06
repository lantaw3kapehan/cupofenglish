
/* ═════ 6 Nov · CASEDB1106 · Cases database-first. Paste AFTER "END READYVID1106".
   The database now makes each app case (number + ACTIONS record) when the save arrives (coe-wq v9 / coe_dbf_h_case) and sends the
   number with the save as f.caseId. Google then writes that same case into ACTIONS (no new number). If the case is already in
   ACTIONS (the same save sent twice), Google answers ok without a second row. Cases without f.caseId work exactly as before.
   Undo: delete this block, Save, Deploy. ═════ */
(function () {
  const G = globalThis, base = G.addCase_; if (typeof base !== 'function' || base.__casedb1106) return;
  const w = function (u, f) {
    const id = String((f && f.caseId) || '');
    if (!/^OAR-\d{4}-\d+$/.test(id)) return base.apply(this, arguments);
    const a = sheet_(TAB.ACTIONS), n = a.getLastRow();
    const ids = n >= 3 ? a.getRange(3, 1, n - 2, 1).getValues().map(x => String(x[0])) : [];
    if (ids.indexOf(id) > -1) return { ok: true, caseId: id, already: true };
    const keep = G.caseIdDb_; G.caseIdDb_ = function () { return id; };
    try { return base.apply(this, arguments); } finally { G.caseIdDb_ = keep; }
  };
  w.__casedb1106 = 1; G.addCase_ = w;
})();
/* ═════ END CASEDB1106 ═════ */
