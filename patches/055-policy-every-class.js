// Cancellation policy box (温馨提醒 · 2 hours before class) on every class picture: new classes, new students' schedules and
// rescheduled classes (before: only when a package schedule was attached). Not on trial classes or cancellations. Same for Copy as text.
require('../tools/lib.js')(process.argv[2], [
[
"if(cl && P.pkg && !cxTrial(e) && window.cxPol) rows.push(['__POL__']);",
"if((cl || mv) && !bl && !cxTrial(e) && window.cxPol) rows.push(['__POL__']);   /* every scheduled or rescheduled class (not trials, not cancellations) */"
],
[
"try{ const pol = (P.kind === 'bal' && P.renew) || (P.kind === 'class' && P.pkg && !cxTrial(P.e)); if(!pol) return '';",
"try{ const pol = (P.kind === 'bal' && P.renew) || ((P.kind === 'class' || P.kind === 'move') && !cxTrial(P.e)); if(!pol) return '';"
]
]);
