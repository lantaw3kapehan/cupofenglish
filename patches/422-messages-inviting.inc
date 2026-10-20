/* 20 Oct · 422 · Messages, inviting to read (Misty: "looking at it, you don't want to read or open it").
   · Tabs as one row of soft pills; the open tab navy; counts in small bubbles.
   · "Not acting on feedback" folds to one calm line (who + how many) — open it to see each teacher; each teacher shows
     one line and expands on click.
   · The list reads like a chat inbox: coloured avatar per person, name, one-line preview, time on the right; new ones in bold
     with a teal dot instead of a beige row; status as a small quiet label; day headers (Today · Yesterday · This week · Earlier). */
(function(){
  const PAL = ['#00A3AD', '#6C5FC7', '#E0A030', '#2E9E6F', '#D4705A', '#3E7CB1', '#B5528F', '#7A8B2E'];
  const col = s => { let h = 0; String(s || '').toLowerCase().split('').forEach(c => h = (h * 31 + c.charCodeAt(0)) >>> 0); return PAL[h % PAL.length]; };
  const css = document.createElement('style');
  css.textContent = `
#v-msgs .tb22{display:flex;gap:6px;flex-wrap:wrap;margin-top:16px}
#v-msgs .tb22 button{border:1px solid var(--line)!important;background:#fff!important;color:var(--ink2)!important;border-radius:999px!important;padding:7px 14px!important;font-weight:600!important;font-size:13.5px!important;display:inline-flex;align-items:center;gap:7px}
#v-msgs .tb22 button.teal{background:var(--ink)!important;border-color:var(--ink)!important;color:#fff!important}
#v-msgs .tb22 button b{min-width:20px;height:20px;line-height:20px;padding:0 6px;border-radius:10px;background:var(--soft);color:var(--ink)!important;font-size:11.5px;text-align:center}
#v-msgs .tb22 button.teal b{background:rgba(255,255,255,.2);color:#fff!important}
#v-msgs .tb22 button.hot b{background:#FBECE8;color:#B4442F!important}
#v-msgs details.ft22{margin-top:14px;background:#fff;border:1px solid var(--line);border-left:4px solid #D4705A;border-radius:var(--r-lg);box-shadow:var(--sh1)}
#v-msgs details.ft22>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:12px;padding:12px 16px}
#v-msgs details.ft22>summary::-webkit-details-marker{display:none}
#v-msgs details.ft22>summary b{font-size:15px;color:var(--ink);white-space:nowrap}
#v-msgs details.ft22>summary .who{flex:1;display:flex;gap:4px;flex-wrap:wrap;min-width:0}
#v-msgs details.ft22>summary .who span{font-size:12.5px;padding:3px 10px;border-radius:999px;background:#FBECE8;color:#A13C28}
#v-msgs details.ft22>summary em{font-style:normal;color:#8A86A0;font-size:13px;white-space:nowrap}
#v-msgs details.ft22>summary:after{content:'›';color:#8A86A0;font-size:18px;transition:transform .15s}
#v-msgs details.ft22[open]>summary:after{transform:rotate(90deg)}
#v-msgs details.ft22>.card{margin:0!important;border:0!important;box-shadow:none!important;padding:0 16px 12px!important}
#v-msgs details.ft22>.card>b:first-child,#v-msgs details.ft22>.card>.small.mute:nth-child(2){display:none}
#v-msgs details.ft22 .li{cursor:pointer}
#v-msgs details.ft22 .li .grow>.small.mute{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
#v-msgs details.ft22 .li.op .grow>.small.mute{display:block}
#v-msgs details.ft22 .li>div:last-child{flex-direction:row!important}
#v-msgs .ib22{margin-top:14px;background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:4px 8px;overflow:hidden}
#v-msgs .ib22 .li{background:transparent!important;border-radius:12px;padding:11px 10px!important;margin:0!important;border-bottom:1px solid #F3F2F7;align-items:center;box-shadow:none!important}
#v-msgs .ib22 .li:last-child{border-bottom:0}
#v-msgs .ib22 .li:hover{background:#F7FAFA!important}
#v-msgs .ib22 .li .av{width:40px;height:40px;border-radius:20px;background:var(--avc)!important;color:#fff!important;font-weight:700;font-size:13px;border:0!important;flex:none}
#v-msgs .ib22 .li .grow>b{font-size:15px}
#v-msgs .ib22 .li .grow>.small.mute{font-size:13.5px;color:#6F6B85}
#v-msgs .ib22 .li.new .grow>b,#v-msgs .ib22 .li.new .grow>.small.mute{color:var(--ink);font-weight:700}
#v-msgs .ib22 .li.new .av{box-shadow:0 0 0 3px #fff,0 0 0 5px #00A3AD}
#v-msgs .ib22 .li>div:last-child .chip{background:transparent!important;border:0!important;padding:0!important;font-size:12px!important;font-weight:600}
#v-msgs .ib22 .li>div:last-child .chip.coral,#v-msgs .ib22 .li>div:last-child .chip.red{color:#B4442F!important}
#v-msgs .ib22 .li>div:last-child .chip.teal{color:#00737B!important}
#v-msgs .ib22 .li>div:last-child .chip.amber{color:#8A5A0F!important}
#v-msgs .ib22 .li>div:last-child .small{font-size:12px}
#v-msgs .dh22{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;padding:12px 10px 4px}`;
  document.head.appendChild(css);
  const dayKey = t => { const m = String(t || '').match(/(\d{1,2})\/(\d{1,2})/); if(!m) return 'Earlier'; const now = new Date(), d = new Date(now.getFullYear(), +m[1] - 1, +m[2]); if(d > now) d.setFullYear(d.getFullYear() - 1);
    const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()), diff = Math.round((t0 - d) / 864e5); return diff <= 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff < 7 ? 'This week' : 'Earlier'; };
  function paint(){ const v = $('v-msgs'); if(!v) return;
    /* tabs */
    const tabRow = [...v.querySelectorAll(':scope > .row')].find(r => r.querySelector('button.chip') && /Needs you|All/.test(r.textContent));
    if(tabRow && !tabRow.classList.contains('tb22')){ tabRow.classList.add('tb22'); tabRow.querySelectorAll('button').forEach(b => { const s = b.querySelector('b'); if(s && /D93F2B/i.test(s.getAttribute('style') || '')) b.classList.add('hot'); if(s) s.removeAttribute('style'); }); }
    /* follow-through card */
    const ft = [...v.querySelectorAll(':scope > .card')].find(c => /Not acting on feedback/.test(c.textContent));
    if(ft && !ft.closest('details')){ const rows = [...ft.querySelectorAll('.li')], names = rows.map(r => (r.querySelector('.grow>b') || {}).textContent || '').filter(Boolean);
      const d = document.createElement('details'); d.className = 'ft22'; let open = false; try{ open = localStorage.getItem('coe.ft22') === '1'; }catch(e){} d.open = open; d.addEventListener('toggle', () => { try{ localStorage.setItem('coe.ft22', d.open ? '1' : '0'); }catch(e){} });
      d.innerHTML = '<summary><b>⚠ Not acting on feedback</b><span class="who">' + names.map(n => '<span>' + esc(n.replace(/^Teacher\s+/, '')) + '</span>').join('') + '</span><em>' + names.length + ' teacher' + (names.length === 1 ? '' : 's') + '</em></summary>';
      ft.parentNode.insertBefore(d, ft); d.appendChild(ft); ft.style.borderLeft = '0';
      rows.forEach(r => r.addEventListener('click', e => { if(e.target.closest('button')) return; r.classList.toggle('op'); })); }
    /* inbox list */
    const list = [...v.querySelectorAll(':scope > div')].find(x => x.querySelector(':scope > .li[onclick^="msgOpen"], :scope > .li[onclick*="msg"]') && !x.classList.contains('card'));
    if(list && !list.classList.contains('ib22')){ list.classList.add('ib22'); list.style.marginTop = ''; let last = '';
      [...list.children].forEach(li => { if(!li.classList.contains('li')) return; const nm = (li.querySelector('.grow>b') || {}).textContent || '', av = li.querySelector('.av'); if(av) li.style.setProperty('--avc', col(nm));
        if(/FFF6EE/i.test(li.getAttribute('style') || '') || li.querySelector('.chip.red') && / new$/.test((li.querySelector('.chip.red') || {}).textContent || '')) li.classList.add('new');
        li.style.background = ''; const tm = (li.querySelector(':scope > div:last-child .small') || {}).textContent || ''; const k = dayKey(tm); if(k !== last){ last = k; li.insertAdjacentHTML('beforebegin', '<div class="dh22">' + k + '</div>'); } }); }
  }
  const r0 = window.renderMsgs; window.renderMsgs = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){ console.warn('msg22', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'msgs') renderMsgs(); }catch(e){}
})();
