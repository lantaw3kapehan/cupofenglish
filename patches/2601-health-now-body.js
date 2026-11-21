// 2601 (2598 follow-up): "App health now" showed the whole Overview box (class visits too). It now shows only the health check:
// how many checks ran, the ones that need attention (each its own line), and the slow screens in the last hour.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  const body = HL ? hlHtml() : '<div class=\"small mute\">Checking…</div>';",
   "  const I = (HL && HL.issues) || [], S = (HL && HL.slow) || [];\n  const body = !HL ? '<div class=\"small mute\">Checking…</div>' : '<div style=\"margin-top:6px\"><b style=\"color:' + (I.length ? '#A2462C' : '#1E6E4C') + '\">' + (I.length ? I.length + ' of ' + (HL.checks || '?') + ' checks need attention' : '✓ All ' + (HL.checks || '') + ' checks pass') + '</b></div>' + (I.length ? '<ul class=\"small\" style=\"margin:6px 0 0;padding-left:18px\">' + I.map(x => '<li style=\"margin:3px 0\">' + esc(x) + '</li>').join('') + '</ul>' : '') + (S.length ? '<div class=\"small mute\" style=\"margin-top:6px\">Slow to load (10 s or more), latest first: ' + S.slice(0, 6).map(x => esc(x[0] + ' ' + x[1] + ' ' + Math.round((+x[2] || 0) / 1000) + ' s')).join(' · ') + '</div>' : '');"],
]);
