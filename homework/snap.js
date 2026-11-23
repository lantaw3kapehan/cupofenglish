/* 2719 (Misty 22 Nov 19:03): "Copy screen" · a picture of what is on the screen (cards, words, colours, lines) with the teacher's
   drawings on top, under the CupOfEnglish header. Each word is drawn where it sits on the screen (no outside program, no upload).
   coeSnap.shot(parts, ink, opt) → canvas · parts: elements stacked one under the other · ink: the drawing canvas (or null)
   coeSnap.withHead(canvas, { logo, title, meta, label }) → canvas with the header · coeSnap.copy(canvasOrPromise, button) */
const SAFE2740 = new Map();   /* 2740: which photos can go into a picture */
(function(){
  if(window.coeSnap) return;
  const tr = s => !s || s === 'transparent' || /rgba\(.*,\s*0\)$/.test(s);
  function shot(parts, ink, opt){ opt = opt || {}; parts = parts.filter(Boolean);
    const box = parts.map(n => n.getBoundingClientRect()), L = Math.min(...box.map(r => r.left)), Rr = Math.max(...box.map(r => r.right)), GAP = opt.gap == null ? 18 : opt.gap;
    const pad = opt.pad == null ? 28 : opt.pad, z = 2, tot = box.reduce((a, r) => a + r.height, 0) + GAP * (box.length - 1), cv = document.createElement('canvas');
    cv.width = Math.round((Rr - L + 2 * pad) * z); cv.height = Math.round((tot + 2 * pad) * z);
    const g = cv.getContext('2d'); g.scale(z, z); g.fillStyle = opt.bg || '#fff'; g.fillRect(0, 0, cv.width, cv.height);
    const rr = (x, y, w, h, r) => { g.beginPath(); if(g.roundRect && r) g.roundRect(x, y, w, h, Math.min(r, h / 2, w / 2)); else g.rect(x, y, w, h); };
    const deco = (n, root) => { const o = []; for(let e = n; e && e !== root.parentNode; e = e.parentNode){ if(e.nodeType !== 1) continue; const cs = getComputedStyle(e), l = cs.textDecorationLine || '';
        if(/line-through/.test(l)) o.push(['s', cs.textDecorationColor || cs.color]); if(/underline/.test(l)) o.push(['u', cs.textDecorationColor || cs.color]); } return o; };
    const skip = opt.skip || (() => false);
    const paint = root => { const walk = n => {
        if(n.nodeType === 1){ if(skip(n) || (n.classList && (n.classList.contains('ink-c') || n.classList.contains('ink-in') || n.classList.contains('ink-grip')))) return;
          const cs = getComputedStyle(n); if(cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return; const r = n.getBoundingClientRect(); if(!r.width && !r.height && !n.childNodes.length) return;
          const rad = parseFloat(cs.borderTopLeftRadius) || 0;
          if(!tr(cs.backgroundColor)){ g.fillStyle = cs.backgroundColor; rr(r.left, r.top, r.width, r.height, rad); g.fill(); }
          const bw = ['Top', 'Right', 'Bottom', 'Left'].map(k => parseFloat(cs['border' + k + 'Width']) || 0), bc = ['Top', 'Right', 'Bottom', 'Left'].map(k => cs['border' + k + 'Color']);
          if(bw.every(x => x > 0 && x < 3) && bc.every(c => c === bc[0]) && !tr(bc[0]) && cs.borderTopStyle !== 'none'){ g.strokeStyle = bc[0]; g.lineWidth = bw[0]; rr(r.left + bw[0] / 2, r.top + bw[0] / 2, r.width - bw[0], r.height - bw[0], rad); g.stroke(); }
          else { [[0, () => [r.left, r.top, r.width, bw[0]]], [1, () => [r.right - bw[1], r.top, bw[1], r.height]], [2, () => [r.left, r.bottom - bw[2], r.width, bw[2]]], [3, () => [r.left, r.top, bw[3], r.height]]].forEach(([i, f]) => {
              if(bw[i] > 0 && !tr(bc[i]) && cs['border' + ['Top', 'Right', 'Bottom', 'Left'][i] + 'Style'] !== 'none'){ g.fillStyle = bc[i]; const q = f(); g.fillRect(q[0], q[1], q[2], q[3]); } }); }
          /* 2740 (Misty 23 Nov 10:46): a photo the browser will not let into a picture (no CORS) made the whole copy fail without a word.
             Such a photo is now left out (a soft grey box in its place) and the rest of the screen is copied. */
          if(n.tagName === 'IMG' && n.complete && n.naturalWidth){ let ok = SAFE2740.get(n.currentSrc || n.src);
            if(ok === undefined){ try{ const pc = document.createElement('canvas'); pc.width = pc.height = 1; const pg = pc.getContext('2d'); pg.drawImage(n, 0, 0, 1, 1); pg.getImageData(0, 0, 1, 1); ok = true; }catch(e){ ok = false; } SAFE2740.set(n.currentSrc || n.src, ok); }
            if(ok){ try{ g.drawImage(n, r.left, r.top, r.width, r.height); }catch(e){} } else { g.fillStyle = '#EEF0F4'; rr(r.left, r.top, r.width, r.height, rad); g.fill(); } return; }
          if(n.tagName === 'CANVAS' && !n.classList.contains('ink-c')){ try{ g.drawImage(n, r.left, r.top, r.width, r.height); }catch(e){} return; }
          if(n.tagName === 'SVG' || n.tagName === 'svg'){ return; }
          if((n.tagName === 'INPUT' || n.tagName === 'TEXTAREA') && n.value){ g.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily; g.fillStyle = cs.color; g.textBaseline = 'top'; g.fillText(n.value, r.left + (parseFloat(cs.paddingLeft) || 0), r.top + (parseFloat(cs.paddingTop) || 0)); return; }
          n.childNodes.forEach(walk); return; }
        if(n.nodeType !== 3 || !n.nodeValue.replace(/[\s​]/g, '')) return; const el = n.parentNode, cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
        g.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily; g.fillStyle = cs.color; g.textBaseline = 'alphabetic'; const D = deco(el, root);
        const tt = cs.textTransform, m = g.measureText('Hg'), asc = m.fontBoundingBoxAscent || fs * 0.8, re = /[^\s​]+/g, rg = document.createRange(); let k;
        while((k = re.exec(n.nodeValue))){ rg.setStart(n, k.index); rg.setEnd(n, k.index + k[0].length); const q = rg.getClientRects()[0]; if(!q) continue; const by = q.top + asc;
          let t = k[0]; if(tt === 'uppercase') t = t.toUpperCase(); else if(tt === 'lowercase') t = t.toLowerCase();
          const ls = parseFloat(cs.letterSpacing) || 0; if(ls && g.letterSpacing !== undefined) g.letterSpacing = ls + 'px';
          g.fillText(t, q.left, by); if(ls && g.letterSpacing !== undefined) g.letterSpacing = '0px';
          D.forEach(([ty, col]) => { g.fillStyle = col; g.fillRect(q.left, ty === 's' ? by - fs * 0.3 : by + 3, q.width, Math.max(1.5, fs / 12)); g.fillStyle = cs.color; }); } };
      walk(root); };
    let yy = pad;
    parts.forEach((part, i) => { const r = box[i]; g.save(); g.translate(pad - L, yy - r.top); g.beginPath(); g.rect(L - 2, r.top - 2, Rr - L + 4, r.height + 4); g.clip(); paint(part);
      if(ink && ink.width && !ink.classList.contains('hid')){ const q = ink.getBoundingClientRect(), d = ink.width / q.width, x0 = Math.max(L, q.left), y0 = Math.max(r.top, q.top), x1 = Math.min(Rr, q.right), y1 = Math.min(r.bottom, q.bottom);
        if(x1 > x0 && y1 > y0) try{ g.drawImage(ink, (x0 - q.left) * d, (y0 - q.top) * d, (x1 - x0) * d, (y1 - y0) * d, x0, y0, x1 - x0, y1 - y0); }catch(e){} }
      g.restore(); yy += r.height + GAP; });
    return cv; }
  function trim(cv, keep){ const g = cv.getContext('2d'), w = cv.width, d = g.getImageData(0, 0, w, cv.height).data; let last = 0;
    for(let y = cv.height - 1; y >= 0 && !last; y--){ const o = y * w * 4; for(let x = 0; x < w; x += 2){ const k = o + x * 4; if(d[k] < 235 || d[k + 1] < 235 || d[k + 2] < 235){ last = y; break; } } }
    const h = Math.min(cv.height, last + (keep || 56)); if(h >= cv.height - 4) return cv; const o = document.createElement('canvas'); o.width = w; o.height = h; const og = o.getContext('2d'); og.fillStyle = '#fff'; og.fillRect(0, 0, w, h); og.drawImage(cv, 0, 0); return o; }
  function withHead(cv, o){ try{ if(!window.coeHdr) return cv; /* 2721: the picture keeps the screen's full sharpness (no shrinking) */ const M = Math.round(Math.max(50, cv.width * 0.04)), W = Math.max(1240, cv.width + 2 * M), lab = String((o && o.label) || '').trim(), band = coeHdr.height(W, !!lab), sc = (W - 2 * M) / cv.width, ch = Math.round(cv.height * sc);
      const out = document.createElement('canvas'); out.width = W; out.height = band + Math.round(50 * W / 1240) + ch; const g = out.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, out.height);
      coeHdr.draw(g, W, { logo: o && o.logo, title: o && o.title, meta: (o && o.meta) || [], label: lab });
      g.imageSmoothingQuality = 'high'; g.drawImage(cv, M, band + Math.round(20 * W / 1240), W - 2 * M, ch); return out; }catch(e){ return cv; } }
  async function copy(pic, btn, name){ const was = btn ? btn.textContent : ''; if(btn){ btn.disabled = true; btn.textContent = 'Copying…'; }
    const bp = Promise.resolve(pic).then(c => new Promise(z => c.toBlob(z, 'image/png')));
    try{ await Promise.race([navigator.clipboard.write([new ClipboardItem({ 'image/png': bp })]), new Promise((z, no) => setTimeout(() => no(new Error('slow')), 8000))]); if(btn) btn.textContent = 'Copied ✓ · paste in WeChat'; }
    catch(e){ try{ const bl = await bp, a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = (name || 'screen') + '.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); if(btn) btn.textContent = 'Saved as a file'; }catch(x){ if(btn) btn.textContent = 'Could not copy'; } }
    if(btn) setTimeout(() => { btn.textContent = was; btn.disabled = false; }, 2200); }
  function logo(src){ return new Promise(z => { const im = new Image(); im.onload = () => z(im); im.onerror = () => z(null); im.src = src; }); }
  window.coeSnap = { shot, trim, withHead, copy, logo };
})();
