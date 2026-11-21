// 2574 (audit QA-14, verified 21 Nov): "Short notice" is set by date when the request is lodged (for today or tomorrow = Short notice,
// 2+ days ahead = In advance). The contract charge is by hours before each lesson (under 4 h, Clause 2.9). Dezza's 22 Nov request is
// "Short notice" by date but 32 h before the first lesson, so no charge. Both are now named for what they are.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["${r.notice ? ' · ' + esc(r.notice) : ''} · ${esc(lvClsShort(r))}</div>",
   "${r.notice ? ' · ' + esc(r.notice) + ' (by date)' : ''}${(() => { try{ const C = lv1795cls(r); if(!C.length) return ''; const h = (Math.min.apply(null, C.map(c => c.t)) - lv1795at(r.at)) / 36e5; return ' · ' + (h < 4 ? '<b style=\"color:#B4513B\">' + esc(lv1795h(h)) + ' before the first lesson · under 4 h (Clause 2.9)</b>' : esc(lv1795h(h)) + ' before the first lesson · 4 h or more'); }catch(e){ return ''; } })()} · ${esc(lvClsShort(r))}</div>"],
  ["<label>Notice</label><div class=\"qa-ch\">${['In advance','Short notice','After the fact'].map(v => pill('notice', v, LVF.notice)).join('')}</div>",
   "<label>Notice category <span class=\"mute\" style=\"font-weight:400\">· by date: In advance = 2+ days ahead · Short notice = for today or tomorrow · the charge goes by the 4 h rule (Clause 2.9)</span></label><div class=\"qa-ch\">${['In advance','Short notice','After the fact'].map(v => pill('notice', v, LVF.notice)).join('')}</div>"],
]);
