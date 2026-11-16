/* 2258 · Teacher profile cards, made easy (Misty 16 Nov 11:31 / 11:33)
   One screen for every teacher's card: Teachers › "Profile cards". Edit on the left, the picture updates on the right,
   Copy picture → paste in WeChat. No QR code on the cards any more. Photos are kept in the database (no Google needed). */
(function(){
  if(window.__prf2258) return; window.__prf2258 = 1;
  try{ const st = document.createElement('style'); st.textContent = `
.prf2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:22px;align-items:start;margin-top:12px}
@media (max-width:900px){.prf2{grid-template-columns:1fr}.prf2-p{order:-1}}
.prf2-p .st{position:sticky;top:0;background:#fff;padding-bottom:6px}
.prf2-p img#prfImg{display:block;width:100%;max-height:72vh;object-fit:contain;border:1px solid var(--line);border-radius:14px;background:#fff;margin:0}
.prf2-f label{margin-top:14px}
.prf2-f .hint{font-size:12.5px;color:var(--mute);margin-top:3px}
.prf2-ph{display:flex;gap:14px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:14px}
.prf2-ph .av{width:76px;height:76px;border-radius:50%;background:#EEF7F6;flex:none;overflow:hidden;display:flex;align-items:center;justify-content:center;font:400 34px "Fredoka One",sans-serif;color:#7DC9C1;border:2px solid #16BCB0}
.prf2-ph .av img{width:100%;height:100%;object-fit:cover}
.prf2-mx{display:grid;grid-template-columns:78px 1fr 30px;gap:6px;align-items:center;margin-top:6px}
.prf2-mx input{width:100%;border:1px solid var(--line);border-radius:10px;padding:9px 10px;font-size:15px;background:#fff}
.prf2-mx button{border:0;background:none;color:var(--mute);font-size:20px;cursor:pointer}
.prf2-tot{font-size:12.5px;margin-top:6px}
.prf2-st{display:inline-block;font-size:12px;font-weight:700;border-radius:999px;padding:3px 10px;background:#EEF7F6;color:#0E7D74;margin-left:6px;vertical-align:middle}
.prf2-st.dirty{background:#FFF4E0;color:#8A5A0B}
.prfL{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin-top:12px}
.prfL button{border:1px solid var(--line);background:#fff;border-radius:16px;padding:14px 8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:8px;font-weight:700;color:var(--ink)}
.prfL button:hover{border-color:#16BCB0;background:#F4FBFA}
.prfL .av{width:84px;height:84px;border-radius:50%;background:#EEF7F6;overflow:hidden;display:flex;align-items:center;justify-content:center;font:400 36px "Fredoka One",sans-serif;color:#7DC9C1;border:2px solid #16BCB0}
.prfL .av img{width:100%;height:100%;object-fit:cover}
.prfL small{font-weight:400;color:var(--mute);font-size:12px}`; document.head.appendChild(st); }catch(e){}

  const cap = n => { n = String(n || '').replace(/^teacher\s+/i, '').trim(); return n ? n.charAt(0).toUpperCase() + n.slice(1) : ''; };
  const isData = p => /^data:image\//.test(String(p || ''));
  let MX = [];
  const mixParse = s => prfLines(s).map(l => { const x = l.match(/^(\d+(?:\.\d+)?)\s*%\s*(.*)$/); return x ? { p: x[1], t: x[2] } : { p: '', t: l }; });
  const mixText = () => MX.filter(r => r.p || r.t.trim()).map(r => (r.p ? r.p + '% ' : '') + r.t.trim()).join('\n');
  function mixPaint(){ const b = document.getElementById('prfMx'); if(!b) return;
    b.innerHTML = MX.map((r, i) => '<div class="prf2-mx"><input inputmode="numeric" value="' + esc(r.p) + '" placeholder="35" aria-label="Percent" oninput="prf2Mx(' + i + ',\'p\',this.value)"><input value="' + esc(r.t) + '" placeholder="教师示范（清晰讲解）" oninput="prf2Mx(' + i + ',\'t\',this.value)"><button type="button" title="Remove" onclick="prf2MxDel(' + i + ')">×</button></div>').join('') +
      '<button type="button" class="btn ghost sm" style="margin-top:8px" onclick="prf2MxAdd()">+ Add a line</button><div id="prfMxT" class="prf2-tot"></div>';
    mixTot(); }
  function mixTot(){ const t = document.getElementById('prfMxT'); if(!t) return; const s = MX.reduce((a, r) => a + (parseFloat(r.p) || 0), 0);
    t.innerHTML = s === 100 ? '<span style="color:#1E7A55">✓ Adds up to 100%</span>' : '<span style="color:#B0571E">Adds up to ' + s + '% · should be 100%</span>'; }
  function dirty(){ const s = document.getElementById('prfSt'); if(s){ s.className = 'prf2-st dirty'; s.textContent = 'Not saved yet'; } const g = document.getElementById('prfGo'); if(g) g.textContent = 'Save changes'; }
  window.prf2Mx = (i, k, v) => { if(!MX[i] || !PRFE) return; MX[i][k] = k === 'p' ? String(v).replace(/[^\d.]/g, '') : v; PRFE.mix = mixText(); mixTot(); dirty(); prfLater(); };
  window.prf2MxDel = i => { MX.splice(i, 1); if(PRFE){ PRFE.mix = mixText(); } mixPaint(); dirty(); prfLater(); };
  window.prf2MxAdd = () => { MX.push({ p: '', t: '' }); mixPaint(); };
  window.prf2Set = (k, v) => { if(!PRFE) return; PRFE[k] = v; dirty(); prfLater(); };
  window.prf2Thumb = () => { const P = PRFE, a = document.getElementById('prfAv'); if(!P || !a) return;
    a.innerHTML = P.photoIm ? '<img src="' + P.photoIm.src + '" alt="">' : esc(P.teacher.charAt(0).toUpperCase());
    const t = document.getElementById('prfAvT'); if(t) t.textContent = P.photoNew ? 'New photo · tap Save changes to keep it' : P.photoIm ? 'Photo on the card' : 'No photo yet'; };

  window.profOpen = async function(name){
    name = cap(name); if(!name) return; const lc = name.toLowerCase();
    openSheet('<h1>Teacher ' + esc(name) + ' · profile card</h1><div class="sk" style="height:320px"></div>'); $('sheet').classList.add('wide');
    try{ await prfLoad(); }catch(e){}
    const sv = PROFD && PROFD.profiles && PROFD.profiles[lc], s = sv || PROF_DEF[lc] || { sub: '专业英语教师', creds: '持证专业教师', skills: '', mix: '', style: '' };
    const P = PRFE = { teacher: name, sub: s.sub || '', creds: s.creds || '', skills: s.skills || '', mix: s.mix || '', style: s.style || '', photo: (sv && sv.photo) || '', qr: '', photoIm: null, qrIm: null, photoNew: '', qrNew: '' };
    MX = mixParse(P.mix); if(!MX.length) MX = [{ p: '35', t: '' }, { p: '35', t: '' }, { p: '20', t: '' }, { p: '10', t: '' }];
    const ta = (k, rows, ph) => '<textarea class="in-t" rows="' + rows + '" placeholder="' + esc(ph) + '" oninput="prf2Set(\'' + k + '\',this.value)">' + esc(P[k]) + '</textarea>';
    const st = sv ? '<span id="prfSt" class="prf2-st">Saved' + (sv.at ? ' · ' + esc(sv.at) : '') + '</span>' : '<span id="prfSt" class="prf2-st dirty">New card · not saved yet</span>';
    openSheet('<button type="button" class="btn ghost sm" style="margin-bottom:8px" onclick="prfList()">‹ All profile cards</button>' +
      '<h1 style="margin:0">Teacher ' + esc(name) + ' · profile card ' + st + '</h1><div class="small mute" style="margin-top:4px">For parents · change any line on the left and the picture on the right updates. Then <b>Copy picture</b> and paste it in WeChat.</div>' +
      '<div class="prf2"><div class="prf2-f">' +
        '<div class="prf2-ph"><div class="av" id="prfAv">' + esc(name.charAt(0)) + '</div><div style="flex:1"><b>Photo</b><div class="small mute" id="prfAvT">Loading…</div><div class="row" style="gap:6px;flex-wrap:wrap;margin-top:6px">' +
          '<label class="btn ghost sm" style="cursor:pointer">Choose photo<input type="file" accept="image/*" class="hide" onchange="prfPick(this,\'photo\')"></label>' +
          '<label class="btn ghost sm" style="cursor:pointer">Take it from an old card<input type="file" accept="image/*" class="hide" onchange="prfPick(this,\'card\')"></label></div>' +
          '<div class="hint">A square photo with the face in the middle works best. You can drag a photo onto <b>Choose photo</b>, or an old card picture onto <b>Take it from an old card</b>.</div></div></div>' +
        '<label>Line under the name</label>' + ta('sub', 2, '专业英语教师 · 擅长少儿英语启蒙与表达训练') +
        '<label>Qualifications</label>' + ta('creds', 4, '持证专业教师\n4年以上少儿英语教学经验') + '<div class="hint">One per line · shown in the middle of the box.</div>' +
        '<label>擅长领域 · strengths</label>' + ta('skills', 7, '自然拼读课程（Phonics）') + '<div class="hint">One per line · long lines wrap by themselves.</div>' +
        '<label>Teaching mix</label><div class="hint">Percent + what it is. Put the details in brackets （…） and the app puts them on their own line when they are long.</div><div id="prfMx"></div>' +
        '<label>Classroom style · the lines at the bottom</label>' + ta('style', 3, '课堂氛围轻松有趣……') + '<div class="hint">No need to write the teacher\'s name.</div>' +
      '</div><div class="prf2-p"><div class="st"><img id="prfImg" alt="Teacher profile card"><div id="prfWait" class="sk" style="height:420px"></div>' +
        '<div class="row" style="gap:8px;margin-top:10px"><button class="btn teal grow" onclick="prfCopy()">Copy picture</button><button class="btn ghost grow" onclick="prfCopy(1)">' + (navigator.share ? 'Share / save' : 'Save picture') + '</button></div>' +
        '<button class="btn block" id="prfGo" style="margin-top:8px" onclick="prfSave()">' + (sv ? 'Save changes' : 'Save this card') + '</button></div></div></div>');
    $('sheet').classList.add('wide'); mixPaint(); prf2Thumb(); prfDraw();
    const a = await prfImg(P.photo).catch(() => null); if(PRFE !== P) return; if(a){ P.photoIm = a; prfDraw(); } prf2Thumb();
  };

  window.prfList = async function(){
    openSheet('<h1>Profile cards</h1><div class="sk" style="height:200px"></div>'); $('sheet').classList.add('wide');
    try{ await prfLoad(); }catch(e){}
    const S = (PROFD && PROFD.profiles) || {}, names = {};
    Object.keys(PROF_DEF).forEach(k => names[k] = cap(k)); Object.keys(S).forEach(k => names[k] = cap(S[k].teacher || k));
    const L = Object.keys(names).sort();
    openSheet('<h1 style="margin:0">Profile cards</h1><div class="small mute" style="margin-top:4px">The teacher cards for parents · tap a teacher to edit or copy the picture.</div>' +
      '<div class="prfL">' + L.map(k => { const p = S[k] && S[k].photo; return '<button type="button" onclick="profOpen(\'' + esc(names[k]) + '\')"><span class="av">' + (isData(p) ? '<img src="' + p + '" alt="">' : esc(names[k].charAt(0))) + '</span>Teacher ' + esc(names[k]) +
        '<small>' + (S[k] ? (isData(p) ? 'Ready' : 'Needs a photo') : 'Not saved yet') + '</small></button>'; }).join('') + '</div>' +
      '<h2 style="margin-top:22px">New teacher</h2><div class="row" style="gap:8px"><input id="prfNew" class="in-t grow" placeholder="Teacher\'s name, e.g. Rose" onkeydown="if(event.key===\'Enter\')prf2New()"><button class="btn teal" onclick="prf2New()">Make a card</button></div>' +
      '<div class="hint small mute" style="margin-top:6px">The card starts with the usual lines; change them and add the photo, then Save.</div>');
    $('sheet').classList.add('wide');
  };
  window.prf2New = () => { const v = cap((document.getElementById('prfNew') || {}).value || ''); if(!v) return toast('Write the teacher\'s name'); if(!/^[A-Za-z][A-Za-z .'-]{0,30}$/.test(v)) return toast('Use the English name, e.g. Rose'); profOpen(v); };

  /* Teachers screen: a "Profile cards" button next to "All teachers · open times" */
  const addBtn = () => { try{ const v = document.getElementById('v-teachers'); if(!v || document.getElementById('prfBtn')) return; const a = document.getElementById('avaBtn');
    const b = document.createElement('button'); b.id = 'prfBtn'; b.className = 'btn ghost sm'; b.style.cssText = 'margin:8px 0 0 8px'; b.textContent = 'Profile cards'; b.onclick = () => prfList();
    if(a) a.after(b); else { const lead = v.querySelector('.lead'); if(lead) lead.appendChild(b); } }catch(e){} };
  const _rt = window.renderTeachers; if(typeof _rt === 'function'){ window.renderTeachers = renderTeachers = function(){ const r = _rt.apply(this, arguments); addBtn(); setTimeout(addBtn, 300); return r; }; }
  /* status chip after Save; a new photo counts as a change */
  const _sv = window.prfSave; if(_sv) window.prfSave = async function(){ const P = PRFE; await _sv.apply(this, arguments); const g = document.getElementById('prfGo'); if(g) g.textContent = 'Save changes';
    const sv = P && PROFD && PROFD.profiles && PROFD.profiles[P.teacher.toLowerCase()], s = document.getElementById('prfSt'); if(s && sv && sv.at === 'just now'){ s.className = 'prf2-st'; s.textContent = 'Saved · just now'; } prf2Thumb(); };
  /* "Take it from an old card": find the photo circle by its teal ring (works for the old poster screenshots too) */
  function ringCut(im){ try{ const W = im.naturalWidth, H = im.naturalHeight, k = Math.min(1, 1400 / W), w = Math.round(W * k), h = Math.round(H * k);
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.drawImage(im, 0, 0, w, h); const d = g.getImageData(0, 0, w, h).data;
    const teal = (x, y) => { const i = (y * w + x) * 4, r = d[i], gg = d[i + 1], b = d[i + 2]; return gg > 170 && b > 150 && r < 170 && gg - r > 45; };
    const y0 = Math.round(h * 0.28), y1 = Math.round(h * 0.70); let x1 = -1; const ys = [];
    for(let y = y0; y < y1; y++) for(let x = w - 1; x > w * 0.6; x--) if(teal(x, y)){ if(x > x1) x1 = x; break; }
    if(x1 < 0) return null;
    for(let y = y0; y < y1; y++) for(let x = x1; x > x1 - 8; x--) if(teal(x, y)){ ys.push(y); break; }
    if(!ys.length) return null; ys.sort((a, b) => a - b); const cy = ys[ys.length >> 1];
    let x0 = -1; for(let x = Math.round(x1 - 250); x > x1 - 0.45 * w; x--){ let hit = false; for(let dy = -3; dy <= 3; dy++) if(teal(x, cy + dy)) hit = true; if(hit){ x0 = x; break; } }
    if(x0 < 0) return null; const R = (x1 - x0) / 2, cx = x1 - R, rr = R - 9 * w / 1362, cy2 = cy + 4 * w / 1362;
    if(R < w * 0.08) return null;
    const o = document.createElement('canvas'); o.width = o.height = 520; const og = o.getContext('2d'); og.fillStyle = '#fff'; og.fillRect(0, 0, 520, 520);
    og.drawImage(im, (cx - rr) / k, (cy2 - rr) / k, 2 * rr / k, 2 * rr / k, 0, 0, 520, 520); return o.toDataURL('image/jpeg', 0.86); }catch(e){ return null; } }
  const _pk = window.prfPick; if(_pk) window.prfPick = async function(inp, kind){
    if(kind === 'card' && PRFE){ const f = inp.files && inp.files[0]; if(f){ const P = PRFE, im = await prfLd(URL.createObjectURL(f)); const u = im && ringCut(im);
      if(u){ inp.value = ''; P.photoNew = u; P.photoIm = await prfLd(u); prfDraw(); dirty(); prf2Thumb(); toast('Photo taken from the card · tap Save changes to keep it'); return; } } }
    const r = await _pk.apply(this, arguments); if(PRFE && PRFE.photoNew) dirty(); prf2Thumb(); return r; };
})();
