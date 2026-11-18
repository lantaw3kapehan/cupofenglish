// 2380 (Misty 18 Nov 18:08: Teacher Martin could not see the Christmas spin card on his laptop Today).
// The card's data was fetched once, 2.5 s after opening; if that call failed or ran before the sign-in was ready, nothing came back for 5 minutes.
// Now: retry every 15 s until the card's data arrives, and draw the card again whenever Today is shown without it.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["setTimeout(load, 2500); setInterval(() => { if(!document.hidden) load(); }, 5 * 60000);",
 "setTimeout(load, 2500); setInterval(() => { if(!document.hidden) load(); }, 5 * 60000);\n    setInterval(() => { try{ if(document.hidden || typeof TOKEN === 'undefined' || !TOKEN) return; if(!X.me) return load(); if(!document.getElementById('x21c') && typeof VIEW !== 'undefined' && (VIEW === 'today' || VIEW === 'home')) paintCard(); }catch(x){} }, 15000);   /* 2380: retry until loaded, redraw if missing */"]
]);
