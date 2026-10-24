// 773: (Misty) "the carried over lesson should be counted also in the validity adjustment".
// · Class notice: the months rule now uses package + carried over (e.g. 33 + 3 = 36 lessons); the line says "33 + 3 carried".
// · "Renewed · paid" sheet: the validity line uses lessons left (carried) + new lessons too.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const t = +x.units || 0, dt = String(x.date || '')", "const pk = +x.units || 0, cy = +x.carry || 0, t = Math.round((pk + cy) * 10) / 10, dt = String(x.date || '')"],
  ["'⚙︎ Automatic · ' + m + ' months (' + t + ' lessons) from '", "'⚙︎ Automatic · ' + m + ' months (' + (cy > 0 ? pk + ' + ' + cy + ' carried = ' : '') + t + ' lessons) from '"],
  ["if(isNaN(d)) return ''; const t = rpTot(); d.setMonth", "if(isNaN(d)) return ''; const t = rpTot() + Math.max(0, +((RPS && RPS.info && RPS.info.left) || 0)); d.setMonth"],
  ["<div class=\"small\" style=\"margin-top:4px\">Valid until <b>${rpDl()}</b> · ${t < 30 ? '4' : t < 60 ? '8' : '12'} months from", "<div class=\"small\" style=\"margin-top:4px\">Valid until <b>${rpDl()}</b> · ${tot < 30 ? '4' : tot < 60 ? '8' : '12'} months (${tot} lessons incl. carried) from"]
]);
