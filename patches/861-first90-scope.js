// 861: (audit #11) "New teachers · first 90 days" listed teachers at day 98, with "hired in the last 120 days" underneath.
//  The database (coe_first90) returns every active teacher hired in the last 120 days; the checklist is the "first 90 days" one.
//  Behaviour kept (still 120 days, same 11 steps). The card now says so and splits the list:
//   · "Day 0–90" (inside the first 90 days)
//   · "Past day 90 · steps still open" (coral, open by default, so overdue steps stay visible)
//   · "Past day 90 · all steps done"
//  Teacher · My growth: "My first 90 days" past day 90 says "past day 90 · n steps still open".
require('../tools/lib.js')(process.argv[2], [
  ["p.innerHTML = `<details open><summary><b>🌱 New teachers · first 90 days</b> <span class=\"small mute\">· hired in the last 120 days</span></summary>${F9.map(x => `<details style=\"margin-top:8px;border-top:1px solid var(--line);padding-top:6px\"><summary class=\"small\"><b>${esc(x.name)}</b> · day ${x.days} · ${bar(x.done, x.total)} ${x.done} of ${x.total} <span class=\"mute\">· still open: ${esc(x.items.filter(i => !i.done).map(i => i.label.split(' (')[0]).slice(0, 3).join(', '))}${x.items.filter(i => !i.done).length > 3 ? '…' : ''}</span></summary>${itemsH(x)}</details>`).join('')}</details>`; } } }",
   "const one = x => `<details style=\"margin-top:8px;border-top:1px solid var(--line);padding-top:6px\"><summary class=\"small\"><b>${esc(x.name)}</b> · day ${x.days} · ${bar(x.done, x.total)} ${x.done} of ${x.total}${x.done < x.total ? ` <span class=\"mute\">· still open: ${esc(x.items.filter(i => !i.done).map(i => i.label.split(' (')[0]).slice(0, 3).join(', '))}${x.items.filter(i => !i.done).length > 3 ? '…' : ''}</span>` : ' <span class=\"mute\">· all done</span>'}</summary>${itemsH(x)}</details>`;\n"
   + "      const A = F9.filter(x => +x.days <= 90), B = F9.filter(x => +x.days > 90 && x.done < x.total), C = F9.filter(x => +x.days > 90 && x.done >= x.total);\n"
   + "      const grp = (L, t, c) => L.length ? `<div class=\"small\" style=\"margin-top:12px;font-weight:700;letter-spacing:.04em;color:${c || '#55526E'}\">${t} · ${L.length}</div>${L.map(one).join('')}` : '';\n"
   + "      p.innerHTML = `<details open><summary><b>🌱 New teachers · first 90 days checklist</b> <span class=\"small mute\">· ${A.length} in their first 90 days${B.length ? ' · ' + B.length + ' past day 90 with steps still open' : ''} · listed until day 120</span></summary>`\n"
   + "        + grp(A, 'Day 0–90') + grp(B, 'Past day 90 · steps still open', '#B03A2E') + grp(C, 'Past day 90 · all steps done')\n"
   + "        + `<div class=\"small mute\" style=\"margin-top:10px\">The checklist is for the first 90 days. Teachers stay on this list until day 120 after the hire date, so steps still open after day 90 stay visible.</div></details>`; } } }"],
  ["<div class=\"small mute\" style=\"letter-spacing:.06em;text-transform:uppercase\">My first 90 days · day ${x.days}</div>",
   "<div class=\"small mute\" style=\"letter-spacing:.06em;text-transform:uppercase\">My first 90 days · day ${x.days}${x.days > 90 ? ' · past day 90' + (x.done < x.total ? ' · ' + (x.total - x.done) + ' step' + (x.total - x.done === 1 ? '' : 's') + ' still open' : '') : ''}</div>"],
]);
