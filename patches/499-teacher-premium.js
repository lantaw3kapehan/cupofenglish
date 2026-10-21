// 21 Oct · Teacher access, premium web feel: frosted header, soft canvas, one card style with gentle lift, refined buttons and focus, calm nav. Style only.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 21 Oct · 499 · Misty: "make it like a web premium feel for teacher's access". Style only, teachers only (management unchanged).
   · Canvas: a soft cool-white background so white cards float; header frosted glass that stays on top while scrolling.
   · One card language: 18 px corners, a hairline border, a soft two-layer shadow, a gentle lift on hover (laptop).
   · Buttons: pill shape, dark primary with a quiet gradient, press feedback, a clear teal focus ring for keyboard users.
   · Type: tighter, larger page titles; calm section titles; tabular numbers for times and counts.
   · Sidebar: the open page as a soft teal pill; thin quiet scrollbars; teal text selection. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
body:not(.mgr){background:radial-gradient(1200px 600px at 85% -10%,#EEF7F8 0,transparent 60%),radial-gradient(900px 500px at -10% 20%,#F4F2FB 0,transparent 55%),#FAFAFC!important}
body:not(.mgr) header{background:rgba(255,255,255,.72)!important;backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);border-bottom:1px solid rgba(43,34,83,.06)!important;box-shadow:0 1px 0 rgba(255,255,255,.6) inset,0 8px 24px -18px rgba(43,34,83,.25)!important}
body:not(.mgr) main h1{letter-spacing:-.4px!important}
body:not(.mgr) .num,body:not(.mgr) .cls .t b,body:not(.mgr) .wk94 b{font-variant-numeric:tabular-nums}
body:not(.mgr) .card,body:not(.mgr) section.sec,body:not(.mgr) .yd92,body:not(.mgr) .ps92,body:not(.mgr) .tin,body:not(.mgr) .wk94 a,body:not(.mgr) #v-today .cls{border-radius:18px!important;border:1px solid rgba(43,34,83,.07)!important;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -16px rgba(43,34,83,.16)!important;transition:box-shadow .2s ease,transform .2s ease,background .2s ease}
body:not(.mgr) #v-today .cls{background:#fff;padding:14px 14px!important;margin-bottom:10px;border-bottom:1px solid rgba(43,34,83,.07)!important}
body:not(.mgr) #v-today .cls.now{background:linear-gradient(90deg,#EAF7F7,#fff 70%)!important;box-shadow:0 0 0 1.5px rgba(0,163,173,.35),0 12px 30px -16px rgba(0,163,173,.35)!important}
@media(hover:hover){
  body:not(.mgr) .card:hover,body:not(.mgr) #v-today .cls:hover,body:not(.mgr) .wk94 a:hover,body:not(.mgr) .yd92:hover{transform:translateY(-1px);box-shadow:0 2px 4px rgba(43,34,83,.05),0 16px 36px -18px rgba(43,34,83,.24)!important}
}
body:not(.mgr) .btn{border-radius:999px!important;font-weight:600;transition:transform .12s ease,box-shadow .2s ease,background .2s ease,filter .2s ease}
body:not(.mgr) .btn:active{transform:scale(.97)}
body:not(.mgr) .btn:not(.ghost):not(.teal):not(.coral){background:linear-gradient(180deg,#3A2F6B,#2B2253)!important;box-shadow:0 6px 16px -8px rgba(43,34,83,.6)!important}
body:not(.mgr) .btn.teal{background:linear-gradient(180deg,#10B1B9,#00939D)!important;box-shadow:0 6px 16px -8px rgba(0,147,157,.65)!important}
body:not(.mgr) .btn.ghost{background:#fff!important;border:1px solid rgba(43,34,83,.1)!important;box-shadow:0 1px 2px rgba(43,34,83,.04)!important}
body:not(.mgr) .btn.ghost:hover{border-color:rgba(0,147,157,.45)!important}
body:not(.mgr) :focus-visible{outline:2.5px solid #00A3AD!important;outline-offset:2px;border-radius:10px}
body:not(.mgr) .chip{border-radius:999px}
body:not(.mgr) main h2{letter-spacing:.1px}
@media(min-width:900px){
  body:not(.mgr) nav{background:rgba(255,255,255,.78)!important;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-right:1px solid rgba(43,34,83,.06)!important}
  body:not(.mgr) nav button{border-radius:12px;transition:background .15s ease,color .15s ease}
  body:not(.mgr) nav button:hover{background:rgba(0,163,173,.06)}
  body:not(.mgr) nav button.on{background:linear-gradient(90deg,rgba(0,163,173,.12),rgba(0,163,173,.04))!important;color:#00737B!important;font-weight:700}
  body:not(.mgr) nav button.on::before{display:none!important}
}
body:not(.mgr) ::selection{background:rgba(0,163,173,.2)}
body:not(.mgr) *{scrollbar-width:thin;scrollbar-color:rgba(43,34,83,.18) transparent}
body:not(.mgr) ::-webkit-scrollbar{width:8px;height:8px} body:not(.mgr) ::-webkit-scrollbar-thumb{background:rgba(43,34,83,.16);border-radius:8px} body:not(.mgr) ::-webkit-scrollbar-track{background:transparent}
@media(prefers-reduced-motion:reduce){ body:not(.mgr) *{transition:none!important} }\`;
  document.head.appendChild(css);
  /* Settle before showing (Misty: "I refresh … the screen adjusts, it doesn't settle right away"): on opening, Today is drawn, then
     finished (day strip, pills, week strip, two columns) and redrawn as fresh data arrives. The first time it opens, the screen now
     stays hidden until the drawing has been quiet for 0.35 s (at most 1.6 s), then fades in once, already in its final place. */
  let settled = false, quiet = 0, t0 = 0;
  const show = () => { if(settled) return; settled = true; clearTimeout(quiet); const v = document.getElementById('v-today'); if(v){ v.style.transition = 'opacity .2s ease'; v.style.opacity = ''; } };
  const _rt = window.renderToday;
  if(_rt) window.renderToday = renderToday = function(){ const teacher = typeof D !== 'undefined' && D && !D.mgr, v = document.getElementById('v-today');
    if(teacher && !settled && v){ if(!t0){ t0 = Date.now(); v.style.transition = 'none'; v.style.opacity = '0'; setTimeout(show, 1600); } clearTimeout(quiet); quiet = setTimeout(show, 350); }
    return _rt.apply(this, arguments); };
})();
` + "</script>\n\n</body>"]]);
