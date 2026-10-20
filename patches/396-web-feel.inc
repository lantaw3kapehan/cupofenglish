/* 20 Oct · 396 · (style and navigation only · no data, button or screen is removed) · Web feel on the laptop, every screen (Misty: "like a website in a laptop browser · no lagging · just by clicking,
   button after button").
   1. Browser Back / Forward work: every screen has its own address (#students, #schedule …); Back closes an open card first,
      then goes to the screen before. Reload keeps you on the same screen.
   2. Faster: no blur effects behind the header and cards (they made scrolling heavy on laptops).
   3. One look everywhere: section cards with the same thin line as the student page; filter buttons and tabs in one style; clickable rows show the hand and a light hover.
   4. Laptop sizes: content up to 1180 px wide; cards open as a wide, scrollable window (normal 600 px, wide 1060 px). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
header{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:rgba(251,250,247,.98)!important}
.scrim{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
section.sec{border-color:var(--line)}
.seg button{border:1px solid var(--line);background:#fff;color:var(--ink2)}
.seg button.on{background:var(--ink);border-color:var(--ink);color:#fff}
[onclick]:not(button):not(a):not(input):not(select):not(label){cursor:pointer}
.wrap .li[onclick]:hover,.wrap .tdr:hover,.wrap tr[onclick]:hover td,.wrap .cls[onclick]:hover{background:#F7F9FA}
:focus-visible{outline:2px solid var(--teal);outline-offset:2px}
*::-webkit-scrollbar{width:10px;height:10px}*::-webkit-scrollbar-thumb{background:#D9D7E3;border-radius:10px;border:3px solid transparent;background-clip:content-box}*::-webkit-scrollbar-thumb:hover{background:#BEBBCC;background-clip:content-box;border:3px solid transparent}
@media(min-width:900px){
  .sheet{width:600px;margin-left:-300px;max-height:90vh;overflow-y:auto;transition:opacity .12s,transform .12s,visibility .12s}
  .sheet.wide{width:min(1060px,94vw);margin-left:calc(min(1060px,94vw) / -2)}
  .btn,nav button,.seg button{transition:background .12s,color .12s,border-color .12s,box-shadow .12s}
}
@media(min-width:1280px){.wrap,.hd{max-width:1180px}}`;
  document.head.appendChild(css);

  /* ── 1. Back / Forward ── */
  let FROMPOP = 0, IGN = 0;
  const isView = v => typeof VIEWS !== 'undefined' && VIEWS.indexOf(v) > -1;
  const sheetOn = () => { const s = $('sheet'); return !!(s && s.classList.contains('on')); };
  const g0 = window.go;
  if(g0) window.go = function(v){ const was = VIEW; const r = g0.apply(this, arguments);
    try{ if(!FROMPOP && isView(v) && location.hash.slice(1) !== v) history.pushState({ v }, '', '#' + v); if(was !== v) window.scrollTo(0, 0); }catch(e){}
    return r; };
  const o0 = window.openSheet;
  if(o0) window.openSheet = function(){ const was = sheetOn(); const r = o0.apply(this, arguments);
    try{ if(!was && !(history.state && history.state.sh)) history.pushState({ v: VIEW, sh: 1 }, '', location.hash || ('#' + VIEW)); }catch(e){}
    return r; };
  const c0 = window.closeSheet;
  if(c0) window.closeSheet = function(){ const r = c0.apply(this, arguments);
    if(!FROMPOP) setTimeout(() => { try{ if(!sheetOn() && history.state && history.state.sh){ IGN = 1; history.back(); } }catch(e){} }, 80);
    return r; };
  window.addEventListener('popstate', () => {
    if(IGN){ IGN = 0; return; }
    if(sheetOn()){ FROMPOP = 1; try{ c0 ? window.closeSheet() : 0; }catch(e){} FROMPOP = 0; return; }
    const v = (location.hash || '').slice(1);
    if(isView(v) && v !== VIEW){ FROMPOP = 1; try{ window.go(v); }catch(e){} FROMPOP = 0; }
    try{ if(history.state && history.state.base) history.pushState({ v: VIEW }, '', '#' + VIEW); }catch(e){} });
  /* the first entry is a floor: Back there keeps you in the app (phones too) */
  try{ history.replaceState({ v: VIEW, base: 1 }, '', '#' + VIEW); history.pushState({ v: VIEW }, '', '#' + VIEW); }catch(e){}
  /* open the screen in the address on reload */
  setTimeout(() => { try{ const v = (location.hash || '').slice(1);
    if(isView(v) && v !== VIEW && D && $('v-' + v)){ FROMPOP = 1; window.go(v); FROMPOP = 0; } }catch(e){} }, 1500);
})();
