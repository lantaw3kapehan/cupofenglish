/* 21 Oct · 511 · Final polish on phones (Misty: "Please final polish and redesign if needed"). Checked every teacher screen at
   phone width with Teacher Mayi's real data:
   · Growth was wider than the phone (the five peer scores did not fit), so the page slid sideways. The scores now fit in five
     narrow columns with smaller labels.
   · Growth "With us 2 years": on a phone the milestone names ran into each other (Senior Teacher / Today). On a phone the
     milestones now read as a short list with their dots; the line stays on a laptop.
   · Growth section chips: one row that scrolls sideways on a phone instead of three wrapped rows.
   · Student page tabs (Overview · Progress · Notes · Profile) fit on one phone row. */
(function(){
  const css = document.createElement('style'); css.textContent = `
@media(max-width:560px){
  #v-growth .jp510{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin-left:-2px;margin-right:-2px;padding:0 2px 2px}
  #v-growth .jp510::-webkit-scrollbar{display:none}
  #v-growth .jp510 a{flex:none}
  .pr-sc{gap:4px!important}
  .pr-sc>div,.pr-sc div{min-width:0;padding:7px 2px!important}
  .pr-sc b{font-size:15px!important}
  .pr-sc span{font-size:8.5px!important;letter-spacing:0!important;word-break:break-word;line-height:1.2;display:block}
  .pr-sc .b53{width:70%!important}
  .gj59 .ln{height:auto!important;margin:8px 0 0!important;display:flex;flex-direction:column;gap:2px}
  .gj59 .ln:before,.gj59 .ln:after{display:none!important}
  .gj59 .ms{position:static!important;transform:none!important;text-align:left!important;display:flex;align-items:center;gap:8px;white-space:normal;left:auto!important}
  .gj59 .ms i{margin:0!important;flex:none}
  .gj59 .ms span{margin-left:0!important}
  #sheetBody.stu2 .stu-tabs{gap:4px!important}
  #sheetBody.stu2 .stu-tabs button{padding:7px 10px!important;font-size:13px!important;gap:4px!important}
  #sheetBody.stu2 .stu-tabs button svg{width:14px;height:14px}
}`;
  document.head.appendChild(css);
})();
