// 649: "My class videos" card on Today — wording for in-app uploads, and a video uploaded in the app shows as found at once
// (it used to wait for the 10-minute Drive check).
require('../tools/lib.js')(process.argv[2], [
[
"Checked in your Drive class folders · a video shows here about 10 minutes after upload · tap a name to open",
"Upload each video in the app on the class card · it shows here at once · due by 23:59 the same day · tap a name to open"
],
[
"function load(){ if(busy || !TOKEN || !(typeof D !== 'undefined' && D && !D.mgr) || Date.now() - at < 3 * 6e4) return; busy = true;",
"window.vmFound = (code, day, url, name) => { let hit = 0; (V || []).forEach(x => { if(String(x.code).toUpperCase() === String(code).toUpperCase() && String(x.day).slice(0, 10) === day && !x.found){ x.found = true; x.url = url; x.name = name; x.uploaded = new Date().toISOString(); hit = 1; } }); if(hit){ try{ localStorage.setItem('coe.vid.mine', JSON.stringify(V)); }catch(e){} try{ paint(); }catch(e){} } };   /* 649 */\n  function load(){ if(busy || !TOKEN || !(typeof D !== 'undefined' && D && !D.mgr) || Date.now() - at < 3 * 6e4) return; busy = true;"
],
[
"D.vids = D.vids || {}; D.vids[id] = { url, at };",
"D.vids = D.vids || {}; D.vids[id] = { url, at }; try{ if(window.vmFound && c.code) vmFound(c.code, c.day, url, (d && d.name) || s.name || ''); }catch(e){}"
]
]);
