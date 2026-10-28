// 1581: (Misty, 29 Oct · Students audit, items 2 and 3) lesson units vs sessions, and "validity ended" is never called an extension.
// · Student page calendar: "20 booked after the 11 lessons left · the package ends on Tue, 30 Nov" counted SESSIONS against lesson UNITS
//   and rounded 11.5 down to 11. Jeoda (preview): 11.5 units left, 25-min classes (0.5 each) → 23 classes are covered, 8 are not.
//   Now: units per class = minutes ÷ 50 rounded to the half (the database rule, coe_cls_units); -TC / -SC classes count 0;
//   the warning names classes AND units, says the date is an estimate, and keeps it apart from the contractual valid-until.
//   0 lessons left now warns too (it was skipped); a shared package (siblings use the same units) shows no estimate; unknown → nothing.
// · Every-week bar: "25 min · Teacher X" → "2 × 25 min = 1 lesson unit a week · Teacher X".
// · Lesson summary / lessons-left pictures for parents: "Validity ended 7 July 2026 · extended 114 days · 已延长114天" → "… · 114 days ago,
//   lessons still left · 已过114天，仍有剩余课时". An approved extension is a new Deadline Date in ACTIVE (then nothing has ended);
//   the app has no other extension record, so it never says "extended".
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["try{ const lf = Math.floor(+((typeof STU !== 'undefined' && STU && STU.s && STU.s.left) || NaN)); ix.pe = live.length > lf && lf >= 0 ? (lf ? L.indexOf(live[lf - 1]) : -2) : -1; ix.over = new Set(lf >= 0 && live.length > lf ? live.slice(lf).map(e => L.indexOf(e)) : []); ix.lf = lf; ix.live = live; }catch(e){ ix.over = new Set(); }",
   "try{ const s0 = typeof STU !== 'undefined' && STU && STU.s ? STU.s : null, lv = s0 ? s0.left : null, lf = lv === '' || lv == null || !isFinite(+lv) ? NaN : +lv, U = window.coeUnits || (() => 1);   /* 1581: units, not sessions */\n      let acc = 0, k = 0; const ok = lf >= 0 && !(s0 && s0.shared); if(ok){ for(; k < live.length; k++){ const u = U(live[k]); if(acc + u > lf + 1e-9) break; acc += u; } }\n      ix.pe = ok && k < live.length ? (k ? L.indexOf(live[k - 1]) : -2) : -1; ix.over = new Set(ix.pe !== -1 ? live.slice(k).map(e => L.indexOf(e)) : []); ix.lf = lf; ix.k = k; ix.live = live;\n      ix.overU = Math.round(live.slice(k).reduce((a, e) => a + U(e), 0) * 10) / 10; ix.allU = Math.round(live.reduce((a, e) => a + U(e), 0) * 10) / 10; ix.shared = !!(s0 && s0.shared); }catch(e){ ix.over = new Set(); }"],
  ["' booked · last on <b>'",
   "' booked' + (ix.allU != null && ix.allU !== live.length ? ' (' + ix.allU + ' lesson unit' + (ix.allU === 1 ? '' : 's') + ')' : '') + ' · last on <b>'"],
  ["(ix.over && ix.over.size ? '<div class=\"ow\">⚠ <b>' + ix.over.size + '</b> booked after the <b>' + ix.lf + '</b> lessons left' + (ix.lf ? ' · the package ends on <b>' + new Date(ix.live[ix.lf - 1].start).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + '</b>' : '') + ' · renew before then or cancel the extra classes</div>' : '')",
   "(ix.over && ix.over.size ? '<div class=\"ow\"><b>' + ix.over.size + '</b> class' + (ix.over.size === 1 ? '' : 'es') + ' (' + ix.overU + ' lesson unit' + (ix.overU === 1 ? '' : 's') + ') booked after the <b>' + ix.lf + '</b> lesson unit' + (ix.lf === 1 ? '' : 's') + ' left run out' + (ix.k ? ' · the lessons left cover the classes up to <b>' + new Date(ix.live[ix.k - 1].start).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + '</b> (estimate from the calendar)' : '') + ' · renew before then or cancel the extra classes. The valid-until date is separate (see Package).</div>' : ix.shared && ix.live && ix.live.length ? '<div class=\"small mute\" style=\"margin-top:4px\">Shared package · the lessons left are shared with the other student, so there is no estimate here</div>' : '')"],
  ["'<span class=\"mt\">' + esc(M.map(m => m + ' min').join(' / ')) + (T.length === 1 ? ' · ' + esc(T[0]) : '') + '</span>'",
   "'<span class=\"mt\">' + (() => { const u = Math.round(S.reduce((a, x) => a + (window.coeUnits ? coeUnits({ mins: +x.m }) : 1), 0) * 10) / 10; return esc((S.length > 1 && M.length === 1 ? S.length + ' × ' : '') + M.map(m => m + ' min').join(' / ') + ' = ' + u + ' lesson unit' + (u === 1 ? '' : 's') + ' a week'); })() + (T.length === 1 ? ' · ' + esc(T[0]) : '') + '</span>'"],
  ["' · extended ' + n + ' day' + (n === 1 ? '' : 's') + ' · 有效期已于' + zh + '结束 · 已延长' + n + '天</span><br>'",
   "' · ' + n + ' day' + (n === 1 ? '' : 's') + ' ago, lessons still left · 有效期已于' + zh + '结束（已过' + n + '天），仍有剩余课时</span><br>'"],
  ["</script>\n</body>\n</html>",
   `</script>
<script id="coe-units">
/* 1581 · lesson units of one class: 50 minutes = 1 unit, 25 minutes = 0.5 (minutes ÷ 50, to the nearest half: the database's coe_cls_units).
   A class titled …-TC or …-SC is not counted (same as the database). Accepts a class { start, end, title } or { mins }. */
window.coeUnits = function(c){ try{ if(!c) return 0; if(c.title && /-(TC|SC)$/i.test(String(c.title).replace(/\\s+X$/i, '').trim())) return 0;
  const m = c.mins != null ? +c.mins : (new Date(c.end) - new Date(c.start)) / 6e4; if(!(m > 0)) return 0; return Math.round(m / 50 * 2) / 2; }catch(e){ return 0; } };
</script>
</body>
</html>`]
]);
