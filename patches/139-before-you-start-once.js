// 15 Oct · "Before you start" pops up once when the app opens, not again a minute later when more items arrive
// (Misty's screen showed it with 2 items, then again with 5). Items that arrive while it is open are added to it;
// after it is closed, new ones only pop up again 10 minutes later (they are in the orange box at once).
require('../tools/lib.js')(process.argv[2], [
["    if(POPPED === sig || snoozed(sig) || inClass() || VIEW !== 'today' || $('sheet').classList.contains('on')) return;",
 "    const popH = () => '<h1 id=\"mustPop\">Before you start</h1><p class=\"small mute\" style=\"margin:8px 0 6px\">Management is waiting for ' + (n === 1 ? 'this' : 'these ' + n + ' things') + '. It only takes a minute.</p>' + L.map((x, i) => row(x, i, true)).join('') +\n" +
 "        '<div style=\"margin-top:14px;text-align:center\"><a class=\"link small\" onclick=\"mustLater(window._mustSig)\">Remind me in 2 hours</a></div>';\n" +
 "    if($('mustPop') && $('sheet').classList.contains('on')){ POPPED = sig; $('sheetBody').innerHTML = popH(); return; }\n" +
 "    if(POPPED === sig || snoozed(sig) || inClass() || VIEW !== 'today' || $('sheet').classList.contains('on') || (window._mustAt && Date.now() - window._mustAt < 10 * 6e4)) return;"],
["      openSheet('<h1>Before you start</h1><p class=\"small mute\" style=\"margin:8px 0 6px\">Management is waiting for ' + (n === 1 ? 'this' : 'these ' + n + ' things') + '. It only takes a minute.</p>' + L.map((x, i) => row(x, i, true)).join('') +\n        '<div style=\"margin-top:14px;text-align:center\"><a class=\"link small\" onclick=\"mustLater(window._mustSig)\">Remind me in 2 hours</a></div>'); }, 2500);",
 "      window._mustAt = Date.now(); openSheet(popH()); }, 2500);"],
]);
