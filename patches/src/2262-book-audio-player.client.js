<script id="b2262">
/* 16 Nov · 2262 · Book audio that opens easily (Misty 15:24). In a book's audio list (DK English for Everyone…), the files are
   shown by exercise, the way the book prints them: "1.4" with buttons Example · 1 · 2 · 3 …, instead of long file names.
   One tap plays it inside the app (a player at the bottom of the sheet, Google Drive's own player, no new tab, no sign-in):
   ⏮ / ⏭ for the previous or next track, "Open in Drive", and "Copy link" to send the track to the student.
   Closing the sheet stops the sound. Other books and PDFs are unchanged. */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
#bkBody .au-ex{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px dashed #E3E8EC}
#bkBody .au-n{flex:none;min-width:52px;font-weight:800;color:var(--ink,#2B2450);font-size:15px;padding-top:6px}
#bkBody .au-ch{display:flex;flex-wrap:wrap;gap:6px}
#bkBody .au-c{border:1px solid #CFE3E3;background:#F2F9F9;color:#13636B;border-radius:999px;padding:6px 12px;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer;line-height:1.1}
#bkBody .au-c:hover{background:#E2F2F2}
#bkBody .au-c.on{background:#13636B;color:#fff;border-color:#13636B}
#bkBody .au-c .ac{font-weight:600;opacity:.6;font-size:11px;margin-left:3px}
#auBar{position:sticky;bottom:0;z-index:5;margin:14px -4px 0;background:#fff;border:1px solid #D8E6E6;border-radius:16px;box-shadow:0 -6px 22px rgba(20,40,60,.12);padding:10px 12px}
#auBar .au-t{display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px;color:var(--ink,#2B2450)}
#auBar .au-t span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#auBar .au-x{border:0;background:#F1F1F4;border-radius:999px;width:28px;height:28px;cursor:pointer;font-size:14px}
#auBar iframe{display:block;width:100%;height:80px;border:0;border-radius:10px;margin-top:8px;background:#2B2B2B}
#auBar .au-b{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#auBar .au-b button,#auBar .au-b a{border:1px solid #D8E0E6;background:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;font-weight:700;color:#13636B;cursor:pointer;text-decoration:none}
#auBar .au-h{font-size:11.5px;color:var(--mute,#7A7F8A);margin-top:6px}
`; document.head.appendChild(st); }catch(e){}
  const E = s => (typeof esc === 'function' ? esc(s) : String(s == null ? '' : s));
  const nat = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
  const view = id => 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view';
  /* b1_c_1_4_1_us.mp3 → unit 1, exercise 4, "1", US */
  function parse(name){ const base = String(name).replace(/\.(mp3|m4a|wav|ogg|aac)$/i, '');
    const m = /^b\d+_[a-z]+_(\d+)_(\d+)(?:_(.*))?$/i.exec(base); if(!m) return null;
    let rest = m[3] || '', acc = ''; const a = /(?:^|_)(usuk|uk|us)$/i.exec(rest); if(a){ acc = a[1].toUpperCase(); rest = rest.slice(0, a.index); }
    rest = rest.replace(/^_+|_+$/g, '');
    let t = rest === '' ? 'Play' : rest.replace(/^eg(?=_|$)/i, 'Example').replace(/^(\d+)_([a-z])$/i, '$1$2').replace(/_/g, ' ');
    const o = /^Example/.test(t) ? 0 : /^\d/.test(t) ? 1 : t === 'Play' ? -1 : 2;
    return { u: +m[1], x: +m[2], t, acc: acc === 'USUK' ? 'US/UK' : acc, o }; }
  let LIST = [], CUR = -1;
  function stop(){ const b = document.getElementById('auBar'); if(b) b.remove(); CUR = -1; document.querySelectorAll('#bkBody .au-c.on').forEach(x => x.classList.remove('on')); }
  window.auStop = stop;
  window.auPlay = function(i){ const it = LIST[i]; if(!it) return; CUR = i;
    document.querySelectorAll('#bkBody .au-c.on').forEach(x => x.classList.remove('on'));
    const btn = document.querySelector('#bkBody .au-c[data-i="' + i + '"]'); if(btn){ btn.classList.add('on'); const d = btn.closest('details'); if(d && !d.open) d.open = true; }
    const body = document.getElementById('bkBody'); if(!body) return;
    let bar = document.getElementById('auBar'); if(!bar){ bar = document.createElement('div'); bar.id = 'auBar'; body.appendChild(bar); }
    bar.innerHTML = `<div class="au-t"><span>♪ ${E(it.title)}</span><button class="au-x" title="Close" onclick="auStop()">✕</button></div>
<iframe src="https://drive.google.com/file/d/${encodeURIComponent(it.id)}/preview" allow="autoplay" title="Audio player"></iframe>
<div class="au-b"><button onclick="auPlay(${i - 1})"${i > 0 ? '' : ' disabled style="opacity:.4"'}>⏮ Previous</button><button onclick="auPlay(${i + 1})"${i < LIST.length - 1 ? '' : ' disabled style="opacity:.4"'}>Next ⏭</button>
<a href="${view(it.id)}" target="_blank" rel="noopener">Open in Drive</a><button onclick="auCopy(${i})">Copy link for student</button></div>
<div class="au-h">Tap ▶ in the player. In an online class, share your screen with sound on so the student hears it.</div>`; };
  window.auCopy = async function(i){ const it = LIST[i]; if(!it) return; const t = it.title + '\n' + view(it.id);
    try{ await navigator.clipboard.writeText(t); toast('Link copied · paste it to the student'); }
    catch(e){ const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try{ document.execCommand('copy'); toast('Link copied · paste it to the student'); }catch(_){ toast(view(it.id)); } a.remove(); } };
  function enhance(){ const body = document.getElementById('bkBody'); if(!body || body.dataset.au === '1') return; LIST = []; CUR = -1;
    const book = ((body.querySelector('h2') || {}).textContent || '').trim();
    body.querySelectorAll('details').forEach(d => { const as = [...d.querySelectorAll('a[href*="drive.google.com/file/d/"]')];
      if(!as.length || !as.every(a => /^♪/.test(a.textContent.trim()))) return;
      const items = as.map(a => { const id = decodeURIComponent((/\/d\/([^/]+)/.exec(a.getAttribute('href')) || [])[1] || ''), name = a.textContent.replace(/^♪\s*/, '').trim(); return { id, name, p: parse(name) }; });
      const box = d.querySelector('div'); if(!box) return;
      const sb = d.querySelector('summary b'), g = sb ? sb.textContent.trim() : '';
      if(sb && /^\d+$/.test(g)) sb.textContent = 'Unit ' + g;
      const sm = d.querySelector('summary .mute'); if(sm) sm.textContent = '· ' + items.length + ' audio';
      const X = {}, odd = [];
      items.forEach(f => { if(!f.p) return odd.push(f); const k = f.p.u + '.' + f.p.x; (X[k] = X[k] || []).push(f); });
      let html = '';
      Object.keys(X).sort(nat).forEach(k => { const fs = X[k].sort((a, b) => (a.p.o - b.p.o) || nat(a.p.t, b.p.t));
        html += `<div class="au-ex"><div class="au-n">${E(k)}</div><div class="au-ch">${fs.map(f => { const i = LIST.length;
          LIST.push({ id: f.id, title: (book ? book.replace(/^DK English for Everyone · /i, 'DK ') + ' · ' : '') + 'Exercise ' + k + (f.p.t === 'Play' ? '' : ' · ' + f.p.t) + (f.p.acc ? ' (' + f.p.acc + ')' : '') });
          return `<button class="au-c" data-i="${i}" onclick="auPlay(${i})">▶ ${E(f.p.t)}${f.p.acc ? `<span class="ac">${E(f.p.acc)}</span>` : ''}</button>`; }).join('')}</div></div>`; });
      odd.sort((a, b) => nat(a.name, b.name)).forEach(f => { const i = LIST.length; LIST.push({ id: f.id, title: f.name });
        html += `<div class="au-ex"><div class="au-ch"><button class="au-c" data-i="${i}" onclick="auPlay(${i})">▶ ${E(f.name.replace(/\.(mp3|m4a|wav|ogg|aac)$/i, ''))}</button></div></div>`; });
      box.innerHTML = html; });
    if(LIST.length){ body.dataset.au = '1';
      const tip = document.createElement('div'); tip.className = 'small mute'; tip.style.marginTop = '8px';
      tip.textContent = 'Audio: open a unit, then tap the exercise number as printed in the book (e.g. 1.4 › ▶ 2). It plays here.';
      const first = body.querySelector('details'); if(first) first.parentNode.insertBefore(tip, first); } }
  window.auEnhance = enhance;
  const S0 = window.bookSheet; if(S0) window.bookSheet = function(){ stop(); const r = S0.apply(this, arguments);
    Promise.resolve(r).then(() => { enhance(); setTimeout(enhance, 300); }, () => {}); return r; };
  if(typeof closeSheet === 'function'){ const c0 = closeSheet; closeSheet = function(){ stop(); return c0.apply(this, arguments); }; }
})();
</script>
