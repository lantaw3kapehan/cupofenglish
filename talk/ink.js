/* 2494 · Drawing tools on the class screens (Misty 11:29: "the same annotation like when they opened our books").
   Same tools as the book reader: Move, Pen, Highlighter, Text, Eraser, Shapes (arrow, line, box, circle, tick, star), six colours,
   three sizes, Undo / Redo, Clear, and a fold button. Each screen keeps its own drawings while the class view is open
   (kept on this device for the session only). Drawings are stored in proportions of the screen width, so they stay in place
   when the window changes size. */
(function(){
  const SZ = { pen: [0.0028, 0.0028, 0.0028], text: [0.024, 0.024, 0.024] }   /* 2702: one text size, one pen · 2813 (Misty 20:28): 1.6 % → 2.4 % of the screen width, readable in WeChat on a phone */, HLW = 0.016;
  const COL = [['#1F6FEB', 'Blue'], ['#D7263D', 'Red'], ['#1E9E5A', 'Green'], ['#F08A00', 'Orange'], ['#7B3FC4', 'Purple'], ['#1B1B1F', 'Black']];
  let HIDE = false, ANN = {}, HIST = [], REDO = [], key = '', tool = 'hand', color = COL[0][0], size = 1, shp = 'rect', host = null, cv = null, bar = null, mini = null, cur = null, ro = null, on = false;
  try{ size = +localStorage.getItem('coe.ink.sz') || 1; if(!(size >= 0 && size <= 2)) size = 1; shp = localStorage.getItem('coe.ink.shp') || 'rect'; }catch(e){}
  const I = p => '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const IC = { hand: I('<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4"/><path d="M10 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M13 10V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M16 11V8.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 6 17.5L4.3 13a1.5 1.5 0 0 1 2.7-1.3L8 14"/>'),
    pen: I('<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>'), hl: I('<path d="m9 11-5 5v3h3l5-5"/><path d="m12 8 4 4 5-5-4-4z"/><path d="M3 21h8"/>'),
    erase: I('<path d="m7 21-4-4L14 6l6 6-9 9z"/><path d="M7 21h13"/>'), rect: I('<rect x="4" y="6" width="16" height="12" rx="1.5"/>'), arrow: I('<path d="M5 19 19 5"/><path d="M10 5h9v9"/>'),
    line: I('<path d="M5 19 19 5"/>'), ellipse: I('<ellipse cx="12" cy="12" rx="8" ry="6"/>'), tick: I('<path d="m5 12 4 4 10-10"/>'), heart: I('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>'), star: I('<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'),
    undo: I('<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'), fold: I('<path d="m15 6-6 6 6 6"/>') };
  const SH = [['arrow', 'Arrow'], ['rect', 'Box'], ['ellipse', 'Circle'], ['tick', 'Tick'], ['star', 'Star'], ['heart', 'Heart']];   /* 2710: star and heart for praise */
  const STAMP = { tick: 1, star: 1, heart: 1 }, FILL = { star: ['#FFC21A', '#E39A00'], heart: ['#FF6B9A', '#E23D74'] };
  const css = `.ink-c{position:absolute;left:0;top:0;z-index:4;touch-action:none}.knav{z-index:40!important}.ink-c.off{pointer-events:none}.ink-c.hid{visibility:hidden}.ink-t .tb.eye{font-size:11px;font-weight:600;width:auto;padding:0 6px;color:#2B2253}
.ink-t{position:fixed;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,.97);border-radius:16px;box-shadow:0 6px 20px rgba(30,26,60,.14);padding:8px;display:flex;flex-direction:column;gap:4px;align-items:center;z-index:60;max-height:calc(100vh - 140px);overflow-y:auto}
.ink-t .tb{width:42px;height:38px;border:0;border-radius:12px;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font:700 17px Inter,sans-serif;color:#2B2253}
.ink-t .tb.on{background:#DDF1F2;color:#0E4C52}.ink-t .tb.red{color:#C0392B;font-size:12px;font-weight:600}.ink-t .hr{width:28px;height:1px;background:#E3E1EA;margin:2px 0}
.ink-t .dots{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:2px}.ink-t .dot{width:16px;height:16px;border-radius:50%;border:0;cursor:pointer;box-shadow:0 0 0 2px #fff,0 0 0 3px transparent}.ink-t .dot.on{box-shadow:0 0 0 2px #fff,0 0 0 4px currentColor}
.ink-t .sz + .sz + .sz + .hr{display:none}.ink-t .sz{display:none!important;width:42px;height:28px;border:0;border-radius:10px;background:transparent;cursor:pointer;color:#2B2253;font-weight:700}.ink-t .sz.on{background:#F1F0F6}
.ink-t .ur{display:flex;gap:2px}.ink-t .ur .tb{width:30px;height:34px}
.ink-s{position:relative}.ink-p{display:none;position:absolute;left:52px;top:-6px;background:#fff;border-radius:12px;box-shadow:0 6px 20px rgba(30,26,60,.16);padding:6px;gap:4px;flex-direction:column;z-index:61}
.ink-p.on{display:flex}.ink-p button{display:flex;align-items:center;gap:8px;border:0;background:transparent;border-radius:8px;padding:6px 10px;cursor:pointer;font:600 13px Inter,sans-serif;color:#2B2253;white-space:nowrap}.ink-p button.on,.ink-p button:hover{background:#DDF1F2}
.ink-m{position:fixed;left:12px;top:50%;transform:translateY(-50%);z-index:60;display:none;flex-direction:column;align-items:center;gap:2px;border:0;border-radius:14px;background:rgba(255,255,255,.97);box-shadow:0 6px 20px rgba(30,26,60,.14);padding:8px 6px;cursor:pointer;font:600 11px Inter,sans-serif;color:#2B2253}
.ink-m i{width:14px;height:14px;border-radius:50%;display:block}body.ink-min .ink-t{display:none}body.ink-min .ink-m{display:flex}
.ink-grip{position:absolute;z-index:6;width:22px;height:22px;border-radius:6px;background:#fff;border:1.5px solid #9AD3D6;color:#0E6F68;font:700 13px/19px Inter,sans-serif;text-align:center;cursor:move;user-select:none;touch-action:none}
.ink-in{position:absolute;z-index:5;border:1.5px dashed #9AD3D6;background:transparent;text-shadow:0 0 2px #fff,0 0 3px #fff;border-radius:6px;padding:2px 6px;outline:0;font-family:Inter,sans-serif;font-weight:600}
body.ink-draw .kv{cursor:crosshair}
body.ink-on:not(.ink-min) #app{padding-left:66px}body.ink-on.ink-min #app{padding-left:58px}@media (min-width:1500px){body.ink-on #app{padding-left:0}}`;
  function styles(){ if(document.getElementById('ink-css')) return; const s = document.createElement('style'); s.id = 'ink-css'; s.textContent = css; document.head.appendChild(s); }
  const W = () => cv ? cv.clientWidth : 1;
  const list = () => (ANN[key] = ANN[key] || []);
  /* 2688 (Misty 22 Nov 13:35, IELTS class): drawings are kept on this computer for 2 days per screen, so stopping the screen share
     and closing the lesson no longer loses them · text wraps inside the screen and can be dragged to a new place with the T tool */
  const SK = 'coe.ink.ann2688'; let svT = 0;
  function loadAll(){ try{ const o = JSON.parse(localStorage.getItem(SK) || '{}'), now = Date.now(), A = {}; Object.keys(o).forEach(k => { if(o[k] && now - o[k].at < 2 * 864e5) A[k] = o[k].a; }); return A; }catch(e){ return {}; } }
  function saveSoon(){ clearTimeout(svT); svT = setTimeout(() => { try{ const o = JSON.parse(localStorage.getItem(SK) || '{}'), now = Date.now();
      Object.keys(ANN).forEach(k => { if(ANN[k] && ANN[k].length) o[k] = { at: now, a: ANN[k] }; else delete o[k]; });
      Object.keys(o).forEach(k => { if(now - o[k].at > 2 * 864e5) delete o[k]; }); localStorage.setItem(SK, JSON.stringify(o)); }catch(e){} }, 500); }
  /* 2746 (Misty 23 Nov 11:10, IELTS): a note was drawn in a narrow column (one word per line) because its saved width was small.
     Now only a width the teacher chose on purpose (dragging the box edge, fw) is kept; otherwise a note wraps at the screen's edge. */
  function lines(x, a, w){ const fs = Math.round(SZ.text[0] * w),   /* 2750: one standard size for every note */ mw = Math.max(40, (a.fw && a.mw ? a.mw : Math.max(0.15, 1 - a.x - 0.012)) * w); x.font = '600 ' + fs + 'px Inter, sans-serif';
    const L = []; String(a.v).split('\n').forEach(par => { let cur = ''; par.split(/\s+/).forEach(wd => { if(!wd) return; const t = cur ? cur + ' ' + wd : wd; if(cur && x.measureText(t).width > mw){ L.push(cur); cur = wd; } else cur = t; }); L.push(cur); });
    const lh = Math.round(fs * 1.25); return { L, lh, fs, tw: Math.max(0, ...L.map(t => x.measureText(t).width)) }; }
  const rec = () => { HIST.push({ k: key, snap: list().slice() }); REDO.length = 0; if(HIST.length > 300) HIST.shift(); };
  function shapePts(a, w){ const [p0, p1] = a.p, x0 = p0[0] * w, y0 = p0[1] * w, x1 = p1[0] * w, y1 = p1[1] * w, P = [];
    if(a.k === 'rect') return [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];
    if(a.k === 'ellipse'){ const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = Math.abs(x1 - x0) / 2, ry = Math.abs(y1 - y0) / 2; for(let i = 0; i <= 48; i++){ const t = i / 48 * Math.PI * 2; P.push([cx + rx * Math.cos(t), cy + ry * Math.sin(t)]); } return P; }
    /* 2710: a hand-written looking tick (short stroke down, long curved stroke up) and a heart */
    if(a.k === 'tick'){ const ww = x1 - x0, h = y1 - y0, A = [x0 + ww * 0.04, y0 + h * 0.56], B = [x0 + ww * 0.36, y0 + h * 0.96], C = [x1, y0 + h * 0.02], K = [x0 + ww * 0.52, y0 + h * 0.5];
      P.push(A); for(let i = 1; i <= 6; i++){ const t = i / 6; P.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * Math.pow(t, 0.9)]); }
      for(let i = 1; i <= 16; i++){ const t = i / 16, u = 1 - t; P.push([u * u * B[0] + 2 * u * t * K[0] + t * t * C[0], u * u * B[1] + 2 * u * t * K[1] + t * t * C[1]]); } return P; }
    if(a.k === 'heart'){ const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, sx = Math.abs(x1 - x0) / 34, sy = Math.abs(y1 - y0) / 30; for(let i = 0; i <= 60; i++){ const t = i / 60 * Math.PI * 2; P.push([cx + sx * 16 * Math.pow(Math.sin(t), 3), cy - sy * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - sy * 1.5]); } return P; }
    if(a.k === 'star'){ const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / 2; for(let i = 0; i <= 10; i++){ const r = i % 2 ? R * 0.45 : R, t = -Math.PI / 2 + i * Math.PI / 5; P.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); } return P; }
    return [[x0, y0], [x1, y1]]; }
  function tag2900(x, X, Y, L, fz, lh, col){ const mw = Math.max(...L.map(t => x.measureText(t).width)), bx = X - fz * .28, by = Y - fz * .2, w = mw + fz * .56, h = (L.length - 1) * lh + fz * 1.32, r = Math.min(fz * .38, h / 2);   /* 2900 (Misty 25 Nov): the same soft white tag as on homework check (2880) */
    x.save(); x.shadowColor = 'rgba(16,24,40,.18)'; x.shadowBlur = fz * .35; x.shadowOffsetY = fz * .06; x.beginPath(); x.roundRect ? x.roundRect(bx, by, w, h, r) : x.rect(bx, by, w, h); x.fillStyle = 'rgba(255,255,255,.92)'; x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect ? x.roundRect(bx, by, w, h, r) : x.rect(bx, by, w, h); x.lineWidth = Math.max(1.5, fz * .07); x.strokeStyle = col; x.globalAlpha = .55; x.stroke(); x.restore(); x.fillStyle = col; L.forEach((t, i) => x.fillText(t, X, Y + i * lh)); }
    function draw(){ if(!cv) return; const x = cv.getContext('2d'), d = window.devicePixelRatio || 1, w = W(); x.setTransform(d, 0, 0, d, 0, 0); x.clearRect(0, 0, cv.width, cv.height);
    (ANN[key] || []).forEach(a => { if(a.t === 'text'){ const T = lines(x, a, w);
      /* 2748 (Misty 23 Nov 11:19): the white card behind typed notes covered the book's words. Now only a thin white outline
         hugs the letters, so notes stay readable without hiding what is under them. */
      x.textBaseline = 'top'; tag2900(x, a.x * w, a.y * w, T.L, T.fs, T.lh, a.c); return; }
      x.globalAlpha = a.t === 'hl' ? 0.32 : 1; x.strokeStyle = a.c; x.lineWidth = Math.max(1.5, a.w * w); x.lineCap = a.t === 'hl' ? 'butt' : 'round'; x.lineJoin = 'round';
      if(a.t === 'shape' && FILL[a.k]){ const P = shapePts(a, w); x.beginPath(); P.forEach((q, i) => i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1])); x.closePath(); x.fillStyle = FILL[a.k][0]; x.fill(); x.strokeStyle = FILL[a.k][1]; x.lineWidth = Math.max(1.5, a.w * w * 0.7); x.stroke(); x.globalAlpha = 1; return; }
      if(a.t === 'shape' && a.k === 'tick') x.lineWidth = Math.max(3, a.w * w * 2.2);
      if(a.t === 'shape'){ const P = shapePts(a, w); x.beginPath(); P.forEach((q, i) => i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1])); x.stroke();
        if(a.k === 'arrow'){ const [ax, ay] = P[0], [bx, by] = P[1], g = Math.atan2(by - ay, bx - ax), L = Math.max(14, a.w * w * 5); x.beginPath(); x.moveTo(bx - L * Math.cos(g - 0.45), by - L * Math.sin(g - 0.45)); x.lineTo(bx, by); x.lineTo(bx - L * Math.cos(g + 0.45), by - L * Math.sin(g + 0.45)); x.stroke(); }
        x.globalAlpha = 1; return; }
      x.beginPath(); a.p.forEach((q, i) => i ? x.lineTo(q[0] * w, q[1] * w) : x.moveTo(q[0] * w, q[1] * w)); if(a.p.length === 1) x.lineTo(a.p[0][0] * w + 0.1, a.p[0][1] * w); x.stroke(); x.globalAlpha = 1; }); saveSoon(); grow3017(); }
  /* 3017: a note dragged or drawn low grows the screen too (not only a newly typed note) */
  let g3017 = 0; function grow3017(){ if(g3017 || !host || !cv) return; try{ const ft = document.querySelector('.knav'), n = need2746(host.scrollWidth); if(!n) return; const want = n + (ft ? Math.round(ft.getBoundingClientRect().height) : 70) + 12; if(want > host.scrollHeight + 2){ g3017 = 1; requestAnimationFrame(() => { g3017 = 0; fit(); }); } }catch(e){} }
  /* 2746: a note or drawing low on the screen was cut off at the bottom of the drawing area (on screen and in Copy screen).
     The screen now grows to hold every note and drawing. */
  function need2746(w){ let m = 0; try{ const x = cv.getContext('2d'); (ANN[key] || []).forEach(a => { if(a.t === 'text'){ const T = lines(x, a, w); m = Math.max(m, a.y * w + T.L.length * T.lh + 16); } else if(a.p){ a.p.forEach(q => { m = Math.max(m, q[1] * w + 16); }); } }); }catch(e){} return Math.ceil(m); }
  function fit(){ if(!cv || !host) return; { const ft3017 = document.querySelector('.knav'), n0 = need2746(host.scrollWidth), n = n0 ? n0 + (ft3017 ? Math.round(ft3017.getBoundingClientRect().height) : 70) + 12 : 0;   /* 3017: room under the lowest note so it can scroll above the button bar */ if(host.dataset.mh2746){ host.style.minHeight = ''; delete host.dataset.mh2746; } if(n > host.scrollHeight - 4){ host.style.minHeight = n + 'px'; host.dataset.mh2746 = '1'; } } const d = window.devicePixelRatio || 1, w = host.scrollWidth, h = host.scrollHeight; cv.style.width = w + 'px'; cv.style.height = h + 'px'; cv.width = Math.round(w * d); cv.height = Math.round(h * d); draw(); }
  const pt = e => { const r = cv.getBoundingClientRect(), w = W(); return [(e.clientX - r.left) / w, (e.clientY - r.top) / w]; };
  function hitText(p){ const x = cv.getContext('2d'), w = W(), L = list();
    for(let k = L.length - 1; k >= 0; k--){ const a = L[k]; if(a.t !== 'text') continue; const T = lines(x, a, w), tw = T.tw / w, th = (T.L.length * T.lh) / w;
      if(p[0] >= a.x - 0.008 && p[0] <= a.x + tw + 0.008 && p[1] >= a.y - 0.008 && p[1] <= a.y + th + 0.008) return a; } return null; }
  function eraseAt(p){ const w = W(), L = list(), n = L.length;
    ANN[key] = L.filter(a => { if(a.t === 'text') return hitText(p) !== a; const P = a.t === 'shape' ? shapePts(a, w).map(q => [q[0] / w, q[1] / w]) : a.p;
      for(let i = 0; i < P.length; i++){ const q = P[i], m = P[i + 1] || q, dx = m[0] - q[0], dy = m[1] - q[1], l2 = dx * dx + dy * dy, t = l2 ? Math.max(0, Math.min(1, ((p[0] - q[0]) * dx + (p[1] - q[1]) * dy) / l2)) : 0;
        if(Math.hypot(q[0] + t * dx - p[0], q[1] + t * dy - p[1]) < 0.01) return false; } return true; });
    if(ANN[key].length !== n){ if(cur && cur.erase) cur.hit = true; draw(); } }
  let EDIT2748 = null;   /* 2748: the text being typed or changed; a colour click recolours it */
  function addText(p){ const w = W(), old = hitText(p); let col = color, at = p;
    if(old){ rec(); ANN[key] = list().filter(a => a !== old); col = old.c; at = [old.x, old.y + SZ.text[0] / 2]; draw(); }
    const ts = SZ.text[0], fs = Math.max(12, Math.round(ts * w));
    /* 2707 (Misty 22 Nov 18:19): the text box fits what is typed (it no longer runs to the edge of the screen), stays inside the
       screen, can be made wider or narrower by dragging its right edge, and moved by the grip at its top-left corner while typing.
       Clicking a text again puts the cursor at the end (the words are no longer all selected). */
    const cs0 = getComputedStyle(host), lim = Math.max(0.2, Math.min(1, (host.clientWidth - (parseFloat(cs0.paddingRight) || 0) - cv.offsetLeft) / w) - 0.012);
    let x0 = old ? old.x : Math.min(at[0], lim - 0.12), y0 = at[1] - ts / 2, fixW = old && old.fw ? old.mw : 0;
    const i = document.createElement('textarea'); i.className = 'ink-in'; i.value = old ? old.v : ''; i.rows = 1; i.spellcheck = false;
    const PADW = 15, ctx = cv.getContext("2d");
    const natural = () => { ctx.save(); ctx.font = '600 ' + fs + 'px Inter, sans-serif'; const m = Math.max(0, ...String(i.value || ' ').split('\n').map(t => ctx.measureText(t).width)); ctx.restore(); return m; };
    const room = () => Math.max(0.06, lim - x0);
    const fitW = () => { const want = fixW ? Math.min(fixW, room()) : Math.min(room(), Math.max(110 / w, (natural() + fs * 0.8) / w)); i.style.width = Math.round(want * w + PADW) + 'px'; return want; };
    i.style.cssText = 'font:600 ' + fs + 'px Inter, sans-serif;line-height:' + Math.round(fs * 1.25) + 'px;color:' + col + ';left:' + (cv.offsetLeft + x0 * w - 7.5) + 'px;top:' + (cv.offsetTop + y0 * w - 3.5) + 'px;resize:horizontal;overflow:hidden;white-space:pre-wrap;box-sizing:border-box;min-width:60px;min-height:0;max-width:none;margin:0';
    const grip = document.createElement('div'); grip.className = 'ink-grip'; grip.title = 'Drag to move the text'; grip.textContent = '✥';
    const place = () => { i.style.left = (cv.offsetLeft + x0 * w - 7.5) + 'px'; i.style.top = (cv.offsetTop + y0 * w - 3.5) + 'px'; grip.style.left = (cv.offsetLeft + x0 * w - 7.5 - 24) + 'px'; grip.style.top = (cv.offsetTop + y0 * w - 3.5) + 'px'; };
    const grow = () => { fitW(); i.style.height = 'auto'; i.style.height = i.scrollHeight + 'px'; };
    EDIT2748 = { set: c => { col = c; i.style.color = c; setTimeout(() => i.focus({ preventScroll: true }), 0); } };
    i.addEventListener('input', grow); host.appendChild(i); host.appendChild(grip); place(); grow();
    setTimeout(() => { i.focus({ preventScroll: true }); const n = i.value.length; try{ i.setSelectionRange(n, n); }catch(e){} }, 0);
    /* dragging the right edge: the width chosen is kept for this text */
    let w0 = 0; i.addEventListener('pointerdown', () => { w0 = i.offsetWidth; }); i.addEventListener('pointerup', () => { if(w0 && Math.abs(i.offsetWidth - w0) > 3){ fixW = Math.min(room(), Math.max(40 / w, (i.offsetWidth - PADW) / w)); grow(); } w0 = 0; });
    let mv = null; grip.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); grip.setPointerCapture(e.pointerId); mv = { sx: e.clientX, sy: e.clientY, x: x0, y: y0 }; });
    grip.addEventListener('pointermove', e => { if(!mv) return; x0 = Math.max(0, Math.min(lim - 0.06, mv.x + (e.clientX - mv.sx) / w)); y0 = Math.max(0, mv.y + (e.clientY - mv.sy) / w); place(); grow(); });
    const upG = () => { if(!mv) return; mv = null; setTimeout(() => i.focus({ preventScroll: true }), 0); }; grip.addEventListener('pointerup', upG); grip.addEventListener('pointercancel', upG);
    let fin = false; const done = ok => { if(fin) return; fin = true; EDIT2748 = null; const v = i.value.replace(/\s+$/, ''), mw = fitW(); i.remove(); grip.remove();
      if(ok && v.trim()){ if(!old) rec(); list().push({ t: 'text', v, x: x0, y: y0, s: ts, c: col, mw, fw: fixW ? 1 : 0 }); } else if(old && !ok){ HIST.pop(); list().push(old); } fit(); };   /* 2746: fit, so the screen grows for a low note */
    i.addEventListener('keydown', ev => { ev.stopPropagation(); if(ev.key === 'Escape'){ ev.preventDefault(); done(true); } });   /* 2712: Enter = new line · click outside or Esc = finished (as on the books) */
    i.addEventListener('blur', () => setTimeout(() => { if(!mv && document.activeElement !== i) done(true); }, 120)); }
  function bindCanvas(){
    cv.addEventListener('pointerdown', e => { if(tool === 'hand') return; e.preventDefault(); e.stopPropagation(); const p = pt(e);
      if(tool === 'text'){ const hit = hitText(p); if(!hit) return addText(p); cv.setPointerCapture(e.pointerId); cur = { drag: hit, p0: p, x0: hit.x, y0: hit.y, moved: false, before: list().map(a => a === hit ? Object.assign({}, a) : a) }; return; }
      cv.setPointerCapture(e.pointerId);
      if(tool === 'erase'){ cur = { erase: true, before: list().slice(), hit: false }; eraseAt(p); return; }
      rec();
      if(tool === 'shape'){ cur = { t: 'shape', k: shp, c: color, w: SZ.pen[size] * 1.2, p: [p, p] }; list().push(cur); draw(); return; }
      cur = { t: tool, c: tool === 'hl' ? (color === '#1B1B1F' ? '#F5B700' : color) : color, w: tool === 'hl' ? HLW : SZ.pen[size], p: [p] }; list().push(cur); draw(); });
    cv.addEventListener('pointermove', e => { if(!cur) return; const p = pt(e);
      if(cur.drag){ const dx = p[0] - cur.p0[0], dy = p[1] - cur.p0[1]; if(Math.hypot(dx, dy) > 0.004) cur.moved = true; if(cur.moved){ cur.drag.x = Math.max(0, Math.min(0.97, cur.x0 + dx)); cur.drag.y = Math.max(0, cur.y0 + dy); cur.drag.mw = Math.max(0.15, Math.min(cur.drag.mw || 1, 1 - cur.drag.x - 0.012)); draw(); } return; } if(cur.erase) return eraseAt(p); if(cur.t === 'shape') cur.p[1] = p; else cur.p.push(p); draw(); });
    const end = () => { if(!cur) return; if(cur.drag){ const c0 = cur; cur = null; if(c0.moved){ HIST.push({ k: key, snap: c0.before }); REDO.length = 0; draw(); } else addText(c0.p0); return; } if(cur.erase){ if(cur.hit){ HIST.push({ k: key, snap: cur.before }); REDO.length = 0; } }
      else if(cur.t === 'shape' && STAMP[cur.k] && Math.hypot(cur.p[1][0] - cur.p[0][0], cur.p[1][1] - cur.p[0][1]) < 0.012){   /* 2710: a click puts a tick / star / heart of a ready size */
        const c0 = cur.p[0], z = cur.k === 'tick' ? 0.035 : 0.04; cur.p = [[c0[0] - z / 2, c0[1] - z / 2], [c0[0] + z / 2, c0[1] + z / 2]]; draw(); }
      else if(cur.t === 'shape' && Math.hypot(cur.p[1][0] - cur.p[0][0], cur.p[1][1] - cur.p[0][1]) < 0.004){ ANN[key] = list().filter(a => a !== cur); HIST.pop(); draw(); } cur = null; };
    cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end); }
  function swap(from, to){ const h = from.pop(); if(!h) return; to.push({ k: h.k, snap: (ANN[h.k] || []).slice() }); ANN[h.k] = h.snap.slice(); if(h.k === key) draw(); }
  function setTool(t){ tool = t; if(t !== 'hand' && HIDE){ HIDE = false; if(cv) cv.classList.remove('hid'); } if(cv) cv.classList.toggle('off', t === 'hand'); document.body.classList.toggle('ink-draw', t !== 'hand'); paintBar(); }
  function paintBar(){ if(!bar) return;
    bar.innerHTML = '<button class="tb" data-a="fold" title="Hide the tools" aria-label="Hide the tools">' + IC.fold + '</button>'
      + [['hand', 'Move and click (V)'], ['pen', 'Pen (P)'], ['hl', 'Highlighter (H)']].map(b => '<button class="tb' + (tool === b[0] ? ' on' : '') + '" data-t="' + b[0] + '" title="' + b[1] + '" aria-label="' + b[1] + '">' + IC[b[0]] + '</button>').join('')
      + '<button class="tb' + (tool === 'text' ? ' on' : '') + '" data-t="text" title="Text (T) · click a text to change it, drag it to move it · Enter for a new line · click outside when finished" aria-label="Text">T</button>'
      + '<button class="tb' + (tool === 'erase' ? ' on' : '') + '" data-t="erase" title="Eraser (E)" aria-label="Eraser">' + IC.erase + '</button>'
      + '<div class="ink-s"><button class="tb' + (tool === 'shape' ? ' on' : '') + '" data-t="shape" title="Shapes (S): arrow, box, circle, tick, star, heart · click once for a tick, star or heart" aria-label="Shapes">' + IC[shp] + '</button><div class="ink-p' + (tool === 'shape' && bar.dataset.sp === '1' ? ' on' : '') + '">' + SH.map(s => '<button data-k="' + s[0] + '" class="' + (shp === s[0] ? 'on' : '') + '">' + IC[s[0]] + s[1] + '</button>').join('') + '</div></div>'
      + '<div class="hr"></div><div class="dots">' + COL.map(c => '<button class="dot' + (color === c[0] ? ' on' : '') + '" data-c="' + c[0] + '" style="background:' + c[0] + ';color:' + c[0] + '" title="' + c[1] + '" aria-label="' + c[1] + '"></button>').join('') + '</div>'
      + '<div class="hr"></div>' + [0, 1, 2].map(z => '<button class="sz' + (size === z ? ' on' : '') + '" data-z="' + z + '" title="' + ['Small', 'Medium', 'Large'][z] + ' text and pen"><span style="font-size:' + [12, 16, 21][z] + 'px">A</span></button>').join('')
      + '<div class="hr"></div><div class="ur"><button class="tb" data-a="undo" title="Undo (Ctrl/Cmd+Z)" aria-label="Undo">' + IC.undo + '</button><button class="tb" data-a="redo" title="Redo (Ctrl/Cmd+Shift+Z)" aria-label="Redo"><span style="display:flex;transform:scaleX(-1)">' + IC.undo + '</span></button></div>'
      + '<button class="tb eye" data-a="eye" title="Hide the drawings for a moment (to see what is under them) · click again to show them">' + (HIDE ? 'Show' : 'Hide') + '</button>'
      + '<button class="tb red" data-a="clear" title="Clear this screen (Undo brings it back)">Clear</button>';
    if(mini) mini.innerHTML = '<i style="background:' + color + '"></i>Tools';
    /* 2709 (Misty 22 Nov 18:29): the shapes list opens outside the tool bar (no sideways scrolling to see Arrow / Box / Circle / Tick) */
    document.querySelectorAll('.ink-p.ink-out').forEach(n => n.remove()); const pp = bar.querySelector('.ink-p.on'), sbn = bar.querySelector('[data-t="shape"]');
    if(pp && sbn){ const r = sbn.getBoundingClientRect(); pp.classList.add('ink-out'); (bar.parentNode || document.body).appendChild(pp);
      pp.style.cssText = 'position:fixed;left:' + Math.round(r.right + 10) + 'px;top:' + Math.round(r.top - 6) + 'px;z-index:62'; pp.addEventListener('click', onBar);
      const off = ev => { if(pp.contains(ev.target) || bar.contains(ev.target)) return; document.removeEventListener('pointerdown', off, true); bar.dataset.sp = ''; pp.remove(); }; setTimeout(() => document.addEventListener('pointerdown', off, true), 0);
      requestAnimationFrame(() => { const q = pp.getBoundingClientRect(); if(q.bottom > window.innerHeight - 8) pp.style.top = Math.max(8, window.innerHeight - 8 - q.height) + 'px'; }); } }
  function onBar(e){ const b = e.target.closest('button'); if(!b) return; e.stopPropagation();
    if(b.dataset.t){ if(b.dataset.t === 'shape' && tool === 'shape'){ bar.dataset.sp = bar.dataset.sp === '1' ? '' : '1'; } else bar.dataset.sp = b.dataset.t === 'shape' ? '1' : ''; setTool(b.dataset.t); return; }
    if(b.dataset.k){ shp = b.dataset.k; bar.dataset.sp = ''; try{ localStorage.setItem('coe.ink.shp', shp); }catch(x){} setTool('shape'); return; }
    if(b.dataset.c){ color = b.dataset.c; if(EDIT2748){ EDIT2748.set(color); paintBar(); return; } if(tool === 'hand' || tool === 'erase') tool = 'pen'; setTool(tool); return; }
    if(b.dataset.z){ size = +b.dataset.z; try{ localStorage.setItem('coe.ink.sz', String(size)); }catch(x){} paintBar(); return; }
    const a = b.dataset.a; if(a === 'fold'){ document.body.classList.add('ink-min'); return; }
    if(a === 'undo') swap(HIST, REDO); if(a === 'redo') swap(REDO, HIST);
    if(a === 'eye'){ HIDE = !HIDE; if(cv) cv.classList.toggle('hid', HIDE); paintBar(); return; }   /* 2718 */
    if(a === 'clear' && list().length){ rec(); ANN[key] = []; draw(); } }
  function onKey(e){ if(!on || (e.target && (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable))) return;   /* 2706: typing in the writing box is not a tool key */ const k = e.key.toLowerCase();
    if((e.metaKey || e.ctrlKey) && k === 'z'){ e.preventDefault(); e.stopPropagation(); if(e.shiftKey) swap(REDO, HIST); else swap(HIST, REDO); return; }
    if(e.metaKey || e.ctrlKey || e.altKey) return; const m = { v: 'hand', p: 'pen', h: 'hl', t: 'text', e: 'erase', s: 'shape' }[k]; if(m){ setTool(m); } }
  /* 2718: with the Move tool (hand), a typed note can be dragged to another place (no need to switch to T); everything else still clicks through */
  function handDrag(el){ if(el.__inkHD) return; el.__inkHD = 1;
    el.addEventListener('pointerdown', e => { if(!on || tool !== 'hand' || !cv || host !== el || e.button > 0) return; const p = pt(e), a = hitText(p); if(!a) return;
      e.preventDefault(); e.stopPropagation(); const p0 = p, x0 = a.x, y0 = a.y, before = list().map(z => z === a ? Object.assign({}, z) : z); let moved = false;
      const mv = ev => { const q = pt(ev), dx = q[0] - p0[0], dy = q[1] - p0[1]; if(!moved && Math.hypot(dx, dy) < 0.004) return; moved = true; a.x = Math.max(0, Math.min(0.97, x0 + dx)); a.y = Math.max(0, y0 + dy); draw(); };
      const up = () => { window.removeEventListener('pointermove', mv, true); window.removeEventListener('pointerup', up, true); el.style.cursor = ''; if(moved){ HIST.push({ k: key, snap: before }); REDO.length = 0; if(HIST.length > 300) HIST.shift(); draw(); } };
      el.style.cursor = 'grabbing'; window.addEventListener('pointermove', mv, true); window.addEventListener('pointerup', up, true); }, true);
    el.addEventListener('pointermove', e => { if(!on || tool !== 'hand' || !cv || host !== el || e.buttons) return; const c = hitText(pt(e)) ? 'grab' : ''; if(el.style.cursor !== c) el.style.cursor = c; }); }
  window.CoeInk = {
    /* start a class session: fresh drawings, tools on the left */
    open(){ styles(); ANN = loadAll(); HIST = []; REDO = []; HIDE = false; on = true; tool = 'hand';
      if(!bar){ bar = document.createElement('div'); bar.className = 'ink-t'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Drawing tools'); bar.addEventListener('click', onBar); bar.addEventListener('mousedown', e => { if(EDIT2748 && e.target.closest && e.target.closest('[data-c]')) e.preventDefault(); }); document.body.appendChild(bar);
        mini = document.createElement('button'); mini.className = 'ink-m'; mini.type = 'button'; mini.title = 'Show the tools'; mini.onclick = () => document.body.classList.remove('ink-min'); document.body.appendChild(mini);
        document.addEventListener('keydown', onKey, true); }
      bar.style.display = ''; mini.style.display = ''; document.body.classList.remove('ink-min'); document.body.classList.add('ink-on'); paintBar(); },
    /* after each repaint: put the drawing layer over this screen (k = which screen, so each keeps its own drawings) */
    page(el, k){ if(!on || !el) return; host = el; key = String(k); handDrag(el); if(getComputedStyle(host).position === 'static') host.style.position = 'relative';
      host.querySelectorAll(':scope > canvas.ink-c').forEach(o => o.remove());   /* 2749: never two drawing layers on one screen (Copy screen took the old one) */
      cv = document.createElement('canvas'); cv.className = 'ink-c' + (tool === 'hand' ? ' off' : '') + (HIDE ? ' hid' : ''); host.appendChild(cv); bindCanvas();
      const room = () => { try{ const r = host.getBoundingClientRect(), ft = document.querySelector('.knav'); const fh = ft ? ft.getBoundingClientRect().height : 90; host.style.minHeight = Math.max(0, Math.round(window.innerHeight - (r.top + window.scrollY) - fh - 12)) + 'px'; }catch(e){} }; room();   /* 2688: room to write under the cards */
      if(ro) ro.disconnect(); ro = new ResizeObserver(() => fit()); ro.observe(host); fit(); },
    close(){ document.querySelectorAll('.ink-p.ink-out').forEach(n => n.remove()); on = false; if(ro) ro.disconnect(); ro = null; cv = null; host = null; if(bar) bar.style.display = 'none'; if(mini) mini.style.display = 'none'; document.body.classList.remove('ink-draw', 'ink-min', 'ink-on'); }
  };
})();
