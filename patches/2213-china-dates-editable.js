// 2213 (14 Nov · Misty: go ahead): management can edit the China dates (holidays, school exam seasons, make-up school days,
// international holidays) from "See all dates" › Edit dates. The list is saved in the database (docs sys:cndates via coe-cal)
// and every phone and laptop uses it, so exam dates can be set each term without asking for an update. The built-in list stays as
// the starting point until the first save.
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="css2213">
.cn13 table{width:100%;border-collapse:collapse;font-size:13.5px}
.cn13 th{text-align:left;font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#6F6B85;padding:6px 4px}
.cn13 td{padding:4px;vertical-align:top;border-top:1px solid #F0EFF5}
.cn13 input,.cn13 select{width:100%;box-sizing:border-box;min-height:38px;border:1px solid #E3E1EC;border-radius:9px;padding:6px 8px;font:inherit;font-size:13.5px;background:#fff;color:#2B2253}
.cn13 .x{width:38px;height:38px;border-radius:9px;border:1px solid #E3E1EC;background:#fff;cursor:pointer;color:#AE4D41;font-size:16px}
.cn13 .bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
@media (max-width:640px){.cn13 table,.cn13 tbody,.cn13 tr,.cn13 td{display:block;width:100%}.cn13 thead{display:none}.cn13 tr{border:1px solid #ECEAF3;border-radius:12px;padding:8px;margin-bottom:8px}.cn13 td{border:0}}
</style>
<script id="x2213">
(function(){
  if(window.__x2213) return; window.__x2213 = 1;
  const URL0 = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-cal', SK = 'coe.cndates';
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function put(rows){ const C = window.CN2195; if(!C || !Array.isArray(rows) || !rows.length) return; C.splice(0, C.length, ...rows.map(x => ({ a: x.a, b: x.b, k: x.k, n: x.n, t: x.t || '' })).sort((p, q) => p.a.localeCompare(q.a))); }
  try{ const s = JSON.parse(localStorage.getItem(SK) || 'null'); if(s && s.rows) put(s.rows); }catch(e){}
  function load(n){ if(typeof TOKEN === 'undefined' || !TOKEN){ if((n || 0) < 60) setTimeout(() => load((n || 0) + 1), 1000); return; }
    fetch(URL0, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'cnGet' }) }).then(r => r.json()).then(r => {
      if(r && r.ok && Array.isArray(r.rows) && r.rows.length){ put(r.rows); try{ localStorage.setItem(SK, JSON.stringify({ rows: r.rows, at: r.at })); }catch(e){} } }).catch(() => {}); }
  setTimeout(load, 1500);
  const KINDS = [['h', 'China holiday'], ['x', 'School exams (about)'], ['w', 'Make-up school day'], ['i', 'International holiday']];
  const row = x => '<tr><td><input data-f="n" value="' + E(x.n) + '" placeholder="Name, e.g. School final exams (about)"></td><td><input type="date" data-f="a" value="' + E(x.a) + '"></td><td><input type="date" data-f="b" value="' + E(x.b) + '"></td>' +
    '<td><select data-f="k">' + KINDS.map(([k, l]) => '<option value="' + k + '"' + (x.k === k ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></td><td><input data-f="t" value="' + E(x.t) + '" placeholder="Short note for teachers (optional)"></td>' +
    '<td><button type="button" class="x" aria-label="Remove this row" onclick="this.closest(\'tr\').remove()">×</button></td></tr>';
  window.cn2213Edit = function(){
    if(typeof D === 'undefined' || !D || !D.mgr) return;
    const t = new Date(); const y0 = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-01';
    const L = (window.CN2195 || []).filter(x => x.b >= y0);
    openSheet('<div class="cn13"><h1>Edit China dates</h1><div class="mute small">Everyone sees these on Schedule, Today and the leave form. Official holidays come from China\'s yearly notice (usually November); school exam dates differ by city, so set them each term. Dates are in Manila days.</div>' +
      '<table><thead><tr><th style="width:30%">Name</th><th>From</th><th>To</th><th>Kind</th><th style="width:26%">Note</th><th></th></tr></thead><tbody id="cn13b">' + L.map(row).join('') + '</tbody></table>' +
      '<div class="bar"><button type="button" class="btn ghost" onclick="cn2213Add()">+ Add a row</button><button type="button" class="btn" id="cn13s" onclick="cn2213Save()">Save for everyone</button></div><div class="mute small" id="cn13m" style="margin-top:8px"></div></div>');
  };
  window.cn2213Add = () => { const b = document.getElementById('cn13b'); if(b) b.insertAdjacentHTML('beforeend', row({ a: '', b: '', k: 'x', n: '', t: '' })); };
  window.cn2213Save = async function(){
    const b = document.getElementById('cn13b'), m = document.getElementById('cn13m'), sb = document.getElementById('cn13s'); if(!b) return;
    const rows = [...b.querySelectorAll('tr')].map(tr => { const o = {}; tr.querySelectorAll('[data-f]').forEach(el => o[el.dataset.f] = el.value.trim()); if(!o.b) o.b = o.a; return o; }).filter(o => o.n || o.a);
    const bad = rows.filter(o => !o.n || !/^\d{4}-\d{2}-\d{2}$/.test(o.a) || o.b < o.a);
    if(bad.length){ m.textContent = 'Check ' + bad.length + ' row' + (bad.length === 1 ? '' : 's') + ': each needs a name and a From date, and To cannot be before From.'; m.style.color = '#AE4D41'; return; }
    const t = new Date(); const y0 = t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-01';
    const keep = (window.CN2195 || []).filter(x => x.b < y0);   /* months already past stay as they were */
    sb.disabled = true; m.style.color = ''; m.textContent = 'Saving…';
    try{ const r = await fetch(URL0, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'cnSet', rows: keep.concat(rows) }) }).then(x => x.json());
      if(!r || !r.ok) throw new Error((r && r.error) || 'not saved');
      put(r.rows); try{ localStorage.setItem(SK, JSON.stringify({ rows: r.rows, at: new Date().toISOString() })); }catch(e){}
      try{ toast('China dates saved for everyone'); }catch(e){} cn2196All(); }
    catch(e){ sb.disabled = false; m.style.color = '#AE4D41'; m.textContent = 'Not saved: ' + (e.message || e) + '. Try again.'; }
  };
})();
</script>
`;
lib(file, [
 ["openSheet('<h1>China dates</h1><div class=\"mute small\">Holidays and school exam seasons in China, so you can plan classes and leave.</div>' + key",
  "openSheet('<h1>China dates</h1><div class=\"mute small\">Holidays and school exam seasons in China, so you can plan classes and leave.</div>' + (typeof D !== 'undefined' && D && D.mgr ? '<button type=\"button\" class=\"btn ghost\" style=\"margin:6px 0 4px\" onclick=\"cn2213Edit()\">Edit dates</button>' : '') + key"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
