// 1583: (Misty, 29 Oct · Students audit, item 5) Enrolled · paid and Renewed · paid: the right defaults and a review before saving.
// · Valid until on the renewal form counted the carried lessons too (15 left + 15 new = 30 → "8 months"), and both forms used
//   setMonth (31 Oct + 4 months → 3 Mar). The rule (RULES-renewals.md 6, ACTIVE's formula on ENROLLED) is the NEW package's lessons
//   (paid + free) from the first class, month end kept → both forms now use coeRenew.validFrom, the one shared calculation.
// · Enrolment: Course stays empty unless the calendar has exactly one book for this student (then it is picked: it matches the
//   calendar code, so lessons count). Partner: the student's SOURCE on DATABASE is shown next to it; it is never changed for you.
// · Review step: Save renewal / Save enrolment first shows "Check before saving" (student, teacher, package, carried, lessons after,
//   paid on, method, partner, invoice, first class, course, valid until) with warnings; "Confirm and save" saves, "Edit" goes back.
//   Changing anything in the form closes the review. The save itself, the payment time and the Payment Confirmation are unchanged.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["function rpDl(){ const n = rpNc(), d = n ? new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12) : new Date(($('rpD') || {}).value + 'T12:00:00'); if(isNaN(d)) return ''; const t = rpTot() + Math.max(0, +((RPS && RPS.info && RPS.info.left) || 0)); d.setMonth(d.getMonth() + (t < 30 ? 4 : t < 60 ? 8 : 12)); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }",
   "function rpDl(){ const n = rpNc(), s = n ? ymdLocal(n) : String(($('rpD') || {}).value || ''); if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(s) || !window.coeRenew) return '';   /* 1583: the shared rule · new lessons (paid + free) from the first class, month end kept */\n  const v = coeRenew.validFrom(s, rpTot()); return v ? new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''; }"],
  ["Valid until <b>${rpDl()}</b> · ${tot < 30 ? '4' : tot < 60 ? '8' : '12'} months (${tot} lessons incl. carried) from ",
   "Valid until <b>${rpDl()}</b> · ${rpTot() < 30 ? '4' : rpTot() < 60 ? '8' : '12'} months (${rpTot()} new lessons) from "],
  ["const d = new Date(s + 'T12:00:00'); d.setMonth(d.getMonth() + (t < 30 ? 4 : t < 60 ? 8 : 12)); return ' · until <b>' + d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + '</b>';",
   "const v = window.coeRenew ? coeRenew.validFrom(s, t) : ''; if(!v) return ''; return ' · until <b>' + new Date(v + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + '</b>';   /* 1583 */"],
  ["</script>\n</body>\n</html>",
   `</script>
<script id="coe-review1583">
/* 1583 · check before saving (Enrolled · paid, Renewed · paid) */
(function(){
  if(window.__1583) return; window.__1583 = 1;
  const $q = id => document.getElementById(id), val = id => { const e = $q(id); return e ? String(e.value || '').trim() : ''; }, E = s => esc(String(s == null ? '' : s));
  const day = s => /^\\d{4}-\\d{2}-\\d{2}$/.test(s) ? new Date(s + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : (s || '—');
  const src = code => { try{ const L = window.coeLearner ? coeLearner(code) : null; return L ? L.source : ''; }catch(e){ return ''; } };
  const isCoe = s => !s || /^(coe|cupofenglish|n\\/a)\\b/i.test(s) || /^coe\\s*[–-]/i.test(s) || /^ST-\\d/i.test(s);
  function close(){ const b = $q('rv1583'); if(b) b.remove(); ['rpS', 'enGo'].forEach(id => { const x = $q(id); if(x) x.style.display = ''; }); }
  function show(btnId, title, rows, warn, go){ const b = $q(btnId); if(!b) return go(); close();
    b.insertAdjacentHTML('beforebegin', '<div id="rv1583" class="card" role="region" aria-label="Check before saving" style="margin-top:14px;border:1.5px solid #00737B;background:#fff">' +
      '<h3 style="margin:0 0 8px;font-family:\\'Fredoka One\\',Inter,sans-serif;font-weight:400;color:#2B2253">Check before saving · ' + E(title) + '</h3>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px">' + rows.filter(Boolean).map(r => '<tr><td style="padding:4px 10px 4px 0;color:#6F6B85;white-space:nowrap;vertical-align:top">' + E(r[0]) + '</td><td style="padding:4px 0;color:#2B2253"><b>' + r[1] + '</b></td></tr>').join('') + '</table>' +
      (warn.length ? '<div style="margin-top:10px;padding:8px 12px;border-radius:10px;background:#FFF5F2;border:1px solid #E9B8AC;color:#9A3B22;font-size:13px">' + warn.map(E).join('<br>') + '</div>' : '') +
      '<div class="row" style="gap:8px;margin-top:12px"><button type="button" class="btn teal grow" id="rvGo">Confirm and save</button><button type="button" class="btn ghost" id="rvBack">Edit</button></div></div>');
    b.style.display = 'none'; const box = $q('rv1583');
    $q('rvGo').onclick = () => { close(); go(); }; $q('rvBack').onclick = () => { close(); try{ b.focus(); }catch(e){} };
    const sb = $q('sheetBody'), off = () => { close(); sb.removeEventListener('input', off, true); sb.removeEventListener('change', off, true); };
    if(sb){ sb.addEventListener('input', off, true); sb.addEventListener('change', off, true); }
    try{ box.scrollIntoView({ block: 'nearest' }); $q('rvGo').focus({ preventScroll: true }); }catch(e){} }
  /* Renewed · paid */
  const rp0 = window.renPaidSave;
  if(typeof rp0 === 'function') window.renPaidSave = function(){ const S = typeof RPS !== 'undefined' ? RPS : null; if(!S || !S.info) return rp0.apply(this, arguments);
    if(window.__rvOk1583){ window.__rvOk1583 = 0; return rp0.apply(this, arguments); }
    const t = rpTot(); if(!(t > 0)) return toast('Choose the package');
    const I = S.info, left = +I.left || 0, after = Math.round((left + t) * 10) / 10, f = $q('rpF'), fl = f && f.files && f.files[0], nc = rpNc(), pa = val('rpPa'), s0 = src(S.code), W = [];
    if(!val('rpM')) W.push('Payment method is empty.');
    if(val('rpD') > ymdLocal(new Date())) W.push('Paid on is a future date.');
    if(s0 && !isCoe(s0) && (!pa || /^cupofenglish$/i.test(pa))) W.push('Partner is "' + (pa || 'empty') + '" but the student came through ' + s0 + ' (DATABASE › SOURCE). Check the partner.');
    if(!nc) W.push('No class is booked after the paid date: the package starts when the first class is added.');
    show('rpS', S.name, [['Student', E(S.name) + ' · ' + E(S.code)], ['Teacher', E(I.teacher || S.teacher || '—')], ['Package', t + ' lessons' + (+S.free ? ' (' + (+S.pkg) + ' paid + ' + (+S.free) + ' free)' : '')],
      ['Carried over', left + ' lesson' + (left === 1 ? '' : 's') + ' (what was left at this renewal)'], ['Lessons after saving', after + ' lessons'], ['Paid on', day(val('rpD'))], ['Payment method', E(val('rpM') || '—')],
      ['Partner', E(pa || '—') + (s0 ? ' <span class="mute small">· source: ' + E(s0) + '</span>' : '')], ['Invoice', E(val('rpI') || (fl ? fl.name : 'none'))],
      ['First class of the package', nc ? E(nc.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })) : 'not booked yet'], ['Valid until', E(rpDl() || '—') + ' <span class="mute small">· ' + (t < 30 ? 4 : t < 60 ? 8 : 12) + ' months from the first class</span>']], W,
      () => { window.__rvOk1583 = 1; window.renPaidSave(); }); };
  /* Enrolled · paid */
  const en0 = window.enSave;
  if(typeof en0 === 'function') window.enSave = function(){ const S = typeof ENS !== 'undefined' ? ENS : null; if(!S || (!S.info && !S.tr && !S.sale)) return en0.apply(this, arguments);
    if(window.__rvOk1583e){ window.__rvOk1583e = 0; return en0.apply(this, arguments); }
    const tr = !!S.tr, t = tr ? (+val('enTn') || 0) : (+S.pkg || 0) + (+S.free || 0), nos = !!($q('enSx') || {}).checked, fc = nos ? '' : val('enS'), pa = val('enPa'), s0 = src(S.code), course = val('enC'), W = [];
    const books = [...new Set((S.cls || []).map(c => String(c.book || '').trim()).filter(Boolean))];
    if(!tr && !S.sale && !(t > 0)) return toast('Type the number of lessons');
    if(!tr && !S.sale && !val('enM')) W.push('Payment method is empty.');
    if(!tr && !S.sale && s0 && !isCoe(s0) && (!pa || /^cupofenglish$/i.test(pa))) W.push('Partner is "' + (pa || 'empty') + '" but the student came through ' + s0 + ' (DATABASE › SOURCE). Check the partner.');
    if(!course && books.length > 1) W.push('Course is empty: every lesson with this teacher counts. The calendar has ' + books.join(', ') + '.');
    const v = fc && window.coeRenew ? coeRenew.validFrom(fc, t) : '';
    show('enGo', S.name, [['Student', E(S.name) + ' · ' + E(S.code)], ['Payment', tr ? 'Transfer · ' + E(val('enTf') || '—') + ' · no payment' : S.sale ? 'Already in SALES (row ' + E(S.sale) + ')' : 'New SALES row'],
      ['Package', t + ' lessons' + (!tr && +S.free ? ' (' + (+S.pkg) + ' paid + ' + (+S.free) + ' free)' : '')], !tr && !S.sale ? ['Paid on', day(val('enD'))] : null, !tr && !S.sale ? ['Payment method', E(val('enM') || '—')] : null,
      !tr && !S.sale ? ['Partner', E(pa || '—') + (s0 ? ' <span class="mute small">· source: ' + E(s0) + '</span>' : '')] : null, ['Teacher', E(val('enT') || '—')],
      ['First class', nos ? 'not set yet' : day(fc)], ['Course', course ? E(window.bkName ? bkName(course) : course) : 'none · counts every lesson with this teacher'],
      ['Valid until', v ? E(day(v)) + ' <span class="mute small">· ' + (t < 30 ? 4 : t < 60 ? 8 : 12) + ' months from the first class</span>' : 'from the first class, once it is set']], W,
      () => { window.__rvOk1583e = 1; window.enSave(); }); };
  /* Enrolled · paid opens with: the one calendar book as Course, the student's SOURCE next to Partner */
  const es0 = window.enSheet;
  if(typeof es0 === 'function') window.enSheet = async function(code){ const r = await es0.apply(this, arguments);
    try{ if(typeof ENS === 'undefined' || !ENS || ENS.code !== code) return r;
      const books = [...new Set((ENS.cls || []).map(c => String(c.book || '').trim()).filter(Boolean))];
      if(books.length === 1 && $q('enC') && !$q('enC').value && window.bkSet) bkSet('enC', books[0]);
      const s0 = src(code), pa = $q('enPa'); if(pa && s0 && !$q('enPaS')) pa.insertAdjacentHTML('afterend', '<div id="enPaS" class="small mute" style="margin-top:4px">Student\\'s source (DATABASE): <b>' + E(s0) + '</b>' + (isCoe(s0) ? '' : ' · type the partner this payment goes through') + '</div>'); }catch(e){}
    return r; };
})();
</script>
</body>
</html>`]
]);
