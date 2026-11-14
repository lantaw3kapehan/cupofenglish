// 2230 (14 Nov · Misty: "our students maintain their previous schedule after renewal … mostly, they maintain it"): right after
// Renewed · paid, the first button is "Keep the same schedule · book the next classes". It opens Book the rest already filled in:
// same days, times, teacher, book and class length, starting the day after the last booked class, as many classes as the new
// lessons allow. Check the preview, press Save. Safety net: To do › Renewals lists anyone renewed in the last 45 days whose booked
// classes run out within 2 weeks while lessons are left (coe_ops_check kind rebook). Check the preview, press Save. Changing days or times is done in the same form; the renewal picture stays below.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 '<button class="btn teal block" style="margin-top:14px" onclick="cxBalance(null,\'${esc(S.code)}\')">Renewal picture for the parent · 续费成功</button>',
 '<button class="btn teal block" style="margin-top:14px" onclick="window.__rn2230={c:\'${esc(S.code)}\',l:${+r.balance || 0},t:Date.now()};rnBook(\'${esc(S.code)}\')">Keep the same schedule · book the next classes</button><div class="small mute" style="margin:6px 2px 0">Same days, times and teacher from the day after the last booked class, as many classes as the new lessons allow. To change, cancel or add, edit the days and times in the same form before saving.</div>\n<button class="btn ghost block" style="margin-top:10px" onclick="cxBalance(null,\'${esc(S.code)}\')">Renewal picture for the parent · 续费成功</button>'],
 ["  const s = classStu(); if(!s || s.left == null || s.shared) return null;\n  const now = Date.now(), L = (CLSM && CLSM[s.code]) || [];",
  "  const s = classStu(); const o2230 = window.__rn2230, nl = o2230 && s && String(o2230.c).toUpperCase() === String(s.code).toUpperCase() && Date.now() - o2230.t < 30 * 6e4 ? o2230.l : null;   /* 2230: the new balance right after a renewal */\n  if(!s || (s.left == null && nl == null) || s.shared) return null; if(nl != null) s.left = nl;\n  const now = Date.now(), L = (CLSM && CLSM[s.code]) || [];"],
 ["['renew', 'Renewals', 'Remind or follow up in WeChat today.', k => k === 'renew']", "['renew', 'Renewals', 'Remind, follow up, or book the next classes.', k => k === 'renew' || k === 'rebook']"],
 ["k => !/^(wifi|wifi5|shot|renew|risk|riskp|tfu|tagain)$/.test(k)]", "k => !/^(wifi|wifi5|shot|renew|rebook|risk|riskp|tfu|tagain)$/.test(k)]"],
 ["if(x.kind === 'renew' || x.kind === 'risk'){ var cd2163", "if(x.kind === 'renew' || x.kind === 'risk' || x.kind === 'rebook'){ var cd2163"],
 ["x.kind === 'riskp' ? 'End the break' :", "x.kind === 'rebook' ? 'Booked / schedule changed ✓' : x.kind === 'riskp' ? 'End the break' :"]]);
