// 805: (Misty) "YES" (make every skill line truly the student's own) + "make the Chinese texts big enough … when sent as picture copy"
// Teacher · trial report form: under each of the 9 skills, a short line "What did you see?" (required, a few words with a real example).
//   It is sent with the report (database), kept on the device as a draft like the rest.
// Report (made in the app): each skill row shows the teacher's own line first (bold, with Chinese), and the CEFR can-do line
//   underneath in small grey as the reference. Reports sent before this keep the CEFR line as before.
// Picture copy: Chinese text larger and darker everywhere on the report (comments, recommendations, skill lines), and the report
//   is drawn at a higher resolution (3× instead of 2×; picture 2400 px wide instead of 1800) so it stays sharp when parents zoom in WeChat.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s0 = fs.readFileSync(file, 'utf8');
const n2 = (s0.match(/H2C\(P\[i\], \{ scale: 2, /g) || []).length; if (!n2) { console.error('H2C scale not found'); process.exit(1); }
s0 = s0.split('H2C(P[i], { scale: 2, ').join('H2C(P[i], { scale: 3, ');
fs.writeFileSync(file, s0);
lib(file, [
  ["scale: 1800 / vp0.width", "scale: 2400 / vp0.width"],
  [".tr-page i{font-style:normal;color:#5C5876}", ".tr-page i{font-style:normal;color:#3A3555;font-size:1.12em;line-height:1.55}.tr-own{font-weight:700;color:#2B2253}.tr-lvl{font-size:9.5px;color:#8A86A0;margin-top:4px;line-height:1.4}.tr-lvl i{font-size:1em;color:#8A86A0}"],
  [".tr-tx.zh{color:#5C5876;margin-top:4px}", ".tr-tx.zh{color:#3A3555;margin-top:5px;font-size:13.5px;line-height:1.65}"],
  ["commZh, nextZh, group, label: d ? d[0] : '' }; }", "commZh, nextZh, group, notes: t._notes || [], notesZh: t._notesZh || [], label: d ? d[0] : '' }; }"],
  ["<td>${e(cd[0])}<br><i>${e(cd[1])}</i></td>",
   "<td>${(F.notes || [])[k] ? '<b class=\"tr-own\">' + e(F.notes[k]) + '</b>' + ((F.notesZh || [])[k] ? '<br><i>' + e(F.notesZh[k]) + '</i>' : '') + '<div class=\"tr-lvl\">' + e(cd[0]) + '<br><i>' + e(cd[1]) + '</i></div>' : e(cd[0]) + '<br><i>' + e(cd[1]) + '</i>'}</td>"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 805 · the teacher's own line per skill */
(function(){
  if(window.__805 || typeof window.trPaint !== 'function') return; window.__805 = 1;
  const MIN = 10;
  const EX = ['e.g. answered “What do you do?” in 2–3 short sentences, paused to find words', 'e.g. clear overall; “v” in “very” sounded like “w”', 'e.g. used present simple well; mixed up he/she twice',
    'e.g. knew job words (meeting, client); needed help with “schedule”', 'e.g. asked me “How about you?” without being prompted', 'e.g. got the main idea of the dialogue on the 2nd listen',
    'e.g. followed 2-step instructions; asked to repeat once', 'e.g. read the short email and found the date and time', 'e.g. answered who/what questions; gave a short opinion'];
  const ok = () => typeof TRS !== 'undefined' && TRS && typeof TRF !== 'undefined' && TRF && TRF.form;
  const fix = () => { if(!ok()) return; const n = TRF.form.rate.length; if(!Array.isArray(TRS.notes) || TRS.notes.length !== n) TRS.notes = Array.from({ length: n }, (_, k) => (Array.isArray(TRS.notes) && TRS.notes[k]) || ''); };
  window.trNote = (k, v) => { fix(); TRS.notes[k] = v; try{ trSave(); }catch(e){} const el = document.getElementById('trn' + k); if(el) el.classList.toggle('bad', false); };
  document.head.insertAdjacentHTML('beforeend', '<style>.trn{margin-top:8px;width:100%;font-size:14px}.trn.bad{border-color:#E4846B;background:#FFF6F2}.trn-l{font-size:12px;color:#6F6B85;margin-top:8px}</style>');
  const _tp = window.trPaint;
  window.trPaint = function(){ const r = _tp.apply(this, arguments); try{ fix(); if(!ok()) return r;
      TRF.form.rate.forEach((x, k) => { const c = document.getElementById('trc' + k); if(!c || document.getElementById('trn' + k)) return;
        c.insertAdjacentHTML('afterend', '<div class="trn-l"><b>What did you see?</b> · one line with a real example, it goes on the report</div><input class="in-t trn" id="trn' + k + '" maxlength="220" placeholder="' + esc(EX[k] || 'e.g. what the student said or did') + '" value="' + esc(TRS.notes[k] || '') + '" oninput="trNote(' + k + ',this.value)">'); }); }catch(e){ console.warn('805', e); } return r; };
  const _sd = window.trSend;
  window.trSend = function(){ try{ fix(); if(ok()){ const k = TRS.notes.findIndex(v => String(v || '').trim().length < MIN);
      if(k > -1){ const el = document.getElementById('trn' + k); if(el){ el.classList.add('bad'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
        toast('Write what you saw · ' + String(TRF.form.rate[k].title).split('\n')[0].toLowerCase()); return; } } }catch(e){} return _sd.apply(this, arguments); };
  const base = window.api;
  const w = function(fn, tok, ctx, body){ if(fn === 'tTrialSubmit' && body && typeof body === 'object' && ok() && Array.isArray(TRS.notes) && TRS.notes.some(v => String(v || '').trim())) body.notes = TRS.notes.map(v => String(v || '').trim());
    return base.apply(this, arguments); };
  for(const k in base) try{ w[k] = base[k]; }catch(e){}
  window.api = w;
  // Management: the report made in the app picks up the teacher's lines (and their Chinese) before it is drawn.
  const _ti = window.tlInstant;
  if(typeof _ti === 'function') window.tlInstant = async function(){ const t = (typeof TLD !== 'undefined') ? TLD : null, self = this, a = arguments;
    if(t && !t._nDone){ t._nDone = 1; try{
      const r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, as: t.teacher || '' }) }).then(x => x.json());
      const sl = String(t.student || '').trim().toLowerCase(), c = String(t.code || '').trim().toUpperCase();
      const hit = ((r && r.list) || []).find(x => x.d === t.date && Array.isArray(x.n) && (x.s === sl || (c && x.c === c)));
      if(hit){ t._notes = hit.n; try{ const z = await api('mgmtZh', TOKEN, hit.n, [t.student, t.cn || '']); if(z && z.ok && Array.isArray(z.zh)) t._notesZh = z.zh; }catch(e){} } }catch(e){} }
    return _ti.apply(self, a); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
