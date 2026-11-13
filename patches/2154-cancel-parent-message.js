// 2154 (13 Nov · Misty 10:30): Cancel class › the reason box is where the parent's message is pasted AS IT IS.
// · Tapping a reason chip no longer adds "Parent asked · " in front of a pasted message (the chip is only marked; who asked is
//   already saved by "Who asked for this?"). An empty box, or one holding only a chip, still fills with the chip as before.
// · The box is a 2-line text area (a message of several lines can be pasted). When the message is in Chinese, its English
//   translation shows under it at once and is saved with it ("<message> · EN: <English>"), so the teacher reads it in English.
// · Proof to send (picture): the parent's own message is shown as it is, with the English under it; an English message gets the
//   Chinese translation as before.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ['<input id="eR" class="in-t" placeholder="e.g. Parent asked · student sick · school exam">',
   '<textarea id="eR" class="in-t" rows="2" style="resize:vertical;min-height:56px" placeholder="Paste the parent\'s message here as it is · or tap a reason below" oninput="cxEn2154(this)"></textarea><div id="eREn" class="small mute" style="margin-top:4px;white-space:pre-line"></div>'],
  ["reason: (($('eR')||{}).value||'').trim(),",
   "reason: (window.cxReason2154 ? cxReason2154() : (($('eR')||{}).value||'').trim()),"],
  ["const cxWhy = w => { const s = cxSplit(w); return esc(s.r) + (s.by ? ` <span class=\"cxby\">${esc(s.by)}</span>` : ''); };",
   "const cxWhy = w => { const s = cxSplit(w), k = s.r.indexOf(' · EN: '); return (k > -1 ? esc(s.r.slice(0, k)) + `<br><span class=\"small\">English: ${esc(s.r.slice(k + 7))}</span>` : esc(s.r)) + (s.by ? ` <span class=\"cxby\">${esc(s.by)}</span>` : ''); };   /* 2154 */"],
  ["CXP = { kind: 'cancel', e, why: w.r, by: w.by, zh: cxZh(w.r), cn: cxCnOf(e.code), url: '' };",
   "CXP = { kind: 'cancel', e, why: w.r, by: w.by, zh: cxZh(w.r), cn: cxCnOf(e.code), url: '' };\n{ const k = w.r.indexOf(' · EN: '); if(k > -1){ const o = w.r.slice(0, k).trim(), en = w.r.slice(k + 7).trim(); if(/[\\u4e00-\\u9fff]/.test(o)){ CXP.zh = o; CXP.zhEdit = 1; CXP.why = en; } else CXP.why = o; } }   /* 2154: the parent's message as it is + English */"],
  ["</script>\n</body>\n</html>",
   `</script>
<script id="x2154">
/* 2154 · Cancel class: the parent's message pasted as it is (no chip text in front) + English for the teacher */
(function(){
  const base = window.cxChip2044;
  window.cxChip2044 = function(b, r){ try{ const el = document.getElementById('eR');
    if(el){ const chips = [...b.parentNode.querySelectorAll('button')].map(x => x.textContent.trim()), v = String(el.value || '').trim();
      if(v && !chips.some(c => v === c || v.indexOf(c + ' · ') === 0)){ b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); return; } }
  }catch(e){} return base ? base.apply(this, arguments) : undefined; };
  let T = 0, EN = { src: '', en: '' };
  const zh = t => /[\\u4e00-\\u9fff]/.test(String(t || ''));
  window.cxEn2154 = function(el){ clearTimeout(T); const box = document.getElementById('eREn'), v = String(el && el.value || '').trim();
    if(!zh(v)){ EN = { src: '', en: '' }; if(box) box.textContent = ''; return; }
    if(EN.src === v && EN.en){ if(box) box.textContent = 'English for the teacher: ' + EN.en; return; }
    if(box) box.textContent = 'English for the teacher: translating…';
    T = setTimeout(() => { api('trEn', TOKEN, v).then(r => { const en = String((r && r.en) || '').trim(); const now = String((document.getElementById('eR') || {}).value || '').trim();
      if(now !== v) return; EN = { src: v, en }; const b2 = document.getElementById('eREn'); if(b2) b2.textContent = en ? 'English for the teacher: ' + en : 'No translation · the teacher sees the message as it is'; }).catch(() => {}); }, 600); };
  window.cxReason2154 = function(){ const v = String((document.getElementById('eR') || {}).value || '').trim(); if(!v) return '';
    const one = v.replace(/\\s*\\n+\\s*/g, ' ').replace(/\\s{2,}/g, ' ');
    return zh(v) && EN.src === v && EN.en ? one + ' · EN: ' + EN.en.replace(/\\s*\\n+\\s*/g, ' ') : one; };
})();
</script>
</body>
</html>`],
]);
