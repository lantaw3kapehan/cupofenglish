/* 20 Oct · 394 · Student page final polish (Misty: "still unsatisfied").
   · Line icons (one stroke style, same colour as the word) instead of emoji, which showed small and grey on the Mac.
   · Header facts as quiet grey chips: only the teacher is coloured; the status pill and the numbers carry the colour.
   · One action card: "Send to parent" (teal) and "Manage" (grey) side by side with a thin divider, wrapping on small screens.
   · Print / PDF moves from "Send to parent" to the end of "Manage" (it prints this page, nothing goes to the parent).
   · The Status box no longer repeats "Active" (it is beside the name). */
(function(){
  const P = { print: '<path d="M6 9V3h12v6"/><rect x="6" y="14" width="12" height="7" rx="1"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>',
    receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    bell: '<path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
    list: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
    chart: '<path d="M3 20h18"/><path d="M5 16l5-5 4 3 6-7"/>',
    pen: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>',
    sign: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 17c1.5-2 2.5-2 3 0s1.5 1 2.5-.5"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h3"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>' };
  const ic = k => '<svg class="lic" width="16" height="16" style="display:inline-block;width:16px;height:16px;flex:none;overflow:visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[k] + '</svg>';
  const BTN = [[/^Print/i, 'print'], [/Lessons left/i, 'receipt'], [/^Class notice/i, 'bell'], [/^Lesson summary/i, 'list'], [/^Progress report/i, 'chart'], [/^Edit details/i, 'pen'], [/^Agreement/i, 'sign'], [/^Change book/i, 'book'], [/^Teacher \/ schedule|^Change teacher/i, 'swap']];
  const TAB = [[/Overview/, 'home'], [/Progress/, 'chart'], [/Notes/, 'notes'], [/Profile/, 'user']];
  const css = document.createElement('style');
  css.textContent = `
#sheetBody.stu2 svg.lic{width:16px;height:16px;flex:none;vertical-align:-3px}
#sheetBody.stu2 .shero .chip{background:#F5F4F9!important;color:#4A4566!important;border:0!important;box-shadow:none!important;font-weight:600!important;font-size:12.5px!important;padding:5px 11px!important;border-radius:999px!important}
#sheetBody.stu2 .shero .chip.teal{color:#00737B!important;background:#EEF8F7!important}
#sheetBody.stu2 .shero .chip svg{opacity:.7}
#sheetBody.stu2 .shero h1 .cn{color:#6F6B85;font-weight:400}
#sheetBody.stu2 .shero .kpis>div span{color:#8A86A0}
.stu-bar{background:#fff;border:1px solid #EEEDF3;border-radius:18px;padding:6px;gap:0!important;margin:12px 0 4px!important;align-items:stretch!important}
.stu-bar .grp{border:0!important;background:transparent!important;border-radius:12px!important;padding:4px 8px!important;gap:6px!important}
.stu-bar{flex-direction:column}
.stu-bar .grp+.grp{border-top:1px solid #F0EFF5!important;border-radius:0!important;margin-top:4px;padding-top:8px!important}
.stu-bar .grp>span{min-width:118px}
.stu-bar .grp.g-send>span{color:#00737B!important}
.stu-bar .grp.g-send .btn{background:#F1FAF9!important;border-color:#D3EEEB!important}
.stu-bar .btn{display:inline-flex!important;align-items:center;gap:6px}
.stu-bar .btn .ic{display:none}
.stu-bar .btn svg.lic{width:15px;height:15px;opacity:.85}
.stu-tabs button{display:inline-flex;align-items:center;gap:6px}
.stu-tabs button .ti{display:none}
#sheetBody.stu2 .shwk .lb{display:inline-flex;align-items:center;gap:6px}
#sheetBody.stu2 .shwk .lb svg.lic{width:14px;height:14px}
#sheetBody.stu2 #stuStat h2 .chip{display:none}
@media(max-width:620px){.stu-bar .grp>span{min-width:0}}`;
  document.head.appendChild(css);
  function paint(){ const body = $('sheetBody'); if(!body || !body.classList.contains('stu2')) return;
    body.querySelectorAll('.stu-bar .btn').forEach(b => { if(b.querySelector('svg.lic')) return; const t = b.textContent.replace(/[^\w\/ ·]/g, '').trim(), hit = BTN.find(x => x[0].test(t)); if(!hit) return;
      const old = b.querySelector('svg:not(.lic)'); if(old) old.remove(); const e = b.querySelector('.ic'); if(e) e.remove(); b.insertAdjacentHTML('afterbegin', ic(hit[1])); });
    try{ const g = body.querySelectorAll('.stu-bar .grp'); const pr = [...body.querySelectorAll('.stu-bar .g-send .btn')].find(b => /Print/i.test(b.textContent)); if(pr && g[1]){ pr.title = 'Print or save this page as PDF'; g[1].appendChild(pr); } }catch(e){}
    body.querySelectorAll('.stu-tabs button').forEach(b => { if(b.querySelector('svg.lic')) return; const hit = TAB.find(x => x[0].test(b.textContent)); if(!hit) return; const e = b.querySelector('.ti'); if(e) e.remove(); b.insertAdjacentHTML('afterbegin', ic(hit[1])); });
  }
  try{ const sb = $('sheetBody'); let t = 0; if(sb) new MutationObserver(() => { clearTimeout(t); t = setTimeout(paint, 90); }).observe(sb, { childList: true, subtree: true }); }catch(e){}
  const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); setTimeout(paint, 120); return r; };
})();
