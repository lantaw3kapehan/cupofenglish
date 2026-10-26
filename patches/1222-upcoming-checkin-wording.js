// 1222 · 26 Oct (Misty 21:00, audit retest: upcoming check-in wording). On Today's class cards an upcoming class showed
// "In · 19:25" — it read as if the teacher had already checked in at 19:25. The first class of the day said "Opens 5 minutes before
// class", but the time-in for the first class opens 40 minutes before (30–40 min window), and the hint for a later class said
// "Tap to time in" although that button is "I'm in". Wording only (plus the first-class pill turning to "do it now" when its time-in
// window opens); the rules, buttons and records are unchanged.
require('../tools/lib.js')(process.argv[2], [
["const inSt = inDone || contPrev ? 'd' : now >= new Date(+st - 5 * 6e4) ? 'n' : 'l';",
 "const inSt = inDone || contPrev ? 'd' : now >= new Date(+st - (isFirst ? 40 : 5) * 6e4) ? 'n' : 'l', tiOp = tm(new Date(+st - 40 * 6e4).toISOString());   /* 1222: the first class's time-in opens 40 min before */"],
["pill(inSt, 'In', isFirst ? 'timeInSheet()' : D.timeIn ? \"classIn('\" + ci2 + \"')\" : 'timeInSheet()', inSt === 'd' ? (contPrev ? 'Same class as before · no I’m in needed' : 'In') : inSt === 'n' ? 'Tap to time in' : 'Opens 5 minutes before class')",
 "pill(inSt, inSt === 'l' && isFirst ? 'Time in from ' + tiOp : isFirst && inSt === 'n' ? 'Time in' : 'In', isFirst ? 'timeInSheet()' : D.timeIn ? \"classIn('\" + ci2 + \"')\" : 'timeInSheet()', inSt === 'd' ? (contPrev ? 'Same class as before · no I’m in needed' : 'In') : inSt === 'n' ? (isFirst || !D.timeIn ? 'Tap to time in' : 'Tap “I’m in”') : isFirst ? 'Time in opens ' + tiOp + ' · 30–40 minutes before your first class' : 'I’m in opens 5 minutes before class, or right after your previous class')"],
["if(!/·/.test(pin.textContent)) pin.lastChild.textContent = 'In · ' + t; pin.title = 'I’m in opens at ' + t;",
 "if(!/·|from/.test(pin.textContent)) pin.lastChild.textContent = 'I’m in from ' + t; pin.title = 'I’m in opens at ' + t + ' · not checked in yet';   /* 1222 */"]
]);
