// 2214 (14 Nov · Misty: "it looks like this" + "students at risk: an option when parents asked for long cancellations, like Iris or Daisy").
// To do › Fix these: (1) the "Meeting ID missing" item is a short title and a compact list (date, student, teacher, classes) instead of
// one long paragraph; (2) Students at risk gets "Parent asked for a break": pick an until date, the student is left out of the at-risk
// list until then and shows as "On a break" with "End the break". Saved in coe_ops_ok as risk:<code>:pause:<date> (coe_ops_check reads it).
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="css2214">
.o91-it.k-riskp{opacity:.85}.o91-it.k-riskp .fx-ch span{background:#F4F2FD;color:#45399E}
.mt14 .sub{font-size:13.5px;color:#5E5A72;margin:2px 0 8px}
.mt14 .rw{display:grid;grid-template-columns:86px minmax(0,1fr) 92px 64px;gap:8px;align-items:center;padding:6px 0;border-top:1px solid #F1F0F6;font-size:14px;color:#2B2253}
.mt14 .rw .d{color:#6F6B85;font-variant-numeric:tabular-nums}.mt14 .rw .c{font-size:12px;color:#8A86A0;margin-left:6px}.mt14 .rw .n{text-align:right;color:#6F6B85;font-size:13px}
.mt14 details summary{cursor:pointer;color:#00737B;font-weight:600;font-size:13.5px;padding:6px 0;list-style:none}.mt14 details summary::-webkit-details-marker{display:none}
.mt14 details[open] summary{display:none}
@media (max-width:560px){.mt14 .rw{grid-template-columns:70px minmax(0,1fr) 70px}.mt14 .rw .n{display:none}}
.rp14 .ch{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.rp14 .ch button{border:1px solid #E3E1EC;background:#fff;border-radius:999px;padding:7px 14px;font:inherit;font-size:14px;cursor:pointer;color:#2B2253}
.rp14 .ch button.on{background:#EEF8F9;border-color:#00A6A6;color:#00737B;font-weight:600}
.rp14 input[type=date]{min-height:42px;border:1px solid #E3E1EC;border-radius:10px;padding:6px 10px;font:inherit;font-size:15px;color:#2B2253}
</style>
<script id="x2214">
(function(){
  if(window.__x2214) return; window.__x2214 = 1;
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const DL = d => { const t = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(t) ? String(d || '') : t.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
  const row = r => '<div class="rw"><span class="d">' + E(DL(r.d)) + '</span><span><b>' + E(r.s || r.code) + '</b><span class="c">' + E(r.code) + '</span></span><span>' + E(r.t ? 'Teacher ' + r.t : '') + '</span><span class="n">' + (+r.n || 1) + ' class' + (+r.n === 1 ? '' : 'es') + '</span></div>';
  const h0 = window.fx2176Head;
  window.fx2176Head = function(x){
    try{
      if(x && x.kind === 'meet' && Array.isArray(x.list)){ const L = x.list, n = L.length;
        return '<div class="o91-tx mt14"><div class="fx-hd"><span class="fx-nm">Meeting ID missing</span><span class="fx-tag">' + n + ' student' + (n === 1 ? '' : 's') + '</span></div>' +
          '<div class="sub">Classes in the next 7 days with no Tencent Meeting ID. Add it on the class in Schedule; until then the teacher\'s evening email shows a blank.</div>' +
          L.slice(0, 6).map(row).join('') + (n > 6 ? '<details><summary>Show all ' + n + '</summary>' + L.slice(6).map(row).join('') + '</details>' : '') + '</div>'; }
    }catch(e){}
    return h0 ? h0(x) : '<div class="o91-tx">' + E(x && x.text) + '</div>';
  };
  const OPS = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-ops';
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const plus = n => { const d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
  window.rp2214 = function(i){
    const x = ((window.FX2214 || {}).items || [])[i]; if(!x) return;
    const nm = (String(x.text || '').match(/^At risk · (.+?) \(ST-/) || [])[1] || x.code;
    window.__rp2214 = x;
    openSheet('<div class="rp14"><h1>Parent asked for a break</h1><p class="small">' + E(nm) + ' (' + E(x.code) + ') stays off Students at risk until the date you pick. If the student is still at risk after that, it comes back here.</p>' +
      '<div class="ch">' + [['2 weeks', 14], ['1 month', 30], ['2 months', 61], ['3 months', 92]].map(([l, n]) => '<button type="button" data-d="' + plus(n) + '" onclick="rp2214Pick(this)">' + l + '</button>').join('') + '</div>' +
      '<label class="small" style="display:block;margin-bottom:4px">On a break until</label><input type="date" id="rp14d" min="' + plus(1) + '" value="' + plus(30) + '">' +
      '<div style="margin-top:14px;display:flex;gap:8px"><button type="button" class="btn" id="rp14s" onclick="rp2214Save()">Save the break</button><button type="button" class="btn ghost" onclick="closeSheet()">Cancel</button></div><div class="small" id="rp14m" style="margin-top:8px"></div></div>');
  };
  window.rp2214Pick = function(b){ const d = document.getElementById('rp14d'); if(d) d.value = b.dataset.d; b.parentNode.querySelectorAll('button').forEach(y => y.classList.toggle('on', y === b)); };
  window.rp2214Save = async function(){
    const x = window.__rp2214, d = document.getElementById('rp14d'), m = document.getElementById('rp14m'), s = document.getElementById('rp14s'); if(!x || !d) return;
    const v = d.value; if(!/^\d{4}-\d{2}-\d{2}$/.test(v) || v <= plus(0)){ m.style.color = '#AE4D41'; m.textContent = 'Pick a date after today.'; return; }
    s.disabled = true; m.style.color = ''; m.textContent = 'Saving…';
    try{ const r = await fetch(OPS, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'ok', ref: 'risk:' + String(x.code).toUpperCase() + ':pause:' + v }) }).then(y => y.json());
      if(!r || !r.ok) throw new Error((r && r.error) || 'not saved');
      const F = window.FX2214; if(F && F.items) F.items = F.items.filter(y => y.ref !== x.ref);
      try{ closeSheet(); }catch(e){} try{ toast('✓ On a break until ' + DL(v) + '. Not counted as at risk until then.'); }catch(e){}
      try{ window.fx2214Load(); }catch(e){} }
    catch(e){ s.disabled = false; m.style.color = '#AE4D41'; m.textContent = 'Not saved: ' + (e.message || e) + '. Try again.'; }
  };
})();
</script>
`;
lib(file, [
 ["var FX = { items: null, at: 0, weeks: null, busy: 0 };", "var FX = { items: null, at: 0, weeks: null, busy: 0 }; window.FX2214 = FX; window.fx2214Load = function(){ FX.at = 0; loadFix(true); };"],
 ["(it.length ? ' <span class=\"fx-cnt\">' + it.length + '</span>' : '')", "(it.filter(function(y){ return y.kind !== 'riskp'; }).length ? ' <span class=\"fx-cnt\">' + it.filter(function(y){ return y.kind !== 'riskp'; }).length + '</span>' : '')"],
 ["onclick=\"rk2176(this)\">Copy message</button>' : '') +", "onclick=\"rk2176(this)\">Copy message</button><button type=\"button\" onclick=\"rp2214(' + i + ')\">Parent asked for a break</button>' : '') +"],
 ["x.kind === 'risk' ? 'Messaged ✓'", "x.kind === 'riskp' ? 'End the break' : x.kind === 'risk' ? 'Messaged ✓'"],
 ["x.kind === 'risk' ? '✓ Noted.", "x.kind === 'riskp' ? '✓ Break ended. The student is checked again at the next update.' : x.kind === 'risk' ? '✓ Noted."],
 ["k => k === 'risk']", "k => k === 'risk' || k === 'riskp']"],
 ["k => !/^(wifi|wifi5|shot|renew|risk|tfu|tagain)$/.test(k)]", "k => !/^(wifi|wifi5|shot|renew|risk|riskp|tfu|tagain)$/.test(k)]"],
 ["m = t.match(/^(Renewal|At risk|Trial follow-up overdue|Try again) · ", "m = t.match(/^(Renewal|At risk|On a break|Trial follow-up overdue|Try again) · "],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
