// 2694 (Misty 22 Nov 14:17, Yufan's trial): 
// · the assessment picture also shows "What the bands mean" (the same table as the result page, the student's band highlighted)
// · on the trial's send steps, an IELTS / KET / PET trial (its report is the assessment result page, not a PDF) shows
//   Copy picture and Share / save picture (copying also records the report as sent, like other trials) and Open result page,
//   instead of "Open PDF · the PDF could not load here".
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`    y += 10; block('Observed strengths', a.strengths, '#EEF7F7'); block('Areas for improvement', a.improve, '#FFF6E8'); block('Recommended learning pathway', a.pathway, '#F2F0FA');`,
   `    y += 10; block('Observed strengths', a.strengths, '#EEF7F7'); block('Areas for improvement', a.improve, '#FFF6E8'); block('Recommended learning pathway', a.pathway, '#F2F0FA');
    /* 2694 · What the bands mean */
    { const G = CAMX() ? CAMX().GUIDE : GUIDE, cb = a.combined != null ? a.combined : a.sp_band != null ? a.sp_band : a.wr_band;
      if(G && G.length){ y += 16; c.fillStyle = NAVY; c.font = '700 28px ' + F; c.fillText('What the bands mean', PAD, y + 10); y += 40;
        const x0 = PAD + 18, x1 = PAD + 190, x2 = WD - PAD - 180, iw = x2 - x1 - 24;
        c.fillStyle = MUTE; c.font = '700 19px ' + F; c.fillText(CAMX() ? 'AVERAGE (0–5)' : 'IELTS BAND', x0, y + 20); c.fillText(CAMX() ? 'WHAT IT MEANS' : 'GENERAL INTERPRETATION', x1, y + 20); c.fillText(CAMX() ? 'INDICATIVE CEFR' : 'APPROX. CEFR', x2, y + 20); y += 36;
        G.forEach(g => { const on = cb != null && +cb >= g[0] && +cb <= g[1]; c.font = (on ? '700 ' : '400 ') + '23px ' + F;
          const L = []; let line = ''; String(g[3]).split(' ').forEach(wd => { const tt = line ? line + ' ' + wd : wd; if(c.measureText(tt).width > iw && line){ L.push(line); line = wd; } else line = tt; }); L.push(line);
          const h = 26 + L.length * 32; c.fillStyle = '#E8E6EF'; c.fillRect(PAD, y, WD - PAD * 2, 2); if(on){ c.fillStyle = '#E6F3F2'; c.fillRect(PAD, y + 2, WD - PAD * 2, h - 2); }
          c.fillStyle = on ? TEAL : NAVY; c.fillText(g[2], x0, y + 38); L.forEach((t, i) => c.fillText(t, x1, y + 38 + i * 32)); c.fillText(g[4], x2, y + 38); y += h; });
        y += 14; } }`],
  [`  window.as1778 = { kq2691:`, `  /* 2694 · the trial send steps: picture of a shared result, by its result link */
  async function tlPic2694(save){ const t = (typeof TLD !== 'undefined') ? TLD : null, m = /[?&]r=([a-f0-9]+)/i.exec((t && t.pdf) || ''); if(!m) return; const b = document.getElementById('tlPicB'); if(b && !save){ b.disabled = true; b.textContent = 'Making the picture…'; }
    const old = S.a; try{ const r = await call('result', { rkey: m[1] }); if(!r || !r.ok) throw new Error((r && r.msg) || 'Share the result first (assessment › Result › Share result)');
      S.a = Object.assign({ sp: {}, wr: {}, notes: {} }, r.a); xm(); const cv = await drawPic(); S.a = old; xm();
      const blob = await new Promise(z => cv.toBlob(z, 'image/png')), name = 'Assessment-' + String(r.a.name || '').replace(/\\s+/g, '-') + '.png'; let ok = false;
      if(!save && window.ClipboardItem){ try{ await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast('Picture copied · paste it in the chat'); ok = true; }catch(x){} }
      if(!ok){ const f = new File([blob], name, { type: 'image/png' }); if(navigator.canShare && navigator.canShare({ files: [f] })){ try{ await navigator.share({ files: [f] }); ok = true; }catch(x){ if(x && x.name === 'AbortError') return; } }
        if(!ok){ const l = document.createElement('a'); l.href = URL_.createObjectURL(blob); l.download = name; document.body.appendChild(l); l.click(); l.remove(); toast('Picture saved'); ok = true; } }
      if(ok && t && t.status !== 'Sent' && !t.sent && typeof D !== 'undefined' && D && D.mgr && typeof tlMark === 'function'){ try{ tlMark('picture'); }catch(x){} } }
    catch(e){ S.a = old; try{ xm(); }catch(x){} toast(String(e.message || e)); } finally { if(b){ b.disabled = false; b.textContent = 'Copy picture'; } } }
  window.as1778 = { tlPic: tlPic2694, kq2691:`],
  [`: TLD.pdf ? (TLD._err ? \`<a class="btn teal grow" href="\${esc(TLD.pdf)}" target="_blank">Open PDF</a>\``,
   `: /\\/assess\\/\\?r=/.test(TLD.pdf || '') ? \`<div class="row" style="gap:8px;width:100%"><button class="btn teal grow" id="tlPicB" onclick="as1778.tlPic(0)">Copy picture</button><button class="btn ghost grow" onclick="as1778.tlPic(1)">\${navigator.share ? 'Share / save picture' : 'Save picture'}</button></div><a class="btn ghost grow" href="\${esc(TLD.pdf)}" target="_blank">Open result page</a>\` : TLD.pdf ? (TLD._err ? \`<a class="btn teal grow" href="\${esc(TLD.pdf)}" target="_blank">Open PDF</a>\``],
  [`pdfOpen = one(/^Open PDF/), loading = one(/^Loading PDF/);`, `pdfOpen = one(/^(Open PDF|Open result page)/), loading = one(/^Loading PDF/);`],
  [`pdfOpen ? 'The PDF could not load here · open it from Drive'`, `pdfOpen ? (/result page/.test(pdfOpen.textContent) ? 'The assessment result · copy the picture for the parent' : 'The PDF could not load here · open it from Drive')`],
]);
