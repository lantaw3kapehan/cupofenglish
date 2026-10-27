// 1355b (part 2 of 1355): book milestones from the student's own regular classes (management card + Student portal, same code).
//   Misty: Shirui ST-2022-044 moved to OD2 on 18 Oct 2026 (class notes: 18 Oct "OD2 · Unit 2", 25 Oct "OD2 · Unit 1"), but the journey dated
//   "Up · A1 · OD2" Sept 2025 — just the first month of the app's monthly records (the -DAILY tabs copy the DATABASE book, "A1, OD2", every month).
//   Now: the current book's first day = the first regular class (class-note book first, else the calendar book; no trial / substitute /
//   cancelled class) after the last class on another book, with the student's main teacher, when that book has >= 3 regular classes.
//   The book before it = what the class notes say, else the package's course on the Lesson summary (from the package start).
//   Exact days are shown (18 Oct 2026), and a month split by a book change shares its lessons by the regular classes before / from that day.
//   Lesson summary header: the current book (the latest regular class taught with that teacher, coe_active_screen "book"), else the course.
const file = process.argv[2];
const BLOCK = String.raw`
    { /* 1355b · book changes from the student's own regular classes (class-note book first, else the calendar book; no trial / substitute / cancelled class) */
      const nk5 = v => String(v || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), reX5 = /(^|[-\s])(TC|SC|SUB)([-\s]|$)|代课/i, now5 = new Date().toISOString().slice(0, 10), E5 = {}, cnt5 = {}, fut5 = {}, NM5 = {};
      const C5 = (S && (S.cls || (window.CLSM && S.code && CLSM[S.code]))) || [];
      (Array.isArray(C5) ? C5 : []).forEach(e => { if(!e || e.cancelled || !e.book || !e.start || reX5.test(String(e.title || '').trim())) return; const t = String(e.teacher || '').trim().toLowerCase(), d = cjDay(e.start), B = String(e.book).trim().split(/[\s,]+/)[0], K = nk5(B); if(!d || !K) return;
        NM5[K] = NM5[K] || B; cnt5[t] = cnt5[t] || {}; cnt5[t][K] = (cnt5[t][K] || 0) + 1; if(d > now5){ fut5[t] = fut5[t] || {}; fut5[t][K] = (fut5[t][K] || 0) + 1; } else if(!(E5[d + '|' + t] && E5[d + '|' + t].note)) E5[d + '|' + t] = { d, t, k: K }; });
      /* a class note's book = the start of "where the class ended" matched to a book the calendar uses (notes add "Unit 2", "page 9"…); no match → not used */
      const KS5 = Object.keys(NM5).sort((a, b) => b.length - a.length);
      ((r && r.notes) || []).forEach(n => { const d = cjDay(n.date), t = String(n.teacher || '').trim().toLowerCase(), x = nk5(String(n.ended || '').split('·')[0]), K = x ? (KS5.find(k => x.indexOf(k) === 0) || '') : ''; if(d && K && d <= now5) E5[d + '|' + t] = { d, t, k: K, note: 1 }; });
      const tot5 = t => Object.values(cnt5[t] || {}).reduce((s, v) => s + v, 0), tn5 = Object.keys(cnt5).sort((a, b) => tot5(b) - tot5(a))[0] || '';
      const L5 = Object.values(E5).filter(x => x.t === tn5).sort((a, b) => a.d.localeCompare(b.d)), CU5 = L5.length ? L5[L5.length - 1].k : '', F5 = fut5[tn5] || {}, fN5 = Object.values(F5).reduce((s, v) => s + v, 0);
      let k5 = L5.length - 1; while(k5 > 0 && L5[k5 - 1].k === CU5) k5--;
      const sx5 = T.find(x => x.start), bkK5 = x => nk5(String(x.bk || '').trim().split(/[\s,]+/)[0]);
      /* a real switch: an earlier class on another book, >= 3 regular classes on the new one, and the classes booked ahead are (almost) all on it — not two books taken in turn */
      const sw5 = k5 > 0 && CU5 && !/^(OTHER|FREETALK|FREE|TRIAL|TC|SC|SUB)$/.test(CU5) && ((cnt5[tn5] || {})[CU5] || 0) >= 3 && (!fN5 || (F5[CU5] || 0) >= 0.8 * fN5) && !(sx5 && bkK5(sx5) === CU5 && !T.some(x => !x.start && !/^Trial/.test(x.en) && bkK5(x) && bkK5(x) !== CU5)) ? Object.values(E5).filter(x => x.k === CU5 && x.d > L5[k5 - 1].d).map(x => x.d).sort()[0] || L5[k5].d : '';   /* the first class on the new book with any teacher */
      if(sw5 && (!s0 || sw5 > s0)){
        const lvMo5 = d => { const x = MO.find(y => y.m === d.slice(0, 7) && cjLv(y.lv) >= 0); return x ? cjLv(x.lv) : -1; }, lvAt5 = d => { const v = lvMo5(d); if(v >= 0) return v; const at = T.filter(y => y.d && y.d <= d && !/^Trial/.test(y.en)).sort((p, q) => p.d.localeCompare(q.d)).pop(); return at ? at.i : (chain.length ? chain[chain.length - 1] : T[0].i); };
        let st5 = T.find(x => !x.start && !/^Trial/.test(x.en) && bkK5(x) === CU5);
        if(st5){ st5.d = sw5; delete st5.cal; delete st5.chk; } else { st5 = { d: sw5, i: lvAt5(sw5), en: 'Book up', zh: '教材升级', bk: NM5[CU5] || CU5 }; T.push(st5); } st5.dd = 1; have[CU5] = 1;
        /* the book before it: the class notes, else the package's course on the Lesson summary (from the package start, when the month's level is on record) */
        const pv5 = L5.slice(0, k5).reverse().find(x => x.note), pk5 = (S && S.pk) || (() => { try{ if(typeof AT === 'undefined' || !AT || !AT.cols) return null; const c = {}; AT.cols.forEach((h, i) => { c[h] = i; });
          const R = AT.rows.filter(x => String(x[c.code]).toUpperCase() === String(S.code || '').toUpperCase() && x[c.enrolled] !== '' && x[c.active]).sort((a, b) => String(b[c.start]).localeCompare(String(a[c.start]))); return R[0] ? { course: R[0][c.course], start: R[0][c.start] } : null; }catch(e){ return null; } })();
        const pc5 = pk5 ? String(pk5.course || '').split(',').map(x => x.trim()).filter(Boolean) : [], PB5 = pv5 ? pv5.k : (pc5.length === 1 ? nk5(pc5[0]) : ''), pb5 = pv5 ? (NM5[PB5] || PB5) : (pc5[0] || '');
        const pd5 = pv5 ? (() => { let j = L5.indexOf(pv5); while(j > 0 && L5[j - 1].k === PB5) j--; return L5[j].d; })() : cjDay(pk5 && pk5.start);
        if(PB5 && PB5 !== CU5 && pd5 && pd5 < sw5 && (!s0 || pd5 > s0) && (pv5 || lvMo5(pd5) >= 0) && !T.some(x => !/^Trial/.test(x.en) && bkK5(x) === PB5) && !T.some(x => x !== st5 && x.d && x.d > pd5 && x.d < sw5 && !/^Trial/.test(x.en))){
          T.push({ d: pd5, i: lvAt5(pd5), en: 'Book up', zh: '教材升级', bk: pb5, dd: 1 }); have[PB5] = 1; } } }`;
const SPLIT = String.raw`
{ /* 1355b · a month with a book change on a given day: that month's lessons go to each book by the regular classes taught before / from that day */
  const C6 = (S && (S.cls || (window.CLSM && S.code && CLSM[S.code]))) || [], n6 = new Date().toISOString().slice(0, 10), h6 = v => Math.round(v * 2) / 2;
  const reg6 = (Array.isArray(C6) ? C6 : []).filter(e => e && !e.cancelled && e.start && !/(^|[-\s])(TC|SC|SUB)([-\s]|$)|代课/i.test(String(e.title || '').trim()) && cjDay(e.start) <= n6);
  const ms6 = [...new Set(DT.filter(x => x.dd).map(x => x.d.slice(0, 7)))];
  ms6.forEach(m => { const IN = DT.filter(x => x.d.slice(0, 7) === m), i0 = DT.indexOf(IN[0]); if(!IN.some(x => x.dd)) return; const own = (i0 > 0 ? [DT[i0 - 1]] : [null]).concat(IN), bd = IN.map(x => x.d);
    const w = own.map(() => 0); reg6.forEach(e => { const d = cjDay(e.start); if(d.slice(0, 7) !== m) return; let j = 0; while(j < bd.length && d >= bd[j]) j++; const mins = (Date.parse(e.end || e.start) - Date.parse(e.start)) / 6e4; w[j] += mins > 0 ? mins / 50 : 1; });
    const Um = MO.filter(y => y.m === m).reduce((s, y) => s + U(y), 0), W = w.reduce((s, v) => s + v, 0); if(!W || !Um) return;
    const last = own[own.length - 1]; let moved = 0; own.forEach((o, j) => { if(o === last || !o) return; const v = h6(Math.min(w[j], Um - moved)); if(v > 0){ o.u = rd((o.u || 0) + v); moved += v; } });
    if(own[0] === null && w[0]) moved += 0; last.u = rd(Math.max(0, (last.u || 0) - moved)); }); }`;
const CHK = String.raw`
{ /* 1355b · a book / level step dated only by the first month of the app's records (Sept 2025 for most) has no real date: shown as being checked, its lessons stay with the step before */
  const f07 = MO.map(y => String(y.m)).sort()[0] || '', s07 = String(((T.find(x => x.start) || {}).d) || '');
  if(f07 && (!s07 || f07 > s07.slice(0, 7))) T.forEach(x => { if(x.start || x.dd || x.cal || !x.d || x.d.slice(0, 7) !== f07 || !/^(Level|Book)/.test(x.en)) return;
    const k = DT.indexOf(x), pr = k > 0 ? DT[k - 1] : null; if(pr && x.u){ pr.u = rd((pr.u || 0) + x.u); } x.u = null; x.after = pr ? pr.d : ''; x.d = ''; x.chk = 1; }); }`;
const DAY = "(x.dd ? (() => { const t = new Date(x.d + 'T12:00:00'); return isNaN(t) ? mon(x.d) : t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); })() : mon(x.d))";
require('../tools/lib.js')(file, [
  ["cal: 1 }); }); } } }", "cal: 1 }); }); }" + BLOCK + " } }"],
  ["x.u = MO.length ? rd(MO.filter(y => y.m >= a && y.m < b).reduce((s, y) => s + U(y), 0)) : null; });", "x.u = MO.length ? rd(MO.filter(y => y.m >= a && y.m < b).reduce((s, y) => s + U(y), 0)) : null; });" + SPLIT],
  ["(mon(x.d) ? ' · ' + esc(mon(x.d)) : '')", "(mon(x.d) ? ' · ' + esc(" + DAY + ") : x.chk ? ' · date being checked 日期核对中' : '')"],
  ["T.push({ d: rd0, i: at ? at.i : now, en: 'Renewed', zh: '续费' }); } }", "T.push({ d: rd0, i: at ? at.i : now, en: 'Renewed', zh: '续费' }); } }" + CHK],
  ["esc(mon(x.d) || '—')", "esc(" + DAY + " || (x.chk ? '日期核对中' : '—'))"],
  ["C.course != null && o[C.course] && typeof pkCourse === 'function' ? '<div style=\"font-weight:400;font-size:12px;color:#00737B\">' + esc(pkCourse(o[C.course])) + '</div>' : ''",
   "C.course != null && ((C.book != null && o[C.book]) || o[C.course]) && typeof pkCourse === 'function' ? '<div style=\"font-weight:400;font-size:12px;color:#00737B\">' + esc(pkCourse((C.book != null && o[C.book]) || o[C.course])) + '</div>' : ''"],
]);
