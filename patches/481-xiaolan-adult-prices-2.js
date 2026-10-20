// 20 Oct · 480 follow-up: leaving Adults clears "Xiaolan's students" (it is an adults-only price list).
require('../tools/lib.js')(process.argv[2], [["window.ppAd = function(a){ PP.ad = a >= 2 ? a : !!a; ppSheet(); };",
 "window.ppAd = function(a){ PP.ad = a >= 2 ? a : !!a; if(PP.ad !== true && PP.partner === 'Xiaolan students') PP.partner = ''; ppSheet(); };"]]);
