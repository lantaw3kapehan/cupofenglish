// 1540: (Misty, 28 Oct 22:23–22:31) Lucy ST-2024-139 renewed 30+3 at 22:17; her 20:30 class with Dezza had already ended, but the
// renewal picture said "3 carried over + 33 new" and "35.5 now" (3 + 33 ≠ 35.5). "We always go back to this same concern every time
// our students renew." Rule (Misty 22:27): a class that ended before the renewal belongs to the OLD package, even on the same day.
// Rules for every future change: server/RULES-renewals.md.
//  · ONE renewal calculation: the database lesson counter applies the rule (migrations renewal_rule_1540_*: coe_renew_at, coe_cls_days.hb,
//    coe_pkg_calc carry_eff), the ACTIVE copy every screen reads carries its numbers, and window.coeRenew (below) is the only code that
//    puts them together: carried + new (+ other) − used = lessons now, the guard, valid-until from the first class after the renewal,
//    the renewal form's "lessons left" check and the teachers on the picture. tools/renewal-suite.js tests it in every release (check.js).
//  · Guard: the renewal picture, the lesson-balance picture and the Lesson Summary refuse to draw ("Numbers don't agree yet · checking
//    (核对中)" with the reason) unless the split adds up exactly, the ACTIVE copy and the renewal check are fresh, no renewal save is waiting,
//    and (renewals) ACTIVE shows the new package with the first-class valid-until.
//  · Renewal form: when what Google would record as CARRY OVER differs from what is really left (a class held but not yet counted), Save
//    waits (核对中) instead of recording the wrong carry — until ACTIVE counts it, or at once after the SERVER-RENEWRULE28 paste.
//  · Renewal picture: "2.5 carried over + 33 new · 35.5 lessons now", a "Used since the renewal" line when lessons were used in the new
//    package, valid until from the first class after the renewal, and only the current teacher(s) (Daniela no longer teaches Lucy).
//  · App health / Overview "App check": every renewed package that does not reconcile (database check coe_renew_check, every 10 min).
const lib = require('../tools/lib.js'), file = process.argv[2];
const MODULE = `<script id="coe-renew">
/* 1540 · ONE renewal calculation for every screen (rules: server/RULES-renewals.md · tests: tools/renewal-suite.js, run by tools/check.js).
   The numbers come from the database lesson counter (coe_pkg_calc → the ACTIVE copy the app reads), which applies the renewal rule
   (a class that ended before the renewal belongs to the old package, even on the same day). This module only puts them together,
   checks they add up and are fresh, and works out valid-until — the same way on the renewal form, the renewal picture, the
   lesson-balance picture and the Lesson Summary. Pure functions (no screen code) so the release test can run them. */
(function(g){
  const n1 = x => Math.round((+x || 0) * 10) / 10;
  const months = tot => (+tot || 0) < 30 ? 4 : (+tot || 0) < 60 ? 8 : 12;
  function addM(ymd, k){ const p = String(ymd || '').slice(0, 10).split('-').map(Number); if(p.length < 3 || !p[0]) return '';
    const last = new Date(Date.UTC(p[0], p[1] - 1 + k + 1, 0)).getUTCDate(); return new Date(Date.UTC(p[0], p[1] - 1 + k, Math.min(p[2], last))).toISOString().slice(0, 10); }
  /* a package's numbers from its ACTIVE rows: [{ owner, carry, transfer, incentive, enrolled (paid + free), finished, available }] */
  function fromRows(rows){ let carry = 0, add = 0, used = 0, nw = 0, now = null;
    (rows || []).forEach(r => { carry += +r.carry || 0; add += (+r.transfer || 0) + (+r.incentive || 0); used += +r.finished || 0;
      if(r.owner){ nw = +r.enrolled || 0; now = r.available === '' || r.available == null ? null : +r.available; } });
    return { carry: n1(carry), add: n1(add), new: n1(nw), used: n1(used), now: now == null ? null : n1(now) }; }
  /* carried + new (+ other) − used = now, exactly. chk = the database check row: only the gifts / returned lessons / adjustments it
     names (chk.unk, not in the ACTIVE columns the app reads) may explain a difference — never an unexplained one */
  function split(s, chk){ const o = Object.assign({ other: 0 }, s); if(o.now == null) return Object.assign(o, { ok: false, why: 'Lessons now unknown (核对中)' });
    let diff = n1(o.carry + o.add + o.new - o.used - o.now);
    if(Math.abs(diff) > 0.001 && chk && chk.ok && +chk.unk && Math.abs(n1(+chk.unk + diff)) < 0.001 && chk.now != null && Math.abs(n1(chk.now) - o.now) < 0.001){ o.other = n1(-diff); diff = 0; }
    o.ok = Math.abs(diff) < 0.001;
    if(!o.ok) o.why = 'Numbers don’t agree yet: ' + o.carry + ' carried + ' + n1(o.new + o.add) + ' new − ' + o.used + ' used ≠ ' + o.now + ' now';
    return o; }
  /* valid until: from the first class after the renewal, month end kept (31 Oct + 8 months = 30 Jun) */
  const validFrom = (start, tot) => start ? addM(start, months(tot)) : '';
  function hm(t){ try{ const d = new Date(t); return isNaN(d) ? '—' : d.toLocaleString('en-GB', { timeZone: 'Asia/Manila', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }catch(e){ return '—'; } }
  /* the guard before anything is drawn or sent */
  function guard(o){ const why = [], c = o.doc, row = o.row, now = o.now || Date.now();
    if(o.split && !o.split.ok) why.push(o.split.why);
    if(c){ if(!c.copyOk) why.push('The ACTIVE copy from Google is out of date (last copy ' + hm(c.copyAt) + ')');
      if(!(now - Date.parse(c.at) < 25 * 6e4)) why.push('The renewal check has not run since ' + hm(c.at)); }
    else if(o.needDoc) why.push('The renewal check has not loaded yet');
    if(row && row.pending) why.push('A renewal save is still waiting for Google');
    if(o.renew){ if(o.oldRow) why.push('ACTIVE still shows the old package');
      if(o.split && o.tot != null && o.split.ok && Math.abs(n1(o.split.new) - n1(o.tot)) > 0.001) why.push('ACTIVE ENROLLED is ' + o.split.new + ' but the payment was ' + n1(o.tot) + ' lessons');
      if(row && row.validRule && row.validSheet && row.validRule !== row.validSheet) why.push('Valid until: ACTIVE says ' + row.validSheet + ', the first class after the renewal (' + row.start + ') gives ' + row.validRule); }
    return { ok: !why.length, why }; }
  /* the renewal form: what Google would record as CARRY OVER must be what is really left now */
  function formHold(sheetLeft, liveLeft, early){
    if(sheetLeft === '' || sheetLeft == null || liveLeft == null) return { hold: true, why: 'Lessons left: checking (核对中)' };
    if(early != null) return { hold: false };   // Google's renewal takes off the lessons it has not counted yet (SERVER-RENEWRULE28 paste)
    const d = n1(+sheetLeft - +liveLeft);
    return Math.abs(d) < 0.001 ? { hold: false } : { hold: true, sheet: n1(sheetLeft), live: n1(liveLeft),
      why: 'ACTIVE (Google) says ' + n1(sheetLeft) + ' left, the classes held so far say ' + n1(liveLeft) + (d > 0 ? ' (' + d + ' held but not counted yet)' : '') }; }
  /* teachers on a renewal picture: the current ones only (a previous teacher does not teach the new package) */
  function teachers(names, prev){ const L = (names || []).map(s => String(s || '').trim()).filter(Boolean), P = {}; (prev || []).forEach(n => P[String(n).trim().toLowerCase()] = 1);
    const cur = L.filter(n => !P[n.toLowerCase()]); return cur.length ? cur : L; }
  /* the header line of the renewal picture */
  function line(Q){ const c = n1(Q.carry), u = n1(Q.used), o = n1(Q.other);
    return (c ? c + ' carried over + ' : '') + n1(Q.tot) + ' new' + (o ? ' + ' + o + ' other' : '') + (u ? ' − ' + u + ' used' : '') + ' · ' + (c ? '结转 ' + c + ' + ' : '') + '新购 ' + n1(Q.tot) + ' 课时' + (u ? ' − 已上 ' + u : ''); }
  let DOC = null, DAT = 0, BUSY = null;
  function doc(force){ if(!force && DOC && Date.now() - DAT < 60e3) return Promise.resolve(DOC); if(BUSY) return BUSY;
    if(typeof TOKEN === 'undefined' || !TOKEN || typeof FAST_URL === 'undefined') return Promise.resolve(DOC);
    BUSY = fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:renewcheck'] }) }).then(x => x.json())
      .then(r => { const d = r && r.ok && r.docs && r.docs['sys:renewcheck'] && r.docs['sys:renewcheck'].data; if(d){ DOC = d; DAT = Date.now(); } return DOC; })
      .catch(() => DOC).then(x => { BUSY = null; return x; });
    return BUSY; }
  g.coeRenew = { n1, months, addM, fromRows, split, validFrom, guard, formHold, teachers, line, doc, last: () => DOC, _set: d => { DOC = d; DAT = Date.now(); } };
})(typeof window !== 'undefined' ? window : globalThis);
</script>
<script>
/* 1540 · wiring: renewal picture + lesson-balance picture + Lesson Summary + renewal form + App health all go through coeRenew */
(function(){
  if(window.__1540 || !window.coeRenew || typeof D === 'undefined') return; window.__1540 = 1;
  const R = window.coeRenew, up = s => String(s || '').trim().toUpperCase();
  /* the ACTIVE rows of a student's current package (row = a given ACTIVE row, else the same pick as the Lesson Summary) */
  function pkgOf(code, row){ try{ const old = window.LS_PICK; if(row) window.LS_PICK = { code: up(code), row: row };
      let S; try{ S = lsRows(code); } finally { window.LS_PICK = old; } if(!S) return null;
      const { C, r, G } = S, o = G.owner || r, M = (G.members && G.members.length ? G.members : [o]);
      /* the package = the owner row + every row of this code without ENROLLED (as the database counts it); a family package (other codes) is "shared" */
      const mine = AT.rows.filter(x => up(x[C.code]) === up(code) && (x === o || x[C.enrolled] === '' || x[C.enrolled] == null));
      const shared = M.some(x => up(x[C.code]) !== up(code)) || (C.shared != null && AT.rows.some(x => up(x[C.shared]) === up(code) && up(x[C.code]) !== up(code))) || (C.shared != null && !!String(o[C.shared] || '').trim());
      return { C, o, shared, carryAll: Math.round(mine.reduce((a, x) => a + (+x[C.carry] || 0), 0) * 10) / 10, rows: mine.map(x => ({ owner: x === o, carry: x[C.carry], transfer: C.transfer != null ? x[C.transfer] : 0, incentive: C.incentive != null ? x[C.incentive] : 0,
        enrolled: x[C.enrolled], finished: x[C.finished], available: x === o ? (x[C.available] === '' ? '' : +x[C.available] + (G.extra || 0)) : '' })) }; }catch(e){ return null; } }
  window.coeRenewPkg = pkgOf;
  const BTN = '#sheetBody button[onclick^="cxCopy"], #sheetBody button[onclick^="cxSave"], #sheetBody button[onclick^="cxText"]';
  function hold(P, why){ try{ P.blob = null; if(P.url){ try{ URL.revokeObjectURL(P.url); }catch(e){} } P.url = ''; const im = $('cxImg'); if(!im) return;
    im.style.display = 'none'; const w = $('cxWait'); if(w) w.remove(); let h = $('rnHold');
    if(!h){ im.insertAdjacentHTML('afterend', '<div id="rnHold" class="mini" style="margin-top:12px;background:#FFF5F2;border:1px solid #E9B8AC"></div>'); h = $('rnHold'); }
    h.innerHTML = '<b style="color:#9A3B22">Numbers don’t agree yet · checking (核对中)</b><div class="small" style="margin-top:4px">' + why.map(esc).join('<br>') + '</div>'
      + '<div class="small mute" style="margin-top:6px">No picture until they agree, so nothing wrong is sent.</div><button class="btn sm ghost" style="margin-top:8px" onclick="coeRenew.doc(true).then(()=>{if(CXP){CXP.url=\\'\\';cxDraw();}})">Check again</button>';
    document.querySelectorAll(BTN).forEach(b => { b.disabled = true; }); }catch(e){} }
  function unhold(){ const h = $('rnHold'); if(h) h.remove(); const im = $('cxImg'); if(im) im.style.display = ''; document.querySelectorAll(BTN).forEach(b => { b.disabled = false; }); }
  /* renewal + lesson-balance pictures */
  const _rnFor = window.rnFor; if(typeof _rnFor === 'function') window.rnFor = function(P){ const Q = _rnFor.apply(this, arguments); if(Q && P && P.__rn) Object.assign(Q, P.__rn.q); return Q; };
  const _rnValid = window.rnValid; if(typeof _rnValid === 'function') window.rnValid = function(P){ const r = _rnValid.apply(this, arguments); try{ const Q = P && P.renew, v = P && P.__rn;
      if(Q && v && v.dl){ Q.dl = v.dl; Q.start = v.start; } }catch(e){} return r; };
  const _cxd = cxDraw;
  cxDraw = async function(){ const P = CXP; if(!P || P.kind !== 'bal' || !D || !D.mgr) return _cxd.apply(this, arguments);
    const code = up((P.e || {}).code), multi = !!(P.bal && P.bal.members); let d = null; try{ d = await R.doc(); }catch(e){} if(CXP !== P) return;
    P.__rn = null; const Q0 = !multi && typeof _rnFor === 'function' ? _rnFor(P) : null, row = d && d.rows ? d.rows[code] : null, k = multi ? null : pkgOf(code);
    const sp = k && !k.shared ? R.split(R.fromRows(k.rows), row || (d && d.unk ? d.unk[code] : null)) : null;   /* d.unk: returned / gift lessons of every package (database) */
    const oldRow = !!(Q0 && P.bal && (x => !/^\\d{4}-\\d{2}-\\d{2}$/.test(x) || x < Q0.paid)(String(P.bal.deadline || '').slice(0, 10)));
    const G = R.guard({ split: sp, doc: d, row, renew: !!Q0, oldRow, needDoc: !!Q0, tot: Q0 ? Q0.tot : null });
    if(!G.ok){ hold(P, G.why); return; }
    unhold(); if(sp && sp.ok && P.bal && !Q0) P.bal.carry = sp.carry;
    if(Q0 && sp){ const q = { carry: sp.carry, used: sp.used, now: sp.now, other: sp.other }; P.__rn = { q, dl: row && row.validRule ? row.validRule : '', start: row && row.start ? row.start : '' };
      try{ const names = String(P.e.teacher || '').split(/\\s*,\\s*/).filter(Boolean), pv = window.PV43 && PV43.prev ? PV43.prev(code, names) : []; P.e.teacher = R.teachers(names, pv).join(', '); }catch(e){} }
    return _cxd.apply(this, arguments); };
  /* Lesson Summary: the same guard */
  const _ls = window.lsHtml; if(typeof _ls === 'function') window.lsHtml = function(code){ const h = _ls.apply(this, arguments);
    try{ if(!D || !D.mgr || !h) return h; const k = pkgOf(code); if(!k || k.shared) return h; const d = R.last(), row = d && d.rows ? d.rows[up(code)] : null;
      const G = R.guard({ split: R.split(R.fromRows(k.rows), row || (d && d.unk ? d.unk[up(code)] : null)), doc: d, row }); if(!d) R.doc();
      if(G.ok) return h;
      return '<div class="mini" style="background:#FFF5F2;border:1px solid #E9B8AC;margin:10px 0"><b style="color:#9A3B22">Numbers don’t agree yet · checking (核对中)</b><div class="small" style="margin-top:4px">' + G.why.map(esc).join('<br>') + '</div><div class="small mute" style="margin-top:6px">The Lesson Summary shows again as soon as they agree.</div></div>'; }catch(e){ return h; } };
  /* renewal form: never record a stale CARRY OVER */
  const _rps = window.renPaidSheet; if(typeof _rps === 'function') window.renPaidSheet = async function(code){ const pa = typeof loadActive === 'function' ? loadActive(true).catch(() => {}) : null;
    const r = await _rps.apply(this, arguments); try{ await pa; }catch(e){}
    try{ const S = typeof RPS !== 'undefined' ? RPS : null, b = $('rpS'); if(!S || up(S.code) !== up(code) || !S.info || !b || /Try again/.test(b.textContent)) return r;
      const k = pkgOf(code, S.info.row); if(!k || k.shared) return r; const H = R.formHold(S.info.left, R.fromRows(k.rows).now, S.info.early);
      if(H.hold){ b.disabled = true; b.textContent = '核对中 · numbers don’t agree yet'; b.onclick = null; const P = $('rpP');
        if(P && !$('rpHold')) P.insertAdjacentHTML('beforebegin', '<div id="rpHold" class="mini" style="margin-top:12px;background:#FFF5F2;border:1px solid #E9B8AC"><b style="color:#9A3B22">Lessons left: checking (核对中)</b><div class="small" style="margin-top:4px">' + esc(H.why) + (H.sheet != null ? '. Saving now would record CARRY OVER ' + H.sheet + ' instead of ' + H.live + '.' : '') + '</div><div class="small mute" style="margin-top:6px">It clears when ACTIVE counts the lesson (Google’s next copy), or at once after the SERVER-RENEWRULE28 paste.</div><button class="btn sm ghost" style="margin-top:8px" onclick="delete RP_PRE[\\'' + esc(up(code)) + '\\'];renPaidSheet(RPS.code,RPS.name,RPS.teacher,RPS.again)">Check again</button></div>'); } }catch(e){}
    return r; };
  /* App health / Overview "App check": renewed packages that do not reconcile */
  const _lh = window.loadHealth; if(typeof _lh === 'function') window.loadHealth = async function(){ const r = await _lh.apply(this, arguments);
    try{ const d = await R.doc(true); if(d && typeof HL !== 'undefined' && HL){ const L = (d.issues || []).map(x => 'Renewal · ' + x.name + ' ' + x.code + ' · ' + (x.what || []).join(' · '));
        if(!d.copyOk) L.unshift('Renewal check · the ACTIVE copy from Google is out of date');
        HL.issues = L.concat((HL.issues || []).filter(s => !/^Renewal /.test(String(s)))); if(L.length) HL.ok = false; const b = $('hlBox'); if(b) b.innerHTML = hlHtml(); try{ homeSoon(); }catch(e){} } }catch(e){}
    return r; };
  setTimeout(() => { try{ if(D && D.mgr) R.doc(); }catch(e){} }, 3000); setInterval(() => { try{ if(D && D.mgr && !document.hidden) R.doc(true); }catch(e){} }, 5 * 6e4);
})();
</script>
`;
lib(file, [
  ["const done = n1(rows0.reduce((a, x) => a + (+x[C.finished] || 0), 0)), enrolled = +o[C.enrolled] || 0, carry = +o[C.carry] || 0,",
   "const done = n1(rows0.reduce((a, x) => a + (+x[C.finished] || 0), 0)), enrolled = +o[C.enrolled] || 0, carry = (x => x == null ? (+o[C.carry] || 0) : x)(window.coeRenewPkg && (coeRenewPkg(code) || {}).carryAll),"],
  // the picture's header line and a "Used since the renewal" line come from coeRenew
  ["c.fillText((+Q.carry ? Q.carry + ' carried over + ' : '') + Q.tot + ' new · ' + (+Q.carry ? '结转 ' + Q.carry + ' + ' : '') + '新购 ' + Q.tot + ' 课时', 112, y + 150);",
   "c.fillText(window.coeRenew ? coeRenew.line(Q) : (+Q.carry ? Q.carry + ' carried over + ' : '') + Q.tot + ' new', 112, y + 150);"],
  ["if(+Q.carry) rows.push(['Carried over', '结转课时', [Q.carry + ' lessons from the last package'], [Q.carry + ' 课时（上期剩余）']]);",
   "if(+Q.carry) rows.push(['Carried over', '结转课时', [Q.carry + ' lessons from the last package'], [Q.carry + ' 课时（上期剩余）']]);\nif(+Q.used) rows.push(['Used since the renewal', '续费后已上', [Q.used + ' lessons'], [Q.used + ' 课时']]);"],
  // no estimates: the guard holds the picture until ACTIVE shows the new package
  ["if(old){ Q.carry = Math.round(+b.left * 10) / 10; Q.now = Math.round((+b.left + Q.tot) * 10) / 10; }",
   "if(old){ Q.now = null; }   /* 1540: no estimate · the guard holds the picture */"],
  ["else { const fresh = (Date.now() - new Date(Q.paid + 'T00:00:00+08:00').getTime()) < 2 * 864e5; Q.now = fresh && +b.left < Q.tot ? Math.round(((+b.carry || +Q.carry || 0) + Q.tot) * 10) / 10 : +b.left; } } }catch(x){}",
   "else { Q.now = +b.left; } } }catch(x){}   /* 1540: lessons now = ACTIVE, never carry + new */"],
  ["})();\n</script>\n</body>\n</html>", "})();\n</script>\n" + MODULE + "</body>\n</html>"]
]);
