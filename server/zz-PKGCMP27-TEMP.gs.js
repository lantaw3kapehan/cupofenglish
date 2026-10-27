
// TEMP 27 Oct · zzPkgCmp: Google's own dry-run answers for every ACTIVE student (read-only), saved to docs sys:pkgcmp for comparison. Remove after use.
function zzPkgCmp() {
  const M0 = mgr_, S0 = sheet_, T0 = Date.now();
  const cache = {};
  const wrap = sh => { const nm = sh.getName(); if (nm !== 'ACTIVE' && nm !== 'SALES') return sh;
    const k = nm; if (!cache[k]) { const dr = sh.getDataRange(); cache[k] = { v: dr.getValues(), f: nm === 'ACTIVE' ? dr.getFormulas() : null, lc: sh.getLastColumn(), lr: sh.getLastRow() }; }
    const C = cache[k];
    return { getName: () => nm, getLastColumn: () => C.lc, getLastRow: () => C.lr,
      getDataRange: () => ({ getValues: () => C.v, getFormulas: () => C.f }),
      getRange: (r, c, nr, nc) => { nr = nr || 1; nc = nc || 1; const out = []; for (let i = 0; i < nr; i++) { const row = C.v[r - 1 + i] || []; const x = []; for (let j = 0; j < nc; j++) x.push(row[c - 1 + j] === undefined ? '' : row[c - 1 + j]); out.push(x); }
        return { getValues: () => out, getValue: () => out[0][0], getFormulas: () => { if (!C.f) throw new Error('no formulas'); const o = []; for (let i = 0; i < nr; i++) { const row = C.f[r - 1 + i] || []; const x = []; for (let j = 0; j < nc; j++) x.push(row[c - 1 + j] || ''); o.push(x); } return o; } }; } }; };
  try {
    mgr_ = function () { return { name: 'zzcmp', mode: 'mgmt' }; };
    sheet_ = function (n) { return wrap(S0(n)); };
    CacheService.getScriptCache().remove('endry');
    pkgLink27_(); const LK = (sbReq_('get', 'docs?key=eq.sys:pkglink&select=data') || [])[0];   // the database copy taken at the same moment
    const today = fmt_(new Date(), 'yyyy-MM-dd');
    const A = cache.ACTIVE ? cache.ACTIVE.v : sheet_(TAB.ACTIVE).getDataRange().getValues();
    const codes = {}, pairs = [];
    for (let i = 4; i < A.length; i++) { const c = String(A[i][0] || '').trim().toUpperCase(); if (!/^ST-\d{4}-\d{3}$/.test(c)) continue; codes[c] = 1; pairs.push([c, String(A[i][3] || '').trim()]); }
    const out = { at: new Date().toISOString(), today: today, renew: {}, renewT: {}, enrol: {} };
    const P = PropertiesService.getScriptProperties(), off = Number(P.getProperty('zzcmp') || 0), all = Object.keys(codes).sort(), part = all.slice(off, off + 70);
    out.off = off; out.total = all.length;
    part.forEach(c => {
      try { out.renew[c] = mgmtRenewPaidLog_('x', { code: c, dry: true, date: today }); } catch (e) { out.renew[c] = { err: String(e) }; }
      try { out.enrol[c] = mgmtEnrolPaidBase6_('x', { code: c, dry: true }); } catch (e) { out.enrol[c] = { err: String(e) }; }
    });
    pairs.filter(p => part.indexOf(p[0]) > -1).forEach(p => { const k = p[0] + '|' + p[1]; if (out.renewT[k]) return; try { out.renewT[k] = mgmtRenewPaidLog_('x', { code: p[0], teacher: p[1], dry: true, date: today }); } catch (e) { out.renewT[k] = { err: String(e) }; } });
    out.ms = Date.now() - T0; out.link = LK ? LK.data : null;
    P.setProperty('zzcmp', String(off + 70 >= all.length ? 0 : off + 70));
    sbReq_('post', 'docs?on_conflict=key', [{ key: 'sys:pkgcmp:' + off, scope: 'mgmt', data: out, updated_at: out.at }], 'resolution=merge-duplicates,return=minimal');
    console.log('pkgcmp · codes ' + off + '–' + (off + part.length) + ' of ' + all.length + ' · ' + out.ms + ' ms');
  } finally { mgr_ = M0; sheet_ = S0; }
}
