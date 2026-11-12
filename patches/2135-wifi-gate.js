// 2135 (12 Nov, Misty): Wi-Fi at time-in → the contract's warning, and "I'm in" is locked while Wi-Fi is detected.
// Source: patches/src/2135-wifi-gate.client.js · server: server/coe-wifi.ts (edge function coe-wifi), table coe_wifi, coe_wifi_flag,
// triggers coe_wifi_timein (Android Chrome reports Wi-Fi) and coe_wifi_redo (a redone time-in check puts the flag to "recheck").
// Also: Team Chat › Time-in pictures carry the teacher's name (data-author) for the "Wi-Fi in this picture" button, and
// To do › Fix these › Wi-Fi items get "Allow · not Wi-Fi" and "Taught on Wi-Fi · open a case" instead of Open / It's correct.
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2135-wifi-gate.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<script id="b2135">\n' + JS + '</script>\n<script id="t2060">'],
  ["inner = '<div class=\"ch-ti\">'", "inner = '<div class=\"ch-ti\" data-author=\"' + esc(m.author || '') + '\">'"],
  ["(x.go ? '<button type=\"button\" class=\"go\" onclick=\"o2091go(' + i + ')\">Open</button>' : '') + '<button type=\"button\" onclick=\"o2091ok(' + i + ', this)\">It\\'s correct</button></div></div>'",
   "(x.kind === 'wifi' ? '<button type=\"button\" class=\"go\" onclick=\"wf2135Close(' + (+x.id || 0) + ',\\'cleared\\',\\'' + String(x.teacher || '').replace(/[^A-Za-z .-]/g, '') + '\\')\">Allow · not Wi-Fi</button><button type=\"button\" onclick=\"wf2135Close(' + (+x.id || 0) + ',\\'confirmed\\',\\'' + String(x.teacher || '').replace(/[^A-Za-z .-]/g, '') + '\\')\">Taught on Wi-Fi · open a case</button></div></div>' : (x.go ? '<button type=\"button\" class=\"go\" onclick=\"o2091go(' + i + ')\">Open</button>' : '') + '<button type=\"button\" onclick=\"o2091ok(' + i + ', this)\">It\\'s correct</button></div></div>')"],
]);
