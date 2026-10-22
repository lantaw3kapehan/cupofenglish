// 22 Oct · Misty: "Celine can acknowledge on the app too as witness". Operations signs once in the app as witness for both
// parties after the teacher signs (date, time, IP recorded); the printed copy then carries the witness signature before the
// teacher takes it to the notary. Phone alert to Celine when a teacher signs; Contracts shows "X to witness" for Operations.
require('../tools/lib.js')(process.argv[2], [
[`(r.status === 'signed' && !r.pres_at && P ? '<button class="btn sm teal" onclick="ctCounter(' + r.id + ',\\'' + e(t) + '\\')">Countersign as President</button>' : '') +`,
 `(r.status === 'signed' && !r.pres_at && P ? '<button class="btn sm teal" onclick="ctCounter(' + r.id + ',\\'' + e(t) + '\\')">Countersign as President</button>' : '') +
          (r.status === 'signed' && !r.wit_at && !P ? '<button class="btn sm teal" onclick="ctWitness(' + r.id + ',\\'' + e(t) + '\\')">Sign as witness</button>' : '') +`],
[`(r.pres_at ? '<span>Countersigned</span><span>' + e(phT(r.pres_at)) + ' · ' + e(r.pres_name || '') + '</span>' : '') +`,
 `(r.pres_at ? '<span>Countersigned</span><span>' + e(phT(r.pres_at)) + ' · ' + e(r.pres_name || '') + '</span>' : '') +
          (r.wit_at ? '<span>Witness</span><span>' + e(phT(r.wit_at)) + ' · ' + e(r.wit_name || '') + '</span>' : (r.status === 'signed' ? '<span>Witness</span><span>Waiting for Operations</span>' : '')) +`],
["  let CNT = null, CNTT = 0;",
 `  window.ctWitness = function(id, t){ const b = $('sheetBody'); const r = (AD.rows || []).find(x => x.id === id); const d = r && tDoc(r.doc_id); if(!r || !d) return;
    b.innerHTML = '<div class="ct"><button class="btn ghost sm" style="margin-bottom:10px" onclick="ctTeacher(\\'' + e(t) + '\\')">‹ ' + e(t) + '</button><h1>Sign as witness</h1><div class="sub">' + e(d.title) + ' · signed by ' + e(r.typed_name || t) + ' on ' + e(phT(r.signed_at)) + '</div>' +
      '<div class="box sign"><div class="fine" style="margin:0 0 10px">You confirm that this document was signed in the app by ' + e(r.typed_name || t) + ' on the date shown, as recorded by the app. You sign once, as witness for both parties.</div>' +
      '<div class="lab">Your full name</div><input class="in" id="cwName" placeholder="e.g. Celine A. Santos"><div class="lab">Draw your signature</div><div class="pad" id="ctPad3"><span class="hint">Sign here</span><canvas></canvas><button type="button" class="clr" onclick="ctClear(\\'ctPad3\\')">Clear</button></div>' +
      '<button class="btn teal go" id="ctGo3" onclick="ctWitnessGo(' + id + ',\\'' + e(t) + '\\')">Sign as witness</button><div class="fine">Your date, time and IP address are recorded.</div>' +
      '<div class="row2"><button class="btn sm ghost" onclick="ctPrint(' + id + ')">Read what they signed</button></div></div></div>'; initPad('ctPad3'); };
  window.ctWitnessGo = async function(id, t){ const nm = ($('cwName').value || '').trim(); if(nm.length < 4 || !/\\s/.test(nm)) return toast('Type your full name'); const sig = padPng('ctPad3'); if(!sig) return toast('Draw your signature');
    const g = $('ctGo3'); g.disabled = true; g.textContent = 'Signing…';
    try{ await call('witness', { id, sig, name: nm }); toast('Signed as witness ✓'); await refresh(t); }catch(x){ g.disabled = false; g.textContent = 'Sign as witness'; toast(x.message); } };
  let CNT = null, CNTT = 0;`],
[`CNT = { n: (P ? w : 0) + q, txt: [P && w ? w + ' to countersign' : '', q ? q + ' to reply' : ''].filter(Boolean).join(' · ') };`,
 `const wt = (L.rows || []).filter(r => r.status === 'signed' && !r.wit_at).length;
      CNT = { n: (P ? w : wt) + q, txt: [P && w ? w + ' to countersign' : '', !P && wt ? wt + ' to witness' : '', q ? q + ' to reply' : ''].filter(Boolean).join(' · ') };`],
[`<td class="ln"></td><td class="gap"></td><td style="border:0"></td></tr><tr><td>Signature over printed name<br><small>Witness for both parties · Operations, CupOfEnglish</small></td>`,
 `<td class="ln" style="vertical-align:bottom">' + (r.wit_sig ? '<img src="' + r.wit_sig + '" alt="" style="height:44px;display:block">' : '') + '</td><td class="gap"></td><td style="border:0"></td></tr><tr><td>' + (r.wit_name ? '<b>' + e(r.wit_name) + '</b><br>' : 'Signature over printed name<br>') + '<small>Witness for both parties · Operations, CupOfEnglish' + (r.wit_at ? ' · signed in the App ' + e(phT(r.wit_at)) : '') + '</small></td>`],
]);
