(function(){
  // What each score looks like (same 9 skills and order as PR-DATA), shown under 1–4 on every skill.
  const A = [
    ['Single words, long pauses', 'Short phrases, often stops', 'Full sentences, a few pauses', 'Speaks at length, smoothly'],
    ['Hard to understand', 'Understood with effort', 'Clear, a few slips', 'Clear and natural'],
    ['Words without structure', 'Simple sentences, many errors', 'Mostly correct, some variety', 'Accurate, complex sentences'],
    ['Very basic words only', 'Basic words, often searches', 'Enough words for class topics', 'Wide, precise word choice'],
    ['Needs heavy prompting', 'Answers, rarely adds', 'Answers and adds ideas', 'Leads and keeps it going'],
    ['Needs gestures or Chinese', 'Slow, repeated speech only', 'Follows normal class talk', 'Follows fast, new talk'],
    ['Rarely responds correctly', 'Responds with help', 'Responds correctly most times', 'Quick, exact responses'],
    ['Reads single words', 'Gets the gist with help', 'Understands level texts alone', 'Understands above-level texts'],
    ['Cannot answer text questions', 'Answers with help', 'Answers most questions alone', 'Answers with reasons and detail']];
  const SEC = i => i < 5 ? ['s', 'speaking'] : i < 7 ? ['l', 'listening'] : ['r', 'reading'];
  const mon = m => { const x = new Date(String(m).slice(0, 7) + '-01T12:00:00'); return isNaN(x) ? String(m || '') : x.toLocaleDateString('en-GB', { month: 'long' }); };
  let CODE = '';
  function base(){ let s = null; try{ s = JSON.parse(store('get', 'coe.stu.' + CODE) || 'null'); }catch(e){} if(!s) return {};
    const today = D.today || '', chk = (s.checks || []).filter(c => c && c.date && c.date < today).sort((a, b) => b.date.localeCompare(a.date))[0] || null;
    const F = (Array.isArray(s.feedback) ? s.feedback : []).filter(f => f && f.s != null && f.month).sort((a, b) => String(b.month).localeCompare(String(a.month)));
    return { chk, fb: F[0] || null }; }
  // the score to compare with: last check (per skill) → trial (per skill) → monthly feedback (section average on 1–4)
  function guide(i, B){ const r9 = B.chk && Array.isArray(B.chk.r) && B.chk.r[i] ? B.chk.r[i] : 0; if(r9) return { v: r9, src: 'last check', exact: 1 };
    const tr = document.querySelector('#pci' + i + ' .pc-tr'); const tv = tr && +(tr.textContent.match(/\d/) || [0])[0]; if(tv) return { v: tv, src: 'trial', exact: 1 };
    if(B.fb){ const [k] = SEC(i), m = +B.fb[k] / 5; if(m > 0){ const v = Math.max(1, Math.min(4, 1 + (m - 1) * 3 / 4)); return { v: Math.round(v * 2) / 2, src: mon(B.fb.month) + ' feedback', exact: 0 }; } }
    return null; }
  function say(i, p, g){ if(!p || !g) return ''; const d = p - g.v;
    if(g.exact){ if(d === 0) return ['ok', '✓ Same as the ' + g.src + ' (' + g.v + ')'];
      if(d === 1) return ['up', '▲ One above the ' + g.src + ' (' + g.v + ') · give a real example in Progress'];
      if(d >= 2) return ['hi', '▲ ' + d + ' above the ' + g.src + ' (' + g.v + ') · very rare · check again'];
      return ['dn', '▼ Below the ' + g.src + ' (' + g.v + ') · fine if that is what you see today']; }
    if(d >= 1) return ['hi', 'Higher than the ' + g.src + ' suggests (about ' + g.v + ') · is this what the student does on their own?'];
    if(d <= -1.5) return ['dn', 'Lower than the ' + g.src + ' suggests (about ' + g.v + ') · fine if that is what you see today'];
    return ['ok', '✓ In line with the ' + g.src + ' (about ' + g.v + ')']; }
  function paint(){ const b = $('sheetBody'); if(!b || !$('pci0')) return; const B = base();
    if(!document.getElementById('pgCss')) document.head.insertAdjacentHTML('beforeend', '<style id="pgCss">.pc-o button .pg-a{display:block;font-size:12px;line-height:1.25;color:#6B7780;margin-top:3px;font-weight:400}.pc-o button.on .pg-a{color:#E6F4F4}.pc-o button.pg-g{box-shadow:inset 0 0 0 2px #7FA6D9}.pc-o button{position:relative}.pc-o button .pg-t{position:absolute;top:8px;right:8px;display:inline-block;font-size:10px;font-weight:800;letter-spacing:.04em;background:#2B5C9E;color:#fff;border-radius:6px;padding:1px 5px;}.pg-say{font-size:13px;margin-top:6px;padding:6px 10px;border-radius:10px}.pg-say.ok{background:#EAF7F1;color:#1E7A55}.pg-say.up{background:#FFF4DE;color:#8A5A00}.pg-say.hi{background:#FDECEA;color:#B23A22}.pg-say.dn{background:#F2F4F5;color:#4F5B62}.pg-hint{font-size:13px;color:#2B5C9E;margin-top:4px}</style>');
    for(let i = 0; i < 9; i++){ const it = $('pci' + i); if(!it) continue; const g = guide(i, B), btns = it.querySelectorAll('.pc-o button'); it.querySelectorAll('.pc-lt.sk').forEach(x => x.remove());
      btns.forEach(bt => { const v = +((bt.querySelector('b') || {}).textContent || 0); if(!bt.querySelector('.pg-a') && A[i] && A[i][v - 1]) bt.insertAdjacentHTML('beforeend', '<span class="pg-a">' + esc(A[i][v - 1]) + '</span>');
        const ex = bt.querySelector('.pg-t'); if(ex) ex.remove(); bt.classList.toggle('pg-g', !!(g && g.exact && g.v === v));
        if(g && g.exact && g.v === v && g.src === 'last check'){ const bb = bt.querySelector('b'); if(bb) bb.insertAdjacentHTML('afterend', '<span class="pg-t">LAST</span>'); } });
      let hint = it.querySelector('.pg-hint'); if(!hint){ it.querySelector('.pc-o').insertAdjacentHTML('beforebegin', '<div class="pg-hint"></div>'); hint = it.querySelector('.pg-hint'); }
      hint.textContent = g ? (g.exact ? 'Last time: ' + g.v + ' (' + g.src + ') · start from there and move only if you saw a change' : 'Guide: about ' + g.v + ' (' + g.src + ') · no earlier check for this skill') : 'No earlier score · use the descriptions under each number';
      const pick = +((it.querySelector('.pc-o button.on b') || {}).textContent || 0), s = say(i, pick, g); let el = it.querySelector('.pg-say');
      if(!s){ if(el) el.remove(); continue; } if(!el){ it.insertAdjacentHTML('beforeend', '<div class="pg-say"></div>'); el = it.querySelector('.pg-say'); } el.className = 'pg-say ' + s[0]; el.textContent = s[1]; } }
  const _pf = window.pcForm; window.pcForm = function(code){ CODE = code; return _pf.apply(this, arguments); };
  const _pp = window.pcPaint; window.pcPaint = function(){ const r = _pp.apply(this, arguments); try{ paint(); setTimeout(paint, 1500); }catch(e){ console.warn('pc guide', e); } return r; };
  const _pk = window.pcPick; window.pcPick = function(){ const r = _pk.apply(this, arguments); try{ setTimeout(paint, 0); }catch(e){} return r; };
})();
