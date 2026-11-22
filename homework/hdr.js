/* CupOfEnglish · one header for every homework picture (Misty 18 Nov 19:33, design "A · Letterhead"):
   logo on the left · "Homework / 作业" (or the picture's own title) in teal on the right with "For / 学生: name · date" under it ·
   a hairline · an optional small grey label (book · unit, writing type) · no footer, so the logo and the date appear once.
   Used by homework/give.html, homework/writing.html, homework/index.html and reader/index.html (book page copy). */
(function(){
  /* 2684 (Misty 22 Nov 12:00, option A): the title and the details in Source Serif like the page · title in deep navy with a short teal line under it */
  const FT = '"COE Serif", Georgia, "Noto Sans SC", "PingFang SC", serif', FI = '"COE Serif", Georgia, "Noto Sans SC", "PingFang SC", serif', FL = '"COE Card Fredoka", Fredoka, "Fredoka One", sans-serif';
  try{ if(![...document.fonts].some(f => f.family.replace(/"/g, '') === 'COE Serif')) [['400', 'normal'], ['700', 'normal'], ['400', 'italic'], ['700', 'italic']].forEach(([w, st]) => { const f = new FontFace('COE Serif', 'url(/fonts/card-serif-' + w + '-' + st + '.woff2)', { weight: w, style: st }); document.fonts.add(f); f.load().then(() => { try{ window.__draw2677 && window.__draw2677(); }catch(e){} }).catch(() => {}); }); }catch(e){}
  const TEAL = '#00ACB8'   /* 18 Nov 19:58 (Misty, option 1): the cup colour of the logo */, GREY = '#6B6880', LINE = '#E3E1EA';
  const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = () => { const d = new Date(); return d.getDate() + ' ' + MO[d.getMonth()] + ' ' + d.getFullYear(); };
  /* shrink a large logo in halves with high-quality smoothing, so it stays crisp */
  function crisp(im, w){ let s = im, sw = im.width, sh = im.height;
    while(sw / 2 >= w * 1.4){ const c = document.createElement('canvas'); c.width = Math.round(sw / 2); c.height = Math.round(sh / 2); const g = c.getContext('2d');
      g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(s, 0, 0, c.width, c.height); s = c; sw = c.width; sh = c.height; }
    return s; }
  const U = W => W / 560;   /* the design was drawn 560 px wide */
  /* height of the header (content starts here) */
  function height(W, hasLabel){ const u = U(W); return Math.round(u * (22 + 38 + 16) + Math.max(1, u * 0.9) + u * (hasLabel ? 38 : 16)); }
  function fit(g, t, font, size, min, room){ let s = size; g.font = font(s); while(g.measureText(t).width > room && s > min){ s -= 0.5; g.font = font(s); }
    let x = t; if(g.measureText(x).width > room){ while(x.length > 4 && g.measureText(x + '…').width > room) x = x.slice(0, -1); x = x.trim() + '…'; } return x; }
  /* o: { logo: Image|null, title, meta: [parts], label } · paints a white header on g (canvas 2D) at the top; returns where content starts */
  function draw(g, W, o){ o = o || {}; const u = U(W), P = Math.round(26 * u), hasL = !!(o.label && String(o.label).trim()), H = height(W, hasL);
    g.save(); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.textBaseline = 'alphabetic';
    const top = 22 * u, row = 38 * u; let lw = 0;
    /* 2711 (Misty 22 Nov 18:41): o.slim · the on-screen class notes board: no logo (it is already in the reader's top bar), title on the left, details on the right, same height */
    if(o.slim){ lw = 0; }
    else if(o.logo && o.logo.width){ const lh = Math.round(34 * u); lw = Math.round(o.logo.width * lh / o.logo.height); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      g.drawImage(crisp(o.logo, lw), P, Math.round(top + (row - lh) / 2), lw, lh); }
    else { g.fillStyle = '#2B2253'; g.font = '600 ' + (20 * u) + 'px ' + FL; g.fillText('CupOfEnglish', P, top + 26 * u); lw = g.measureText('CupOfEnglish').width; }
    const room = o.slim ? (W - 2 * P) * 0.5 : W - 2 * P - lw - 20 * u;
    /* the English leads: "Homework" full size, " / 作业" at 72 % (Misty 18 Nov 19:56) */
    const title = o.title || 'Homework / 作业', cut = title.indexOf(' / '), en = cut > 0 ? title.slice(0, cut) : title, zh = cut > 0 ? title.slice(cut) : '';
    let big = 19 * u; const wOf = b => { g.font = '700 ' + b + 'px ' + FT; const a = g.measureText(en).width; g.font = '700 ' + (b * 0.72) + 'px ' + FT; return a + (zh ? g.measureText(zh).width : 0); };
    while(wOf(big) > room && big > 12 * u) big -= 0.5;
    g.fillStyle = '#2B2253'; g.textAlign = 'left'; const ty = o.slim ? top + 30 * u : top + 18 * u, x0 = o.slim ? P : W - P - wOf(big);
    g.font = '700 ' + big + 'px ' + FT; const ew = g.measureText(en).width; g.fillText(en, x0, ty);
    if(zh){ g.font = '700 ' + (big * 0.72) + 'px ' + FT; g.fillText(zh, x0 + ew, ty); }
    g.fillStyle = '#14B3A7'; g.beginPath(); const uw = 20 * u, uh = Math.max(2, 1.7 * u); const ux = o.slim ? P : W - P - uw; g.roundRect ? g.roundRect(ux, ty + 6.5 * u, uw, uh, uh / 2) : g.rect(ux, ty + 6.5 * u, uw, uh); g.fill();
    g.textAlign = 'right';
    const meta = (o.meta || []).filter(Boolean).concat(o.date === false ? [] : [o.date || today()]).join('  ·  ');
    /* 2695 (Misty 22 Nov 14:27, option A): the student's name on a light teal band, the teacher's on a light lavender band, like the book label */
    const segs = []; (o.meta || []).filter(Boolean).concat(o.date === false ? [] : [o.date || today()]).forEach((p, i) => { if(i) segs.push({ t: '  ·  ' }); let m;
      if((m = /^(For(?: \/ 学生)?:\s*)(.+)$/.exec(p))) segs.push({ t: m[1] }, { t: m[2], bg: '#E4F6F6', fg: '#0E6F68' });
      else if((m = /^(Teacher(?: \/ 老师)?:\s*|Teacher\s+)(.+)$/.exec(p))) segs.push({ t: m[1] }, { t: m[2], bg: '#ECE9F7', fg: '#3C3489' });
      else segs.push({ t: p }); });
    const pd95 = 6 * u, yb95 = o.slim ? ty : top + 37 * u; let fs95 = 12 * u; const room95 = o.slim ? W - 2 * P - wOf(big) - 24 * u : room;
    const mw95 = () => segs.reduce((a, x) => { g.font = (x.bg ? '700 ' : '400 ') + fs95 + 'px ' + FI; return a + g.measureText(x.t).width + (x.bg ? 2 * pd95 : 0); }, 0);
    while(mw95() > room95 && fs95 > 9 * u) fs95 -= 0.5;
    if(segs.length && mw95() <= room95){ let x = W - P - mw95(); g.textAlign = 'left';
      segs.forEach(x0 => { g.font = (x0.bg ? '700 ' : '400 ') + fs95 + 'px ' + FI; const w = g.measureText(x0.t).width;
        if(x0.bg){ const h = fs95 * 1.45; g.fillStyle = x0.bg; g.beginPath(); g.roundRect ? g.roundRect(x, yb95 - fs95 * 1.08, w + 2 * pd95, h, h / 2) : g.rect(x, yb95 - fs95 * 1.08, w + 2 * pd95, h); g.fill(); g.fillStyle = x0.fg; g.fillText(x0.t, x + pd95, yb95); x += w + 2 * pd95; }
        else { g.fillStyle = GREY; g.fillText(x0.t, x, yb95); x += w; } }); g.textAlign = 'right'; }
    else if(meta){ g.fillStyle = GREY; const m = fit(g, meta, s => '400 ' + s + 'px ' + FI, 12 * u, 9 * u, room); g.fillText(m, W - P, top + 37 * u); }
    g.textAlign = 'left';
    const ly = Math.round(top + row + 16 * u); g.fillStyle = LINE; g.fillRect(P, ly, W - 2 * P, Math.max(1, Math.round(u * 0.9)));
    if(hasL){ /* 2687 (Misty 22 Nov 12:42, option B): the book or writing label in cup teal on a light teal band */
      const pd = 8 * u, ph = 21 * u, py = ly + 9 * u; const l = fit(g, String(o.label).trim(), s => '700 ' + s + 'px ' + FI, 12 * u, 9 * u, W - 2 * P - 2 * pd); g.font = '700 ' + (12 * u) + 'px ' + FI; const lw2 = Math.min(g.measureText(l).width, W - 2 * P - 2 * pd);
      g.fillStyle = '#E4F6F6'; g.beginPath(); g.roundRect ? g.roundRect(P, py, lw2 + 2 * pd, ph, ph / 2) : g.rect(P, py, lw2 + 2 * pd, ph); g.fill();
      g.fillStyle = '#0E6F68'; g.font = '700 ' + (12 * u) + 'px ' + FI; fit(g, l, s => '700 ' + s + 'px ' + FI, 12 * u, 9 * u, W - 2 * P - 2 * pd); g.fillText(l, P + pd, py + ph / 2 + 4.3 * u); }
    g.restore(); return H; }
  window.coeHdr = { height, draw, pad: W => Math.round(26 * U(W)), today };
})();
