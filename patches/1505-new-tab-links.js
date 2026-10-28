// 1505 · Screens are real links (Misty 28 Oct 19:23: "when we click a SCREEN, we can OPEN LINK IN NEW TAB so we can do other things too").
// · Side menu (laptop), bottom bar + More (phone), group tabs (Finance / Teachers / Students / Trials) and the links inside screens
//   (Overview tiles, To do, Notices & requests, student / teacher rows …) are <a href="#screen"> links. Ctrl/Cmd-click, middle-click and
//   right-click › "Open link in new tab" open the screen in a new tab; a plain click is unchanged (no reload, same scroll and context).
// · Record addresses: #student=ST-… · #teacher=Name · #chat=all (also #student/ST-…, #chat/all). Access is checked like a click: the screen
//   must be in that person's menu or group tabs; the server checks every record as before.
// · A new tab opens straight on its screen, signed in (token in localStorage), from the saved copies. A reload or Back keeps the app's own
//   return rules, now per tab (each tab keeps its own screen and scroll place in sessionStorage).
// · The menu items were <button>s: the CSS rules and look-ups written for "nav button" / "#navIn button" / ".mo-tabs button" now also match
//   the links (":is(button,a)", same specificity), so they look and behave the same.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const boot = fs.readFileSync(path.join(__dirname, '1505-new-tab-boot.inc'), 'utf8');
const inc = fs.readFileSync(path.join(__dirname, '1505-new-tab-links.inc'), 'utf8');
const DEF = "ok && (_fr || !D.mgr) ? sv : D.mgr ? 'home' : 'today'";
require('../tools/lib.js')(file, [
  ['<html lang="en">\n<head>\n<meta charset="utf-8">', '<html lang="en">\n<head>\n<meta charset="utf-8">\n<script id="b1505">\n' + boot + '</script>'],
  ["go(" + DEF + ");", "go((window.coeBoot1505 && coeBoot1505.pick(" + DEF + ")) || (" + DEF + "));   /* 1505: an opened address wins */"],
  ["const sv = store('get','coe.view'),", "const sv = tab1505.get('coe.view'),"],
  ["_pl = JSON.parse(store('get','coe.place') || 'null');", "_pl = JSON.parse(tab1505.get('coe.place') || 'null');"],
  ["VIEW = v; store('set', 'coe.view', v);", "VIEW = v; tab1505.set('coe.view', v);"],
  ["store('set', 'coe.place', JSON.stringify(", "tab1505.set('coe.place', JSON.stringify("],
  ["const p = JSON.parse(store('get', 'coe.place') || 'null');", "const p = JSON.parse(tab1505.get('coe.place') || 'null');"],
  ["window.coeHV = () => { const h = (location.hash || '').slice(1); return HV[h] || h; };",
   "window.coeHV = () => { const h = (location.hash || '').slice(1).split(/[=\\/]/)[0]; return HV[h] || h; };   /* 1505: #student=… / #chat=all → their screen */"],
]);
// the body part goes last (after every other screen script), only once the exact changes above all applied
const s0 = fs.readFileSync(file, 'utf8');
const i = s0.lastIndexOf('</body>');
const s1 = s0.slice(0, i) + '<script id="l1505">\n' + inc + '</script>\n' + s0.slice(i);
fs.writeFileSync(file, s1);
