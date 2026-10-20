/* 20 Oct · 395 · Student page uses the same boxes and colours as every other screen (Misty: "boxes and colours aligned with other screens").
   Boxes: white, 1px var(--line), radius var(--r-lg), shadow var(--sh1) — the standard section card. Inner boxes: var(--soft) with
   var(--r-md). Colours: the app's own tokens — ink (navy), teal, tint, soft — plus amber and coral only for "soon" and "act now". */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#sheetBody.stu2{--ok:var(--teal);--okT:var(--tint);--soon:#B7791F;--soonT:#FDF4E3;--now:#C0533D;--nowT:#FBECE8}
#sheetBody.stu2 .shero,#sheetBody.stu2 section.sec,#sheetBody.stu2 #stuRn,.stu-bar{background:#fff!important;border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)!important}
#sheetBody.stu2 section.sec{margin-top:14px}
#sheetBody.stu2 .shero{padding:18px 20px}
#sheetBody.stu2 .kpis>div{background:var(--soft)!important;border:0!important;box-shadow:none!important;border-radius:var(--r-md)!important}
#sheetBody.stu2 .kpis>div b{color:var(--ink)}
#sheetBody.stu2 .kpis>div.k-ok b{color:var(--teal)}
#sheetBody.stu2 .kpis>div.k-soon{background:var(--soonT)!important} #sheetBody.stu2 .kpis>div.k-now{background:var(--nowT)!important}
#sheetBody.stu2 .stats .stat{background:var(--soft)!important;border:0!important;border-radius:var(--r-md)!important}
#sheetBody.stu2 .shero .chip{background:var(--soft)!important;color:var(--ink2)!important}
#sheetBody.stu2 .shero .chip.teal{background:var(--tint)!important;color:var(--teal)!important}
#sheetBody.stu2 .stp.ok{background:var(--tint);color:var(--teal)}
#sheetBody.stu2 .shwk{border-top-color:var(--line)}
#sheetBody.stu2 .shwk .sl{background:var(--ink)}
#sheetBody.stu2 .shwk .nx{color:var(--teal)}
.stu-bar .grp.g-send>span{color:var(--teal)!important}
.stu-bar .grp.g-send .btn{background:var(--tint)!important;border-color:transparent!important;color:#00737B!important}
.stu-bar .grp.g-send .btn:hover{background:var(--teal)!important;color:#fff!important}
.stu-bar .btn{border-color:var(--line)!important;color:var(--ink)!important}
.stu-bar .grp+.grp{border-top-color:var(--line)!important}
.stu-tabs{background:transparent;backdrop-filter:none;border-bottom:0;gap:6px;padding:6px 0;margin:12px 0 4px!important}
.stu-tabs button{background:#fff;border:1px solid var(--line);color:var(--ink2);font-size:14px;padding:7px 14px}
.stu-tabs button.on{background:var(--ink);border-color:var(--ink);color:#fff;box-shadow:0 4px 12px rgba(45,42,74,.2)}
#sheetBody.stu2 .tl4 .tl4-card{border-color:var(--line)}
#sheetBody.stu2 .cls.nx{background:var(--tint)}
#sheetBody.stu2 .nxb{background:var(--teal)}`;
  document.head.appendChild(css);
})();
