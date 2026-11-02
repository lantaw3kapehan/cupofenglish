// 1701: (Misty, 2 Nov 09:55) "Why does it say 'Report sent' here, and on management 'Report not in yet'?" · Becky ST-2026-129: the
//   report was handed to the queue at 09:46 and Google refused it at 09:47 (AUTH), but the teacher card kept "✓ Report sent" from the
//   phone's own memory (797 remembers a report the moment it is queued). With coe-trials v12 (failed sends no longer listed), the card
//   now uses that memory only until the list has been read again 90 s after sending; if the list still doesn't have the report, the
//   card goes back to "Trial report" (to send it again) and the red "Not sent · please check" box is asked for at once.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    const m = mine()[kOf(q)]; if(m) return Object.assign({ q: 1 }, m);",
   "    const m = mine()[kOf(q)]; if(m){ const mt = m.t || Date.parse(String(m.at || '').replace(' ', 'T') + ':00+08:00') || 0;   /* 1701: memory only until Google's list is read 90 s later */\n" +
   "      if(!(P && P.at > mt + 9e4)) return Object.assign({ q: 1 }, m);\n" +
   "      try{ if(!window.__ff1701 && typeof fastFails === 'function'){ window.__ff1701 = 1; fastFails(); setTimeout(() => { window.__ff1701 = 0; }, 6e4); } }catch(e){} }"],
  ["      M[kOf(ctx)] = { d: String(ctx.date).slice(0, 10), s: low(ctx.student), c: up(ctx.code), at: now,",
   "      M[kOf(ctx)] = { d: String(ctx.date).slice(0, 10), s: low(ctx.student), c: up(ctx.code), at: now, t: Date.now(),"],
  ["localStorage.setItem(MK, JSON.stringify(M)); }catch(e){} setTimeout(paint, 50); setTimeout(() => load(true), 4000); } }).catch(() => {}); }",
   "localStorage.setItem(MK, JSON.stringify(M)); }catch(e){} setTimeout(paint, 50); setTimeout(() => load(true), 4000); setTimeout(() => { load(true); setTimeout(paint, 3000); }, 1e5); } }).catch(() => {}); }"],
  ["const n = +(String(b.getAttribute('onclick')).match(/\\d+/) || [-1])[0], q = TRQS[n], x = find(q);\n    if(!x) return;",
   "const n = +(String(b.getAttribute('onclick')).match(/\\d+/) || [-1])[0], q = TRQS[n], x = find(q);\n    if(!x){ if(/^✓ Report sent/.test(b.textContent) && !window.__rt1701){ window.__rt1701 = 1; setTimeout(() => { window.__rt1701 = 0; try{ if(typeof VIEW !== 'undefined' && VIEW === 'today') renderToday(); }catch(e){} }, 0); } return; }   /* 1701: undo a card that said sent */"]
]);
