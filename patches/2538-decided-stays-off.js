// 2538 (Misty 17:39 "I already clicked Waive, but it's still here · check all similar buttons"):
//   Lates: a decided late (Waive / Excused / Unexcused / system issue) is remembered on the device for 36 h, so an older saved copy of
//   the Overview that arrives afterwards cannot put it back on screen.
//   Wi-Fi: "Decision written ✓" takes the item off at once; "warn the teacher", "Allow" and "confirmed" refresh the Fix list straight away
//   (they called a refresh that no longer existed, so the item stayed until the 5-minute reload).
const file = process.argv[2];
const inc = `<script id="b2538">
(function(){ const K = 'coe.dec2538';
  const get = () => { try{ const o = JSON.parse(localStorage.getItem(K) || '{}'), n = Date.now(); for(const k in o) if(o[k] < n) delete o[k]; return o; }catch(e){ return {}; } };
  window.dec2538 = { add: k => { try{ const o = get(); o[k] = Date.now() + 36 * 36e5; localStorage.setItem(K, JSON.stringify(o)); }catch(e){} }, has: k => !!get()[k],
    late: row => 'late:' + Math.floor(+row / 1000) };
  if(!window.o2091load) window.o2091load = function(){ try{ if(window.fx2214Load) window.fx2214Load(); }catch(e){} };
})();
</script>
`;
require('../tools/lib.js')(file, [
  ["try{ const r = await api('decideLate', TOKEN, row, cond); if(!r.ok) throw r;",
   "try{ const r = await api('decideLate', TOKEN, row, cond); if(!r.ok) throw r; try{ dec2538.add(dec2538.late(row)); }catch(e){}"],
  ["const L = (MO.late || []).filter(x => !(+x.row > 1e9 && Date.now() - +x.row > 36 * 36e5))",
   "if(window.dec2538 && MO.late && MO.late.some(x => dec2538.has(dec2538.late(x.row)))) MO.late = MO.late.filter(x => !dec2538.has(dec2538.late(x.row))); const L = (MO.late || []).filter(x => !(+x.row > 1e9 && Date.now() - +x.row > 36 * 36e5))"],
  ["if(!r || !r.ok) throw 0; say('✓ Off the list');",
   "if(!r || !r.ok) throw 0; try{ const F = window.FX2214; if(F && F.items) F.items = F.items.filter(y => !(y.kind === 'wifi5' && +y.id === +id)); const it = btn && btn.closest('.o91-it'); if(it) it.remove(); }catch(e){} say('✓ Off the list');"],
  ["say(r && r.ok ? '✓ Teacher ' + teacher + ' can tap I’m in' : 'Not saved · try again'); };",
   "say(r && r.ok ? '✓ Teacher ' + teacher + ' can tap I’m in' : 'Not saved · try again'); try{ if(r && r.ok && window.o2091load) o2091load(true); }catch(e){} };"],
  ["say('Opening the Wi-Fi case');",
   "say('Opening the Wi-Fi case'); try{ if(window.o2091load) o2091load(true); }catch(e){}"],
  ["if(kind === 'timein' && typeof MO !== 'undefined' && MO && MO.late){ const t = ms(x.at);",
   "if(kind === 'timein' && typeof MO !== 'undefined' && MO && MO.late){ const t = ms(x.at); try{ MO.late.filter(l => Math.abs(+l.row - t) < 1000).forEach(l => dec2538.add(dec2538.late(l.row))); }catch(e){}"],
  ['<script id="b2278">', inc + '<script id="b2278">']
]);
