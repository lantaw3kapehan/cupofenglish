// 1539 · Philippine price list + learning roadmap pictures, redesigned for the Philippine audience (29 Oct 2026, Misty 23:53).
// Same builder and frame as every CupOfEnglish picture (coeCard: logo + pill at the top, LEARN WITH THE BEST at the bottom) with a PH
// visual variant; no forked code. coeCard gets three optional settings used only by the PH pictures (China pictures pass none, so they
// stay byte-identical): opt.ratio (minimum height ratio · 1.25 = 4:5 portrait, 2440 × 3050 px, crisp for Facebook / Messenger),
// opt.font (Inter for the text) and opt.foot (one plain centred line just above the footer: the British Council line, sys:pricing_ph.bc_line).
// Price list: bold programme headline, who it is for (Adult: work & career, travel, everyday conversations, presentations · IELTS: the
//   Academic / General Training / UKVI pathways from Misty's IELTS flyer), three track columns (Foundation → Professional → Mastery) with
//   lessons + mock tests / tasks, ≈ hours, big ₱ price, ₱ per lesson, CEFR or band target, the track goal; Recommended column highlighted;
//   the four skills with check-marks; Good to know (50-minute lessons, method, 4-hour notice); quote dates.
// Roadmap: a visual path Foundation → Professional → Mastery with the level / band at each step (the chosen track highlighted), and the four
//   skills as cards with 3–5 core skills each (line icons) and the result. Facts only from sys:pricing_ph (Misty's flyers): no new claims,
//   discounts, payment plans or guarantees. Copy / Save / Share / Copy message unchanged.
const fs = require('fs'), file = process.argv[2], R = String.raw;
require('../tools/lib.js')(file, [
  ["const K = { CX: CX, Wc: Wc, R: Wc - CX, F: F,", "const K = { CX: CX, Wc: Wc, R: Wc - CX, F: opt && opt.font ? opt.font : F,"],
  ["const fy = y + 20; if(draw){ c.fillStyle = K.LINE; c.fillRect(CX, fy, Wc - CX * 2, 2);",
   "if(opt && opt.foot) y += 54; const fy = opt && opt.ratio && H ? Math.max(y + 20, H - 120) : y + 20; if(draw && opt && opt.foot){ let fz = 22; while(fz > 16 && T.w(opt.foot, '400 ' + fz + 'px ' + K.F) > Wc - 120) fz--; T.text(opt.foot, Wc / 2, fy - 22, '400 ' + fz + 'px ' + K.F, K.MUTE, 'center'); } if(draw){ c.fillStyle = K.LINE; c.fillRect(CX, fy, Wc - CX * 2, 2);"],
  ["const H = run(document.createElement('canvas').getContext('2d'), false, 0);",
   "let H = run(document.createElement('canvas').getContext('2d'), false, 0); if(opt && opt.ratio) H = Math.max(H, Math.round((Wc + 60) * opt.ratio) - 60);"],
  ["rec = L.find(p => p.k === PP.rec), Q = PP.m === 'ph' ? phQ() : null;",
   "rec = L.find(p => p.k === PP.rec), Q = PP.m === 'ph' ? phQ() : null;\nif(Q && window.phPricePic1539){ const my = PP; const b = await phPricePic1539(PP.ad === true ? 'adult' : 'ielts', PP.rec); if(PP !== my) return; PP.blob = b; const el0 = $('ppImg'); if(el0) el0.innerHTML = '<img src=\"' + URL.createObjectURL(PP.blob) + '\" style=\"width:100%;border-radius:12px;border:1px solid #E6EEF0\">'; return; }"],
  ["var blob = await coeCard(band ? 'IELTS learning roadmap' : 'Learning roadmap', function(T, y){",
   "if(window.phRoadPic1539){ var b9 = await phRoadPic1539(RP.pid, RP.tid); if(RP !== my) return; RP.blob = b9; var e9 = $('rpImg'); if(e9) e9.innerHTML = '<img src=\"' + URL.createObjectURL(b9) + '\" style=\"width:100%;border-radius:12px;border:1px solid #E6EEF0\">'; return; }\n    var blob = await coeCard(band ? 'IELTS learning roadmap' : 'Learning roadmap', function(T, y){"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<script>
/* 1539 · PH picture design (price list + roadmap) on the shared coeCard frame */
(function(){
  if(window.__1539) return; window.__1539 = 1;
  var FI = '"COE Card Inter",Inter,Arial,sans-serif', FB = '"COE Card Fredoka","Fredoka One",Arial,sans-serif';
  var NAVY = '#2B2253', TEAL = '#00737B', TEAL2 = '#16BCB0', SOFT = '#E3F6F6', MUTE = '#6F6B85', SUB = '#4A4766', LINE = '#E6ECEF', RED = '#E0533D';
  var D = function(){ return window.phPricing1530 ? phPricing1530() : null; };
  var prog = function(id){ var d = D(); return d && (d.programs || []).find(function(p){ return p.id === id; }) || null; };
  var peso = function(n){ return '₱' + Number(n || 0).toLocaleString('en-US'); };
  var IC = { check: ['M5 12l5 5L20 7'], speak: ['M3 20l1.3-3.9A9 8 0 1 1 7.7 19.7L3 20'], listen: ['M4 15v-3a8 8 0 0 1 16 0v3', 'M4 15h3v5H4z', 'M17 15h3v5h-3z'],
    read: ['M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0', 'M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0', 'M3 6v13', 'M12 6v13', 'M21 6v13'], write: ['M4 20h4L18.5 9.5a2.8 2.8 0 0 0-4-4L4 16v4', 'M13.5 6.5l4 4'],
    think: ['M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0-1 3a2 2 0 0 1-4 0a3.5 3.5 0 0 0-1-3', 'M9.7 17h4.6', 'M12 2v1', 'M4 11H3', 'M21 11h-1', 'M5.6 4.6l.7.7', 'M18.4 4.6l-.7.7'],
    work: ['M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M3 13h18'],
    plane: ['M16 10h4a2 2 0 0 1 0 4h-4l-4 7h-3l2-7H7l-2 2H2l2-4l-2-4h3l2 2h4L9 3h3z'], chat: ['M8 9h8M8 13h6', 'M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-5l-5 3v-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z'],
    present: ['M3 4h18', 'M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4', 'M12 16v4', 'M9 20h6', 'M8 12l3-3 2 2 3-3'], uni: ['M22 9L12 5 2 9l10 4z', 'M6 10.6V16a6 3 0 0 0 12 0v-5.4'],
    globe: ['M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z', 'M3.6 9h16.8M3.6 15h16.8', 'M11.5 3a17 17 0 0 0 0 18M12.5 3a17 17 0 0 1 0 18'], doc: ['M14 3v4a1 1 0 0 0 1 1h4', 'M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z', 'M9 13l2 2 4-4'],
    clock: ['M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z', 'M12 7v5l3 3'], target: ['M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18z', 'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8z', 'M12 12h.01'] };
  var skIc = function(n){ n = String(n).toLowerCase(); return /speak/.test(n) ? 'speak' : /listen/.test(n) ? 'listen' : /read/.test(n) ? 'read' : /writ/.test(n) ? 'write' : 'think'; };
  function ico(T, k, cx, cy, size, col, lw){ if(!T.draw) return; var c = T.c; c.save(); c.translate(cx - size / 2, cy - size / 2); c.scale(size / 24, size / 24); c.strokeStyle = col; c.lineWidth = lw || 2; c.lineCap = 'round'; c.lineJoin = 'round'; c.fillStyle = 'transparent'; (IC[k] || []).forEach(function(q){ c.stroke(new Path2D(q)); }); c.restore(); }
  function circ(T, cx, cy, r, fill, stroke, lw){ if(!T.draw) return; var c = T.c; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); if(fill){ c.fillStyle = fill; c.fill(); } if(stroke){ c.lineWidth = lw || 2; c.strokeStyle = stroke; c.stroke(); } }
  function head(T, y, kicker, big, small, sub){   // bold headline: "Adult English" navy + "1:1" teal
    T.text(kicker, T.CX, y + 6, '700 20px ' + FI, TEAL); var f = '400 70px ' + FB; T.text(big, T.CX, y + 82, f, NAVY); T.text(small, T.CX + T.w(big + ' ', f), y + 86, f, TEAL2);
    var sl = T.wrap(sub, T.Wc - T.CX * 2, '500 26px ' + FI).slice(0, 2); sl.forEach(function(s, i){ T.text(s, T.CX, y + 122 + i * 34, '500 26px ' + FI, SUB); }); return y + 122 + sl.length * 34 + 4; }
  function chips(T, y, L){ var x = T.CX; L.forEach(function(q){ var f = '600 21px ' + FI, w = T.w(q[1], f) + 74; if(x + w > T.Wc - T.CX){ x = T.CX; y += 58; } T.box(x, y, w, 46, 23, SOFT); ico(T, q[0], x + 28, y + 23, 22, TEAL, 2); T.text(q[1], x + 48, y + 30, f, TEAL); x += w + 12; }); return y + 46 + 26; }
  function pathways(T, y){ var W = (T.Wc - T.CX * 2 - 32) / 3, P = [['uni', 'Academic', 'University, postgraduate studies, professional registration'], ['work', 'General Training', 'Migration, employment overseas, everyday English'], ['globe', 'UKVI', 'UK visa and immigration (SELT)']];
    T.text('YOUR DESTINATION DETERMINES THE PATHWAY', T.CX, y + 2, '700 18px ' + FI, MUTE); y += 14;
    P.forEach(function(p, i){ var x = T.CX + i * (W + 16), L = T.wrap(p[2], W - 36, '400 18px ' + FI).slice(0, 2); T.box(x, y, W, 112, 20, '#fff', TEAL2, 2); ico(T, p[0], x + 34, y + 34, 26, TEAL, 2);
      T.text('IELTS ' + p[1], x + 58, y + 43, '700 22px ' + FI, NAVY); L.forEach(function(s, j){ T.text(s, x + 18, y + 70 + j * 23, '400 18px ' + FI, SUB); }); });
    return y + 112 + 10; }
  function columns(T, y, P, rec){ var band = P.measure === 'Band', TR = P.tracks || [], W = (T.Wc - T.CX * 2 - 32) / 3, top = y + 26, colH = 0, K = ['f', 'c', 'a'];
    var lay = function(go){ var hmax = 0; TR.forEach(function(t, i){ var x = T.CX + i * (W + 16), isR = rec && K[i] === rec, yy = top, gl = T.wrap(t.goal || '', W - 40, '600 20px ' + FI), ol = T.wrap(t.outcome || '', W - 40, '400 18px ' + FI);
        var hh = 350 + gl.length * 26 + ol.length * 23;
        if(go){ var H = colH; T.box(x, yy, W, H, 22, isR ? '#F4FBFB' : '#fff', isR ? TEAL2 : LINE, isR ? 3 : 2);
          T.box(x, yy, W, 84, 22, isR ? TEAL : NAVY); T.box(x, yy + 60, W, 24, 0, isR ? TEAL : NAVY);
          T.text(t.name.toUpperCase(), x + W / 2, yy + 40, '400 30px ' + FB, '#fff', 'center'); T.text('TRACK', x + W / 2, yy + 68, '700 16px ' + FI, isR ? '#CFF3F0' : '#BDB8D6', 'center');
          if(isR){ var rw = T.w('RECOMMENDED', '700 16px ' + FI) + 30; T.box(x + (W - rw) / 2, yy - 18, rw, 32, 16, '#FFD25E'); T.text('RECOMMENDED', x + W / 2, yy + 4, '700 16px ' + FI, NAVY, 'center'); }
          var cy = yy + 122; T.text(t.lessons + ' lessons', x + W / 2, cy, '700 28px ' + FI, NAVY, 'center'); T.text((t.extra ? '+ ' + t.extra + ' · ' : '') + '≈ ' + t.hours + ' hours', x + W / 2, cy + 30, '500 19px ' + FI, t.extra ? TEAL : MUTE, 'center');
          cy += 92; T.text(peso(t.price), x + W / 2, cy, '400 54px ' + FB, TEAL, 'center'); T.text(peso(Math.round(t.price / t.lessons)) + ' per lesson', x + W / 2, cy + 32, '600 19px ' + FI, SUB, 'center');
          cy += 62; T.box(x + 18, cy, W - 36, 56, 14, SOFT); ico(T, 'target', x + 44, cy + 28, 24, TEAL, 2); T.text(band ? 'Band ' + t.target : 'CEFR ' + t.target, x + 66, cy + 36, '700 21px ' + FI, NAVY);
          cy += 80; gl.forEach(function(s){ T.text(s, x + 20, cy, '600 20px ' + FI, NAVY); cy += 26; }); cy += 2; ol.forEach(function(s){ T.text(s, x + 20, cy, '400 18px ' + FI, SUB); cy += 23; }); }
        hmax = Math.max(hmax, hh); }); return hmax; };
    colH = lay(false); lay(true); return top + colH + 28; }
  function skillsRow(T, y, P){ var S = (P.system && P.system.skills) || [], W = (T.Wc - T.CX * 2) / Math.max(1, S.length); T.box(T.CX, y, T.Wc - T.CX * 2, 56, 18, '#F6F7FA');
    S.forEach(function(k, i){ var x = T.CX + i * W + 22; circ(T, x + 16, y + 28, 15, TEAL); ico(T, 'check', x + 16, y + 28, 18, '#fff', 3); T.text(k.name, x + 42, y + 36, '700 21px ' + FI, NAVY); }); return y + 56 + 24; }
  function notes(T, y, L){ T.text('GOOD TO KNOW', T.CX, y, '700 18px ' + FI, MUTE); y += 14;
    L.forEach(function(l){ T.wrap(l.t, T.Wc - T.CX * 2 - 26, (l.red ? '600 ' : '400 ') + '20px ' + FI).forEach(function(s, j){ y += 27; if(!j) T.dot(T.CX + 6, y - 7, l.red ? RED : TEAL2); T.text(s, T.CX + 24, y, (l.red ? '600 ' : '400 ') + '20px ' + FI, l.red ? RED : SUB); }); }); return y + 22; }
  var REG = null; function reg(){ if(REG) return REG; REG = Promise.all([['COE Card Fredoka', 'fonts/card-fredoka-one.woff2', '400'], ['COE Card Inter', 'fonts/card-inter-var.woff2', '100 900']].map(function(a){
      var have = false; try{ document.fonts.forEach(function(f){ if(String(f.family).replace(/["']/g, '') === a[0]) have = true; }); }catch(e){} if(have) return 0;
      try{ var f = new FontFace(a[0], 'url(' + a[1] + ') format("woff2")', { weight: a[2] }); document.fonts.add(f); return f.load().catch(function(){ return 0; }); }catch(e){ return 0; } })); return REG; }
  async function fonts(){ try{ await reg(); await Promise.all(['400 40px "COE Card Fredoka"', '400 20px "COE Card Inter"', '700 20px "COE Card Inter"'].map(function(f){ return document.fonts.load(f).catch(function(){ return 0; }); })); }catch(e){} }

  window.phPricePic1539 = async function(pid, rec){ var P = prog(pid); if(!P) return null; await fonts(); var band = P.measure === 'Band', d = D() || {}, H = window.phCxHours ? phCxHours() : 4;
    return coeCard(band ? 'IELTS price list' : 'Adult English price list', function(T, y){
      y = head(T, y + 4, band ? 'EXPERT IELTS · 1:1 PREMIUM PROGRAM' : 'EXPERT ADULT ENGLISH · 1:1 PREMIUM PROGRAM', band ? 'IELTS' : 'Adult English', '1:1', band ? 'One learner. One teacher. One clear goal.' : P.tagline || '');
      y = band ? pathways(T, y) : chips(T, y, [['work', 'Work & career'], ['plane', 'Travel'], ['chat', 'Everyday conversations'], ['present', 'Presentations']]);
      y = columns(T, y, P, rec);
      y = skillsRow(T, y, P);
      var d0 = coeDate(new Date())[0], d1 = coeDate(new Date(Date.now() + 7 * 864e5))[0];
      y = notes(T, y, [{ t: P.small || '' }, { t: (P.method || '') + '.' }, { t: 'Please tell your teacher at least ' + H + ' hours before class if you need to cancel or move a lesson.', red: 1 }].concat(band ? [{ t: 'Target bands are a guide; official results come from the IELTS test.' }] : []));
      T.text('Quoted on ' + d0 + ' · valid until ' + d1, T.CX, y + 6, '400 19px ' + FI, MUTE);
      return y + 12; }, { en: 1, ratio: 1.25, font: FI, foot: window.phBcLine ? phBcLine() : '' }); };

  window.phRoadPic1539 = async function(pid, tid){ var P = prog(pid); if(!P) return null; await fonts(); var band = P.measure === 'Band', S = P.system || {}, TR = P.tracks || [];
    return coeCard(band ? 'IELTS learning roadmap' : 'Learning roadmap', function(T, y){
      y = head(T, y + 4, (band ? 'EXPERT IELTS' : 'EXPERT ADULT ENGLISH') + ' · LEARNING ROADMAP', band ? 'IELTS' : 'Adult English', '1:1', S.sub || P.tagline || '');
      // the path: Foundation → Professional → Mastery
      var W = T.Wc - T.CX * 2, n = TR.length, step = W / n, py = y + 46;
      if(T.draw){ var c = T.c; c.save(); c.strokeStyle = TEAL2; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(T.CX + step / 2, py); c.lineTo(T.CX + W - step / 2, py); c.stroke();
        for(var a = 1; a < n; a++){ var ax = T.CX + step * a; c.fillStyle = TEAL2; c.beginPath(); c.moveTo(ax + 8, py); c.lineTo(ax - 8, py - 12); c.lineTo(ax - 8, py + 12); c.closePath(); c.fill(); } c.restore(); }
      TR.forEach(function(t, i){ var cx = T.CX + step * i + step / 2, on = tid ? t.id === tid : true;
        circ(T, cx, py, 40, on ? TEAL : '#fff', TEAL, 4); T.text(String(i + 1), cx, py + 15, '400 40px ' + FB, on ? '#fff' : TEAL, 'center');
        T.text(t.name, cx, py + 92, '400 34px ' + FB, NAVY, 'center'); T.text(t.lessons + ' lessons' + (t.extra ? ' + ' + t.extra : ''), cx, py + 126, '500 19px ' + FI, SUB, 'center');
        var lab = (band ? 'Band ' : 'CEFR ') + t.target, lw = T.w(lab, '700 20px ' + FI) + 32; T.box(cx - lw / 2, py + 144, lw, 40, 20, on ? SOFT : '#F6F7FA'); T.text(lab, cx, py + 171, '700 20px ' + FI, on ? TEAL : SUB, 'center');
        T.wrap(t.goal || '', step - 30, '400 18px ' + FI).slice(0, 2).forEach(function(s, j){ T.text(s, cx, py + 214 + j * 24, '400 18px ' + FI, MUTE, 'center'); }); });
      y = py + 214 + 48 + 22;
      // the four skills
      T.text('THE FOUR SKILLS YOU WILL BUILD', T.CX, y, '700 18px ' + FI, MUTE); y += 18;
      var SK = S.skills || [], CW = (W - 20) / 2, rows = Math.ceil(SK.length / 2), ch = 0;
      SK.forEach(function(k){ var core = (k.core || []).slice(0, 5), res = T.wrap(k.result || '', CW - 48, '600 18px ' + FI).slice(0, 2); ch = Math.max(ch, 72 + core.length * 27 + 6 + res.length * 23 + 12); });
      SK.forEach(function(k, i){ var x = T.CX + (i % 2) * (CW + 20), yy = y + Math.floor(i / 2) * (ch + 14), core = (k.core || []).slice(0, 5), res = T.wrap(k.result || '', CW - 48, '600 18px ' + FI).slice(0, 2);
        T.box(x, yy, CW, ch, 22, '#fff', LINE, 2); circ(T, x + 44, yy + 42, 26, SOFT); ico(T, skIc(k.name), x + 44, yy + 42, 28, TEAL, 2); T.text(k.name, x + 84, yy + 52, '400 32px ' + FB, NAVY);
        var cy = yy + 96; core.forEach(function(s){ var fz = 20; while(fz > 16 && T.w(s, '400 ' + fz + 'px ' + FI) > CW - 76) fz--; ico(T, 'check', x + 34, cy - 7, 20, TEAL2, 3); T.text(s, x + 56, cy, '400 ' + fz + 'px ' + FI, SUB); cy += 27; });
        cy += 6; res.forEach(function(s){ T.text(s, x + 24, cy, '600 18px ' + FI, TEAL); cy += 23; }); });
      y += rows * (ch + 14) + 8;
      var ft = (S.footer || []).filter(function(f){ return !/Track-Based/.test(f); }).join(' · '), fz = 19; while(fz > 15 && T.w(ft, '500 ' + fz + 'px ' + FI) > T.Wc - T.CX * 2) fz--;
      T.text(ft, T.Wc / 2, y + 10, '500 ' + fz + 'px ' + FI, MUTE, 'center');
      return y + 20; }, { en: 1, ratio: 1.25, font: FI }); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1539 PH price list + roadmap design (4:5, shared frame)');
