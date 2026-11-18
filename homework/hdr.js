/* CupOfEnglish · one header for every homework picture (Misty 18 Nov 19:33, design "A · Letterhead"):
   logo on the left · "Homework / 作业" (or the picture's own title) in teal on the right with "For / 学生: name · date" under it ·
   a hairline · an optional small grey label (book · unit, writing type) · no footer, so the logo and the date appear once.
   Used by homework/give.html, homework/writing.html, homework/index.html and reader/index.html (book page copy). */
(function(){
  const FT = '"COE Card Fredoka", Fredoka, "Fredoka One", "Noto Sans SC", sans-serif', FI = '"COE Card Inter", Inter, "Noto Sans SC", "PingFang SC", sans-serif';
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
    if(o.logo && o.logo.width){ const lh = Math.round(34 * u); lw = Math.round(o.logo.width * lh / o.logo.height); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
      g.drawImage(crisp(o.logo, lw), P, Math.round(top + (row - lh) / 2), lw, lh); }
    else { g.fillStyle = '#2B2253'; g.font = '600 ' + (20 * u) + 'px ' + FT; g.fillText('CupOfEnglish', P, top + 26 * u); lw = g.measureText('CupOfEnglish').width; }
    const room = W - 2 * P - lw - 20 * u;
    /* the English leads: "Homework" full size, " / 作业" at 72 % (Misty 18 Nov 19:56) */
    const title = o.title || 'Homework / 作业', cut = title.indexOf(' / '), en = cut > 0 ? title.slice(0, cut) : title, zh = cut > 0 ? title.slice(cut) : '';
    let big = 19 * u; const wOf = b => { g.font = '600 ' + b + 'px ' + FT; const a = g.measureText(en).width; g.font = '600 ' + (b * 0.72) + 'px ' + FT; return a + (zh ? g.measureText(zh).width : 0); };
    while(wOf(big) > room && big > 12 * u) big -= 0.5;
    g.fillStyle = TEAL; g.textAlign = 'left'; const ty = top + 19 * u, x0 = W - P - wOf(big);
    g.font = '600 ' + big + 'px ' + FT; const ew = g.measureText(en).width; g.fillText(en, x0, ty);
    if(zh){ g.font = '600 ' + (big * 0.72) + 'px ' + FT; g.fillText(zh, x0 + ew, ty); }
    g.textAlign = 'right';
    const meta = (o.meta || []).filter(Boolean).concat(o.date === false ? [] : [o.date || today()]).join('  ·  ');
    if(meta){ g.fillStyle = GREY; const m = fit(g, meta, s => '400 ' + s + 'px ' + FI, 12 * u, 9 * u, room); g.fillText(m, W - P, top + 19 * u + 3 * u + 12 * u); }
    g.textAlign = 'left';
    const ly = Math.round(top + row + 16 * u); g.fillStyle = LINE; g.fillRect(P, ly, W - 2 * P, Math.max(1, Math.round(u * 0.9)));
    if(hasL){ g.fillStyle = GREY; const l = fit(g, String(o.label).trim(), s => '400 ' + s + 'px ' + FI, 12 * u, 9 * u, W - 2 * P); g.fillText(l, P, ly + 12 * u + 12 * u); }
    g.restore(); return H; }
  window.coeHdr = { height, draw, pad: W => Math.round(26 * U(W)), today };
})();
