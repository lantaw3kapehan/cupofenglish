// 2331 (Misty 18 Nov): show where the month's bonus comes from under the bonus tile on My pay. Enrolment bonuses are already added the
// moment the student is Enrolled and paid (ACTIONS "Enrollment Bonus"); only Perfect Attendance waits for the 1st. Now the tile says so.
const file = process.argv[2];
const inc = `<script id="b2331">
/* 18 Nov · 2331 · bonus tile: what it is made of */
window.bon2331 = function(adj){ try{ const m0 = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 8) + '01';
  const L = (adj || []).filter(a => a && a.plus > 0 && String(a.date || '') >= m0);
  if(!L.length) return '<span>bonus</span>';
  const en = L.filter(a => /enrol/i.test(String(a.type || '') + ' ' + String(a.subject || ''))), oth = L.filter(a => en.indexOf(a) < 0);
  const nm = a => String(a.student || '').split(' · ')[0].trim();
  const parts = []; if(en.length) parts.push('Enrolment: ' + en.map(nm).filter(Boolean).join(', '));
  oth.forEach(a => parts.push(String(a.type || a.subject || 'Recognition') + (nm(a) ? ': ' + nm(a) : '')));
  return '<span>bonus</span><span style="display:block;margin-top:4px;color:#2D6A4F;font-size:13px;line-height:1.35">' + esc(parts.join(' · ')) + '<br>Added when the family pays</span>'; }catch(e){ return '<span>bonus</span>'; } };
</script>
`;
require('../tools/lib.js')(file, [
['<script id="b2278">', inc + '<script id="b2278">'],
['<span>bonus</span></div>\n<div class="stat"><b class="num minus">−${peso(me.monthDeduct)}</b>', '${window.bon2331 ? bon2331(adj) : \'<span>bonus</span>\'}</div>\n<div class="stat"><b class="num minus">−${peso(me.monthDeduct)}</b>']
]);
