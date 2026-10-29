// 1616 · the last reads people still waited on Google for (Misty's laptop, 11:18–11:40):
//   · Pay ready, Reports, Reports waiting (3.4–4.8 s after a tap): when the database copy is older than its age (1602), the
//     copy is now shown at once (if under 3 days old) and Google refreshes it behind, nobody waiting; the screen redraws only
//     if the answer changed.
//   · Leave proof pictures (3–5 s, a file in Google Drive): the first look still comes from Drive; looking again at the same
//     proof in this session is instant.
//   · Management start data: the "last asked Google" time is also kept for this browser tab across reloads (sessionStorage),
//     so a reload for a new version does not ask Google again.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["new Promise(z => setTimeout(() => z(null), 8500))]).then(d => (d && d.data != null && !(d.data && d.data.ok === false && fn !== 'mgmtHealth') && Date.now() - Date.parse(d.at) < m * 6e4) ? d.data : g1613(), () => g1613()); }",
   "new Promise(z => setTimeout(() => z(null), 8500))]).then(d => { if(d && d.data != null && !(d.data && d.data.ok === false && fn !== 'mgmtHealth')){ const ag = Date.now() - Date.parse(d.at);\n" +
   "            if(ag < m * 6e4) return d.data;\n" +
   "            if(ag < 3 * 864e5){ setTimeout(() => { const u = window._ui; window._ui = 0; let p; try{ p = g1613(); }finally{ window._ui = u; } Promise.resolve(p).then(x => { try{ if(x != null && JSON.stringify(x) !== JSON.stringify(d.data) && typeof sbRedraw === 'function') sbRedraw(fn, args, x); }catch(e){} }, () => {}); }, 50); return d.data; } }   /* 1616: old copy at once, Google behind */\n" +
   "          return g1613(); }, () => g1613()); }"],
  ["function bootMark1609(){ window.__boot1609 = { t: Date.now(), tk: String(TOKEN).slice(-12) }; try{ localStorage.setItem('coe.m.bootAt', String(Date.now())); localStorage.setItem('coe.m.bootTk', String(TOKEN).slice(-12)); }catch(e){} }   /* 1609 */",
   "function bootMark1609(){ window.__boot1609 = { t: Date.now(), tk: String(TOKEN).slice(-12) }; try{ sessionStorage.setItem('coe.m.boot1616', JSON.stringify(window.__boot1609)); }catch(e){} try{ localStorage.setItem('coe.m.bootAt', String(Date.now())); localStorage.setItem('coe.m.bootTk', String(TOKEN).slice(-12)); }catch(e){} }   /* 1609 · 1616 */"],
  ["function bootFresh1609(){ try{ const m = window.__boot1609; if(m && m.tk === String(TOKEN).slice(-12) && Date.now() - m.t < 30 * 6e4) return true; }catch(e){}",
   "function bootFresh1609(){ try{ const m = window.__boot1609 || JSON.parse(sessionStorage.getItem('coe.m.boot1616') || 'null'); if(m && m.tk === String(TOKEN).slice(-12) && Date.now() - m.t < 30 * 6e4) return true; }catch(e){}   /* 1616: this tab, across reloads */"],
  ["try{ const r = await api('mgmtLeaveProof', TOKEN, id, i); if(!r.ok) throw r;",
   "try{ const k1616 = id + '|' + i, r = (window.__lp1616 = window.__lp1616 || {})[k1616] || await api('mgmtLeaveProof', TOKEN, id, i); if(!r.ok) throw r; try{ const ks = Object.keys(window.__lp1616); if(ks.length > 12) delete window.__lp1616[ks[0]]; window.__lp1616[k1616] = r; }catch(e){}   /* 1616: seen again → instant */"],
]);
