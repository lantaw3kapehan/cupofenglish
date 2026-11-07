// 1880: (Misty 7 Nov 22:05 "yes I like this" · 22:05 "when copying picture, 1 page is enough" · 22:06 "label their if the teacher uploaded it late")
//   Payslip → Lessons by student: every date is a tap to its class video (▶ green), screen proof (📷 blue), ⚠ no video (red),
//   "late upload" (orange, uploaded after the class day) and "before app record" (grey, before 22 Oct); counts at the top.
//   From coe-stuvid { month, teacher } → coe_teacher_videos. Units and pay are unchanged.
//   Copy / save picture: the plain list as before (the chips and counts are left out of the picture), so it stays one page.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  let SL = null;",
   `  let SL = null, VM1880 = null;   /* 1880: { k: 'teacher|YYYY-MM', m: { 'CODE|YYYY-MM-DD': [rows] } } */
  try{ if(!document.getElementById('css1880')) document.head.insertAdjacentHTML('beforeend', '<style id="css1880">.vc1880{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}.v1880{font-size:12px;border-radius:8px;padding:3px 7px;text-decoration:none;white-space:nowrap;line-height:1.5}.v1880.ok{background:#E6F4F1;color:#0E6B5C}.v1880.pf{background:#EEF2FF;color:#3949AB}.v1880.no{background:#FDECEA;color:#B42318;font-weight:600}.v1880.old{background:#F2F1F5;color:#8A84A0}.v1880 .lt{color:#B54708;font-weight:600}.vs1880{display:flex;gap:6px;margin:8px 0 4px}.vs1880 div{flex:1;background:#F7F5FC;border-radius:10px;padding:6px 4px;text-align:center}.vs1880 b{display:block;font-size:17px}.vs1880 span{font-size:11px;color:#6B6585}.vs1880 .r b{color:#B42318}.vs1880 .o b{color:#B54708}.has1880{display:none}</style>'); }catch(e){}
  const vk1880 = S => String((S && S.person && S.person.name) || '').toLowerCase() + '|' + String((S && S.month) || '');
  async function vload1880(S){ const k = vk1880(S); if(VM1880 && VM1880.k === k && Date.now() - VM1880.t < 120000) return false;
    let r = null; try{ r = await fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, month: S.month, teacher: (S.person && S.person.name) || '' }) }).then(x => x.json()); }catch(e){}
    if(!r || !r.ok) return false; const m = {};
    (r.rows || []).forEach(x => { const key = String(x.code || '').toUpperCase() + '|' + x.d; (m[key] = m[key] || []).push(x); });
    Object.keys(m).forEach(key => m[key].sort((a, b) => (b.url ? 1 : 0) - (a.url ? 1 : 0) || String(a.t).localeCompare(String(b.t))));
    VM1880 = { k, t: Date.now(), m }; return true; }`],
  ["function lessHtml1751(S, r){ const L = S.lessons; if(!L) return '';",
   `function lessHtml1751(S, r){ const L = S.lessons; if(!L) return '';
    const VM = VM1880 && VM1880.k === vk1880(S) ? VM1880 : null, used = {}, cnt = { n: 0, v: 0, p: 0, l: 0, x: 0 };   /* 1880 */
    const fd = s => { const x = new Date(String(s).slice(0, 10) + 'T00:00:00'); return isNaN(x) ? '' : x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + (String(s).length > 10 ? ' ' + String(s).slice(11, 16) : ''); };
    const chip = (code, d, u, t) => { const key = String(code || '').toUpperCase() + '|' + String(d).slice(0, 10), A = VM.m[key] || []; let v = t ? A.find(z => z.t === t) : null; if(!v){ v = A[used[key] || 0]; used[key] = (used[key] || 0) + 1; }
      const lb = new Date(String(d).slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + (+u === 1 || !u ? '' : +u === 0.5 ? ' (½)' : ' (' + (Math.round(u * 100) / 100) + ')'), rec = String(d).slice(0, 10) >= '2026-10-22';
      cnt.n++; const lt = v && v.url && v.late ? ' · <span class="lt">late upload' + (v.up ? ' ' + esc(fd(v.up)) : '') + '</span>' : '';
      if(v && v.url){ if(v.proof) cnt.p++; else cnt.v++; if(v.late) cnt.l++;
        return '<a class="v1880 ' + (v.proof ? 'pf' : 'ok') + '" href="' + esc(v.url) + '" target="_blank" rel="noopener">' + (v.proof ? '📷 ' : '▶ ') + esc(lb) + (v.proof ? ' · screen proof' : '') + lt + '</a>'; }
      if(rec){ cnt.x++; return '<span class="v1880 no">⚠ ' + esc(lb) + ' · no video</span>'; }
      return '<span class="v1880 old">' + esc(lb) + ' · before app record</span>'; };
    const chips = (x, kind) => { if(!VM) return ''; const D0 = kind ? [{ d: x.d, u: x.u, t: x.t }] : (x.days || []).slice().sort((a, b) => String(a.d).localeCompare(String(b.d)));
      return '<div class="vc1880">' + D0.map(y => chip(x.code, y.d, y.u, kind ? y.t : '')).join('') + '</div>'; };`],
  ["    const one = (x, kind) => tr('<b>' + esc(x.name || x.code || '') + '</b> <span class=\"m\">' + esc([x.code, x.book].filter(Boolean).join(' · ')) + '</span><div class=\"m\" style=\"font-size:12px\">' + esc(kind ? kind + ' · ' + days([{ d: x.d, u: x.u }]) + (x.t ? ' · ' + x.t : '') : days(x.days)) + '</div>', kind ? x.u : x.units);",
   "    const one = (x, kind) => tr('<b>' + esc(x.name || x.code || '') + '</b> <span class=\"m\">' + esc([x.code, x.book].filter(Boolean).join(' · ')) + '</span>' + (VM && kind ? '<div class=\"m vk1880\" style=\"font-size:12px\">' + esc(kind) + '</div>' : '') + chips(x, kind) + '<div class=\"m' + (VM ? ' has1880' : '') + '\" style=\"font-size:12px\">' + esc(kind ? kind + ' · ' + days([{ d: x.d, u: x.u }]) + (x.t ? ' · ' + x.t : '') : days(x.days)) + '</div>', kind ? x.u : x.units);"],
  ["    return '<h2>Lessons by student</h2><div class=\"m\" style=\"margin:-4px 0 6px\">Classes held in ' + esc(lab(S.month)) + ' · 1 unit = 50 minutes (½ = a 25-minute class) · use this to tally with your own records</div><table>'",
   "    const body1880 = '<table>'"],
  ["      + (Math.abs(pd - tot) > 0.009 ? '<div class=\"m\" style=\"margin-top:4px\">The pay above counts ' + n1(pd) + ' units' + (pd > tot ? ' (includes corrections made by Operations)' : ' (after corrections by Operations)') + '.</div>' : ''); }",
   "      + (Math.abs(pd - tot) > 0.009 ? '<div class=\"m\" style=\"margin-top:4px\">The pay above counts ' + n1(pd) + ' units' + (pd > tot ? ' (includes corrections made by Operations)' : ' (after corrections by Operations)') + '.</div>' : '');\n"
   + "    return '<h2>Lessons by student</h2><div class=\"m\" style=\"margin:-4px 0 6px\">Classes held in ' + esc(lab(S.month)) + ' · 1 unit = 50 minutes (½ = a 25-minute class) · use this to tally with your own records' + (VM ? '<span class=\"vk1880\"> · tap a date to open its video</span>' : '') + '</div>'\n"
   + "      + (VM ? '<div class=\"vs1880\"><div><b>' + cnt.n + '</b><span>lessons</span></div><div><b>' + cnt.v + '</b><span>videos</span></div><div><b>' + cnt.p + '</b><span>screen proofs</span></div><div class=\"o\"><b>' + cnt.l + '</b><span>late uploads</span></div><div class=\"r\"><b>' + cnt.x + '</b><span>missing</span></div></div>' : '') + body1880; }"],
  ["    SL = S; const q = x => esc(String(x)).replace(/'/g, '');",
   "    SL = S; const q = x => esc(String(x)).replace(/'/g, '');\n    if(!(VM1880 && VM1880.k === vk1880(S))) vload1880(S).then(ok => { if(ok && $('sheet') && $('sheet').classList.contains('open') && /^Lessons by student/.test(((document.querySelector('#sheetBody h1') || {}).textContent || ''))) ps1752Lessons(name, ym); });   /* 1880 */"],
]);
// the picture: leave the chips and counts out (plain list, one page) — every html2canvas call in the payslip picture
const fs = require('fs'); let s = fs.readFileSync(file, 'utf8');
const a = "const cv = await H(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false }); const blob";
const n = s.split(a).length - 1; if (n !== 1) throw new Error('picture anchor: ' + n);
s = s.replace(a, "const cv = await H(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false, onclone: d => { try{ d.querySelectorAll('.vc1880,.vs1880,.vk1880').forEach(x => x.remove()); d.querySelectorAll('.has1880').forEach(x => x.classList.remove('has1880')); }catch(e){} } }); const blob");
fs.writeFileSync(file, s);
