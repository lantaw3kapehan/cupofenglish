// 2224 (14 Nov · Misty: "we can do all now"): Schedule gets a fourth view, "Open slots": every teacher's open class times for
// this week or next, side by side (teachers down, days across), 25- or 50-minute classes. Built from the same teaching hours and
// booked classes as Teachers › "All teachers · open times" (mgmtAvailAll, avWeek), so the two always agree; that sheet stays for
// the partner picture and copy-as-text, and "Share these times" opens it. Tap a teacher's name to set their teaching hours.
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="css2224">
#v-schedule .fr24{margin:14px 0 22px;background:#fff;border:1px solid #ECEAF3;border-radius:20px;padding:20px 20px 16px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 8px 24px rgba(43,34,83,.05)}
#v-schedule .fr24 .top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
#v-schedule .fr24 .ttl{flex:1;min-width:220px;display:flex;flex-direction:column;gap:2px}
#v-schedule .fr24 .ttl b{font-size:22px;font-weight:700;color:#2B2253}
#v-schedule .fr24 .ttl span{font-size:13px;color:#6F6B85}
#v-schedule .fr24 .sg{display:inline-flex;background:#F1F0F6;border-radius:12px;padding:3px;gap:2px}
#v-schedule .fr24 .sg button{border:0;background:transparent;border-radius:9px;padding:7px 13px;font:600 13.5px Inter,sans-serif;color:#4A4566;cursor:pointer;min-height:36px}
#v-schedule .fr24 .sg button.on{background:#fff;color:#2B2253;box-shadow:0 1px 3px rgba(43,34,83,.14)}
#v-schedule .fr24 .sh{height:40px;padding:0 14px;border:1px solid #E3E1EC;border-radius:12px;background:#fff;font:600 13.5px Inter,sans-serif;color:#00737B;cursor:pointer}
#v-schedule .fr24 .sts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 16px}
#v-schedule .fr24 .st{background:#F7F6FB;border-radius:14px;padding:10px 14px;display:flex;flex-direction:column;gap:1px;min-width:0}
#v-schedule .fr24 .st span{font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#6F6B85}
#v-schedule .fr24 .st b{font-size:22px;font-weight:700;color:#2B2253;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-schedule .fr24 .st em{font-style:normal;font-size:12.5px;color:#6F6B85}
#v-schedule .fr24 .sc{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid #EEEDF4;border-radius:14px}
#v-schedule .fr24 table{border-collapse:separate;border-spacing:0;width:100%;min-width:900px;font-size:12.5px}
#v-schedule .fr24 th{position:sticky;top:0;background:#FAFAFC;font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#6F6B85;padding:9px 8px;text-align:left;border-bottom:1px solid #EEEDF4}
#v-schedule .fr24 th small{display:block;text-transform:none;letter-spacing:0;font-weight:500;color:#9A96AE;font-size:11px;margin-top:1px}
#v-schedule .fr24 th.td{color:#00737B}
#v-schedule .fr24 td{vertical-align:top;padding:8px;border-bottom:1px solid #F3F2F7;border-left:1px solid #F3F2F7}
#v-schedule .fr24 tr:last-child td{border-bottom:0}
#v-schedule .fr24 td.nm{position:sticky;left:0;z-index:1;background:#fff;border-left:0;min-width:120px;width:130px}
#v-schedule .fr24 td.nm button{border:0;background:none;padding:0;font:650 14px Inter,sans-serif;color:#2B2253;cursor:pointer;text-align:left}
#v-schedule .fr24 td.nm button:hover{color:#00737B;text-decoration:underline}
#v-schedule .fr24 td.nm small{display:block;font-size:11.5px;color:#6F6B85;margin-top:1px}
#v-schedule .fr24 td.past{background:#FAFAFC}
#v-schedule .fr24 .r{display:inline-block;margin:0 4px 4px 0;padding:3px 8px;border-radius:8px;background:#E3F4F2;color:#00626A;font-weight:600;white-space:nowrap;font-variant-numeric:tabular-nums}
#v-schedule .fr24 .r i{font-style:normal;font-weight:500;color:#2F8A85;margin-left:4px;font-size:11px}
#v-schedule .fr24 .full{color:#A6432E;font-weight:600;font-size:11.5px}
#v-schedule .fr24 .off{color:#B9B6C8}
#v-schedule .fr24 .nt{font-size:12.5px;color:#6F6B85;margin-top:12px}
#v-schedule .vw03>div button:nth-child(4){--ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M12 7v5l3 2'/%3E%3C/svg%3E")}
@media (max-width:640px){#v-schedule .fr24{padding:12px 10px}#v-schedule .fr24 .sts{gap:6px}#v-schedule .fr24 .st b{font-size:17px}#v-schedule .fr24 .st em{display:none}}
</style>
<script id="x2224">
(function(){
  if(window.__x2224) return; window.__x2224 = 1;
  try{ if(localStorage.getItem('coe.scBy') === 'free') SC_BY = 'free'; }catch(e){}
  const S = { wk: null, len: 25, r: null, busy: 0, err: '' };
  try{ const s = JSON.parse(localStorage.getItem('coe.fr24') || 'null'); if(s){ S.len = s.len === 50 ? 50 : 25; } }catch(e){}
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hm = t => new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Shanghai' });
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  function ranges(free, len){ const L = free.slice().sort((a, b) => a - b), out = []; let a = null, b = null, n = 0;
    L.forEach(t => { if(a != null && t - b <= 30 * 6e4){ b = t; n++; } else { if(a != null) out.push([a, b + len * 6e4, n]); a = t; b = t; n = 1; } });
    if(a != null) out.push([a, b + len * 6e4, n]); return out; }
  function weeks(r){ const save = (typeof AVA !== 'undefined') ? AVA : null; const rows = [];
    try{ AVA = { from: r.from, teachers: r.teachers, sel: new Set(), len: S.len, wk: S.wk };
      r.teachers.filter(t => t.days && t.days.some(Boolean)).forEach(t => { rows.push({ t, W: avaTW(t) }); }); }
    finally { AVA = save; } return rows; }
  function html(){
    const r = S.r, today = ymd(new Date());
    if(S.wk == null) S.wk = [0, 6].includes(new Date().getDay()) ? 1 : 0;
    let head = '<div class="top"><div class="ttl"><b>Open slots</b><span>Each teacher\'s open class times · China and Manila time (same clock) · tap a name to set teaching hours</span></div>' +
      '<div class="sg">' + [[0, 'This week'], [1, 'Next week']].map(([k, l]) => '<button type="button" class="' + (S.wk === k ? 'on' : '') + '" onclick="fr24Set(\'wk\',' + k + ')">' + l + '</button>').join('') + '</div>' +
      '<div class="sg">' + [25, 50].map(k => '<button type="button" class="' + (S.len === k ? 'on' : '') + '" onclick="fr24Set(\'len\',' + k + ')">' + k + ' min</button>').join('') + '</div>' +
      '<button type="button" class="sh" onclick="avAllOpen()">Share these times</button></div>';
    if(!r) return '<div class="fr24">' + head + '<div class="nt">' + (S.err ? 'Could not load the teaching hours: ' + E(S.err) + '. Try again in a moment.' : 'Loading the teaching hours…') + '</div></div>';
    const rows = weeks(r); if(!rows.length) return '<div class="fr24">' + head + '<div class="nt">No teaching hours are set yet. Set them in Teachers › a teacher › Teaching hours.</div></div>';
    const days = rows[0].W.map(d => d.d), tot = [0, 0, 0, 0, 0, 0, 0]; let all = 0; const per = [];
    const body = rows.map(({ t, W }) => { let n = 0;
      const cells = W.map((d, i) => { const y = ymd(d.d), past = y < today; let c = '';
        if(d.off) c = '<span class="off">—</span>';
        else if(!d.free.length) c = past ? '<span class="off">—</span>' : '<span class="full">' + (d.bk.length ? 'Full · ' + d.bk.length + ' booked' : 'No open time') + '</span>';
        else { const R = ranges(d.free, S.len); n += d.free.length; tot[i] += d.free.length; c = R.map(([a, b, k]) => '<span class="r">' + hm(a) + '–' + hm(b) + (k > 1 ? '<i>' + k + '</i>' : '') + '</span>').join(''); }
        return '<td class="' + (past ? 'past' : '') + '">' + c + '</td>'; }).join('');
      all += n; per.push([t.name, n]);
      return '<tr><td class="nm"><button type="button" onclick="fr24Hours(\'' + E(t.name).replace(/'/g, '') + '\')">' + E(t.name) + '</button><small>' + (n ? n + ' open slot' + (n === 1 ? '' : 's') : 'no open slots') + '</small></td>' + cells + '</tr>'; }).join('');
    per.sort((a, b) => b[1] - a[1]); const bi = tot.indexOf(Math.max(...tot));
    const none = (r.teachers || []).filter(t => !(t.days && t.days.some(Boolean))).map(t => t.name);
    return '<div class="fr24">' + head +
      '<div class="sts"><div class="st"><span>Open ' + S.len + '-min slots</span><b>' + all + '</b><em>' + (S.wk ? 'next week' : 'rest of this week') + '</em></div>' +
      '<div class="st"><span>Most open</span><b>' + (per[0] && per[0][1] ? 'Teacher ' + E(per[0][0]) : '—') + '</b><em>' + (per[0] && per[0][1] ? per[0][1] + ' slots' : '') + '</em></div>' +
      '<div class="st"><span>Most open day</span><b>' + (tot[bi] ? E(days[bi].toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })) : '—') + '</b><em>' + (tot[bi] ? tot[bi] + ' slots' : '') + '</em></div></div>' +
      '<div class="sc"><table><thead><tr><th>Teacher</th>' + days.map((d, i) => '<th class="' + (ymd(d) === today ? 'td' : '') + '">' + d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }) + '<small>' + (tot[i] ? tot[i] + ' open' : '&nbsp;') + '</small></th>').join('') + '</tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<div class="nt">A green time is open for a new class (the small number = how many ' + S.len + '-min classes fit). "Full" = all teaching hours booked.' + (none.length ? ' No teaching hours set yet: ' + E(none.join(', ')) + '.' : '') + '</div></div>';
  }
  function paint(v){
    const sw = v.querySelector('.vw03'); if(!sw) return;
    let w = v.querySelector('.fr24w'); if(!w){ w = document.createElement('div'); w.className = 'fr24w'; sw.insertAdjacentElement('afterend', w); }
    w.innerHTML = html();
    let n = w.nextElementSibling; while(n){ if(!n.classList.contains('fr24w')){ n.style.display = 'none'; n.dataset.h24 = 1; } n = n.nextElementSibling; }
    if(!S.r && !S.busy) load(v);
  }
  async function load(v){ S.busy = 1; S.err = '';
    try{ let r = null; try{ r = await avaGet(false); }catch(e){ r = (typeof kept === 'function' && kept('avall')) || null; if(!r) throw e; } S.r = r; }
    catch(e){ S.err = (e && (e.msg || e.message)) || 'not loaded'; }
    S.busy = 0; if(SC_BY === 'free'){ const vv = document.getElementById('v-schedule'); if(vv) paint(vv); } }
  window.fr24Set = (k, x) => { S[k] = x; try{ localStorage.setItem('coe.fr24', JSON.stringify({ len: S.len })); }catch(e){} const v = document.getElementById('v-schedule'); if(v) paint(v); };
  window.fr24Hours = n => { try{ if(typeof avOpen === 'function') return avOpen(n); }catch(e){} try{ avAllOpen(); }catch(e){} };
  window.__fr24Paint = v => paint(v);
})();
</script>
`;
lib(file, [
 ["[['time', 'List'], ['line', 'Timeline'], ['month', 'Month']]", "[['time', 'List'], ['line', 'Timeline'], ['month', 'Month'], ['free', 'Open slots']]"],
 ["const k = b.textContent === 'List' ? 'time' : b.textContent === 'Timeline' ? 'line' : 'month', on", "const k = b.textContent === 'List' ? 'time' : b.textContent === 'Timeline' ? 'line' : b.textContent === 'Month' ? 'month' : 'free', on"],
 ["    if(SC_BY === 'month'){ if(window.__mo04Paint) window.__mo04Paint(v); return; }", "    if(SC_BY !== 'free'){ v.querySelectorAll('.fr24w').forEach(x => x.remove()); v.querySelectorAll('[data-h24]').forEach(x => { x.style.display = ''; delete x.dataset.h24; }); }   /* 2224 */\n    if(SC_BY === 'free'){ if(window.__fr24Paint) window.__fr24Paint(v); return; }\n    if(SC_BY === 'month'){ if(window.__mo04Paint) window.__mo04Paint(v); return; }"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
