// 2249 (Misty, Merlin): a student with two packages with the same teacher (Merlin: Academic Reading 26 left · Academic Writing 3 left, both Virgo)
// was always renewed on the first one (Reading). The renewal form now shows "Which package?" with each package (course · lessons left)
// when there is more than one for that teacher, and picks by itself the one whose course the upcoming classes use (Merlin → Writing).
// The choice goes with the save (row), and the database renews exactly that ACTIVE row (coe_renew_preview / coe_renew_db 2249).
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="d2249">.rp49{margin-top:8px;padding:10px 12px;border:1px solid #F0C9A8;background:#FFF8F1;border-radius:12px}.rp49 b{color:#2B2253}.rp49 .c{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.rp49 button{border:1px solid #E3E1EC;background:#fff;border-radius:999px;padding:7px 12px;font:600 13px Inter,sans-serif;color:#2B2253;cursor:pointer}.rp49 button.on{background:#2F6F77;border-color:#2F6F77;color:#fff}</style>
<script id="x2249">
(function(){
  if(window.__x2249) return; window.__x2249 = 1;
  window.RP_ROW = window.RP_ROW || {};
  const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const nice = c => String(c || 'Package').replace(/([a-z])([A-Z])/g, '$1 $2');
  window.rp2249Pick = (code, row, name, teacher, again) => { const K = String(code).toUpperCase(); RP_ROW[K] = String(row);
    Object.keys(RP_PRE).forEach(k => { if(k === K || k.indexOf(K + '|') === 0) delete RP_PRE[k]; });
    renPaidSheet(code, name, teacher, again); };
  window.rp2249 = (code, name, teacher, again, r) => { try{
    const K = String(code).toUpperCase(), tl = String(r.teacher || teacher || '').toLowerCase();
    const A = (r.alts || []).filter(a => !tl || String(a.teacher).toLowerCase() === tl); if(A.length < 2) return;
    if(!RP_ROW[K]){ const up = (RPS.cls || []).filter(c => !c.cancelled && new Date(c.start).getTime() > Date.now()).map(c => String(c.book || '') + ' ' + String(c.title || '')).join(' ').toLowerCase();
      const m = A.filter(a => a.course && up.indexOf(String(a.course).toLowerCase()) >= 0);
      if(m.length === 1 && String(m[0].row) !== String(r.row)){ rp2249Pick(code, m[0].row, name, teacher, again); return; } }
    const H = document.getElementById('rpH'); if(!H || H.parentNode.querySelector('.rp49')) return;
    H.insertAdjacentHTML('afterend', '<div class="rp49"><b>Which package?</b> <span class="small mute">' + E(r.name || name) + ' has ' + A.length + ' packages with Teacher ' + E(r.teacher || teacher) + '. The renewal goes on the one you pick.</span><div class="c">' +
      A.map(a => '<button type="button" class="' + (String(a.row) === String(r.row) ? 'on' : '') + '" onclick="rp2249Pick(\'' + E(code) + '\',' + (+a.row) + ',\'' + E(String(name)).replace(/'/g, '') + '\',\'' + E(String(teacher || '')).replace(/'/g, '') + '\',' + (again ? 'true' : 'false') + ')">' + E(nice(a.course)) + (a.left != null ? ' · ' + a.left + ' left' : '') + '</button>').join('') + '</div></div>');
  }catch(e){} };
})();
</script>
`;
lib(file, [
 ["function rpWarm(code, teacher){ const k = String(code).toUpperCase(), x = RP_PRE[k];",
  "function rpWarm(code, teacher){ const rw2249 = (window.RP_ROW || {})[String(code).toUpperCase()] || '', k = String(code).toUpperCase() + (rw2249 ? '|' + rw2249 : ''), x = RP_PRE[k];"],
 ["const g = api('mgmtRenewPaid', TOKEN, { code, teacher, dry: true, date: today })",
  "const g = rw2249 ? Promise.resolve({ ok: false, gerr: 1 }) : api('mgmtRenewPaid', TOKEN, { code, teacher, dry: true, date: today })"],
 ["d = window.pkcDb ? pkcDb('renew', { code, teacher, date: today }) : Promise.resolve(null);",
  "d = window.pkcDb ? pkcDb('renew', { code, teacher, date: today, row: rw2249 ? +rw2249 : undefined }) : Promise.resolve(null);"],
 ["partner: $('rpPa').value.trim(), invoice: $('rpI').value.trim() };",
  "partner: $('rpPa').value.trim(), invoice: $('rpI').value.trim(), row: (S.info && S.info.alts && S.info.alts.length > 1) ? String(S.info.row) : '' };"],
 ["const F = $('rpFoot'); if(F) F.textContent = 'Same as doing it by hand: a new SALES row · ACTIVE row ' + r.row",
  "if(window.rp2249) rp2249(code, name, teacher, again, r);\nconst F = $('rpFoot'); if(F) F.textContent = 'Same as doing it by hand: a new SALES row · ACTIVE row ' + r.row"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
