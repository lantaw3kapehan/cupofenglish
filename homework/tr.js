/* 2730 (Misty 22 Nov 20:13): Translate in class, without leaving the full screen.
   Words come from our own copy of ECDICT (MIT licence, /dict/), so it opens at once and works in China; pinyin from pinyin-pro (MIT, /dict/pinyin.js).
   coeTr.button()  → a "Translate" button for a page's bar     coeTr.open(text) → the card with that word
   coeTr.chip(text, x, y) → a small "Translate" chip at a point (used after a double-click on a word)
   Words looked up today are kept on this computer (coe.tr.day); "Add to notes" / "Add to homework" are picked up by the class note in the app. */
(function(){
  if(window.coeTr) return;
  const ME = document.currentScript && document.currentScript.src || location.href, BASE = new URL('../dict/', ME).href;
  const css = `
.ctr{position:fixed;z-index:2147483000;right:16px;top:76px;width:330px;max-width:calc(100vw - 24px);max-height:calc(100vh - 100px);display:none;flex-direction:column;background:#fff;border:1px solid #E3E8EC;border-radius:16px;box-shadow:0 10px 30px rgba(43,34,83,.16);font-family:"COE Card Inter",Inter,system-ui,sans-serif;color:#2B2253;overflow:hidden}
.ctr.on{display:flex}[data-ctr].on{background:#E4F6F6!important;border-color:#9FE1CB!important;color:#0E6F68!important}.ctr *{box-sizing:border-box}
.ctr .hd{display:flex;align-items:center;gap:8px;padding:10px 12px 6px 14px;cursor:move;user-select:none;touch-action:none}
.ctr .hd b{font-size:14px;font-weight:700}.ctr .hd i{font-style:normal;font-size:12px;color:#8A93A0}
.ctr .x{margin-left:auto;border:0;background:transparent;font-size:20px;line-height:1;color:#8A93A0;cursor:pointer;padding:2px 6px;border-radius:8px}.ctr .x:hover{background:#F2F4F6}
.ctr form{display:flex;gap:6px;padding:0 12px 10px}
.ctr input{flex:1;min-width:0;height:38px;border:1px solid #D7DDE3;border-radius:10px;padding:0 12px;font:inherit;font-size:15px;color:#2B2253;outline:none}.ctr input:focus{border-color:#00B5B9;box-shadow:0 0 0 3px rgba(0,181,185,.15)}
.ctr form button{height:38px;border:0;border-radius:10px;background:#2B2253;color:#fff;font:inherit;font-size:14px;font-weight:700;padding:0 14px;cursor:pointer}
.ctr .bd{overflow:auto;padding:0 14px 12px}
.ctr .w{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.ctr .w b{font-size:24px;font-weight:800;letter-spacing:-.01em}
.ctr .ph{font-size:13px;color:#5C6573;display:flex;align-items:center;gap:6px;margin:2px 0 8px;flex-wrap:wrap}
.ctr .snd{display:inline-flex;align-items:center;gap:4px;border:1px solid #E3E8EC;background:#fff;border-radius:999px;padding:2px 9px;font:inherit;font-size:12px;font-weight:700;color:#0E6F68;cursor:pointer}.ctr .snd:hover{background:#E4F6F6}
.ctr .m{margin:6px 0}.ctr .m .zh{font-size:16px;line-height:1.45}.ctr .m .pos{font-size:12px;color:#8A93A0;margin-right:6px}.ctr .m .py{font-size:12px;color:#8A93A0;line-height:1.35}
.ctr .tg{display:flex;gap:5px;flex-wrap:wrap;margin:8px 0 2px}.ctr .tg span{font-size:11px;font-weight:700;border-radius:999px;padding:2px 9px;background:#EEEDFE;color:#3C3489}
.ctr .ac{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}.ctr .ac button{border:1px solid #D7DDE3;background:#fff;border-radius:10px;height:32px;padding:0 10px;font:inherit;font-size:13px;font-weight:700;color:#2B2253;cursor:pointer}.ctr .ac button:hover{background:#F6F7F9}.ctr .ac button.on{background:#E4F6F6;border-color:#9FE1CB;color:#0E6F68}
.ctr .mute{font-size:12px;color:#8A93A0;line-height:1.45}.ctr .from{font-size:12px;color:#8A93A0;margin-bottom:2px}
.ctr .row{display:flex;gap:8px;align-items:baseline;padding:6px 0;border-bottom:1px solid #F0F2F4;cursor:pointer}.ctr .row:last-child{border-bottom:0}.ctr .row b{font-size:15px;min-width:70px}.ctr .row span{font-size:14px}
.ctr .td{border-top:1px solid #F0F2F4;padding:8px 14px 10px;display:flex;gap:5px;flex-wrap:wrap;align-items:center}.ctr .td:empty{display:none}.ctr .td em{font-style:normal;font-size:12px;color:#8A93A0;margin-right:2px}
.ctr .td button{border:1px solid #E3E8EC;background:#fff;border-radius:999px;font:inherit;font-size:12px;padding:2px 9px;color:#2B2253;cursor:pointer}.ctr .td button.n{border-color:#9FE1CB;background:#E4F6F6}
.ctr-chip{position:fixed;z-index:2147483001;display:none;border:0;border-radius:999px;background:#2B2253;color:#fff;font-family:"COE Card Inter",Inter,system-ui,sans-serif;font-size:13px;font-weight:700;padding:6px 12px;cursor:pointer;box-shadow:0 4px 12px rgba(43,34,83,.25)}
.ctr-big{position:fixed;inset:0;z-index:2147483002;display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:rgba(255,255,255,.97);font-family:"COE Card Inter",Inter,system-ui,sans-serif;color:#2B2253;cursor:pointer;text-align:center;padding:24px}
.ctr-big.on{display:flex}.ctr-big .bw{font-size:min(14vw,110px);font-weight:800;letter-spacing:-.02em;line-height:1.05}.ctr-big .bp{font-size:min(4vw,28px);color:#5C6573}
.ctr-big .bz{font-size:min(9vw,72px);font-weight:700;color:#0E6F68;line-height:1.2;margin-top:10px}.ctr-big .by{font-size:min(3.4vw,26px);color:#8A93A0}.ctr-big .bh{position:absolute;bottom:18px;font-size:13px;color:#8A93A0}`;
  const st = document.createElement('style'); st.textContent = css; (document.head || document.documentElement).appendChild(st);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const TAG = { zk: 'Junior high', gk: 'Senior high', cet4: 'CET-4', cet6: 'CET-6', ielts: 'IELTS', toefl: 'TOEFL', gre: 'GRE' };
  const SPK = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const day = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);

  /* ---------- the dictionary (shards fetched once, kept for the visit) ---------- */
  const SH = new Map();
  const shard = path => { if(!SH.has(path)) SH.set(path, fetch(BASE + path).then(r => r.ok ? r.json() : {}).catch(() => { SH.delete(path); return {}; })); return SH.get(path); };
  const keyOf = w => { const s = w.toLowerCase().replace(/[^a-z]/g, ''); return (s.length >= 2 ? s.slice(0, 2) : (s + '_').slice(0, 2)) || '__'; };
  async function entry(w){ const d = await shard('en/' + keyOf(w) + '.json'); const lo = w.toLowerCase();
    let k = d[w] ? w : d[lo] ? lo : Object.keys(d).find(x => x.toLowerCase() === lo); if(k) return { w: k, e: d[k] };
    const base = d['@' + lo]; if(base){ const d2 = await shard('en/' + keyOf(base) + '.json'); if(d2[base]) return { w: base, e: d2[base], from: w }; }
    return null; }
  async function find(w){ w = w.trim().replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, ''); if(!w) return null; let r = await entry(w); if(r) return r;
    const lo = w.toLowerCase(), tries = [];
    if(/ies$/.test(lo)) tries.push(lo.slice(0, -3) + 'y'); if(/es$/.test(lo)) tries.push(lo.slice(0, -2)); if(/s$/.test(lo)) tries.push(lo.slice(0, -1));
    if(/ied$/.test(lo)) tries.push(lo.slice(0, -3) + 'y'); if(/ed$/.test(lo)) tries.push(lo.slice(0, -2), lo.slice(0, -1)); if(/(.)\1ed$/.test(lo)) tries.push(lo.slice(0, -3));
    if(/ing$/.test(lo)) tries.push(lo.slice(0, -3), lo.slice(0, -3) + 'e'); if(/(.)\1ing$/.test(lo)) tries.push(lo.slice(0, -4));
    if(/'s$/.test(lo)) tries.push(lo.slice(0, -2)); if(/ly$/.test(lo)) tries.push(lo.slice(0, -2));
    for(const t of tries){ if(t.length < 2) continue; r = await entry(t); if(r){ r.from = w; return r; } } return null; }
  async function zhFind(t){ const d = await shard('zh/' + (t.codePointAt(0) % 64) + '.json'); if(d[t]) return d[t];
    for(let n = t.length - 1; n >= 1; n--){ const s = t.slice(0, n), d2 = await shard('zh/' + (s.codePointAt(0) % 64) + '.json'); if(d2[s]) return d2[s]; } return null; }
  let PY = null; const pinyinLib = () => PY || (PY = new Promise(ok => { if(window.pinyinPro) return ok(window.pinyinPro); const s = document.createElement('script'); s.src = BASE + 'pinyin.js'; s.onload = () => ok(window.pinyinPro || null); s.onerror = () => { PY = null; ok(null); }; document.head.appendChild(s); }));
  const py = async t => { const L = await pinyinLib(); if(!L || !/[一-鿿]/.test(t)) return ''; try{ return L.pinyin(t.replace(/[^一-鿿，；,; ]/g, ''), { toneType: 'symbol' }).replace(/\s*([，；,;])\s*/g, '$1 ').replace(/\s+/g, ' ').trim(); }catch(e){ return ''; } };
  const split = line => { const m = /^((?:[a-z]+\.\s*)+)(.*)$/.exec(line); return m ? { pos: m[1].trim(), zh: m[2].trim() } : { pos: '', zh: line.trim() }; };

  /* ---------- words looked up today (this computer) ---------- */
  const load = () => { try{ const o = JSON.parse(localStorage.getItem('coe.tr.day') || 'null'); return o && o.day === day() ? o : { day: day(), L: [] }; }catch(e){ return { day: day(), L: [] }; } };
  const save = o => { try{ localStorage.setItem('coe.tr.day', JSON.stringify(o)); }catch(e){} };
  function note(w, zh, flag){ const o = load(); let it = o.L.find(x => x.w.toLowerCase() === w.toLowerCase());
    if(!it){ it = { w, zh, at: Date.now(), n: 0, h: 0 }; o.L.push(it); if(o.L.length > 40) o.L.shift(); }
    if(zh) it.zh = zh; it.at = Date.now(); if(flag) it[flag] = it[flag] ? 0 : 1; save(o); return it; }

  /* ---------- the card ---------- */
  let C = null, CUR = null, CHIP = null, BIG = null;
  function build(){ if(C) return C; C = document.createElement('div'); C.className = 'ctr'; C.setAttribute('role', 'dialog'); C.setAttribute('aria-label', 'Translate');
    C.innerHTML = '<div class="hd"><b>Translate</b><i>翻译</i><button class="x" type="button" aria-label="Close">×</button></div>'
      + '<form autocomplete="off"><input type="text" placeholder="A word or 中文" spellcheck="false" aria-label="Word to translate"><button type="submit">Go</button></form><div class="bd"></div><div class="td"></div>';
    document.body.appendChild(C);
    C.querySelector('.x').onclick = close;
    C.querySelector('form').onsubmit = e => { e.preventDefault(); show(C.querySelector('input').value); };
    ['keydown', 'keyup', 'keypress'].forEach(t => C.addEventListener(t, e => { if(e.key !== 'Escape') e.stopPropagation(); }));
    C.addEventListener('pointerdown', e => e.stopPropagation()); C.addEventListener('wheel', e => e.stopPropagation(), { passive: true });
    const hd = C.querySelector('.hd'); let dr = null;
    hd.addEventListener('pointerdown', e => { if(e.target.closest('.x')) return; const r = C.getBoundingClientRect(); dr = { x: e.clientX - r.left, y: e.clientY - r.top }; hd.setPointerCapture(e.pointerId); });
    hd.addEventListener('pointermove', e => { if(!dr) return; const x = Math.max(4, Math.min(innerWidth - 60, e.clientX - dr.x)), y = Math.max(4, Math.min(innerHeight - 40, e.clientY - dr.y)); C.style.left = x + 'px'; C.style.top = y + 'px'; C.style.right = 'auto'; });
    hd.addEventListener('pointerup', () => { dr = null; });
    C.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if(!b) return; const a = b.dataset.a;
      if(a === 'w') show(b.dataset.w);
      else if(a === 'uk' || a === 'us') say(CUR && CUR.w, a);
      else if(a === 'big') big();
      else if((a === 'n' || a === 'h') && CUR){ const it = note(CUR.w, CUR.zh, a); b.classList.toggle('on', !!it[a]); b.textContent = a === 'n' ? (it.n ? '✓ In class notes' : 'Add to notes') : (it.h ? '✓ In homework' : 'Add to homework'); today(); } });
    return C; }
  function today(){ const o = load(), el = C && C.querySelector('.td'); if(!el) return; const L = o.L.slice(-12);
    el.innerHTML = L.length ? '<em>Today</em>' + L.map(x => '<button type="button" data-a="w" data-w="' + esc(x.w) + '" class="' + (x.n || x.h ? 'n' : '') + '" title="' + esc(x.zh || '') + '">' + esc(x.w) + '</button>').join('') : ''; }
  function say(w, v){ if(!w) return; let done = false; const tts = () => { if(done) return; done = true; try{ const u = new SpeechSynthesisUtterance(w); u.lang = v === 'uk' ? 'en-GB' : 'en-US'; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); }catch(e){} };
    try{ const a = new Audio('https://dict.youdao.com/dictvoice?audio=' + encodeURIComponent(w) + '&type=' + (v === 'uk' ? 1 : 2)); a.onerror = tts; const t = setTimeout(tts, 2500); a.onplaying = () => { clearTimeout(t); done = true; }; a.play().catch(() => { clearTimeout(t); tts(); }); }catch(e){ tts(); } }
  function big(){ if(!CUR) return; if(!BIG){ BIG = document.createElement('div'); BIG.className = 'ctr-big'; document.body.appendChild(BIG); BIG.onclick = () => BIG.classList.remove('on'); }
    BIG.innerHTML = '<div class="bw">' + esc(CUR.w) + '</div>' + (CUR.ph ? '<div class="bp">/' + esc(CUR.ph) + '/</div>' : '') + '<div class="bz">' + esc(CUR.zh || '') + '</div>' + (CUR.py ? '<div class="by">' + esc(CUR.py) + '</div>' : '') + '<div class="bh">Tap anywhere or press Esc to go back</div>';
    place(BIG); BIG.classList.add('on'); }
  async function show(text){ build(); open0(); text = String(text || '').replace(/\s+/g, ' ').trim(); const inp = C.querySelector('input'), bd = C.querySelector('.bd'); inp.value = text; today();
    if(!text){ bd.innerHTML = '<div class="mute">Type a word, or double-click a word on the page.</div>'; setTimeout(() => inp.focus(), 30); return; }
    const my = {}; show.my = my; bd.innerHTML = '<div class="mute">Looking up…</div>';
    if(/[一-鿿]/.test(text)){ const t = text.replace(/[^一-鿿]/g, ''), L = await zhFind(t), p = await py(t); if(show.my !== my) return;
      CUR = null; bd.innerHTML = '<div class="w"><b>' + esc(t) + '</b></div>' + (p ? '<div class="ph">' + esc(p) + '</div>' : '')
        + (L && L.length ? '<div class="mute" style="margin-bottom:4px">In English · tap one for its meaning</div>' + L.map(w => '<div class="row" data-a="w" data-w="' + esc(w) + '"><b>' + esc(w) + '</b></div>').join('') : '<div class="mute">Not in our dictionary yet. Try a shorter word.</div>');
      return; }
    const r = await find(text); if(show.my !== my) return;
    if(!r && /\s/.test(text)){ const ws = text.split(/\s+/).map(w => w.replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, '')).filter(Boolean).slice(0, 14), R = [];
      for(const w of ws){ const x = await find(w); R.push({ w, z: x ? split(x.e[1][0] || '').zh : '' }); } if(show.my !== my) return; CUR = null;
      bd.innerHTML = '<div class="mute" style="margin-bottom:4px">Word by word · whole-sentence translation is not connected yet</div>' + R.map(x => '<div class="row" data-a="w" data-w="' + esc(x.w) + '"><b>' + esc(x.w) + '</b><span>' + esc(x.z || '–') + '</span></div>').join('');
      return; }
    if(!r){ CUR = null; bd.innerHTML = '<div class="mute">“' + esc(text) + '” is not in our dictionary. Check the spelling, or try the base word (run, not running).</div>'; return; }
    const [ph, tr, tags] = r.e, M = tr.map(split), zh1 = M.map(m => m.zh).join('；'), P = await Promise.all(M.map(m => py(m.zh))); if(show.my !== my) return;
    CUR = { w: r.w, ph, zh: M[0] ? M[0].zh.split(/[,，；;]/).slice(0, 3).join('，') : '', py: '' }; CUR.py = await py(CUR.zh); if(show.my !== my) return;
    const it = note(r.w, CUR.zh), tg = String(tags || '').split(/\s+/).filter(t => TAG[t]).map(t => TAG[t]);
    bd.innerHTML = (r.from ? '<div class="from">' + esc(r.from) + ' → ' + esc(r.w) + '</div>' : '')
      + '<div class="w"><b>' + esc(r.w) + '</b></div>'
      + '<div class="ph">' + (ph ? '/' + esc(ph) + '/' : '') + '<button type="button" class="snd" data-a="uk">' + SPK + 'UK</button><button type="button" class="snd" data-a="us">' + SPK + 'US</button></div>'
      + M.map((m, i) => '<div class="m"><div class="zh">' + (m.pos ? '<span class="pos">' + esc(m.pos) + '</span>' : '') + esc(m.zh) + '</div>' + (P[i] ? '<div class="py">' + esc(P[i]) + '</div>' : '') + '</div>').join('')
      + (tg.length ? '<div class="tg">' + tg.map(t => '<span>' + esc(t) + '</span>').join('') + '</div>' : '')
      + '<div class="ac"><button type="button" data-a="big">Show big</button><button type="button" data-a="n" class="' + (it.n ? 'on' : '') + '">' + (it.n ? '✓ In class notes' : 'Add to notes') + '</button><button type="button" data-a="h" class="' + (it.h ? 'on' : '') + '">' + (it.h ? '✓ In homework' : 'Add to homework') + '</button></div>';
    today(); }
  const host = () => document.fullscreenElement && document.fullscreenElement !== document.documentElement ? document.fullscreenElement : document.body;
  const place = el => { if(el && el.parentNode !== host()) host().appendChild(el); };
  document.addEventListener('fullscreenchange', () => { [C, CHIP, BIG].forEach(el => { if(el && el.parentNode) place(el); }); });
  function open0(){ build(); place(C); if(!C.classList.contains('on')){ C.classList.add('on'); BTN.forEach(b => b.classList.add('on')); } }
  function close(){ if(C) C.classList.remove('on'); BTN.forEach(b => b.classList.remove('on')); hideChip(); }
  function toggle(){ if(C && C.classList.contains('on')) close(); else show(''); }
  function hideChip(){ if(CHIP) CHIP.style.display = 'none'; }
  function chip(text, x, y){ text = String(text || '').trim(); if(!text || text.length > 60) return; if(!CHIP){ CHIP = document.createElement('button'); CHIP.type = 'button'; CHIP.className = 'ctr-chip'; document.body.appendChild(CHIP);
      CHIP.addEventListener('pointerdown', e => { e.stopPropagation(); e.preventDefault(); }); CHIP.onclick = e => { e.stopPropagation(); hideChip(); show(CHIP.dataset.t); }; }
    place(CHIP); CHIP.dataset.t = text; CHIP.textContent = 'Translate · ' + (text.length > 18 ? text.slice(0, 17) + '…' : text);
    CHIP.style.display = 'block'; const w = CHIP.offsetWidth; CHIP.style.left = Math.max(6, Math.min(innerWidth - w - 6, x - w / 2)) + 'px'; CHIP.style.top = Math.max(6, y - 44) + 'px';
    clearTimeout(chip.t); chip.t = setTimeout(hideChip, 5000); }
  const BTN = [];
  function button(cls){ const b = document.createElement('button'); b.type = 'button'; if(cls) b.className = cls; b.dataset.ctr = '1'; b.title = 'Translate a word (English ↔ 中文) without leaving the screen'; b.textContent = 'Translate';
    b.addEventListener('click', e => { e.preventDefault(); toggle(); }); BTN.push(b); return b; }

  /* a double-click on words in the page offers the chip (writing, homework, speaking, notes …); the book pages use chip() themselves */
  document.addEventListener('dblclick', e => { if(C && C.contains(e.target)) return; setTimeout(() => { const s = window.getSelection && getSelection(), t = s ? String(s).trim() : '';
      if(!t || t.length > 60 || !/[A-Za-z一-鿿]/.test(t)) return; let r = null; try{ r = s.getRangeAt(0).getBoundingClientRect(); }catch(err){}
      chip(t, r && r.width ? r.left + r.width / 2 : e.clientX, r && r.height ? r.top : e.clientY); }, 10); });
  document.addEventListener('pointerdown', e => { if(CHIP && e.target !== CHIP) hideChip(); }, true);
  window.addEventListener('keydown', e => { if(e.key !== 'Escape') return; if(BIG && BIG.classList.contains('on')){ BIG.classList.remove('on'); e.stopImmediatePropagation(); e.preventDefault(); return; }
    if(C && C.classList.contains('on')){ close(); e.stopImmediatePropagation(); e.preventDefault(); } }, true);
  window.coeTr = { button, open: show, close, toggle, chip, find };
})();
