// 768: (Misty) monthly feedback · "make it auto, tailored from the class notes, quick to fill · which notes go where".
// When the form opens with empty boxes, the three boxes are drafted for the parent from the teacher's own class notes (last 45 days):
//  · Strengths ← notes tagged ✓ Win (untagged notes that read as going well)
//  · Areas for improvement ← notes tagged ↗ Work on (untagged "needs to…" notes), turned into "We are helping Mia …"
//  · Next steps ← (only if the goals plan has not filled it) where they are in the book, the latest next-class plan, one home tip
// Untagged notes show where they went ("→ Strengths" / "→ Areas"); "✨ Redo from my notes" rebuilds the draft.
// A box still exactly as drafted asks once before sending ("Did you read the draft?"): checked, but not slow.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 768 · monthly feedback drafted from the class notes */
(function(){
  if(typeof fbPaint !== 'function' || window.__768) return; window.__768 = 1;
  const css = document.createElement('style'); css.textContent = '.fb-dr{margin-left:auto;background:#00737B;color:#fff;border:0;border-radius:99px;padding:6px 12px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}'
    + '.fb-tag{display:block;background:#FFF4DE;color:#8A5A00;border-radius:10px;padding:8px 11px;font-size:12.5px;margin:12px 0 0;line-height:1.45}.fb-to{display:inline-block;margin:0 8px 0 6px;font-size:11px;font-weight:700;color:#A86A00}'
    + '.fb-chk{font-size:12px;margin-top:4px}.fb-chk.d{color:#A86A00}.fb-chk.ok{color:#1E7A55}';
  document.head.appendChild(css);
  const NEED = /\b(needs?|tends?|struggl\w*|difficult\w*|hard time|not yet|unable|can'?t|cannot|improve|work on|focus|distract\w*|shy|hesitat\w*|forg[eo]t\w*|lying|sleepy|not participat\w*|camera|off-?task|playing|mix(es)? up|confus\w*|wrong)\b/i;
  const SKIP = /didn'?t attend|did not attend|absent|no class|cancel|no show|not present/i;
  const cap = t => t ? t.charAt(0).toUpperCase() + t.slice(1) : t, end = t => /[.!?]$/.test(t) ? t : t + '.';
  const clean = t => String(t || '').replace(/\s+/g, ' ').replace(/\s*\bI think\b[^.]*\.?/gi, '').trim();
  const sents = t => (clean(t).match(/[^.!?]+[.!?]*/g) || []).map(x => x.trim()).filter(x => x.length > 3);
  const list = A => A.length < 2 ? (A[0] || '') : A.slice(0, -1).join(', ') + ' and ' + A[A.length - 1];
  const skillsOf = N => { const S = []; N.forEach(n => String(n.skills || '').split(/[,;/]+/).map(x => x.trim().toLowerCase()).filter(Boolean).forEach(x => { if(S.indexOf(x) < 0) S.push(x); })); return S; };
  const TIP = { reading: 'read one short page aloud together each day (5 minutes)', speaking: 'ask {N} to tell you about the day in English for two minutes', listening: 'play the lesson audio or a short English story for 10 minutes a day',
    writing: 'help {N} write two or three sentences about the day', vocabulary: 'review five word cards from class each day', grammar: 'say three full sentences together about the day' };
  let TAGS = {};   /* "date|teacher" → kind, from tFbPlus (the same data the Class notes panel uses) */
  const kindOf = n => TAGS[n.date + '|' + (n.teacher || '')] || TAGS[n.date + '|'] || '';
  const destOf = n => { const k = kindOf(n); if(/Work on/.test(k) && !/Win/.test(k)) return 'areas'; if(/Win/.test(k)) return 'strengths'; return NEED.test(n.obs || '') ? 'areas' : 'strengths'; };
  function notes(){ const O = (typeof FBF !== 'undefined' && FBF && FBF.obs) || []; return O.filter(n => n && n.obs && !SKIP.test(String(n.obs))); }
  function draft(){
    const N = notes(), name = String((FBF && FBF.student) || 'Your child').split(/\s+/)[0];
    const good = N.filter(n => destOf(n) === 'strengths'), need = N.filter(n => destOf(n) === 'areas'), gs = skillsOf(good), ns = skillsOf(need);
    let st = good.length ? 'This month ' + name + ' did well' + (gs.length ? ' in ' + list(gs) : '') + '. ' + good.slice(0, 3).map(n => sents(n.obs).slice(0, 2).map(x => end(cap(x))).join(' ')).join(' ')
      : name + ' comes to class and keeps working steadily through the book.';
    let ar = ns.length ? name + ' is still working on ' + list(ns) + '. ' : ''; const seen = {};
    need.forEach(n => sents(n.obs).forEach(x => { if(Object.keys(seen).length >= 3) return;
      let y = x.replace(new RegExp('^(' + name + '|she|he|the student)\\s+(still\\s+)?needs?\\s+to\\s+', 'i'), 'We are helping ' + name + ' ').replace(/^(she|he)\s+/i, name + ' ');
      const k = y.toLowerCase().slice(0, 40); if(seen[k]) return; seen[k] = 1; ar += end(cap(y)) + ' '; }));
    if(!need.length) ar = name + ' can keep building ' + (gs[0] || 'speaking') + ' with more practice in full sentences.';
    const all = (FBF.obs || []).slice().sort((p, q) => String(q.date).localeCompare(String(p.date))), last = all.find(n => n.ended || n.next) || {};
    const book = String(last.ended || '').trim(), plan = String(last.next || '').replace(/^\s*continue from[^.]*\.\s*/i, '').trim();
    let nx = (book ? 'Next month we will continue from ' + book.replace(/\s*[-–]\s*/g, ' · ') + '. ' : 'Next month we will continue with the book. ')
      + (plan ? 'In class we will focus on ' + plan.replace(/\.$/, '').replace(/^([A-Z])(?=[a-z])/, c => c.toLowerCase()) + '. ' : '')
      + 'At home: ' + (TIP[ns[0] || gs[0] || 'reading'] || TIP.reading).replace(/\{N\}/g, name) + '.';
    return (FBF.form.texts || []).map(t => { const k = FB_TXT(t.title)[1]; return (k === 'strengths' ? st : k === 'areas' ? ar : k === 'next' ? nx : '').replace(/\s+/g, ' ').trim(); });
  }
  function fill(force){ if(!FBS || !FBF || !FBF.form || !notes().length) return false;
    const D2 = draft(), T = (FBF.form.texts || []).map(t => FB_TXT(t.title)[1]); let any = false;
    T.forEach((k, ti) => { const cur = String(FBS.texts[ti] || '').trim(), wasDraft = FBS._draft && cur === String(FBS._draft[ti] || '').trim();
      if(force || !cur || wasDraft){ FBS.texts[ti] = D2[ti]; any = true; } });
    FBS._draft = D2; try{ fbSave(); }catch(e){}
    document.querySelectorAll('#sheetBody textarea.fbtx').forEach((ta, ti) => { if(ta.value !== (FBS.texts[ti] || '')) ta.value = FBS.texts[ti] || ''; });
    return any; }
  async function loadTags(){ try{ const r = await api('tFbPlus', TOKEN, FBF.code); const T = {}; ((r && r.tags) || []).forEach(x => { T[x.date + '|' + (x.teacher || '')] = x.kind || ''; if(!T[x.date + '|']) T[x.date + '|'] = x.kind || ''; }); TAGS = T; }catch(e){} }
  const _paint = window.fbPaint;
  window.fbPaint = function(){ const r = _paint.apply(this, arguments);
    try{ if(FBS && !FBS._seen768 && !FBF.fix){ FBS._seen768 = 1; const code = FBF.code, emptyEx = () => (FBS.texts || []).every((t, i) => !String(t || '').trim() || (FBF.form.texts[i] && FB_TXT(FBF.form.texts[i].title)[1] === 'next'));
        if(emptyEx() && notes().length) Promise.race([loadTags(), new Promise(z => setTimeout(z, 2500))]).then(() => { if(!FBF || FBF.code !== code || !$('fbGo') || !emptyEx()) return;
          const T = (FBF.form.texts || []).map(t => FB_TXT(t.title)[1]), ni = T.indexOf('next'), keepNext = ni > -1 && String(FBS.texts[ni] || '').trim();
          const kept = keepNext ? FBS.texts[ni] : null; fill(false); if(keepNext){ FBS.texts[ni] = kept; const ta = document.querySelectorAll('#sheetBody textarea.fbtx')[ni]; if(ta) ta.value = kept; try{ fbSave(); }catch(e){} }
          decorate(); toast('✨ Drafted from your class notes · read and adjust'); });
        else loadTags().then(decorate); }
      decorate(); }catch(e){ console.warn('768', e); } return r; };
  function decorate(){ const b = $('sheetBody'); if(!b || !FBF || !FBS) return; const N = notes();
    const sum = b.querySelector('.gx-panel > summary, details.obs > summary'); if(sum && N.length && !sum.querySelector('.fb-dr')){ sum.style.display = 'flex'; sum.style.alignItems = 'center'; sum.style.gap = '10px';
      sum.insertAdjacentHTML('beforeend', '<button type="button" class="fb-dr" onclick="event.preventDefault();event.stopPropagation();fbRedo()">✨ ' + (FBS._draft ? 'Redo from my notes' : 'Draft from my notes') + '</button>'); }
    else if(sum && FBS._draft){ const bt = sum.querySelector('.fb-dr'); if(bt) bt.textContent = '✨ Redo from my notes'; }
    b.querySelectorAll('.gx-n').forEach(el => { if(el.querySelector('.fb-to') || !el.querySelector('.tg.no')) return; const t = (el.querySelector(':scope > div') || {}).textContent || '';
      if(!t.trim() || SKIP.test(t)) return; el.querySelector('.tg.no').insertAdjacentHTML('afterend', '<span class="fb-to">→ ' + (NEED.test(t) ? 'Areas' : 'Strengths') + '</span>'); });
    const tas = b.querySelectorAll('textarea.fbtx');
    if(FBS._draft && tas.length && !b.querySelector('.fb-tag')){ const sec = tas[0].closest('section'); const ng = N.filter(n => destOf(n) === 'strengths').length, na = N.length - ng;
      if(sec) sec.insertAdjacentHTML('beforebegin', '<div class="fb-tag">✨ <b>Drafted from your ' + N.length + ' class note' + (N.length === 1 ? '' : 's') + '</b> · Strengths from ' + ng + ' (✓ Win or going well) · Areas from ' + na + ' (↗ Work on or "needs to…") · Next steps from where you ended and your last plan.<br>Read each box, fix what isn\'t right, and add one real example from class.</div>'); }
    tas.forEach((ta, ti) => { const c = $('fbc' + ti); if(!c) return; const mark = () => { const same = FBS._draft && String(FBS.texts[ti] || '').trim() === String(FBS._draft[ti] || '').trim();
        c.className = 'small fb-chk ' + (same ? 'd' : 'ok'); c.textContent = String(FBS.texts[ti] || '').trim().split(/\s+/).filter(Boolean).length + ' words' + (FBS._draft ? (same ? ' · draft, not checked yet' : ' · ✓ checked') : ''); };
      mark(); if(!ta.dataset.m768){ ta.dataset.m768 = 1; ta.addEventListener('input', () => setTimeout(mark, 0)); } }); }
  window.fbRedo = function(){ const has = (FBS.texts || []).some((t, i) => String(t || '').trim() && !(FBS._draft && String(t).trim() === String(FBS._draft[i] || '').trim()));
    if(has && !confirm('Replace what you wrote with a new draft from your class notes?')) return;
    Promise.race([loadTags(), new Promise(z => setTimeout(z, 2500))]).then(() => { fill(true); document.querySelectorAll('#sheetBody textarea.fbtx').forEach(ta => ta.dispatchEvent(new Event('input'))); decorate(); toast('✨ Drafted from your class notes · read and adjust'); }); };
  const _send = window.fbSend;
  window.fbSend = function(){ try{ if(FBS && FBS._draft && !FBS._ok768){ const T = (FBF.form.texts || []).map(t => FB_TXT(t.title)[0]);
        const same = FBS._draft.map((d, i) => String(FBS.texts[i] || '').trim() === String(d || '').trim() ? T[i] : null).filter(Boolean);
        if(same.length){ if(!confirm('You have not changed the draft for: ' + same.join(', ') + '.\n\nDid you read it, and is it right for ' + (FBF.student || 'this student') + '?\nOK = send as it is · Cancel = let me check')) return; FBS._ok768 = 1; } } }catch(e){}
    return _send.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
