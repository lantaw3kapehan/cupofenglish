// 14 Oct pm · Renewals follow one flow (Misty: Ethel and Amy were paid but still showed under Renewing; "can it only use
// 1 template … and then after lodging the class notice appears").
// 1. "Renewed · paid" → Save → the class notice opens straight away (filled from ACTIVE and the calendar), with the
//    "✓ renewed · N lessons left" line, the renewal picture and the agreement reminder on top. No separate "Done" card.
// 2. If the package was already paid in the last 7 days (on or after the parent confirmed), "Renewed · paid" no longer shows
//    the payment form again (that would add a second package): it says "already renewed", moves the student to Renewed ✓,
//    and offers the class notice and the renewal picture. "Record another payment" is still there for a real second payment.
require('../tools/lib.js')(process.argv[2], [
["async function renPaidSheet(code, name, teacher){ RPS = { code, name, teacher, pkg: 30, free: 3, info: null, sched: '' };",
 "async function renPaidSheet(code, name, teacher, again){ RPS = { code, name, teacher, pkg: 30, free: 3, info: null, sched: '', again: !!again };"],
["RPS.info = r; RPS.cls = Array.isArray(cl) ? cl : []; if(r.prev && r.prev.pkg){ RPS.pkg = r.prev.pkg; RPS.free = r.prev.free; }",
 "RPS.info = r; RPS.cls = Array.isArray(cl) ? cl : []; if(r.prev && r.prev.pkg){ RPS.pkg = r.prev.pkg; RPS.free = r.prev.free; }\n" +
 "{ const pd = r.prev && r.prev.date, rs = String((REN || {})[String(code).toUpperCase()] || ''), cd = (/^Renewing · ([A-Z][a-z]{2} \\d{1,2}, \\d{4})/.exec(rs) || [])[1], pt = pd ? new Date(pd + 'T12:00:00').getTime() : 0;   /* 14 Oct pm: already paid → no second form */\n" +
 "  if(pt && !RPS.again && Date.now() - pt < 7 * 864e5 && (!cd || pt >= new Date(cd + ' 00:00').getTime())){\n" +
 "    const lbl = new Date(pt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });\n" +
 "    try{ REN[String(code).toUpperCase()] = 'Renewed · ' + r.prev.pkg + (r.prev.free ? '+' + r.prev.free : '') + ' paid · ' + lbl + ' · SALES'; localStorage.setItem('coe.ren', JSON.stringify(REN)); renderMToday(); }catch(e){}\n" +
 "    return openSheet(`<h1>${esc(name)} · already renewed</h1><div class=\"card\" style=\"margin-top:10px;background:#F1FAF9;border-color:#BFE6E3\"><div style=\"font-size:20px\"><b style=\"color:#00737B\">${r.left} lessons</b> left now</div><div class=\"small\" style=\"margin-top:4px\">Paid ${esc(lbl)} · ${r.prev.pkg}${r.prev.free ? ' + ' + r.prev.free : ''} · ${esc(r.prev.invoice || 'SALES')} · ACTIVE row ${r.row}</div></div>` +\n" +
 "      `<button class=\"btn teal block\" style=\"margin-top:14px\" onclick=\"cnOpen('${esc(code)}')\">Class notice</button><button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"cxBalance(null,'${esc(code)}')\">Renewal picture for the parent · 续费成功</button>` +\n" +
 "      `<button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"renPaidSheet('${esc(code)}','${esc(String(name)).replace(/'/g, '')}','${esc(String(teacher || '')).replace(/'/g, '')}', true)\">Record another payment (a new package)</button>`); } }"],
["AT = null; MS = null; try{ ding('msg'); }catch(e){}\nopenSheet(`<h1>✓ ${esc(S.name)} renewed</h1>",
 "AT = null; MS = null; try{ ding('msg'); }catch(e){}\nconst rpBan = (`<h2 style=\"margin:0\">✓ ${esc(S.name)} renewed · class notice below</h2>"],
["<div id=\"rpAgr\"></div><button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"closeSheet()\">Done</button>`);",
 "<div id=\"rpAgr\"></div>`);\n" +
 "await cnOpen(S.code); try{ $('sheetBody').insertAdjacentHTML('afterbegin', '<div style=\"border-bottom:1px solid #E5ECEC;padding-bottom:14px;margin-bottom:14px\">' + rpBan + '</div>'); }catch(x){}   /* 14 Oct pm: one flow · the class notice follows the payment */"],
]);
