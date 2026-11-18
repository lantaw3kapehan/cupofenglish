// 2389 (Misty 18 Nov 21:07, Julia: no button to re-upload Eddie's video) · the laptop that uploaded a video keeps its own "done" note
//   (coe.vup) and the folder list (coe.vid.mine), and those put "Class video uploaded" back on the card even after Management removed
//   the file. Today now gets the removed files (vidRm) and those local notes are cleared, so the card shows Upload video again.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<script id=\"b2278\">",
   "<script id=\"b2389\">\n(function(){\n  if(window.__2389) return; window.__2389 = 1;\n" +
   "  function clean(){ try{ if(typeof D === 'undefined' || !D || D.mgr || !Array.isArray(D.vidRm) || !D.vidRm.length) return; var R = D.vidRm, has = function(u){ u = String(u || ''); return u && R.some(function(f){ return u.indexOf(f) >= 0; }); };\n" +
   "    try{ var o = JSON.parse(localStorage.getItem('coe.vup') || '{}') || {}, ch = 0; for(var k in o){ var x = o[k]; if(x && (has(x.done) || (x.fid && R.indexOf(x.fid) >= 0))){ delete o[k]; ch = 1; } } if(ch) localStorage.setItem('coe.vup', JSON.stringify(o)); }catch(e){}\n" +
   "    try{ var L = JSON.parse(localStorage.getItem('coe.vid.mine') || 'null'); if(Array.isArray(L)){ var c2 = 0; L.forEach(function(v){ if(v && v.found && has(v.url)){ v.found = false; v.url = ''; c2 = 1; } }); if(c2) localStorage.setItem('coe.vid.mine', JSON.stringify(L)); } }catch(e){}\n" +
   "    if(D.vids) Object.keys(D.vids).forEach(function(k){ if(D.vids[k] && has(D.vids[k].url)) delete D.vids[k]; }); }catch(e){} }\n" +
   "  window.vidRmClean = clean;\n" +
   "  var _rt = window.renderToday; if(typeof _rt === 'function') window.renderToday = function(){ clean(); return _rt.apply(this, arguments); };\n" +
   "})();\n</script>\n<script id=\"b2278\">"]
]);
