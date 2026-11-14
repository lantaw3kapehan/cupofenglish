// 2204 (14 Nov · Misty: "YES GO AHEAD"): management Schedule gets a third view, "Month": a calendar of the whole month,
// one square per day with classes, teachers teaching, cancelled classes, teachers on approved leave, China holidays and exam seasons
// shaded, busier days darker. ‹ › moves by month. Tap a day to open it in the List view. Data: coe-cal edge function (coe_month_overview).
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="css2204">
#v-schedule .mo04{margin:12px 0 18px;background:#fff;border:1px solid #ECEAF3;border-radius:16px;padding:14px}
#v-schedule .mo04 .top{display:flex;align-items:center;gap:10px;margin-bottom:10px}
#v-schedule .mo04 .top b{font-size:18px;flex:1}
#v-schedule .mo04 .top button{width:40px;height:40px;border-radius:12px;border:1px solid #E3E1EC;background:#fff;font-size:18px;cursor:pointer;color:#2B2253}
#v-schedule .mo04 .tot{font-size:13px;color:#4A4566;margin:-4px 0 10px}
#v-schedule .mo04 .g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
#v-schedule .mo04 .dw{font-size:11.5px;font-weight:600;color:#6F6B85;text-transform:uppercase;letter-spacing:.04em;padding:0 4px}
#v-schedule .mo04 .d{position:relative;min-height:104px;border:1px solid #ECEAF3;border-radius:12px;padding:7px 8px;display:flex;flex-direction:column;gap:2px;font-size:12px;color:#4A4566;background:#fff;box-sizing:border-box;overflow:hidden;cursor:pointer;text-align:left;font-family:inherit}
#v-schedule .mo04 .d:hover{box-shadow:0 2px 10px rgba(43,34,83,.12)}
#v-schedule .mo04 .d .dt{display:flex;justify-content:space-between;align-items:baseline}
#v-schedule .mo04 .d .dt b{font-size:16px;color:#2B2253}
#v-schedule .mo04 .d .bar{height:5px;border-radius:3px;background:#00939D;margin:3px 0 2px}
#v-schedule .mo04 .d .n{font-weight:650;color:#2B2253}
#v-schedule .mo04 .d .cx{color:#AE4D41}
#v-schedule .mo04 .d .lv{color:#8A5A12}
#v-schedule .mo04 .d .cn{font-size:10.5px;font-weight:650;line-height:1.2}
#v-schedule .mo04 .d.o{opacity:.35}
#v-schedule .mo04 .d.td{border:2px solid #00A3AD}
#v-schedule .mo04 .d.sel{box-shadow:0 0 0 2px #2B2253 inset}
#v-schedule .mo04 .d.past{background:#FAFAFC}
#v-schedule .mo04 .d.k-h{background:#FFF3EF}#v-schedule .mo04 .d.k-x{background:#F4F2FC}#v-schedule .mo04 .d.k-i{background:#EEF8F7}
#v-schedule .mo04 .k{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:#4A4566;margin-top:10px}
#v-schedule .mo04 .k span{display:flex;align-items:center;gap:6px}
#v-schedule .mo04 .k i{display:inline-block;width:14px;height:12px;border-radius:4px}
@media (max-width:640px){#v-schedule .mo04{padding:8px}#v-schedule .mo04 .g{gap:3px}#v-schedule .mo04 .d{min-height:74px;padding:4px;font-size:10.5px}#v-schedule .mo04 .d .hide-s{display:none}}
</style>
<script id="x2204">
(function(){
  if(window.__x2204) return; window.__x2204 = 1;
  try{ if(localStorage.getItem('coe.scBy') === 'month') SC_BY = 'month'; }catch(e){}
  let MM = null; const CACHE = {};
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const cnOn = y => { try{ return (window.CN2195 || []).filter(x => x.a <= y && x.b >= y && x.k !== 'w')[0] || null; }catch(e){ return null; } };
  const short = n => String(n || '').replace(/ holiday$/, '').replace(/ \(about\)$/, '').replace(/ \(Grade \d+(, about)?\)$/, '');
  function range(m){ const f = new Date(m + '-01T12:00:00'), s = new Date(f); s.setDate(f.getDate() - ((f.getDay() + 6) % 7)); return { f, s, last: new Date(f.getFullYear(), f.getMonth() + 1, 0, 12) }; }
  async function load(m){
    if(CACHE[m]) return CACHE[m]; const { s } = range(m); const key = 'coe.mo04.' + m;
    try{ const c = JSON.parse(localStorage.getItem(key) || 'null'); if(c && Date.now() - c.at < 10 * 6e4) return (CACHE[m] = c.d); }catch(e){}
    const r = await fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-cal', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, from: ymd(s), days: 42 }) }).then(x => x.json());
    if(!r || !r.ok) throw new Error((r && r.error) || 'Could not load the month');
    const d = {}; (r.days || []).forEach(x => d[x.day] = x); CACHE[m] = d; try{ localStorage.setItem(key, JSON.stringify({ at: Date.now(), d })); }catch(e){} setTimeout(() => { delete CACHE[m]; }, 5 * 6e4); return d;
  }
  function grid(m, D){
    const { f, s, last } = range(m), today = ymd(new Date()), sel = SC && SC.date, mx = Math.max(1, ...Object.values(D || {}).map(x => +x.n || 0));
    let h = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => '<div class="dw">' + w + '</div>').join(''), tot = 0, tcx = 0;
    for(let i = 0; i < 42; i++){ const d = new Date(s); d.setDate(s.getDate() + i); if(i >= 35 && d > last) break;
      const y = ymd(d), out = d.getMonth() !== f.getMonth(), x = (D || {})[y], c = cnOn(y);
      if(!out && x){ tot += +x.n || 0; tcx += +x.cx || 0; }
      h += '<button type="button" class="d' + (out ? ' o' : '') + (y === today ? ' td' : y < today ? ' past' : '') + (y === sel ? ' sel' : '') + (c && !out ? ' k-' + c.k : '') + '" onclick="mo04Go(\'' + y + '\')" title="Open ' + E(d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })) + '">' +
        '<span class="dt"><b>' + d.getDate() + '</b>' + (x && x.peak && !out ? '<span class="hide-s" style="font-size:10.5px;color:#8A86A0">busiest ' + E(x.peak) + '</span>' : '') + '</span>' +
        (c && !out ? '<span class="cn" style="color:' + (c.k === 'h' ? '#A4402A' : c.k === 'x' ? '#4A3FA8' : '#00626A') + '">' + E(short(c.n)) + '</span>' : '') +
        (x && !out && x.n ? '<span class="bar" style="width:' + Math.max(12, Math.round(x.n / mx * 100)) + '%;opacity:' + (0.35 + 0.65 * x.n / mx).toFixed(2) + '"></span><span class="n">' + x.n + ' classes</span><span class="hide-s">' + x.tch + ' teacher' + (x.tch === 1 ? '' : 's') + '</span>' : (!out && x ? '<span style="color:#8A86A0">No classes</span>' : '')) +
        (x && !out && x.cx ? '<span class="cx hide-s">' + x.cx + ' cancelled</span>' : '') +
        (x && !out && x.leave && x.leave.length ? '<span class="lv">' + E(x.leave.join(', ')) + ' on leave</span>' : '') + '</button>'; }
    const ml = f.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    return '<div class="mo04"><div class="top"><button type="button" aria-label="Previous month" onclick="mo04M(-1)">‹</button><b>' + E(ml) + '</b><button type="button" aria-label="Next month" onclick="mo04M(1)">›</button></div>' +
      (D ? '<div class="tot">' + tot + ' classes this month' + (tcx ? ' · ' + tcx + ' cancelled' : '') + '. Tap a day to open it.</div>' : '<div class="tot">Loading the month…</div>') + '<div class="g">' + h + '</div>' +
      '<div class="k"><span><i style="background:#00939D"></i>longer bar = more classes</span><span><i style="background:#FFF3EF"></i>China holiday</span><span><i style="background:#F4F2FC"></i>school exams</span><span><i style="background:#EEF8F7"></i>international holiday</span><span><i style="border:2px solid #00A3AD"></i>today</span></div></div>';
  }
  async function paint(v){
    if(!MM) MM = String((SC && SC.date) || ymd(new Date())).slice(0, 7);
    const old = v.querySelector('.mo04w'); const w = old || document.createElement('div'); w.className = 'mo04w';
    if(!old){ const sw = v.querySelector('.vw03'); if(!sw) return; sw.insertAdjacentElement('afterend', w); }
    const m = MM; w.innerHTML = grid(m, CACHE[m] || null);
    let n = sw2(v); while(n){ const nx = n.nextElementSibling; if(!n.classList.contains('mo04w')) n.style.display = 'none'; n = nx; }
    if(!CACHE[m]){ try{ const D = await load(m); if(MM === m && SC_BY === 'month') w.innerHTML = grid(m, D); }catch(e){ w.innerHTML = '<div class="mo04"><div class="tot">Could not load the month: ' + E(e.message || e) + '</div></div>'; } }
  }
  const sw2 = v => { const w = v.querySelector('.mo04w'); return w && w.nextElementSibling; };
  window.mo04M = d => { const [y, m] = (MM || ymd(new Date()).slice(0, 7)).split('-').map(Number); const x = new Date(y, m - 1 + d, 1, 12); MM = ymd(x).slice(0, 7); const v = document.getElementById('v-schedule'); if(v) paint(v); };
  window.mo04Go = y => { const t = new Date(); t.setHours(12, 0, 0, 0); const o = Math.round((new Date(y + 'T12:00:00') - t) / 864e5); SC_BY = 'time'; try{ localStorage.setItem('coe.scBy', 'time'); }catch(e){} MM = y.slice(0, 7); loadSchedule(o - SC_OFF); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50); };
  window.__mo04Paint = v => paint(v);
})();
</script>
`;
lib(file, [
 ["[['time', 'List'], ['line', 'Timeline']].map(([k, l]) => '<button style=\"border:0;border-radius:9px;padding:8px 16px;min-height:38px;font-weight:600;font-size:14px;font-family:inherit;cursor:pointer;' + ((k === 'line') === (SC_BY === 'line') ?",
  "[['time', 'List'], ['line', 'Timeline'], ['month', 'Month']].map(([k, l]) => '<button style=\"border:0;border-radius:9px;padding:8px 16px;min-height:38px;font-weight:600;font-size:14px;font-family:inherit;cursor:pointer;' + (k === SC_BY || (k === 'time' && SC_BY === 'teacher') ?"],
 ["<span style=\"font-size:12.5px;color:#6F6B85\">Timeline = every teacher\\'s day side by side</span></div>'); }\n    if(SC_BY !== 'line') return;",
  "<span style=\"font-size:12.5px;color:#6F6B85\">Timeline = every teacher\\'s day side by side · Month = the whole month at a glance</span></div>'); }\n    if(SC_BY === 'month'){ if(window.__mo04Paint) window.__mo04Paint(v); return; }\n    if(SC_BY !== 'line') return;"],
 ["const w = function(){ const line = SC_BY === 'line'; if(line) SC_BY = 'time'; let r; try{ r = orig.apply(this, arguments); } finally{ if(line) SC_BY = 'line'; }",
  "const w = function(){ const keep = SC_BY, line = keep === 'line' || keep === 'month'; if(line) SC_BY = 'time'; let r; try{ r = orig.apply(this, arguments); } finally{ if(line) SC_BY = keep; }"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
