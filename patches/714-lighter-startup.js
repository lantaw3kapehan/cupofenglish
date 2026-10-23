// 714: (audit) Lighter app start. Management: the background warm-up of every teacher's page runs at most once every 30 minutes
// per browser and starts after 20 s (it ran on every reload — today's many updates meant many bursts of ~20 slow requests).
// Teacher: badges refresh every 5 minutes (was 2). The teacher-badge helper stops polling on management logins.
require('../tools/lib.js')(process.argv[2], [
["if(!window._wpT){ window._wpT = 1; setTimeout(async () => { for(const t of (MO.teachers || [])){ if(!TOKEN) break;",
 "if(!window._wpT){ window._wpT = 1; let _wl = 0; try{ _wl = +localStorage.getItem('coe.wpT') || 0; }catch(e){} if(Date.now() - _wl > 30 * 60000) setTimeout(async () => { try{ localStorage.setItem('coe.wpT', String(Date.now())); }catch(e){} for(const t of (MO.teachers || [])){ if(!TOKEN) break;"],
["}, 6000); } }", "}, 20000); } }"],
["const w = () => { const r = $('hRank'), g = $('v-growth'); if(!r || !g || !txT()){ setTimeout(w, 1500); return; }",
 "const w = () => { if(typeof D !== 'undefined' && D && D.mgr) return; const r = $('hRank'), g = $('v-growth'); if(!r || !g || !txT()){ setTimeout(w, 1500); return; }"],
["Date.now() - MYT > 100e3) loadMy(true).catch(() => {}); }, 120e3)", "Date.now() - MYT > 280e3) loadMy(true).catch(() => {}); }, 300e3)"],
]);
