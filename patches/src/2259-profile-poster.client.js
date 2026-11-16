/* 2259 · Teacher profile card, new design (Misty 16 Nov 11:39: "make the poster itself the best design while keeping it persuasive")
   Portrait card for WeChat (reads well on a phone): big photo, name, the line under the name as tags, qualifications as badges,
   strengths, the teaching mix as one coloured bar with a legend, the classroom style as a quote, and a free-trial call to action.
   Same fields as before, so every saved card redraws in the new design. */
(function(){
  if(window.__prf2259) return; window.__prf2259 = 1;
  const NAVY = '#2B2253', TEAL = '#14B3A7', TEAL2 = '#0E8F86', SOFT = '#EEF8F7', INK2 = '#5B5675', LINE = '#D5EEEB';
  const MIXC = ['#14B3A7', '#2B2253', '#F2B544', '#7FD8CF', '#E07A5F', '#9C8ADE'];
  window.prfDraw = async function(){ const P = PRFE; if(!P) return;
    try{ await document.fonts.ready; await document.fonts.load('400 40px "Fredoka One"').catch(() => 0); }catch(x){}
    const [logo, tag] = await Promise.all([prfLd((document.querySelector('#login img') || {}).src), prfLd((document.querySelector('#login .tagl img') || {}).src)]);
    const W = 1600, M = 100, CW = W - 2 * M, F = '"PingFang SC","Microsoft YaHei","Noto Sans SC","Hiragino Sans GB",sans-serif', FO = '"Fredoka One",' + F;
    const m = document.createElement('canvas').getContext('2d');
    const wrap = (t, font, w) => { m.font = font; const out = []; String(t || '').split('\n').forEach(par => { let line = '';
      for(const ch of Array.from(par)){ const t2 = line + ch; if(m.measureText(t2).width > w && line && !/[。，、；：！？）》」』.,;:!?)]/.test(ch)){ const sp = line.lastIndexOf(' ');
        if(/[A-Za-z0-9]/.test(ch) && sp > 0 && /[A-Za-z0-9]$/.test(line)){ out.push(line.slice(0, sp)); line = line.slice(sp + 1) + ch; } else { out.push(line); line = ch.trim() ? ch : ''; } } else line = t2; }
      if(line) out.push(line); }); return out; };
    const tw = (t, font) => { m.font = font; return m.measureText(t).width; };

    /* ── measure ── */
    const tags = String(P.sub || '').split(/\s*[·•|｜]\s*/).map(s => s.trim()).filter(Boolean);
    const tagF = '700 38px ' + F, tagPad = 34, tagH = 74, tagGap = 16;
    const tagRows = []; { let row = [], w = 0; tags.forEach(t => { const x = Math.min(tw(t, tagF), CW - 2 * tagPad) + 2 * tagPad; if(row.length && w + tagGap + x > CW){ tagRows.push(row); row = []; w = 0; } row.push([t, x]); w += (row.length > 1 ? tagGap : 0) + x; }); if(row.length) tagRows.push(row); }
    const creds = prfLines(P.creds), crF = '700 34px ' + F, crH = 66, crPad = 28;
    const crRows = []; { let row = [], w = 0; creds.forEach(t => { const x = Math.min(tw(t, crF), CW - 2 * crPad - 44) + 2 * crPad + 44; if(row.length && w + 14 + x > CW){ crRows.push(row); row = []; w = 0; } row.push([t, x]); w += (row.length > 1 ? 14 : 0) + x; }); if(row.length) crRows.push(row); }
    const skF = '400 34px ' + F, skills = prfLines(P.skills), colW = (CW - 60) / 2 - 40;
    const two = skills.length >= 5 && skills.filter(s => tw(s, skF) > colW).length <= Math.ceil(skills.length / 3);   // two columns; a long line wraps inside its column
    const skL = skills.map(s => wrap(s, skF, two ? colW : CW - 60)), skLH = 50;
    let skH = 0; if(two){ for(let i = 0; i < skL.length; i += 2) skH += Math.max(skL[i].length, (skL[i + 1] || []).length) * skLH + 18; } else skL.forEach(x => skH += x.length * skLH + 18);
    const mix = prfLines(P.mix).map(l => { const x = l.match(/^(\d+(?:\.\d+)?)\s*%\s*(.*)$/); const t = (x ? x[2] : l).trim(), i = t.search(/[（(]/);
      let ti = t, d = ''; if(i > 0){ ti = t.slice(0, i).trim(); let rest = t.slice(i), mm;
        while((mm = rest.match(/^[（(]([^（）()]{1,8})[）)]\s*(?=[（(])/))){ ti += '（' + mm[1] + '）'; rest = rest.slice(mm[0].length); }   // 综合能力培养（4Cs）（创造力…）
        d = rest.replace(/^[（(]/, '').replace(/[）)]$/, '').trim(); }
      return { p: x ? +x[1] : 0, t: ti, d }; });
    const mxTF = '700 36px ' + F, mxDF = '400 29px ' + F, mxTW = CW - 260;
    mix.forEach(x => { x.tl = wrap(x.t, mxTF, mxTW); x.dl = x.d ? wrap(x.d, mxDF, mxTW) : []; x.h = Math.max(92, x.tl.length * 46 + x.dl.length * 40 + 26); });
    const stF = '700 40px ' + F, stL = wrap(P.style, stF, CW - 150);

    const logoW = 440, logoH = logo ? logoW * logo.height / logo.width : 110;
    let y = 70; const L = {};
    L.logo = y; y += logoH + 70;
    L.photo = y; const pr = 250; y += pr * 2 + 70;
    L.name = y + 100; y += 140;
    L.tags = y + 10; y += tagRows.length * (tagH + 14) + 30;
    L.creds = y; y += crRows.length ? crRows.length * (crH + 14) + 40 : 0;
    const secH = 90;
    L.sk = y; y += skills.length ? secH + skH + 40 : 0;
    L.mx = y; y += mix.length ? secH + 64 + 34 + mix.reduce((a, x) => a + x.h, 0) + 40 : 0;
    L.st = y; y += stL.length ? secH + stL.length * 60 + 90 + 50 : 0;
    L.cta = y; y += 190 + 60;
    const tagImgH = tag ? 380 * tag.height / tag.width : 50; L.tag = y; y += tagImgH + 70;
    const H = Math.round(y);

    /* ── draw ── */
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
    const rr = (x, y, w, h, r) => { r = Math.min(r, h / 2, w / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
    c.fillStyle = '#fff'; c.fillRect(0, 0, W, H);
    // soft top band + decorative circles
    const g0 = c.createLinearGradient(0, 0, 0, L.name + 40); g0.addColorStop(0, '#E3F6F4'); g0.addColorStop(1, '#FFFFFF'); c.fillStyle = g0; c.fillRect(0, 0, W, L.name + 40);
    c.fillStyle = 'rgba(20,179,167,.08)'; c.beginPath(); c.arc(W - 90, 160, 230, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(80, L.photo + 380, 150, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(242,181,68,.16)'; c.beginPath(); c.arc(W / 2 + pr + 70, L.photo + 70, 46, 0, Math.PI * 2); c.fill();
    if(logo) c.drawImage(logo, (W - logoW) / 2, L.logo, logoW, logoH);
    // photo
    const pcx = W / 2, pcy = L.photo + pr;
    c.save(); c.shadowColor = 'rgba(43,34,83,.18)'; c.shadowBlur = 50; c.shadowOffsetY = 18; c.beginPath(); c.arc(pcx, pcy, pr + 14, 0, Math.PI * 2); c.fillStyle = '#fff'; c.fill(); c.restore();
    c.save(); c.beginPath(); c.arc(pcx, pcy, pr, 0, Math.PI * 2); c.closePath(); c.fillStyle = SOFT; c.fill(); c.clip();
    if(P.photoIm){ const s = Math.min(P.photoIm.width, P.photoIm.height); c.drawImage(P.photoIm, (P.photoIm.width - s) / 2, (P.photoIm.height - s) / 2, s, s, pcx - pr, pcy - pr, pr * 2, pr * 2); }
    else { c.fillStyle = '#A9D8D4'; c.textAlign = 'center'; c.font = '400 220px ' + FO; c.fillText(P.teacher.charAt(0).toUpperCase(), pcx, pcy + 78); }
    c.restore(); c.lineWidth = 8; c.strokeStyle = TEAL; c.beginPath(); c.arc(pcx, pcy, pr + 4, 0, Math.PI * 2); c.stroke();
    c.lineWidth = 3; c.strokeStyle = 'rgba(20,179,167,.35)'; c.setLineDash([4, 14]); c.beginPath(); c.arc(pcx, pcy, pr + 34, Math.PI * 0.95, Math.PI * 1.75); c.stroke(); c.setLineDash([]);
    // name
    c.textAlign = 'center'; let fs = 118; const nm = ('Teacher ' + P.teacher).toUpperCase(); c.font = '400 ' + fs + 'px ' + FO; while(c.measureText(nm).width > CW && fs > 60){ fs -= 6; c.font = '400 ' + fs + 'px ' + FO; }
    c.fillStyle = '#9BE3DA'; c.fillText(nm, W / 2 + 6, L.name + 6); c.fillStyle = NAVY; c.fillText(nm, W / 2, L.name);
    // tags (the line under the name)
    tagRows.forEach((row, ri) => { const tot = row.reduce((a, x) => a + x[1], 0) + (row.length - 1) * tagGap; let x0 = (W - tot) / 2; const yy = L.tags + ri * (tagH + 14);
      row.forEach(([t, w], i) => { const first = ri === 0 && i === 0; c.fillStyle = first ? TEAL : SOFT; rr(x0, yy, w, tagH, tagH / 2); c.fill();
        c.fillStyle = first ? '#fff' : TEAL2; c.font = tagF; c.textAlign = 'center'; c.fillText(t, x0 + w / 2, yy + 50, w - 2 * tagPad); x0 += w + tagGap; }); });
    // qualifications as badges
    crRows.forEach((row, ri) => { const tot = row.reduce((a, x) => a + x[1], 0) + (row.length - 1) * 14; let x0 = (W - tot) / 2; const yy = L.creds + ri * (crH + 14);
      row.forEach(([t, w]) => { c.fillStyle = '#fff'; c.strokeStyle = LINE; c.lineWidth = 3; rr(x0, yy, w, crH, 18); c.fill(); c.stroke();
        c.fillStyle = TEAL; c.beginPath(); c.arc(x0 + crPad + 14, yy + crH / 2, 15, 0, Math.PI * 2); c.fill();
        c.strokeStyle = '#fff'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(x0 + crPad + 7, yy + crH / 2); c.lineTo(x0 + crPad + 12, yy + crH / 2 + 6); c.lineTo(x0 + crPad + 22, yy + crH / 2 - 6); c.stroke(); c.lineCap = 'butt';
        c.fillStyle = NAVY; c.font = crF; c.textAlign = 'left'; c.fillText(t, x0 + crPad + 44, yy + 45, w - 2 * crPad - 44); x0 += w + 14; }); });
    // section title
    const sec = (yy, zh, en) => { c.textAlign = 'left'; c.fillStyle = TEAL; rr(M, yy + 16, 12, 52, 6); c.fill(); c.fillStyle = NAVY; c.font = '800 50px ' + F; c.fillText(zh, M + 34, yy + 60);
      const w = tw(zh, '800 50px ' + F); c.fillStyle = '#9A96B0'; c.font = '400 28px ' + FO; c.fillText(en, M + 34 + w + 20, yy + 58);
      c.strokeStyle = LINE; c.lineWidth = 2; c.beginPath(); c.moveTo(M + 34 + w + 20 + tw(en, '400 28px ' + FO) + 24, yy + 48); c.lineTo(W - M, yy + 48); c.stroke(); };
    // strengths
    if(skills.length){ sec(L.sk, '擅长领域', 'STRENGTHS'); let yy = L.sk + secH + 20;
      const item = (lines, x, y0) => { c.fillStyle = TEAL; c.beginPath(); c.arc(x + 10, y0 - 12, 9, 0, Math.PI * 2); c.fill(); c.fillStyle = '#3A3458'; c.font = skF; c.textAlign = 'left'; lines.forEach((t, i) => c.fillText(t, x + 36, y0 + i * skLH)); };
      if(two){ for(let i = 0; i < skL.length; i += 2){ item(skL[i], M + 10, yy + 22); if(skL[i + 1]) item(skL[i + 1], M + 30 + (CW - 60) / 2 + 20, yy + 22); yy += Math.max(skL[i].length, (skL[i + 1] || []).length) * skLH + 18; } }
      else skL.forEach(l => { item(l, M + 10, yy + 22); yy += l.length * skLH + 18; }); }
    // teaching mix: one bar + legend
    if(mix.length){ sec(L.mx, '课堂构成', 'IN CLASS'); const by = L.mx + secH + 14, tot = mix.reduce((a, x) => a + (x.p || 0), 0) || 1; let bx = M;
      c.save(); rr(M, by, CW, 64, 32); c.clip(); mix.forEach((x, i) => { const w = CW * (x.p || 0) / tot; c.fillStyle = MIXC[i % MIXC.length]; c.fillRect(bx, by, w + 1, 64);
        if(w > 90){ c.fillStyle = i === 2 ? NAVY : '#fff'; c.font = '400 34px ' + FO; c.textAlign = 'center'; c.fillText(x.p + '%', bx + w / 2, by + 45); } bx += w; }); c.restore();
      let yy = by + 64 + 34; mix.forEach((x, i) => { c.fillStyle = MIXC[i % MIXC.length]; rr(M + 6, yy + 12, 22, 22, 6); c.fill();
        c.fillStyle = NAVY; c.font = '400 56px ' + FO; c.textAlign = 'left'; c.fillText((x.p || '') + (x.p ? '%' : ''), M + 46, yy + 50);
        c.font = mxTF; x.tl.forEach((t, k) => c.fillText(t, M + 230, yy + 36 + k * 46)); c.fillStyle = INK2; c.font = mxDF; x.dl.forEach((t, k) => c.fillText(t, M + 230, yy + 36 + x.tl.length * 46 + k * 40));
        yy += x.h; if(i < mix.length - 1){ c.strokeStyle = '#EEF0F4'; c.lineWidth = 2; c.beginPath(); c.moveTo(M + 230, yy - 12); c.lineTo(W - M, yy - 12); c.stroke(); } }); }
    // classroom style as a quote
    if(stL.length){ sec(L.st, '课堂风格', 'TEACHING STYLE'); const qy = L.st + secH + 10, qh = stL.length * 60 + 70; c.fillStyle = SOFT; rr(M, qy, CW, qh, 34); c.fill();
      c.fillStyle = 'rgba(20,179,167,.35)'; c.font = '400 170px ' + FO; c.textAlign = 'left'; c.fillText('“', M + 24, qy + 140);
      c.fillStyle = TEAL2; c.font = stF; c.textAlign = 'left'; stL.forEach((t, i) => c.fillText(t, M + 100, qy + 74 + i * 60)); }
    // call to action
    { const cy = L.cta, ch = 190, g = c.createLinearGradient(M, 0, W - M, 0); g.addColorStop(0, '#14B3A7'); g.addColorStop(1, '#0E8F86'); c.fillStyle = g; rr(M, cy, CW, ch, 40); c.fill();
      c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(W - M - 60, cy + 30, 120, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#fff'; c.textAlign = 'left'; c.font = '800 56px ' + F; c.fillText('免费试听 25 分钟', M + 60, cy + 88);
      c.font = '400 32px ' + F; c.fillText('一对一在线外教 · 回复本消息即可预约 ' + P.teacher + ' 老师', M + 60, cy + 146, CW - 400);
      c.fillStyle = '#F2B544'; rr(W - M - 250, cy + 54, 200, 82, 41); c.fill(); c.fillStyle = NAVY; c.font = '800 38px ' + F; c.textAlign = 'center'; c.fillText('立即预约', W - M - 150, cy + 108); }
    if(tag) c.drawImage(tag, (W - 380) / 2, L.tag, 380, tagImgH);

    const blob = await new Promise(r => cv.toBlob(r, 'image/png')); if(PRFE !== P) return; P.blob = blob;
    const el = $('prfImg'); if(el){ if(P.url) URL.revokeObjectURL(P.url); P.url = URL.createObjectURL(blob); el.src = P.url; const w = $('prfWait'); if(w) w.remove(); }
    try{ window.prf2Thumb && prf2Thumb(); }catch(x){}
  };
})();
