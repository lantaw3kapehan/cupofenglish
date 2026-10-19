// 19 Oct · 296 · Teacher Excellence (Misty: "more visible on this side, below Pay"): on a laptop the live summary sits in the side menu under Pay —
// level and medal, month so far and place, the level track, points to the next level, a small line of her months, "Live · updated hh:mm". Tap → My growth.
// Phones (menu at the bottom) keep the line under the name.
const fs = require('fs'), path = require('path'), sideJs = fs.readFileSync(path.join(__dirname, '296-excellence-sidebar.side.js'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["grid-template-columns:repeat(auto-fit,minmax(230px,1fr))", "grid-template-columns:repeat(var(--kxc,2),minmax(0,1fr))"],
  ["if(x.qa != null) L.push(`QA ${x.qa}`", "if(x.qa != null) L.push(`Monthly QA (President) <b style=\"color:var(--ink)\">${x.qa}</b>`"],
  ["L.push(`Class visits ${x.visits} ", "L.push(`Daily visits (Ops) <b style=\"color:var(--ink)\">${x.visits}</b> "],
  ["<a href=\"#\" onclick=\"event.preventDefault();kxVisits()\">see visits</a>", "<a href=\"#\" style=\"color:#2a9d8f;font-weight:600;text-decoration:none\" onclick=\"event.preventDefault();kxVisits()\">see visits ›</a>"],
  ["function badge(){ const el = $('hRank'); if(!el || !isT()) return; const old = el.querySelector('.kxb'); if(old) old.remove();",
   "function badge(){ const el = $('hRank'); if(!el || !isT()) return; const old = el.querySelector('.kxb'); if(old) old.remove(); if(sideOn()) return;"],
  ["  function paintAll(){ try{ badge(); }catch(e){}", sideJs + "  function paintAll(){ try{ side(); }catch(e){} try{ badge(); }catch(e){}"],
  ["const _r = window.render; if(_r) window.render = function(){ const x = _r.apply(this, arguments); try{ badge(); }catch(e){}",
   "const _r = window.render; if(_r) window.render = function(){ const x = _r.apply(this, arguments); try{ side(); }catch(e){} try{ badge(); }catch(e){}"]]);
