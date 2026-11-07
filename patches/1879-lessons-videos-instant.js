// 1879: (Misty 7 Nov 21:53 "when I open lessons and videos it's slow too")
//   "▶ Lessons & videos" now starts loading the moment the student page opens (and again on touch), so the tap shows the list at once.
//   The answer is kept for 3 minutes per student; the database part takes under 10 ms, the wait was the server waking up.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["${code ? `<button class=\"btn ghost sm\" onclick=\"lvOpen1878('${esc(code)}')\">▶ Lessons &amp; videos</button>` : ''}",
   "${code ? (setTimeout(() => { try{ lvPre1879(code); }catch(e){} }, 400), `<button class=\"btn ghost sm\" onpointerdown=\"lvPre1879('${esc(code)}')\" onclick=\"lvOpen1878('${esc(code)}')\">▶ Lessons &amp; videos</button>`) : ''}"],
  ["  let r = null; try{ r = await fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code }) }).then(x => x.json()); }catch(e){}",
   "  let r = null; try{ r = await lvPre1879(code); }catch(e){}\n  if(!r || !r.ok){ delete LV1879[code]; try{ r = await lvPre1879(code); }catch(e){} }"],
  ["async function lvOpen1878(code){",
   `const LV1879 = {};
function lvPre1879(code){   /* 1879: load once, keep 3 minutes */
  const c = LV1879[code]; if(c && Date.now() - c.t < 180000) return c.p;
  const p = fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code }) }).then(x => x.json());
  p.then(r => { if(!r || !r.ok) delete LV1879[code]; }, () => { delete LV1879[code]; });
  LV1879[code] = { t: Date.now(), p }; return p; }
async function lvOpen1878(code){`],
]);
