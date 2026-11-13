// 2194 (13 Nov · Misty: "the screen is adjusting and readjusting when refreshed"): Finance › Overview for Operations
// opens on the last saved copy at once (then quietly updates), and while nothing is saved it shows four card-sized placeholders, so the page does not jump.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["  let F = null, at = 0, busy = 0;\n  const n = v => (+v || 0).toLocaleString('en-US');",
  "  let F = (() => { try{ return JSON.parse(localStorage.getItem('coe.fo2181') || 'null'); }catch(e){ return null; } })(), at = 0, busy = 0;\n  const n = v => (+v || 0).toLocaleString('en-US');"],
 ["    if(!F) return '<div class=\"fo81\"><div class=\"sk\"></div><div class=\"sk\"></div></div>';",
  "    if(!F) return '<div class=\"fo81\">' + '<div class=\"sk\" style=\"min-height:190px;border-radius:16px\"></div>'.repeat(4) + '</div>';"],
 ["if(r && r.ok && r.data){ F = r.data; at = Date.now(); const v = document.getElementById('v-finov'); const box = v && v.querySelector('.fo81'); if(box) box.outerHTML = fo2181Html(); }",
  "if(r && r.ok && r.data){ const same = JSON.stringify(r.data) === JSON.stringify(F); F = r.data; at = Date.now(); try{ localStorage.setItem('coe.fo2181', JSON.stringify(F)); }catch(e){} if(same) return; const v = document.getElementById('v-finov'); const box = v && v.querySelector('.fo81'); if(box) box.outerHTML = fo2181Html(); }"]
]);
