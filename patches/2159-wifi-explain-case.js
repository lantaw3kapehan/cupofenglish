// 2159 (13 Nov · Misty 13:49 "do all now"): the Wi-Fi rule made complete.
// (a) The locked teacher explains in the warning sheet (text + optional photo) → coe-wifi › explain → Celine's To do item shows it.
// (b) To do › Fix these › Wi-Fi item: See picture / See photo buttons.
// (c) "Taught on Wi-Fi · open a case": the case form is filled in from the Wi-Fi item: the teacher, the picture, the time, the clause
//     of her own contract (Addendum ₱600 / 2025 written warning), which incident this is (2nd = lesson offers paused), her explanation,
//     and the 5-day deadline (Clause 5.1). After 5 days To do shows "5 days are up" until "Decision written ✓".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["+ '<p class=\"wf-small\">' + E(t.after) + '</p>'",
   "+ (f.id ? '<div class=\"wf-ex\"><b>Explain to Operations</b>' + (f.explain ? '<div class=\"wf-sent\">Sent' + (f.explainAt ? ' ' + E(new Date(f.explainAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })) : '') + ': “' + E(f.explain) + '”</div>' : '') + '<textarea id=\"wfExT\" class=\"in-t\" rows=\"3\" maxlength=\"600\" placeholder=\"What happened? e.g. my cable internet stopped at 18:50, I switched to Wi-Fi for 5 minutes\"></textarea><label class=\"small\" style=\"display:block;margin-top:6px\">Photo (optional) <input type=\"file\" id=\"wfExF\" accept=\"image/*\"></label><button type=\"button\" class=\"btn ghost block\" id=\"wfExGo\" style=\"margin-top:8px\">' + (f.explain ? 'Send a new explanation' : 'Send my explanation') + '</button></div>' : '')   /* 2159 */\n      + '<p class=\"wf-small\">' + E(t.after) + '</p>'"],
  ["    shown = (f.id || 0) + ':' + f.status; }",
   "    if($b('wfExGo')) $b('wfExGo').onclick = async () => { const tx = String(($b('wfExT') || {}).value || '').trim(); if(tx.length < 3) return say('Write a short explanation');   /* 2159 */\n      const btn = $b('wfExGo'); btn.disabled = true; btn.textContent = 'Sending…'; let img = '';\n      try{ const fl = ($b('wfExF') || {}).files; if(fl && fl[0]) img = await window.wfImg2159(fl[0]); }catch(e){}\n      const r = await call('explain', { id: f.id, text: tx, img }); btn.disabled = false;\n      if(!r || !r.ok){ btn.textContent = 'Send my explanation'; return say((r && r.error) || 'Not sent · check your internet'); }\n      f = Object.assign({}, f, { explain: tx, explainAt: new Date().toISOString() }); C = { at: Date.now(), flag: f }; show(f, go); say('Explanation sent to Operations'); };\n    shown = (f.id || 0) + ':' + f.status; }"],
  ["say('Opening the Wi-Fi case');",
   "say('Opening the Wi-Fi case'); setTimeout(() => { try{ window.wfFill2159 && wfFill2159(r.info, teacher); }catch(e){} }, 450);   /* 2159 */"],
  ["x.kind === 'wifi' ? '<button type=\"button\" class=\"go\" onclick=\"wf2135Close('",
   "x.kind === 'wifi5' ? '<button type=\"button\" class=\"go\" onclick=\"wf2159Decided(' + (+x.id || 0) + ', this)\">Decision written ✓</button></div></div>' : x.kind === 'wifi' ? (x.proof ? '<a class=\"btn\" style=\"text-decoration:none\" target=\"_blank\" rel=\"noopener\" href=\"' + String(x.proof).replace(/[\"<>]/g, '') + '\">See picture</a>' : '') + (x.img ? '<a class=\"btn\" style=\"text-decoration:none\" target=\"_blank\" rel=\"noopener\" href=\"' + String(x.img).replace(/[\"<>]/g, '') + '\">See photo</a>' : '') + '<button type=\"button\" class=\"go\" onclick=\"wf2135Close('"],
  ["</script>\n</body>\n</html>",
   `</script>
<script id="x2159">
/* 2159 · Wi-Fi: the teacher's photo (made small before sending) · the case filled in · "Decision written ✓" */
(function(){
  if(window.__wf2159) return; window.__wf2159 = 1;
  const U = () => (typeof FAST_URL !== 'undefined' ? FAST_URL : 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe') + '-wifi';
  const say = m => { try{ toast(m); }catch(e){} };
  window.wfImg2159 = file => new Promise((ok, no) => { const fr = new FileReader(); fr.onerror = no; fr.onload = () => { const im = new Image(); im.onerror = no; im.onload = () => {
      const k = Math.min(1, 1280 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', 0.8)); }; im.src = fr.result; }; fr.readAsDataURL(file); });
  const dd = s => { try{ return new Date(String(s).length <= 10 ? s + 'T12:00:00+08:00' : s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Manila' }); }catch(e){ return String(s || ''); } };
  const hm = s => { try{ return new Date(s).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };
  window.wfFill2159 = function(info, teacher){ const $ = id => document.getElementById(id);
    if(!$('cX')){ say('Open Actions › Cases once, then tap “Taught on Wi-Fi · open a case” again'); return; }
    const I = info || {}, who = String(I.teacher || teacher || '').replace(/^Teacher\\s+/i, ''), add = I.contract === 'addendum', n = +I.incident || 1;
    const e = $('cE'); if(e && who){ const o = [...e.options].find(x => x.value.replace(/^Teacher\\s+/i, '').toLowerCase() === who.toLowerCase() || x.text.replace(/^Teacher\\s+/i, '').toLowerCase() === who.toLowerCase()); if(o) e.value = o.value; }
    const a = $('cA'); if(a) a.value = add ? '600' : '';
    const when = (I.day ? dd(I.day) : '') + (I.at ? ', ' + hm(I.at) : '');
    const rule = add ? 'Taught on Wi-Fi without prior written approval: Addendum No. 1, Clauses 3.2 and 4.1; POLICY PEN-025. ₱600 per verified lesson taught on Wi-Fi.'
      : 'Taught on Wi-Fi: Independent Contractor Agreement, Annex A, Technical Requirements (a) (cable internet, not Wi-Fi); Memo No. 20. Written warning (no amount is charged under the 2025 agreement without the teacher’s written consent).';
    const step = n <= 1 ? (add ? 'Incident no. 1: final notice of breach.' : 'Incident no. 1: written warning.')
      : 'Incident no. ' + n + ': a further incident. New lesson offers are paused until Operations verifies the wired connection (Clause 5.2 / PEN-025, Memo 20)' + (add ? '' : '; repeated violation may lead to disciplinary action, up to ending the contract (Annex A, Termination (c))') + '.';
    const x = $('cX'); if(x) x.value = 'Wi-Fi seen in the time-in / I’m in picture on ' + when + '.' + (I.proof ? ' Picture: ' + I.proof : '') + '\\n' + rule + '\\n' + step
      + (I.explain ? '\\nTeacher’s explanation: “' + I.explain + '”' + (I.explainImg ? ' (photo: ' + I.explainImg + ')' : '') : '\\nNo explanation yet.')
      + '\\nNotice sent in the app. 5 days to explain (Clause 5.1): until ' + (I.deadline ? dd(I.deadline) : '5 days from today') + '; then the written decision.';
    try{ x.dispatchEvent(new Event('input', { bubbles: true })); }catch(e){}
    say('Case filled in · check it and tap Add'); };
  window.wf2159Decided = async function(id, btn){ if(btn) btn.disabled = true;
    try{ const r = await fetch(U(), { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'decided', id }) }).then(x => x.json());
      if(!r || !r.ok) throw 0; say('✓ Off the list'); try{ if(window.o2091load) o2091load(true); }catch(e){} }catch(e){ if(btn) btn.disabled = false; say('Not saved · try again'); } };
  document.head.insertAdjacentHTML('beforeend', '<style id="d2159">.wf2135 .wf-ex{margin:12px 0;padding:12px;border-radius:12px;background:#F7F6FB;border:1px solid #E6E3F0}.wf2135 .wf-ex textarea{margin-top:8px;width:100%;box-sizing:border-box}.wf2135 .wf-sent{margin-top:6px;font-size:13px;color:#4A4660;line-height:1.45}</style>');
})();
</script>
</body>
</html>`],
]);
