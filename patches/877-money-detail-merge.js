// 877: Sales & costs › Overview tab (Misty 25 Oct: Finance › Overview is the main summary; Sales & costs is the detailed analysis).
//      Display/layout only — every figure is the same variable as before (estNet, still, be, net12, yNow, one, exs, prs, cks).
// · "Expected net" tile now carries the remaining-salary explanation (net so far, actual · minus salaries still to pay, estimate);
//   the separate "Set aside about ₱… for the remaining salaries" item is folded into it.
// · "Break-even" tile is now "Break-even · monthly sales target": the average monthly costs, the rounded target and the losing months;
//   the separate "Keep monthly sales above ₱…" item is folded into it.
// · "What to do next" is split: "Checks to do" (someone acts: payments to link in ACTIVE, spending above usual to check) and
//   "Insights" (for information: one-off income, two sources give most sales).
// · Labels say Actual (recorded in MONEY) vs Estimate (worked out from averages), with date ranges: "1–25 Oct 2026", "Sep 2026 · full month".
// · "<Month> so far": the Sales / Costs / Net tiles that repeat Finance › Overview are folded (one tap to open); pace bar and notes stay.
// (generated: each pair is [exact text in app.html, replacement]; JSON strings)
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + "<style>/* 877 */ #v-money details.f877{margin:8px 0 4px} #v-money details.f877>summary{cursor:pointer;font-size:13px;color:#6F6C85;list-style:none;padding:4px 0} #v-money details.f877>summary::-webkit-details-marker{display:none} #v-money details.f877>summary::before{content:'› ';display:inline-block;transition:transform .15s} #v-money details.f877[open]>summary::before{transform:rotate(90deg)} #v-money details.f877>summary:focus-visible{outline:2px solid #01b0bf;outline-offset:2px;border-radius:4px}</style>\n" + s.slice(i); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["  const estNet = cur && cur.net != null ? cur.net - still : null;",
   "  const estNet = cur && cur.net != null ? cur.net - still : null;\n  const rng877 = '1–' + day + ' ' + now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });"],
  ["<h3>The picture</h3><span>the four answers first · tap a tile for the detail</span>",
   "<h3>The picture</h3><span>Actual = recorded in the MONEY tab · Estimate = worked out from averages · tap a tile for the detail</span>"],
  ["if(cur) h += t(estNet != null && estNet < 0 ? 't-bad' : ofP != null && ofP >= Math.round(day / dim * 100) ? 't-ok' : 't-g', mon(cur) + ' · expected net', '≈ ' + P(estNet != null ? estNet : cur.net), still ? `what ${esc(mon(cur))} should end with, after about ${P(still)} in salaries still to pay` : `${esc(mon(cur))}'s profit so far`, 'x73m', skCur);",
   "if(cur) h += t(estNet != null && estNet < 0 ? 't-bad' : ofP != null && ofP >= Math.round(day / dim * 100) ? 't-ok' : 't-g', mon(cur) + (still ? ' · expected net · estimate' : ' · net so far · actual'), (still ? '≈ ' : '') + P(estNet != null ? estNet : cur.net), still ? `Net so far ${P(cur.net)} (actual, ${esc(rng877)}) − about ${P(still)} in salaries${stillG ? ' and dues' : ''} still to pay (estimate, from the ${full.length}-month average) · set that aside` : `${esc(mon(cur))}'s profit so far (actual, ${esc(rng877)})`, 'x73m', skCur);"],
  ["h += t(net12 >= 0 ? 't-ok' : 't-bad', `Net · last ${full.length} months`,",
   "h += t(net12 >= 0 ? 't-ok' : 't-bad', `Net · last ${full.length} full months · actual`,"],
  ["`profit after the losing months · ${prof.length} up, ${loss.length} down`",
   "`${full.length ? esc(full[full.length - 1].m) + ' – ' + esc(full[0].m) + ' · ' : ''}profit after the losing months · ${prof.length} up, ${loss.length} down`"],
  ["if(be != null) h += t('t-w', 'Break-even', P(be) + '<small style=\"display:inline;font-size:13px;color:#6F6C85\"> / month</small>', `sales needed each month just to cover all costs`, 'x73c', skBe);",
   "if(be != null) h += t('t-w', 'Break-even · monthly sales target', P(be) + '<small style=\"display:inline;font-size:13px;color:#6F6C85\"> / month</small>', `average monthly costs over ${full.length} full months · keep sales above ${P(Math.ceil(be / 1000) * 1000)}${loss.length ? ` · ${loss.length} of the last ${full.length} months lost money (${esc(loss.map(m => mon(m)).join(', '))})${loss.every(m => (m.sales || 0) < be) ? ', each under this line' : ''}` : ''}`, 'x73c', skBe);"],
  ["if(yNow) h += t(yPrev && yNow.net >= yPrev.net ? 't-ok' : 't-s', yNow.y + ' net so far',",
   "if(yNow) h += t(yPrev && yNow.net >= yPrev.net ? 't-ok' : 't-s', yNow.y + ' net · to date · actual',"],
  ["const add = (c, ic, b, s, to) => A.push(`<div class=\"ac\" style=\"--c:${c}\" onclick=\"x73Go('${to}')\"><span class=\"ic\">${ic}</span><div class=\"w\"><b>${b}</b><span>${s}</span></div></div>`);",
   "const I877 = [], card877 = (c, ic, b, s, to) => `<div class=\"ac\" style=\"--c:${c}\" onclick=\"x73Go('${to}')\"><span class=\"ic\">${ic}</span><div class=\"w\"><b>${b}</b><span>${s}</span></div></div>`, add = (...a) => A.push(card877(...a)), info = (...a) => I877.push(card877(...a));"],
  ["if(one.length && be != null) add('#2F6FD0', '★',",
   "if(one.length && be != null) info('#2F6FD0', '★',"],
  ["  if(cur && still > 0) add('#6C5FC7', '₱',",
   "  /* 877: folded into the Expected net tile */ if(false && cur && still > 0) add('#6C5FC7', '₱',"],
  ["if(loss.length && be != null){ const under = loss.map(m => mon(m)); add('#C4553D', '↓',",
   "/* 877: folded into the Break-even · monthly sales target tile */ if(false && loss.length && be != null){ const under = loss.map(m => mon(m)); add('#C4553D', '↓',"],
  ["if(prs.length >= 3 && top2 >= 60) add('#2F6FD0', '◐',",
   "if(prs.length >= 3 && top2 >= 60) info('#2F6FD0', '◐',"],
  ["if(A.length) h += `<div class=\"cap\"><h3>What to do next</h3><span>worked out from the numbers · tap one to see why</span></div><div class=\"todo\">${A.slice(0, 8).join('')}</div>`;",
   "if(A.length) h += `<div class=\"cap\"><h3>Checks to do</h3><span>someone needs to act · worked out from the numbers · tap one to see why</span></div><div class=\"todo\">${A.slice(0, 8).join('')}</div>`;\n  if(I877.length) h += `<div class=\"cap\"><h3>Insights</h3><span>for information · nothing to fix</span></div><div class=\"todo\">${I877.join('')}</div>`;"],
  ["<span>day ${day} of ${dim} · ",
   "<span>${esc(rng877)} · actual · day ${day} of ${dim} · "],
  ["<div class=\"t3\"><div class=\"t-s\"><span>Sales</span>",
   "<details class=\"f877\"><summary>Sales, costs and net so far · actual · the same figures as Finance › Overview</summary><div class=\"t3\"><div class=\"t-s\"><span>Sales</span>"],
  ["(mg(cur) != null ? mg(cur) + '% margin' : '')}</small></div></div>",
   "(mg(cur) != null ? mg(cur) + '% margin' : '')}</small></div></div></details>"],
  ["ofP + '% of ' + esc(mon(p)) + ' (' + P(p.sales) + ')'",
   "ofP + '% of ' + esc(p.m) + ' · full month (' + P(p.sales) + ')'"],
  ["'about ' + P(estNet) + ' after the salaries to come'",
   "'estimate: about ' + P(estNet) + ' after the salaries to come'"]
]);
