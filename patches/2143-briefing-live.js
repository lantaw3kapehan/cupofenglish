// 2143 (12 Nov, Misty 20:41: "it should always auto refresh instantly"): the Finance Briefing (and Overview / Forecast) refresh by
// themselves when money changes: a sale, an expense, a partner payment, a payroll change, a package or lesson change.
// Server: statement triggers coe_stamp_fin on coe_sales, coe_expenses, partner_payments, coe_fin_settings → coe_stamp → sys:stamps.
// App: the live check (every 5 s while the Briefing is open, instead of 14 s) drops the Briefing's copies and reloads them in place
// (no flicker, no scroll jump, never while typing).
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = `
(function(){
  var FIN = { sales: 1, money: 1, packages: 1, lessons: 1 }, open = function(){ try{ return typeof VIEW !== 'undefined' && (VIEW === 'finbrief' || VIEW === 'forecast'); }catch(e){ return false; } };
  function reload(){ try{ var st = window.fc980 && fc980.st && fc980.st(); if(st){ st.exp = null; st.busy = 0; }
      try{ MN = null; }catch(e){} try{ PL = null; }catch(e){} try{ store('del', 'coe.m.money'); }catch(e){}
      if(VIEW === 'finbrief' && window.fbz2143) fbz2143(); else if(window.fc980 && fc980.load) fc980.load(); }catch(e){} }
  var ap = window.coeStampApply;
  if(typeof ap === 'function' && !ap.__fin){ var w = function(kinds){ var r = ap.apply(this, arguments);
      try{ if(open() && (kinds || []).some(function(k){ return FIN[k]; })){ var t = document.activeElement; if(t && /INPUT|TEXTAREA|SELECT/.test(t.tagName)) setTimeout(reload, 4000); else reload(); } }catch(e){} return r; };
    w.__fin = 1; window.coeStampApply = w; }
  /* the live check reads apply through this name: point it at the wrapper */
  try{ if(window.coeStampCheck && window.coeStampApply.__fin) window.__fin2143 = 1; }catch(e){}
  setInterval(function(){ try{ if(open() && !document.hidden && window.coeStampCheck) coeStampCheck(); }catch(e){} }, 5000);
})();
`;
lib(file, [
  ["window.fbz2084rm = function(id){", "window.fbz2143 = function(){ startLoads(); };\n  window.fbz2084rm = function(id){"],
  ["      last = s; if(kinds.length) apply(kinds); }catch(e){} finally{ busy = false; } }",
   "      last = s; if(kinds.length) (window.coeStampApply || apply)(kinds); }catch(e){} finally{ busy = false; } }"],
  ['<script id="t2060">', '<script id="b2143">' + JS + '</script>\n<script id="t2060">'],
]);
