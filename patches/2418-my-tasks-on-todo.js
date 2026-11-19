// 2418 (Misty 19 Nov 13:23, "that should be in TO DO not notices"): a 📌 task sent to someone in management (e.g. Celine: "Guide Resa on
//   the new homework template") also shows at the top of their own To do, with ✅ Done and Open, until it is done.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  // ── Management · Messages page: tasks still open, by person\n  const _rm = window.renderMsgs; window.renderMsgs = function(){ const r = _rm.apply(this, arguments);",
   "  /* 2418: my own open tasks on my To do */\n" +
   "  function myTasks(){ try{ const me = String(((typeof D !== 'undefined' && D && D.me) || {}).name || '').trim().toLowerCase(); if(!me || typeof MSG === 'undefined' || !MSG) return [];\n" +
   "      return (MSG.threads || []).filter(t => t && isTask(t.root) && !isDone(t.root) && String(t.teacher || '').trim().toLowerCase() === me); }catch(e){ return []; } }\n" +
   "  function paintMine(){ const v = $('v-mtoday'); if(!v || typeof VIEW === 'undefined' || VIEW !== 'mtoday') return; const L = myTasks(), old = $('myTask2418');\n" +
   "    const h = L.length ? '<section class=\"card\" id=\"myTask2418\" style=\"margin:0 0 14px;border-left:5px solid #E4846B\"><b>📌 Your tasks · ' + L.length + '</b><div class=\"small mute\">From Notices · they stay here until you tap ✅ Done</div>' +\n" +
   "      L.map(t => '<div class=\"row\" style=\"gap:10px;align-items:center;padding:10px 0;border-top:1px solid #F0EEF5;margin-top:8px\"><div class=\"grow\" style=\"min-width:0\"><div>' + esc(body(t.root)) + '</div><div class=\"small mute\">' + esc(t.root.from || 'Management') + (t.root.at ? ' · since ' + esc(sd(t.root.at)) : '') + '</div></div>' +\n" +
   "        '<button class=\"btn ghost sm\" onclick=\"go(\\'msgs\\')\">Open</button><button class=\"btn teal sm\" onclick=\"msgAckM(\\'' + esc(t.root.id) + '\\',3,this);this.closest(\\'.row\\').style.opacity=.4\">✅ Done</button></div>').join('') + '</section>' : '';\n" +
   "    if(old && old.outerHTML === h) return; if(old) old.remove(); if(h) v.insertAdjacentHTML('afterbegin', h); }\n" +
   "  const _rt2418 = window.renderMToday; if(typeof _rt2418 === 'function') window.renderMToday = function(){ const r = _rt2418.apply(this, arguments); try{ if(typeof MSG === 'undefined' || !MSG){ if(typeof loadMsgs === 'function') loadMsgs(true).then(paintMine); } else paintMine(); }catch(e){} return r; };\n" +
   "  setInterval(() => { try{ paintMine(); }catch(e){} }, 20000);\n" +
   "  // ── Management · Messages page: tasks still open, by person\n  const _rm = window.renderMsgs; window.renderMsgs = function(){ const r = _rm.apply(this, arguments);"]
]);
