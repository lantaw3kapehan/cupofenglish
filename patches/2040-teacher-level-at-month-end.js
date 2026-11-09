// 2040 (9 Nov 22:06, Misty: "yes to number 6, make it real time so it's objective and accurate"): teachers see their Gold / Silver /
//   Bronze level only when the month is closed (final). During the month they see their live score and place "so far" (the database
//   works it out again every 10 minutes), but no level, so no one believes she is Gold from a half-finished month. Management is unchanged.
const file = process.argv[2];
const STRIP = "const strip2040 = d => { try{ if(d && Array.isArray(d.months)) d.months.forEach(m => { if(m && !m.final){ (function w(o){ if(o && typeof o === 'object'){ if(Object.prototype.hasOwnProperty.call(o, 'level')) o.level = null; Object.keys(o).forEach(k => w(o[k])); } })(m); } }); }catch(e){} return d; };   /* 2040 */\n  ";
require('../tools/lib.js')(file, [
 ["try{ const c = JSON.parse(localStorage.getItem('coe.kx.me') || 'null'); if(c && c.on) K = c; }catch(e){}",
  STRIP + "try{ const c = JSON.parse(localStorage.getItem('coe.kx.me') || 'null'); if(c && c.on) K = strip2040(c); }catch(e){}"],
 ["post('tKpi').then(d => { K = d || null;", "post('tKpi').then(d => { K = strip2040(d) || null;"],
 ['<div style="font:800 26px/1 var(--brand,inherit);color:var(--ink)">${esc(me.level)}</div>',
  '<div style="font:800 26px/1 var(--brand,inherit);color:var(--ink)">${me.level ? esc(me.level) : \'<span style="font:600 14px/1.3 Inter,system-ui,sans-serif;color:#6B6782">Level at month end</span>\'}</div>'],
 ["${MED[me.level] || ''} ${esc(me.level || '')} · ${gapT(me)} · ${when}", "${me.level ? (MED[me.level] || '') + ' ' + esc(me.level) + ' · ' : 'Score ' + esc(String(me.total)) + ' · '}${gapT(me)} · ${when}"],
 ["(me.rank ? E(me.level) + (t >= 0 ? ' · ' + E(t) : '') : 'Not ranked yet')", "(me.rank ? (me.level ? E(me.level) + (t >= 0 ? ' · ' + E(t) : '') : 'Score' + (t >= 0 ? ' ' + E(t) : '')) : 'Not ranked yet')"]
]);
