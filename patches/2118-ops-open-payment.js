// 2118 (12 Nov 13:59, Misty: "Fix these" › Payment 1721 for Gaby › Open "goes to Sales" (the Finance page), not to the payment).
// coe_ops_check now gives the payment's key (date|invoice); Open opens that payment's edit card straight away (Edit › Partner), the same
// card as Finance › Transactions › Edit. Other items open their screen as before.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["window.o2091go = function(i){ var x = (FX.items || [])[i]; if(!x) return; try{ go(x.go); }catch(e){} };",
   "window.o2091go = function(i){ var x = (FX.items || [])[i]; if(!x) return; if(/^sale-/.test(x.kind || '') && x.key && typeof window.fxTx === 'function'){ return window.fxTx('sale', encodeURIComponent(x.key)); }   /* 2118: straight to the payment */\n    try{ go(x.go); }catch(e){} };"],
]);
