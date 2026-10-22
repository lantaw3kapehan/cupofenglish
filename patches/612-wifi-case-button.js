// 22 Oct · Addendum No. 1 (3.2, 4.1) / POLICY PEN-025: a one-tap "Wi-Fi case" in Cases — the New case form opens already filled:
// subject DSL Policy Violation, ₱600 deduction, and the action text (first verified incident = final notice of breach).
require('../tools/lib.js')(process.argv[2], [
[`<button class="btn sm teal" onclick="caseSheet()">+ New case</button></div>`,
 `<button class="btn sm ghost" onclick="wifiCase()" title="Taught on Wi-Fi without approval · ₱600 (PEN-025)">+ Wi-Fi case</button> <button class="btn sm teal" onclick="caseSheet()">+ New case</button></div>`],
["async function sendCase(){",
 `function wifiCase(){ caseSheet(); const set = (id, v) => { const el = $(id); if(!el || v == null) return; if(el.tagName === 'SELECT' && ![...el.options].some(o => o.value === v || o.text === v)){ const o = document.createElement('option'); o.value = o.text = v; el.appendChild(o); } el.value = v; };
  setTimeout(() => { set('cS', 'DSL Policy Violation'); const ty = $('cT'); if(ty){ const o = [...ty.options].find(o => /penalt/i.test(o.text)); if(o) ty.value = o.value; }
    set('cA', '600'); set('cX', 'Taught on Wi-Fi without prior written approval (Addendum No. 1, Clauses 3.2 and 4.1; POLICY PEN-025). ₱600 per verified incident. First verified incident: final notice of breach. A further incident pauses new lesson offers until Operations verifies the wired connection (Clause 5.2). Notice sent in the app; 5 days to explain.');
    const d = $('cDone'); if(d) d.checked = false; toast('Choose the teacher, then add the case'); }, 60); }
async function sendCase(){`],
]);
