// 777: (Misty) shared-package class notice: "Kaylee is using OD2" (the notice showed only Leo's OPW1 The Alphabet).
// · When the children in one notice use different books, each child's line shows their own book ("👤 Kaylee … · 📘 OD2")
//   and the single 📘 line is left out. Each book comes from that child's next class in the calendar.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 777 · class notice: each child's own book */
(function(){
  if(window.__777 || typeof window.cnOpen !== 'function') return; window.__777 = 1;
  const up = x => String(x || '').trim().toUpperCase();
  const bookOf = L => { const now = Date.now() - 3 * 36e5, ok = (Array.isArray(L) ? L : []).filter(c => c && !c.cancelled && !/trial|-TC(\s+X)?\s*$/i.test(String(c.title || '')));
    const nx = ok.filter(c => new Date(c.start).getTime() >= now).sort((a, b) => new Date(a.start) - new Date(b.start))[0] || ok.sort((a, b) => new Date(b.start) - new Date(a.start))[0];
    const b = nx ? String(nx.book || (String(nx.title || '').replace(/\s+X$/i, '').split('-')[4] || '')).trim() : ''; return b ? (typeof cnBookPick === 'function' && cnBookPick(b)) || b : ''; };
  const _o = window.cnOpen;
  window.cnOpen = async function(code){ const r = await _o.apply(this, arguments);
    try{ const x = typeof CN !== 'undefined' ? CN : null; if(x && Array.isArray(x.fam) && x.fam.length > 1 && up(x.code) === up(code)){
        const L = await Promise.all(x.fam.map(m => Array.isArray(CLSM[up(m.code)]) ? CLSM[up(m.code)] : api('mgmtStuClasses', TOKEN, m.code).then(v => { if(Array.isArray(v)) CLSM[up(m.code)] = v; return v; }).catch(() => [])));
        x.fam.forEach((m, k) => { m.book = bookOf(L[k]) || (up(m.code) === up(x.code) ? x.book : ''); });
        if(typeof cnPv === 'function') cnPv(); } }catch(e){}
    return r; };
  const _t = window.cnText;
  window.cnText = function(){ let t = _t.apply(this, arguments);
    try{ const x = typeof CN !== 'undefined' ? CN : null; if(x && Array.isArray(x.fam) && x.fam.length > 1){ const B = x.fam.map(m => String(m.book || '').trim());
        if(B.some(Boolean) && new Set(B.filter(Boolean)).size > 1){
          x.fam.forEach(m => { if(!m.book) return; const re = new RegExp('^(👤 .*' + String(m.code).replace(/[-]/g, '\\-') + ')$', 'm'); t = t.replace(re, '$1 · 📘 ' + m.book); });
          t = t.replace(/^📘 .*\n?/m, ''); } } }catch(e){}
    return t; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
