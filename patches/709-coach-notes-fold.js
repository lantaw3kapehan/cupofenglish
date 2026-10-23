// 709: (QA) Coaching notes fold under "Read notes" so the Trainings side column stays short; first line shows as a preview.
require('../tools/lib.js')(process.argv[2], [
["(x.notes ? '<div class=\"small\" style=\"margin-top:4px;white-space:pre-line\">' + e(x.notes) + '</div>' : '')",
 "(x.notes ? '<details class=\"tx-cn\"><summary><span>' + e(String(x.notes).split(/\\n/)[0].slice(0, 90)) + '</span><b>Read notes</b></summary><div class=\"small\" style=\"white-space:pre-line;margin-top:6px\">' + e(x.notes) + '</div></details>' : '')"],
[".tx-all{", ".tx-cn{margin-top:4px}.tx-cn summary{list-style:none;cursor:pointer;font-size:12.5px;color:var(--ink2,#5E5A75)}.tx-cn summary::-webkit-details-marker{display:none}.tx-cn summary span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.tx-cn summary b{color:#00737B;font-size:12px}.tx-cn[open] summary span{display:none}\n.tx-all{"],
]);
