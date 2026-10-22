// 22 Oct · Misty: in New case, attach the clause violated (like the Wi-Fi case) so every case is official and institutional.
// Choosing the subject shows "Clause violated" and writes it at the top of Action taken; the type, the amount (from Addendum No. 1,
// Clause 4.1 by excused/unexcused and new/regular) and the deduction points (by teacher tier, Clause 4.2-4.3) fill in when empty.
// Everything stays editable. Subjects about students, parents or operations get no clause.
require('../tools/lib.js')(process.argv[2], [
["  const ruleOf = s => { const r = RULES[s];", "  window.NT_RULES = RULES;\n  const ruleOf = s => { const r = RULES[s];"],
[`<label>Subject</label><select id="cS" class="in-t"><option></option>\${opts(L.subject)}</select>`,
 `<label>Subject</label><select id="cS" class="in-t" onchange="caseAuto('s')"><option></option>\${opts(L.subject)}</select><div id="cRule" class="small" style="display:none;margin-top:6px;padding:8px 10px;border-radius:10px;background:#FBECE8;color:#5A2418;line-height:1.45"></div>`],
["function caseSheet(){", `/* 615 · clause violated + amounts from Addendum No. 1 */
const CA_AMT = { late: { Excused: [100, 100], Unexcused: [100, 300] }, miss: { Excused: [100, 300], Unexcused: [300, 500] }, video: { Excused: [100, 100], Unexcused: [200, 200] } };
const CA_KIND = s => /Late Time-in|Late to Class/.test(s) ? 'late' : /Missed Lesson|Class Cancellation|Absence/.test(s) ? 'miss' : /Video Submission/.test(s) ? 'video' : /DSL/.test(s) ? 'dsl' : '';
const CA_TYPE = s => /Late|Missed|Cancellation|Absence/.test(s) ? 'Attendance' : /Video|DSL|Incomplete/.test(s) ? 'Teaching Compliance' : /Performance|Coaching/.test(s) ? 'Teaching Quality' : /Conversation|Communication|Oversharing|Boundary|Confidentiality/.test(s) ? 'Professional Conduct' : '';
const CA_PTS = { 'Newly Hired': 2, 'Starting Teacher': 4, 'Newly Qualified': 6, 'Junior Teacher': 8, 'Senior Teacher': 10, 'Master Teacher': 10 };
const CA_TAG = 'Violation of Addendum No. 1, Clause ';
window.caseAuto = function(){ const v = id => (($(id) || {}).value || ''), s = v('cS'), R = (window.NT_RULES || {})[s], box = $('cRule');
  if(box){ box.style.display = R ? '' : 'none'; box.innerHTML = R ? '<b>Clause violated · Addendum No. 1, Clause ' + esc(R[1]) + '</b><br>' + esc(R[0]) : ''; }
  const x = $('cX'); if(x){ const rest = x.value.split('\\n').filter(l => l.indexOf(CA_TAG) !== 0).join('\\n').replace(/^\\n+/, ''); x.value = R ? CA_TAG + R[1] + ': ' + R[0] + (rest ? '\\n' + rest : '') : rest; }
  const t = $('cT'); if(t && !t.value && CA_TYPE(s) && [...t.options].some(o => o.value === CA_TYPE(s))) t.value = CA_TYPE(s);
  const k = CA_KIND(s), a = $('cA'), c = v('cC'), st = v('cSt2');
  if(a && (!a.value || a.dataset.auto === '1')){ let n = ''; if(k === 'dsl') n = '600'; else if(CA_AMT[k] && CA_AMT[k][c] && st) n = String(CA_AMT[k][c][st === 'New' ? 0 : 1]); if(n || a.dataset.auto === '1'){ a.value = n; a.dataset.auto = n ? '1' : ''; } }
  const d = $('cD'), ti = v('cTi'); if(d && R && (k || /Professional|Teaching/.test(CA_TYPE(s))) && (!d.value || d.dataset.auto === '1') && CA_PTS[ti]){ d.value = String(CA_PTS[ti]); d.dataset.auto = '1'; } };
document.addEventListener('change', ev => { const t = ev.target; if(t && /^(cC|cSt2|cTi)$/.test(t.id) && $('cS')) caseAuto(); if(t && t.id === 'cA') t.dataset.auto = ''; if(t && t.id === 'cD') t.dataset.auto = ''; });
function caseSheet(){`],
]);
