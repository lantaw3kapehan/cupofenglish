/* 19 Oct · 352 · "Change teacher" becomes "Change teacher / schedule" (Misty: Lewis moves from Teacher Julia Mon 18:30
   to Teacher Mayi Mon 17:30 + Wed 19:00, book OD1 · "how to solve two schedules, or multiple schedules?")
   One sheet, any number of weekly days:
   1. the old weekly schedule(s) stop from the chosen date · the same "Stop this schedule" as Schedule (later classes get X + RSVP No,
      reason "Changed to Teacher …" · nothing deleted, no make-up, not counted, the old teacher is not marked)
      · Google does this for the whole series, not only the next 4 months
   2. the new weekly days are added (one weekly package per day, each with its own time and length) with the new teacher and book
   3. a double booking is listed with "Add anyway"; nothing else is forced */
(function(){
  const DN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], DL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const SUG = ['REF', 'RE1', 'RE2', 'RE3', 'OD1', 'OD2', 'OD3', 'OD4', 'OD5', 'OD6', 'ODF1', 'Pathways1', 'Pathways2', 'TheAlphabet', 'ShortVowels', 'LongVowels', 'ConsonantBlends', 'LetterBlends', 'RazAa', 'RazA', 'RazB', 'RazC', 'WondersGK', 'WondersG1', 'WondersG2', 'Freetalk'];
  const cap = s => { s = String(s || '').trim(); return s ? s[0].toUpperCase() + s.slice(1) : s; };
  const d8 = iso => new Date(new Date(iso).getTime() + 8 * 3600e3), ymd = iso => d8(iso).toISOString().slice(0, 10), hm = iso => d8(iso).toISOString().slice(11, 16), wd = iso => d8(iso).getUTCDay();
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const okT = t => { const m = String(t || '').trim().replace(/[.：]/g, ':').match(/^([01]?\d|2[0-3]):?([0-5]\d)$/); return m ? m[1].padStart(2, '0') + ':' + m[2] : ''; };
  const first = (from, d, t) => { const x = new Date(from + 'T12:00:00Z'); for(let k = 0; k < 14; k++){ const y = new Date(x.getTime() + k * 864e5), ds = y.toISOString().slice(0, 10); if(y.getUTCDay() === d && Date.parse(ds + 'T' + (okT(t) || '23:59') + ':00+08:00') > Date.now() + 5 * 6e4) return ds; } return from; };   /* never a time already gone */
  let CS = null;
  function teachers(){ let L = []; try{ L = (SL && SL.teachers) || []; }catch(e){} if(!L.length){ try{ const k = kept('sl2'); L = (k && k.teachers) || []; }catch(e){} } return L.filter(Boolean); }
  function cls(){ const L = (STU && STU.code === CS.code && STU.cls) || []; return (Array.isArray(L) ? L : []).filter(c => c && c.start && !c.cancelled && !/-(TC|SC)$/i.test(String(c.title || '').replace(/\s+X$/, ''))); }
  /* the old weekly schedules: one per teacher + weekday + time, from the date on */
  function series(){ const f = CS.from || today(), M = {};
    cls().filter(c => ymd(c.start) >= f && new Date(c.start).getTime() > Date.now()).sort((a, b) => a.start.localeCompare(b.start)).forEach(c => { const k = cap(c.teacher) + '|' + wd(c.start) + '|' + hm(c.start);
      if(!M[k]) M[k] = { k, teacher: cap(c.teacher), d: wd(c.start), time: hm(c.start), mins: Math.round((new Date(c.end) - new Date(c.start)) / 6e4) || 25, book: c.book || '', first: c, n: 0 }; M[k].n++; });
    return Object.values(M).sort((a, b) => ((a.d + 6) % 7) - ((b.d + 6) % 7) || a.time.localeCompare(b.time)); }
  function perDay(mins, rows){ const left = Number(STU && STU.s && STU.s.left); if(!(left > 0)) return 20; return Math.max(1, Math.min(60, Math.ceil(left * 50 / (mins || 25) / Math.max(1, rows)))); }
  function sync(){ (CS.rows || []).forEach((r, i) => { const d = $('csD' + i), t = $('csT' + i), m = $('csM' + i), n = $('csN' + i); if(d) r.d = +d.value; if(t) r.time = t.value; if(m) r.mins = +m.value; if(n) r.n = +n.value; });
    const b = $('csB'); if(b) CS.book = b.value.trim(); const f = $('csF'); if(f && f.value) CS.from = f.value; }
  function paint(){ const S = series(), T = teachers(), nw = CS.nw, rows = CS.rows;
    const stop = S.filter(x => CS.stop[x.k]);
    const bad = rows.some(r => !okT(r.time)) || !rows.length, can = nw && !bad && (stop.length || rows.length);
    openSheet(`<h1>Change teacher / schedule</h1><div class="mute small">${esc(CS.name)} · ${esc(CS.code)} · same student, code, lessons left${STU && STU.s && STU.s.left != null ? ' (' + esc(STU.s.left) + ')' : ''} and history</div>
<label>From</label><input id="csF" class="in-t" type="date" value="${esc(CS.from)}" onchange="csRe()">
<label>1 · Stop the old weekly classes <span class="mute small">(from that date · later ones get X, not counted, no make-up)</span></label>
${S.length ? S.map(x => `<label class="check" style="margin-top:6px"><input type="checkbox" ${CS.stop[x.k] ? 'checked' : ''} onchange="csStop('${esc(x.k)}',this.checked)"><div><b>${DL[x.d]} ${esc(x.time)}</b> · ${x.mins} min · Teacher ${esc(x.teacher)}${x.book ? ' · ' + esc(x.book) : ''}<div class="small mute">next ${esc(ymd(x.first.start))} · every later ${DL[x.d]} ${esc(x.time)} too</div></div></label>`).join('') : '<div class="small mute" style="margin-top:6px">No weekly classes after that date.</div>'}
<label style="margin-top:16px">2 · New teacher</label><div class="gx-c" style="margin-top:6px">${T.map(t => `<button type="button" style="${cap(t) === cap(nw) ? 'background:#2B2253;color:#fff' : ''}" onclick="csNw('${esc(t)}')">Teacher ${esc(cap(t))}</button>`).join('')}</div>
<label style="margin-top:16px">3 · New weekly days</label>
${rows.map((r, i) => `<div class="row" style="gap:8px;margin-top:8px;align-items:flex-end;flex-wrap:wrap">
<div style="flex:1.2;min-width:110px"><div class="small mute">Day</div><select id="csD${i}" class="in-t" onchange="csRe()">${[1, 2, 3, 4, 5, 6, 0].map(d => `<option value="${d}"${d === r.d ? ' selected' : ''}>${DL[d]}</option>`).join('')}</select></div>
<div style="flex:1;min-width:90px"><div class="small mute">Time (24h)</div><input id="csT${i}" class="in-t" value="${esc(r.time || '')}" placeholder="17:30" inputmode="numeric" onchange="csRe()" style="${r.time && !okT(r.time) ? 'border-color:#C0392B' : ''}"></div>
<div style="flex:.9;min-width:80px"><div class="small mute">Length</div><select id="csM${i}" class="in-t" onchange="csRe()">${[25, 30, 50, 60].map(m => `<option value="${m}"${m === r.mins ? ' selected' : ''}>${m} min</option>`).join('')}</select></div>
<div style="flex:.8;min-width:70px"><div class="small mute">Classes</div><input id="csN${i}" class="in-t" type="number" min="1" max="60" value="${r.n}" onchange="csRe()"></div>
<button type="button" class="btn ghost sm" style="margin-bottom:4px" onclick="csDel(${i})" aria-label="Remove">✕</button></div>`).join('')}
<button type="button" class="btn ghost sm" style="margin-top:8px" onclick="csAdd()">+ Add a day</button>
<label style="margin-top:16px">Book</label><input id="csB" class="in-t" placeholder="e.g. OD1" value="${esc(CS.book || '')}" onchange="csRe()" autocomplete="off">
<div class="gx-c" style="margin-top:6px">${SUG.map(b => `<button type="button" onclick="$('csB').value='${b}';csRe()">${b}</button>`).join('')}</div>
<div class="card" style="margin-top:14px;padding:12px 14px;background:#F6F5FA;line-height:1.55">
${stop.length ? stop.map(x => `<div>✕ Stop <b>${DL[x.d]} ${esc(x.time)}</b> with Teacher ${esc(x.teacher)} from ${esc(ymd(x.first.start))}</div>`).join('') : '<div class="mute">Nothing stopped</div>'}
${rows.map(r => `<div>＋ <b>${DL[r.d]} ${esc(okT(r.time) || r.time || '…')}</b>–${okT(r.time) ? esc(new Date(Date.parse('2000-01-01T' + okT(r.time) + ':00Z') + r.mins * 6e4).toISOString().slice(11, 16)) : '…'} with <b>Teacher ${esc(cap(nw) || '…')}</b>${CS.book ? ' · ' + esc(CS.book) : ''} · ${r.n} classes from ${esc(first(CS.from, r.d, r.time))}</div>`).join('')}
</div>
<button class="btn teal block" style="margin-top:12px" onclick="csRun()" ${can ? '' : 'disabled'}>Save the new schedule</button>
<div class="small mute" style="margin-top:6px">Classes already taught stay with the old teacher (her pay and records). Takes about a minute · keep this open.</div>`); }
  window.csRe = () => { sync(); paint(); };
  window.csStop = (k, on) => { sync(); CS.stop[k] = on; paint(); };
  window.csNw = t => { sync(); CS.nw = t; paint(); };
  window.csAdd = () => { sync(); const l = CS.rows[CS.rows.length - 1]; CS.rows.push({ d: l ? (l.d + 2) % 7 : 1, time: '', mins: l ? l.mins : 25, n: l ? l.n : 20 }); paint(); };
  window.csDel = i => { sync(); CS.rows.splice(i, 1); paint(); };
  window.ctOpen = function(code){ const s = (STU && STU.code === code && STU.s) || {};
    CS = { code, name: s.name || code, from: today(), nw: '', book: s.book || '', stop: {}, rows: [] };
    const S = series(); S.forEach(x => { CS.stop[x.k] = true; });
    CS.rows = S.map(x => ({ d: x.d, time: x.time, mins: x.mins, n: perDay(x.mins, S.length) }));
    if(!CS.rows.length) CS.rows = [{ d: 1, time: '', mins: 25, n: 20 }];
    if(!CS.book && S[0]) CS.book = S[0].book; paint(); };
  async function addRow(o, r, force){ const date = first(o.from, r.d, r.time), f = { code: o.code, student: o.name, kind: '', fresh: false, cn: '', book: o.book, teacher: o.nw, date, time: okT(r.time), mins: String(r.mins), days: r.n > 1 ? [r.d] : [], count: r.n, force: !!force };
    try{ const x = await api('addClass', TOKEN, f); return x && x.ok ? { ok: true } : { ok: false, conflict: !!(x && x.conflict), msg: (x && x.msg) || 'not added' }; }
    catch(e){ return { ok: false, conflict: !!(e && e.conflict), msg: String((e && (e.msg || e.error)) || 'not added') }; } }
  let LAST = null;
  window.csRun = async function(){ sync(); const o = JSON.parse(JSON.stringify(CS)), S = series().filter(x => o.stop[x.k]), R = o.rows.filter(r => okT(r.time));
    if(!o.nw || (!S.length && !R.length)) return;
    openSheet(`<h1>Saving the new schedule…</h1><div class="small mute">${esc(o.name)} · please keep this open</div><div class="card" style="margin-top:12px;padding:12px 14px"><div id="csProg">Starting…</div></div>`);
    const prog = t => { const g = $('csProg'); if(g) g.innerHTML = t; }, res = [];
    for(const x of S){ prog('Stopping ' + DL[x.d] + ' ' + esc(x.time) + ' with Teacher ' + esc(x.teacher) + '…');
      const c = x.first, f = { action: 'cancel', start: c.start, date: ymd(c.start), time: hm(c.start), mins: String(x.mins), teacher: x.teacher, makeup: false, reason: 'Changed to Teacher ' + cap(o.nw), forward: true, force: false };
      try{ const r = await api('editClass', TOKEN, c.id, f); res.push({ t: 'stop', x, ok: !!(r && r.ok), msg: (r && r.msg) || '' }); }
      catch(e){ res.push({ t: 'stop', x, ok: false, msg: String((e && (e.msg || e.error)) || 'not saved') }); } }
    for(const r of R){ prog('Adding ' + DL[r.d] + ' ' + esc(okT(r.time)) + ' with Teacher ' + esc(cap(o.nw)) + '…'); const a = await addRow(o, r, false); res.push(Object.assign({ t: 'add', r }, a)); }
    LAST = { o, res }; try{ Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); delete CLSM[o.code]; store('del', 'coe.cls.' + o.code); }catch(e){}
    done(); };
  window.csForce = async function(i){ const it = LAST && LAST.res[i]; if(!it || it.t !== 'add') return; const b = $('csFx' + i); if(b){ b.disabled = true; b.textContent = 'Adding…'; }
    const a = await addRow(LAST.o, it.r, true); Object.assign(it, a, { conflict: false }); done(); };
  function done(){ const { o, res } = LAST, bad = res.filter(x => !x.ok).length;
    openSheet(`<h1>${bad ? 'Almost done' : '✓ New schedule saved'} · ${esc(o.name)}</h1>
<div class="card" style="margin-top:10px;padding:12px 14px;line-height:1.6">${res.map((x, i) => x.t === 'stop'
  ? `<div>${x.ok ? '✓' : '✕'} Stopped <b>${DL[x.x.d]} ${esc(x.x.time)}</b> with Teacher ${esc(x.x.teacher)} from ${esc(ymd(x.x.first.start))}${x.ok ? '' : ' · <span style="color:#B03A2E">' + esc(x.msg) + '</span> · use Stop this schedule in Schedule'}</div>`
  : `<div>${x.ok ? '✓' : '✕'} <b>${DL[x.r.d]} ${esc(okT(x.r.time))}</b> with Teacher ${esc(cap(o.nw))} · ${x.r.n} classes from ${esc(first(o.from, x.r.d, x.r.time))}${x.ok ? '' : ' · <span style="color:#B03A2E">' + esc(x.msg) + '</span>' + (x.conflict ? ` <button class="btn sm coral" id="csFx${i}" onclick="csForce(${i})">Add anyway</button>` : '')}</div>`).join('')}</div>
<div class="card" style="margin-top:10px;padding:12px 14px"><b>One step in the sheet (ACTIVE)</b><div class="small" style="margin-top:4px">If Teacher ${esc(cap(o.nw))} is new for ${esc(o.name)}: add a row <b>${esc(o.code)} · ${esc(o.name)} · Teacher ${esc(cap(o.nw))}</b> right under his package row with <b>Enrolled empty</b>, so her lessons come off the same package.</div></div>
<button class="btn block" style="margin-top:12px" onclick="closeSheet();openStudent('${esc(o.code)}')">Back to ${esc(o.name)}</button>`); }
  /* the button reads "Change teacher / schedule" */
  const sr2 = window.stuRender; if(sr2) window.stuRender = function(){ const r = sr2.apply(this, arguments); try{ const b = $('ctBtn'); if(b) b.textContent = 'Change teacher / schedule'; }catch(e){} return r; };
})();
