// 20 Oct · Teachers polish: one-line rows, units inline, calmer teacher details card.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 442 · Misty: "polish it more" (Teachers). Style only, nothing removed.
   · Rows: about half as tall; "80 units" reads on one line; the rank line and stats are smaller and calmer.
   · Bottom "TEACHERS · live from the sheet" becomes "Teacher details" in one white card: the six numbers sit in one row of small tiles
     (no coloured tops), the sign-in email row is slimmer, Print / PDF sits on the title line. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
body #v-teachers .tc2{padding:7px 20px!important;column-gap:16px!important}
body #v-teachers .tc2-nm b{font-size:15px!important}
body #v-teachers .tc2-rk{font-size:12.5px!important;margin-top:0!important}
body #v-teachers .tc2-f{font-size:12.5px!important}
body #v-teachers .tc2-u{display:flex!important;align-items:baseline;justify-content:flex-end;gap:4px}
body #v-teachers .tc2 .tc2-u b{display:inline!important;font-size:20px!important;line-height:1.2!important}
body #v-teachers .tc2-u span{font-size:11px!important;text-transform:lowercase!important;letter-spacing:0!important}
body #v-teachers .tc2-line .pg{height:6px!important}
#v-teachers h2.td42{margin-top:26px!important}
#v-teachers #ttBody>.card{padding:14px 16px!important;border-radius:var(--r-lg)!important}
#v-teachers #ttBody>.card .stats{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px!important;margin-top:10px!important}
#v-teachers #ttBody>.card .stats+.stats{margin-top:8px!important}
#v-teachers #ttBody>.card .stat{padding:8px 12px!important;min-height:0!important;border-radius:12px!important;box-shadow:none!important;border:0!important;background:var(--soft)!important}
#v-teachers #ttBody>.card .stat:before,#v-teachers #ttBody>.card .stat:after{display:none!important}
#v-teachers #ttBody>.card .stat b{font-size:20px!important}
#v-teachers #ttBody>.card .stat span{font-size:12px!important}
#v-teachers #ttBody>.card input{padding-top:8px!important;padding-bottom:8px!important}
@media(min-width:1000px){#v-teachers #ttBody>.card .stats{grid-template-columns:repeat(3,minmax(0,1fr))}#v-teachers #ttBody>.card .s42{display:grid;grid-template-columns:1fr 1fr;gap:8px}#v-teachers #ttBody>.card .s42>.stats{margin:0!important}}\`;
  document.head.appendChild(css);
  function tidy(){ const v = document.getElementById('v-teachers'); if(!v) return;
    const h = [...v.querySelectorAll('h2')].find(x => /^\\s*TEACHERS/i.test(x.textContent) && /live from the sheet/i.test(x.textContent));
    if(h && !h.classList.contains('td42')){ h.classList.add('td42'); const t = [...h.childNodes].find(n => n.nodeType === 3 && /TEACHERS/i.test(n.nodeValue)); if(t) t.nodeValue = t.nodeValue.replace(/TEACHERS/i, 'Teacher details '); const c = h.querySelector('.c'); if(c) c.textContent = 'pick a teacher · live from the TEACHERS sheet'; }
    const card = v.querySelector('#ttBody>.card'); if(card && !card.querySelector('.s42')){ const S = [...card.querySelectorAll(':scope > .stats')]; if(S.length === 2){ const w = document.createElement('div'); w.className = 's42'; S[0].before(w); w.appendChild(S[0]); w.appendChild(S[1]); } } }
  ['renderTeachers', 'loadTT'].forEach(f => { const o = window[f]; if(typeof o === 'function') window[f] = function(){ const r = o.apply(this, arguments); try{ tidy(); }catch(e){} Promise.resolve(r).then(() => { try{ tidy(); }catch(e){} }); return r; }; });
  try{ tidy(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
