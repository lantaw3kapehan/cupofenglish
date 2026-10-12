// Monday summary: read last week from the server's shared copy (mgmtWeekSum, one calendar read, cached 6 h and rebuilt
// in the background) instead of 14 calls per person. Falls back to the old per-day reads if the server copy fails.
require('../tools/lib.js')(process.argv[2], [
[
"try{\nconst sc = await Promise.all(L.map(d => api('mgmtSchedule', TOKEN, d).catch(() => null))),",
"try{\nconst w = await api('mgmtWeekSum', TOKEN, L[0]).catch(() => null);\nif(w && w.ok && w.week && w.week.ev){ WS = { week: L[0], days: L, ts: Date.now(), ev: w.week.ev, rem: w.week.rem || {} }; try{ localStorage.setItem(k, JSON.stringify(WS)); }catch(e){} } else {\nconst sc = await Promise.all(L.map(d => api('mgmtSchedule', TOKEN, d).catch(() => null))),"
],
[
"WS = { week: L[0], days: L, ts: Date.now(), ev, rem }; try{ localStorage.setItem(k, JSON.stringify(WS)); }catch(e){}\n}catch(e){ console.warn('ws', e); }",
"WS = { week: L[0], days: L, ts: Date.now(), ev, rem }; try{ localStorage.setItem(k, JSON.stringify(WS)); }catch(e){}\n}\n}catch(e){ console.warn('ws', e); }"
]
]);
