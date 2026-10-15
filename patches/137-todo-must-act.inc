(function(){
  // What counts as "management is waiting for you" (not just information).
  const KINDS = [
    [/^Progress check/i, 'Fill it in now'], [/^Message/i, 'Read and reply'], [/QA visit/i, 'Read · tap Got it'], [/^Trial report/i, 'Write the report'],
    [/^Fix$/i, 'Fix the feedback'], [/^To fix/i, 'See what to fix'], [/^Reminder/i, 'Finish it'], [/^Leave/i, 'Answer'], [/^Inform/i, 'Tell the students'],
    [/^Pay$/i, 'Check your pay'], [/^Tagged/i, 'See why'], [/^Homework/i, 'Mark homework'], [/^Peer review/i, 'Review the class'], [/^Feedback/i, 'Write feedback']];
  const verb = (label, red) => { for(const [re, v] of KINDS) if(re.test(label)) return (re.source === '^Feedback' && !red) ? null : v; return null; };
  function harvest(root){
    const out = []; let h2 = [...root.querySelectorAll('h2')].find(x => /^To do/.test(x.textContent.trim())); if(!h2) return out;
    const card = h2.nextElementSibling; if(!card) return out;
    card.querySelectorAll(':scope > .li').forEach((li, i) => { const ch = li.querySelector('.chip'); if(!ch) return; const label = ch.textContent.trim(), red = ch.classList.contains('red');
      const v = verb(label, red); if(!v) return; const g = li.querySelector('.grow'), t = g ? g.innerText.trim().split('\n') : [''];
      out.push({ i, label, red, verb: v, title: t[0] || '', sub: t.slice(1).join(' · '), key: label + '|' + (t[0] || ''), li }); });
    return out; }
  const inClass = () => { try{ const now = Date.now(); return (D.schedule || []).some(c => c.day === D.today && !c.cancelled && Date.parse(c.start) <= now && Date.parse(c.end) > now); }catch(e){ return false; } };
  const snoozed = sig => { try{ const s = JSON.parse(localStorage.getItem('coe.mustSnooze') || 'null'); return s && s.sig === sig && Date.now() < s.until; }catch(e){ return false; } };
  window.mustLater = sig => { try{ localStorage.setItem('coe.mustSnooze', JSON.stringify({ sig, until: Date.now() + 2 * 3600e3 })); }catch(e){} closeSheet(); toast('OK · we will remind you again in 2 hours'); };
  window.mustGo = i => { const L = window._MUST || [], x = L[i]; if(!x) return; closeSheet(); setTimeout(() => { try{ const li = [...document.querySelectorAll('#v-today .li')].find(e => e.dataset.must === String(i)); (li || x.li).click(); }catch(e){} }, 120); };
  const row = (x, i, big) => '<div class="must-r"><div class="grow" style="min-width:0"><span class="chip ' + (x.red ? 'red' : 'coral') + '">' + esc(x.label) + '</span><div class="ell" style="margin-top:4px"><b>' + esc(x.title) + '</b></div>' + (x.sub ? '<div class="small mute ell">' + esc(x.sub) + '</div>' : '') + '</div><button class="btn ' + (big ? 'teal' : 'teal sm') + '" onclick="mustGo(' + i + ')">' + esc(x.verb) + '</button></div>';
  let POPPED = '';
  function paint(){
    if(!D || D.mgr) return; const root = $('v-today'); if(!root) return;
    const L = harvest(root); window._MUST = L; L.forEach((x, i) => x.li.dataset.must = String(i));
    const n = L.length; try{ document.title = (n ? '(' + n + ') ' : '') + 'CupOfEnglish'; if(navigator.setAppBadge) n ? navigator.setAppBadge(n) : navigator.clearAppBadge(); }catch(e){}
    const old = $('mustBox'); if(old) old.remove(); if(!n) return;
    if(!document.getElementById('mustCss')) document.head.insertAdjacentHTML('beforeend', '<style id="mustCss">#mustBox{border:2px solid #E4846B;background:#FFF6F2;border-radius:18px;padding:14px 16px;margin:14px 0 6px}#mustBox h3{margin:0 0 4px;font-size:17px}.must-r{display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1px dashed #F0C9BC}.must-r:first-of-type{border-top:0}.must-r .btn{flex:none;white-space:nowrap}@media(max-width:520px){.must-r{flex-wrap:wrap}.must-r .btn{width:100%}}</style>');
    const box = '<div id="mustBox"><h3>⚠ Management is waiting for ' + (n === 1 ? '1 thing' : n + ' things') + '</h3><div class="small mute" style="margin-bottom:6px">Please do ' + (n === 1 ? 'it' : 'these') + ' before your next class · ' + (n === 1 ? 'it leaves' : 'each one leaves') + ' this list once done</div>' + L.map((x, i) => row(x, i)).join('') + '</div>';
    const lead = root.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', box); else root.insertAdjacentHTML('afterbegin', box);
    // Pop up once when the app opens (and again when something new arrives), never during a class, "Later" = 2 hours.
    const sig = L.map(x => x.key).sort().join('¦'); window._mustSig = sig;
    if(POPPED === sig || snoozed(sig) || inClass() || VIEW !== 'today' || $('sheet').classList.contains('on')) return;
    clearTimeout(window._mustT); window._mustT = setTimeout(() => { if(POPPED === sig || $('sheet').classList.contains('on') || VIEW !== 'today') return; POPPED = sig;
      openSheet('<h1>Before you start</h1><p class="small mute" style="margin-top:-4px">Management is waiting for ' + (n === 1 ? 'this' : 'these ' + n + ' things') + '. It only takes a minute.</p>' + L.map((x, i) => row(x, i, true)).join('') +
        '<div style="margin-top:14px;text-align:center"><a class="link small" onclick="mustLater(window._mustSig)">Remind me in 2 hours</a></div>'); }, 2500);
    // A phone / laptop notification for each new item (once).
    try{ L.forEach(x => { if(!remTold('must:' + x.key)) notify('CupOfEnglish · to do', x.label + ' · ' + x.title, 'coe-must'); }); }catch(e){}
  }
  const _rt = window.renderToday; window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ paint(); }catch(e){ console.warn('must', e); } return r; };
})();
