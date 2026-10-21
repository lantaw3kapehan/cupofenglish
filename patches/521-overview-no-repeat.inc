/* 21 Oct · 521 · Management Overview without repeats (Misty: "since it's repetitive … final polish"; "this feels wordy"; "remove repetitive
   information and redundancy in Management screens").
   · "Month at a glance" sentence removed: every part of it is already on the page (October net and sales → Business tiles;
     September profit → Business tiles; packages healthy → Packages; QA average → Performance; trials → Trials).
   · The greeting's sentence ("40 classes today. 11 teachers teaching …") removed: the three tiles beside it say the same.
   · "Today, teacher by teacher": the counts row (live now · still to go · done · cancelled · next) removed — the Classes and Next
     tiles at the top say it; "Show 2 cancelled" stays on the switch.
   · Business and "Today, teacher by teacher" are stacked full width (the left column had empty space under Business and the
     lanes were squeezed into a narrow right column).
   · The teacher-by-teacher lanes fit the card (the rest of the day at a glance) instead of a narrow window that scrolled sideways
     and looked empty. Nothing removed from the data; each number now appears once. */
(function(){
  const css = document.createElement('style'); css.textContent = `
body.mgr .ovc .x-glance{display:none!important}
body.mgr #v-home .x-top p{display:none!important}
body.mgr #v-home .ovt-sum{display:none!important}
body.mgr #v-home .ov-tl{--lw:150px!important;min-width:calc(var(--lw) + var(--h) * 58px)!important}
body.mgr #v-home .ov-lane .ov-ln b{font-size:13.5px}
body.mgr #v-home .ov-b{font-size:11px}
body.mgr #v-home .ov-two{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:14px!important}
body.mgr #v-home .ov-two>section{width:auto!important;max-width:none!important}
body.mgr #v-home .ov-two .x-pay{max-width:520px}`;
  document.head.appendChild(css);
})();
