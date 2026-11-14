// 2201 (14 Nov · Misty: "make the calendar best"): the teacher's Schedule gets a "List | Calendar" switch.
// · This week / Next week → a week grid: days across, hours down, each class a block in its book colour at its real time and length,
//   cancelled classes striped grey, today's column highlighted with a red "now" line, China holidays and exam seasons shaded on their days.
// · This month / Next month → a month calendar: one square per day with the number of classes and the first times, China dates shaded.
// The list stays as it was; the last choice is remembered on the device. Nothing changes for management.
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="css2201">
#v-tsched .c01sw{display:inline-flex;gap:4px;background:#F1F0F6;border-radius:12px;padding:3px;margin:10px 0 0 8px;vertical-align:middle}
#v-tsched .c01sw button{border:0;background:transparent;border-radius:9px;padding:7px 12px;font-weight:600;font-size:13px;font-family:inherit;color:#4A4566;cursor:pointer;min-height:36px}
#v-tsched .c01sw button.on{background:#fff;color:#2B2253;box-shadow:0 1px 3px rgba(43,34,83,.12)}
#v-tsched .c01{margin:14px 0 18px;background:#fff;border:1px solid #ECEAF3;border-radius:16px;overflow-x:auto;-webkit-overflow-scrolling:touch}
#v-tsched .c01w{display:grid;grid-template-columns:52px repeat(7,minmax(96px,1fr));min-width:760px}
#v-tsched .c01h{position:sticky;top:0;z-index:3;background:#fff;border-bottom:1px solid #ECEAF3;padding:8px 8px 6px;display:flex;flex-direction:column;gap:1px;min-height:58px;box-sizing:border-box}
#v-tsched .c01h span{font-size:11.5px;font-weight:600;color:#6F6B85;text-transform:uppercase;letter-spacing:.04em}
#v-tsched .c01h b{font-size:18px;line-height:1.1}
#v-tsched .c01h em{font-style:normal;font-size:10.5px;font-weight:650;line-height:1.2;border-radius:5px;padding:1px 5px;align-self:flex-start;margin-top:2px}
#v-tsched .c01h.td span,#v-tsched .c01h.td b{color:#00737B}
#v-tsched .c01t{position:relative}
#v-tsched .c01t span{position:absolute;right:6px;transform:translateY(-50%);font-size:10.5px;color:#8A86A0;font-variant-numeric:tabular-nums}
#v-tsched .c01c{position:relative;border-left:1px solid #F0EFF5}
#v-tsched .c01c.td{background:#F4FBFB}
#v-tsched .c01c.cn-h{background:#FFF6F2}#v-tsched .c01c.cn-x{background:#F7F6FD}#v-tsched .c01c.cn-i{background:#F2FAF9}
#v-tsched .c01c i.l{position:absolute;left:0;right:0;height:1px;background:#F3F2F7}
#v-tsched .c01e{position:absolute;left:3px;right:3px;box-sizing:border-box;border-radius:7px;border-left:4px solid var(--c);background:var(--t);padding:2px 5px;font-size:11.5px;line-height:1.2;overflow:hidden;color:#2B2253}
#v-tsched .c01e b{display:block;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-tsched .c01e small{display:block;font-size:10px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-tsched .c01e.cx{background:repeating-linear-gradient(135deg,#F4F3F8 0 5px,#FBFBFD 5px 10px);border-left-color:#C9C6D6;color:#8A86A0}
#v-tsched .c01e.cx b{text-decoration:line-through}
#v-tsched .c01e.fin{opacity:.55}
#v-tsched .c01e.on{box-shadow:0 0 0 2px #00A3AD}
#v-tsched .c01n{position:absolute;left:0;right:0;height:2px;background:#C2563F;z-index:2}
#v-tsched .c01m{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;padding:12px}
#v-tsched .c01m .dw{font-size:11.5px;font-weight:600;color:#6F6B85;text-transform:uppercase;letter-spacing:.04em;padding:0 4px}
#v-tsched .c01m .d{min-height:86px;border:1px solid #ECEAF3;border-radius:12px;padding:6px 7px;display:flex;flex-direction:column;gap:2px;font-size:11.5px;color:#4A4566;background:#fff;box-sizing:border-box;overflow:hidden}
#v-tsched .c01m .d b{font-size:15px;color:#2B2253}
#v-tsched .c01m .d.o{opacity:.35;border-style:dashed}
#v-tsched .c01m .d.td{border:2px solid #00A3AD}
#v-tsched .c01m .d.past{opacity:.6}
#v-tsched .c01m .d.cn-h{background:#FFF3EF}#v-tsched .c01m .d.cn-x{background:#F4F2FC}#v-tsched .c01m .d.cn-i{background:#EEF8F7}
#v-tsched .c01m .d .cn{font-size:10.5px;font-weight:650;line-height:1.2}
#v-tsched .c01m .d .n{font-weight:650;color:#2B2253}
#v-tsched .c01m .d .tm{font-variant-numeric:tabular-nums;color:#6F6B85;font-size:11px}
#v-tsched .c01k{display:flex;flex-wrap:wrap;gap:14px;font-size:12px;color:#4A4566;margin:8px 2px 0}
#v-tsched .c01k span{display:flex;align-items:center;gap:6px}
#v-tsched .c01k i{display:inline-block;width:14px;height:12px;border-radius:4px}
@media (max-width:640px){#v-tsched .c01m{gap:3px;padding:8px}#v-tsched .c01m .d{min-height:64px;padding:4px;font-size:10.5px}#v-tsched .c01m .d .tm{display:none}}
</style>
<script id="x2201">
(function(){
  if(window.__x2201) return; window.__x2201 = 1;
  let MODE = 'list'; try{ MODE = localStorage.getItem('coe.tsView') === 'cal' ? 'cal' : 'list'; }catch(e){}
  window.c01Set = m => { MODE = m; try{ localStorage.setItem('coe.tsView', m); }catch(e){} try{ tsPaint(); }catch(e){} };
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const hm = d => { const x = new Date(d); return x.getHours() + x.getMinutes() / 60; };
  const tm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const tint = c => { const m = /^#?([0-9a-f]{6})$/i.exec(String(c || '')); if(!m) return '#F6F5FA'; const n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255, f = .84;
    return 'rgb(' + Math.round(r + (255 - r) * f) + ',' + Math.round(g + (255 - g) * f) + ',' + Math.round(b + (255 - b) * f) + ')'; };
  const col = e => { try{ return svCol(e.book || e.code); }catch(x){ return '#9A98A8'; } };
  const cnOn = y => { try{ return (window.CN2195 || []).filter(x => x.a <= y && x.b >= y && x.k !== 'w')[0] || null; }catch(e){ return null; } };
  const short = n => String(n || '').replace(/ holiday$/, '').replace(/ \(about\)$/, '').replace(/ \(Grade \d+(, about)?\)$/, '');
  function week(t){
    const E0 = t.events, today = ymd(new Date()), now = Date.now(), PX = 46;
    const live = E0.filter(e => !e.cancelled); let h0 = 8, h1 = 22;
    if(E0.length){ h0 = Math.min(...E0.map(e => Math.floor(hm(e.start)))); h1 = Math.max(...E0.map(e => Math.ceil(hm(e.end) || hm(e.start) + 1))); }
    h0 = Math.max(0, Math.min(h0, 17)); h1 = Math.min(24, Math.max(h1, h0 + 4)); const H = (h1 - h0) * PX;
    const days = []; for(let k = 0; k < 7; k++){ const d = new Date(t.from + 'T12:00:00'); d.setDate(d.getDate() + k); days.push(d); }
    let hd = '<div class="c01h" style="border-left:0"></div>', cols = '';
    let tcol = '<div class="c01t" style="height:' + H + 'px">'; for(let h = h0 + 1; h < h1; h++) tcol += '<span style="top:' + ((h - h0) * PX) + 'px">' + String(h).padStart(2, '0') + ':00</span>'; tcol += '</div>';
    days.forEach(d => { const y = ymd(d), c = cnOn(y), td = y === today, L = E0.filter(e => e.day === y);
      hd += '<div class="c01h' + (td ? ' td' : '') + '"><span>' + (td ? 'Today' : d.toLocaleDateString('en-GB', { weekday: 'short' })) + '</span><b>' + d.getDate() + ' <small style="font-size:11px;font-weight:500;color:#8A86A0">' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</small></b>' +
        (c ? '<em class="cn95t k-' + c.k + '">' + E(short(c.n)) + '</em>' : '') + '</div>';
      let lines = ''; for(let h = h0 + 1; h < h1; h++) lines += '<i class="l" style="top:' + ((h - h0) * PX) + 'px"></i>';
      const ev = L.map(e => { const a = hm(e.start), b = Math.max(a + .35, hm(e.end) || a + .5), top = (a - h0) * PX, ht = Math.max(20, (b - a) * PX - 2);
        const st = e.cancelled ? 'cx' : (now >= new Date(e.start) && now < new Date(e.end)) ? 'on' : new Date(e.end) < now ? 'fin' : '', cc = col(e);
        return '<div class="c01e ' + st + '" style="top:' + top + 'px;height:' + ht + 'px;--c:' + cc + ';--t:' + tint(cc) + '" title="' + E(tm(e.start) + '–' + tm(e.end) + ' · ' + (e.student || e.title || '') + (e.code ? ' · ' + e.code : '') + (e.book ? ' · ' + e.book : '') + (e.cancelled ? ' · cancelled' : '')) + '"><b>' + E(e.student || e.title || '') + '</b>' + (ht > 30 ? '<small>' + E(tm(e.start) + (e.book ? ' · ' + e.book : '')) + '</small>' : '') + '</div>'; }).join('');
      const nl = td && hm(now) > h0 && hm(now) < h1 ? '<div class="c01n" style="top:' + ((hm(now) - h0) * PX) + 'px"></div>' : '';
      cols += '<div class="c01c' + (td ? ' td' : c ? ' cn-' + c.k : '') + '" style="height:' + H + 'px">' + lines + ev + nl + '</div>'; });
    return '<div class="c01"><div class="c01w">' + hd + tcol + cols + '</div></div>';
  }
  function month(t){
    const E0 = t.events, today = ymd(new Date()), f = new Date(t.from + 'T12:00:00'), start = new Date(f); start.setDate(f.getDate() - ((f.getDay() + 6) % 7));
    const last = new Date(f); last.setDate(f.getDate() + t.days - 1); const end = new Date(last); end.setDate(last.getDate() + (7 - ((last.getDay() + 6) % 7) - 1));
    let h = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => '<div class="dw">' + w + '</div>').join('');
    for(const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)){
      const y = ymd(d), out = d < f || d > last, L = E0.filter(e => e.day === y), live = L.filter(e => !e.cancelled).sort((a, b) => new Date(a.start) - new Date(b.start)), c = cnOn(y);
      h += '<div class="d' + (out ? ' o' : '') + (y === today ? ' td' : y < today ? ' past' : '') + (c && !out ? ' cn-' + c.k : '') + '"><b>' + d.getDate() + '</b>' +
        (c && !out ? '<span class="cn" style="color:' + (c.k === 'h' ? '#A4402A' : c.k === 'x' ? '#4A3FA8' : '#00626A') + '">' + E(short(c.n)) + '</span>' : '') +
        (!out && live.length ? '<span class="n">' + live.length + ' class' + (live.length === 1 ? '' : 'es') + '</span><span class="tm">' + live.slice(0, 3).map(e => tm(e.start)).join(' · ') + (live.length > 3 ? ' …' : '') + '</span>' : '') +
        (!out && L.length > live.length ? '<span class="tm">' + (L.length - live.length) + ' cancelled</span>' : '') + '</div>';
    }
    return '<div class="c01"><div class="c01m">' + h + '</div></div>';
  }
  function decorate(){
    const v = document.getElementById('v-tsched'); const t = typeof TS !== 'undefined' && TS; if(!v || !t || !t.events) return;
    const seg = v.querySelector('.seg'); if(seg && !v.querySelector('.c01sw')) seg.insertAdjacentHTML('afterend', '<div class="c01sw"><button class="' + (MODE === 'list' ? 'on' : '') + '" onclick="c01Set(\'list\')">List</button><button class="' + (MODE === 'cal' ? 'on' : '') + '" onclick="c01Set(\'cal\')">Calendar</button></div>');
    if(MODE !== 'cal') return;
    const secs = [...v.querySelectorAll('section.sec')].filter(s => s.querySelector('.sv-day, .sv-none')); if(!secs.length) return;
    v.querySelectorAll('.sv-wk').forEach(x => { if(/Finished/.test(x.textContent)) x.style.display = 'none'; });
    const key = '<div class="c01k"><span><i style="background:#E6F6F7;box-shadow:0 0 0 2px #00A3AD"></i>on now</span><span><i style="background:repeating-linear-gradient(135deg,#F4F3F8 0 4px,#FBFBFD 4px 8px);border:1px solid #DDD"></i>cancelled</span><span><i style="background:#FFF3EF"></i>China holiday</span><span><i style="background:#F4F2FC"></i>school exams</span><span>Colour = book</span></div>';
    secs[0].insertAdjacentHTML('beforebegin', '<div class="c01wrap">' + key + (t.days > 7 ? month(t) : week(t)) + '</div>');
    secs.forEach(s => s.style.display = 'none');
  }
  function wrap(){
    if(typeof window.tsPaint !== 'function'){ setTimeout(wrap, 300); return; }
    if(window.tsPaint.__x2201) return; const orig = window.tsPaint;
    const w = function(){ const r = orig.apply(this, arguments); try{ if(typeof VIEW !== 'undefined' && VIEW === 'tsched') decorate(); }catch(e){ console.warn('2201', e); } return r; };
    w.__x2201 = 1; window.tsPaint = w; try{ tsPaint = w; }catch(e){}
    try{ if(typeof VIEW !== 'undefined' && VIEW === 'tsched' && TS && TS.events) w(); }catch(e){}
  }
  wrap();
})();
</script>
`;
lib(file, [["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]]);
