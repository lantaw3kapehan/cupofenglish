/* 19 Oct · 327 · Teaching setup check (Misty: "do all")
   Teacher · Today: once a month, one screenshot of her teaching screen (solid white background, face lit and centred, headset, stable video).
     Until it is approved the card stays on Today: Not sent → Waiting for Operations → Approved ✓ (card gone) or Fix needed (with the note, upload again).
   Management · Performance: "Teaching setup · October" — every active teacher, the screenshot, Approve / Ask for a fix.
   Files: private storage bucket "setup" (coe-mgmt setupUpload / setupUrl); records: coe_setup_check. */
(function(){
  const call = (body) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, body)) }).then(x => x.json());
  const post = (fn, args) => call({ op: 'screen', fn, args: args || [] }).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN), isM = () => !!(typeof D !== 'undefined' && D && D.mgr && TOKEN);
  const ym = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 7);
  const mName = m => { try{ return new Date(m + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long' }); }catch(e){ return m; } };
  const RULES = 'Solid white background · face lit and centred · headset on · camera at eye level · nothing personal behind you';
  // ── teacher ──
  let ME = null, MEat = 0; try{ ME = JSON.parse(localStorage.getItem('coe.setup.me') || 'null'); }catch(e){}
  function loadMe(force){ if(!isT() || (!force && Date.now() - MEat < 5 * 6e4)) return; MEat = Date.now(); post('tSetupMe').then(d => { ME = d; try{ localStorage.setItem('coe.setup.me', JSON.stringify(d)); }catch(e){} card(); }).catch(() => { MEat = 0; }); }
  function card(){ const v = $('v-today'); if(!v || !isT()) return; let c = $('setupCard'); const cur = ME && (ME.rows || []).find(x => x.ym === ym()), st = cur ? cur.status : '';
    if(!ME || st === 'Approved'){ if(c) c.remove(); return; }
    const h = st === 'Waiting' ? `<b>📷 Teaching setup · ${esc(mName(ym()))}</b> <span class="chip amber">Waiting for Operations</span><div class="small mute" style="margin-top:4px">Sent ${esc(new Date(cur.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))} · you can send a better one any time</div><label class="btn sm ghost" style="margin-top:8px">Send another<input type="file" accept="image/*" hidden onchange="setupUp(this)"></label>`
      : st === 'Fix needed' ? `<b>📷 Teaching setup · ${esc(mName(ym()))}</b> <span class="chip red">Fix needed</span><div class="small" style="margin-top:4px;color:#B03A2E">${esc(cur.note || 'Please fix your setup and send a new screenshot.')}</div><div class="small mute">${RULES}</div><label class="btn sm" style="margin-top:8px">Send a new screenshot<input type="file" accept="image/*" hidden onchange="setupUp(this)"></label>`
      : `<b>📷 Teaching setup check · ${esc(mName(ym()))}</b><div class="small" style="margin-top:4px">Once a month: open your class screen (camera on) and send one screenshot.</div><div class="small mute">${RULES}</div><label class="btn sm" style="margin-top:8px">Send screenshot<input type="file" accept="image/*" hidden onchange="setupUp(this)"></label>`;
    if(!c){ c = document.createElement('section'); c.id = 'setupCard'; c.className = 'card'; c.style.cssText = 'padding:12px 14px;margin:0 0 12px'; const lead = v.querySelector('.lead'); if(lead) lead.after(c); else v.prepend(c); }
    if(c.dataset.h !== h){ c.innerHTML = h; c.dataset.h = h; } c.style.borderLeft = st === 'Fix needed' ? '4px solid #C0392B' : st === 'Waiting' ? '4px solid #F2C46D' : '4px solid var(--teal)'; }
  function shrink(file){ return new Promise((ok, no) => { const fr = new FileReader(); fr.onerror = no; fr.onload = () => { const im = new Image(); im.onerror = no; im.onload = () => {
    const k = Math.min(1, 1600 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
    cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height); ok(cv.toDataURL('image/jpeg', 0.82)); }; im.src = fr.result; }; fr.readAsDataURL(file); }); }
  window.setupUp = async function(inp){ const f = inp.files && inp.files[0]; if(!f) return; const lab = inp.parentNode; const was = lab.firstChild.textContent; lab.firstChild.textContent = 'Sending…';
    try{ const b64 = await shrink(f); const r = await call({ op: 'setupUpload', b64, type: 'image/jpeg' }); if(!r || !r.ok) throw r;
      toast('✓ Setup screenshot sent · Operations will check it'); loadMe(true); }
    catch(e){ lab.firstChild.textContent = was; toast('Not sent · ' + ((e && e.error) || 'check the connection and try again')); } inp.value = ''; };
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const x = _rt.apply(this, arguments); try{ card(); loadMe(); }catch(e){} return x; };
  // ── management ──
  let ALL = null, ALLat = 0; const URLS = {};
  function loadAll(force){ if(!isM() || (!force && Date.now() - ALLat < 2 * 6e4)) return; ALLat = Date.now(); post('mgmtSetupAll', [ym()]).then(d => { ALL = d || []; mPanel(); }).catch(() => { ALLat = 0; }); }
  function thumb(path, el){ if(URLS[path]){ el.src = URLS[path]; return; } call({ op: 'setupUrl', path }).then(r => { if(r && r.ok){ URLS[path] = r.url; el.src = r.url; } }); }
  window.setupView = function(path, who){ openSheet(`<h1>Teaching setup · ${esc(who)}</h1><div class="small mute">${RULES}</div><img id="setupBig" style="width:100%;border-radius:12px;margin-top:10px;background:#eee;min-height:200px">`); thumb(path, $('setupBig')); };
  window.setupDo = function(t, st){ let note = ''; if(st === 'Fix needed'){ note = prompt('What should ' + t + ' fix? (she sees this)', 'Please use a solid white background.'); if(note == null) return; }
    post('mgmtSetupReview', [t, ym(), st, note]).then(() => { toast(st === 'Approved' ? '✓ Approved · ' + t : 'Sent back to ' + t + ' to fix'); loadAll(true); }).catch(() => toast('Not saved · try again')); };
  function mPanel(){ const v = $('v-perf'); if(!v || VIEW !== 'perf' || !ALL) return; let p = $('setupPanel');
    const n = s => ALL.filter(x => (x.status || '') === s).length, wait = ALL.filter(x => x.status === 'Waiting');
    if(!p){ p = document.createElement('section'); p.id = 'setupPanel'; p.className = 'card'; p.style.cssText = 'padding:12px 14px;margin:0 0 14px'; const after = $('qaRc') || v.querySelector('.lead'); if(after) after.after(p); else v.prepend(p); }
    p.innerHTML = `<details${wait.length ? ' open' : ''}><summary><b>📷 Teaching setup · ${esc(mName(ym()))}</b> <span class="small mute">· ${n('Approved')} approved · ${wait.length} to check · ${n('Fix needed')} to fix · ${ALL.filter(x => !x.status).length} not sent</span></summary>
${ALL.map(x => `<div class="row small" style="gap:10px;align-items:center;padding:7px 0;border-top:1px solid var(--line)">${x.path ? `<img data-p="${esc(x.path)}" onclick="setupView('${esc(x.path)}','${esc(x.teacher)}')" style="width:72px;height:44px;object-fit:cover;border-radius:6px;background:#eee;cursor:pointer">` : '<div style="width:72px;height:44px;border-radius:6px;background:#f3f3f3"></div>'}
<div class="grow"><b>${esc(x.teacher)}</b> ${x.status === 'Approved' ? '<span class="chip green">Approved</span>' : x.status === 'Waiting' ? '<span class="chip amber">To check</span>' : x.status === 'Fix needed' ? '<span class="chip red">Fix needed</span>' : '<span class="mute">not sent yet</span>'}${x.note ? `<div class="mute">${esc(x.note)}</div>` : ''}</div>
${x.status === 'Waiting' ? `<button class="btn sm teal" onclick="setupDo('${esc(x.teacher)}','Approved')">Approve</button><button class="btn sm ghost" onclick="setupDo('${esc(x.teacher)}','Fix needed')">Ask for a fix</button>` : x.status === 'Approved' ? `<button class="btn sm ghost" onclick="setupDo('${esc(x.teacher)}','Fix needed')">Ask for a fix</button>` : ''}</div>`).join('')}</details>`;
    p.querySelectorAll('img[data-p]').forEach(im => thumb(im.dataset.p, im)); }
  const _rp = window.renderPerf; if(_rp) window.renderPerf = function(){ const x = _rp.apply(this, arguments); try{ mPanel(); loadAll(); }catch(e){} return x; };
  setTimeout(() => { if(isT()){ loadMe(); card(); } }, 3500);
})();
