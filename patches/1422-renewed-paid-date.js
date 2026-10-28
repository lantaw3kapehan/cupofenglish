// 1422: (Misty, 28 Oct 11:13) Luna ST-2026-030 showed "Renewed Oct 31": "THE RENEWED here should be the day they paid, but the
// validity count should start from their official class start, like for Luna her class starts on October 31."
// Display only, nothing stored changes:
// · Renewed / New chips (Active table, Students list) = the payment date: the SALES row linked from the package (ACTIVE column J,
//   copied to the database as sys:pkglink, refreshed every 2 minutes). No linked sale → the class start date as before, with a "?"
//   and a tooltip.
// · Package start = first class date (unchanged); valid-until already counts from it (unchanged).
// · Lesson Summary picture: "Paid · 付款日期" line under "Package Starts" when a linked payment exists.
const fs = require('fs'), lib = require('../tools/lib.js'), file = process.argv[2];
{ let s = fs.readFileSync(file, 'utf8');
  const a = "${st ? `Package Starts: ${fD(st)} · 课程包开始：${zD(st)}<br>` : ''}";
  const n = s.split(a).length - 1; if (n !== 2) { console.error('Expected 2 Package Starts lines, found ' + n); process.exit(1); }
  s = s.split(a).join(a + "${(() => { try{ const p = window.pkPaid ? pkPaid(o[C.code], o[C.teacher], o[C.start]) : null; if(!p || !p.paid) return ''; const pd = new Date(p.paid + 'T00:00:00'); return `Paid: ${fD(pd)} · 付款日期：${zD(pd)}<br>`; }catch(e){ return ''; } })()}");
  fs.writeFileSync(file, s); }
lib(file, [
  ['<style id="st1270">',
   "<script>\n" +
   "/* 1422 · payment date of a package (SALES row linked from ACTIVE column J) from the database copy sys:pkglink */\n" +
   "(function(){ let M = null, at = 0, busy = false;\n" +
   "  const ymdM = ms => new Date(+ms + 8 * 3600e3).toISOString().slice(0, 10);\n" +
   "  function build(d){ const S = {}, out = {}; (d.sales || []).forEach(x => { if(x && x.row) S[x.row] = x.d || ''; });\n" +
   "    (d.act || []).forEach(a => { if(!a || !a.c) return; const k = String(a.c).toUpperCase() + '|' + String(a.t || '').trim().toLowerCase(); (out[k] = out[k] || []).push({ st: a.aw ? ymdM(a.aw) : '', paid: a.link && S[a.link] ? String(S[a.link]).slice(0, 10) : '' }); });\n" +
   "    return out; }\n" +
   "  function load(){ if(busy || !TOKEN || !(D && D.mgr) || Date.now() - at < 120000) return; busy = true;\n" +
   "    fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:pkglink'] }) }).then(x => x.json())\n" +
   "      .then(r => { const d = r && r.ok && r.docs && r.docs['sys:pkglink'] && r.docs['sys:pkglink'].data; if(!d) return; const first = !M; M = build(d); at = Date.now();\n" +
   "        if(first) try{ if(VIEW === 'active' && typeof renderActive === 'function') renderActive(); else if(VIEW === 'astudents' && typeof renderAStudents === 'function') renderAStudents(); }catch(e){} })\n" +
   "      .catch(() => {}).finally(() => { busy = false; }); }\n" +
   "  window.pkPaid = function(code, teacher, start){ load(); if(!M) return null; let L = M[String(code || '').trim().toUpperCase() + '|' + String(teacher || '').trim().toLowerCase()] || []; const c0 = String(code || '').trim().toUpperCase() + '|';\n" +
   "    if(!L.length) Object.keys(M).forEach(k => { if(k.indexOf(c0) === 0) L = L.concat(M[k]); }); if(!L.length) return { paid: '' };\n" +
   "    const s = String(start || '').slice(0, 10), hit = L.find(x => x.st === s) || (L.length === 1 ? L[0] : null); return { paid: hit ? hit.paid : '' }; };\n" +
   "  /* the chip text: the paid date, or the start date with a ? when no payment is linked */\n" +
   "  window.pkChipDate = function(code, teacher, start){ const p = window.pkPaid(code, teacher, start), sd = typeof tdDate === 'function' ? tdDate(start) : String(start || '');\n" +
   "    if(p && p.paid) return '<span title=\"Paid ' + esc(p.paid) + ' · classes start ' + esc(String(start || '').slice(0, 10)) + '\">' + (typeof tdDate === 'function' ? tdDate(p.paid) : esc(p.paid)) + '</span>';\n" +
   "    return '<span title=\"' + (M ? 'No payment linked in SALES for this package · showing the class start date' : 'Checking the payment date…') + '\">' + sd + (M ? ' <sup style=\"opacity:.7\">?</sup>' : '') + '</span>'; };\n" +
   "})();\n" +
   "</script>\n<style id=\"st1270\">"],
  ["isRen(r) ? ` <span class=\"chip green\" style=\"font-size:11px\">Renewed ${esc(tdDate(r[C.start]))}${",
   "isRen(r) ? ` <span class=\"chip green\" style=\"font-size:11px\">Renewed ${pkChipDate(r[C.code], r[C.teacher], r[C.start])}${"],
  [": isNew(r) ? ` <span class=\"chip teal\" style=\"font-size:11px\">New ${esc(tdDate(r[C.start]))}</span>`",
   ": isNew(r) ? ` <span class=\"chip teal\" style=\"font-size:11px\">New ${pkChipDate(r[C.code], r[C.teacher], r[C.start])}</span>`"],
  ["'<span class=\"chip green\" style=\"font-size:11px\">Renewed ' + esc(typeof tdDate === 'function' ? tdDate(o.start) : o.start) + '</span>' : o && o.nw ? '<span class=\"chip teal\" style=\"font-size:11px\">New ' + esc(typeof tdDate === 'function' ? tdDate(o.start) : o.start) + '</span>'",
   "'<span class=\"chip green\" style=\"font-size:11px\">Renewed ' + pkChipDate(o.code, o.teacher, o.start) + '</span>' : o && o.nw ? '<span class=\"chip teal\" style=\"font-size:11px\">New ' + pkChipDate(o.code, o.teacher, o.start) + '</span>'"]
]);
