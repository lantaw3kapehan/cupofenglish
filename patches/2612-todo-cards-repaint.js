// 2612: the 2609 To do cards were drawn once on opening, before the student list arrived (no names), and the 30 s redraw
// never ran: it checked VIEW === 'mtoday' but the To do screen is VIEW 'todo'. Now: redraw whenever the To do screen is
// showing, every 30 s, and every 2 s in the first minute until the student names are in.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["setInterval(function(){ try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday') paint(); }catch(e){} }, 30e3);",
   "var shown = function(){ var v = document.getElementById('v-mtoday'); return !!(v && v.offsetParent); };\n  setInterval(function(){ try{ if(shown()) paint(); }catch(e){} }, 30e3);\n  var n0 = 0, t0 = setInterval(function(){ try{ var ok = typeof MS !== 'undefined' && Array.isArray(MS) && MS.length; if(ok && shown()) paint(); if(ok || ++n0 > 30) clearInterval(t0); }catch(e){ clearInterval(t0); } }, 2e3);"],
]);
