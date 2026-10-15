(function(){
  // 15 Oct · Enquiries, refined (Misty: "Now, the ENQUIRIES SCREEN").
  //  · the 12 picture/message cards become a compact toolkit in three stages, in the order they are used:
  //    Before the trial · Trial booked · Enrolling (same buttons, same pictures);
  //  · the enquiry list opens on the first tab with someone in it; tabs with 0 are dimmed.
  const css = `
#v-enquiry .eq2-g{margin-top:18px}
#v-enquiry .eq2-g>h3{display:flex;align-items:baseline;gap:10px;margin:0 2px 10px;font-family:var(--brand);font-weight:400;font-size:18px;color:#2B2253}
#v-enquiry .eq2-g>h3 span{font-family:inherit;font-size:13px;color:#8A87A0;font-weight:400}
#v-enquiry .eq2-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
#v-enquiry .eq2-t{margin:0!important;padding:14px 16px!important;flex-direction:column!important;align-items:stretch!important;gap:8px!important;border-radius:16px!important;border-color:#EEF0F4!important;transition:box-shadow .15s}
#v-enquiry .eq2-t:hover{box-shadow:0 8px 20px rgba(43,34,83,.07)}
#v-enquiry .eq2-t>div:first-child{display:none!important}
#v-enquiry .eq2-t .small.mute{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
#v-enquiry .eq2-t>button{margin-top:auto;align-self:stretch;min-height:38px}
#v-enquiry .eq2-g.s1 .eq2-t{border-top:3px solid #00A3AD!important}
#v-enquiry .eq2-g.s2 .eq2-t{border-top:3px solid #D9962B!important}
#v-enquiry .eq2-g.s3 .eq2-t{border-top:3px solid #2E9E6F!important}
#v-enquiry #enqBox .seg button.z{opacity:.45}`;
  const st = document.createElement('style'); st.id = 'eq2css'; st.textContent = css; document.head.appendChild(st);
  const G = [['s1', 'Before the trial', 'answer the parent · invite to a trial', [1, 2, 3, 4, 5, 6]], ['s2', 'Trial booked', 'for the new WeChat group', [7, 8]], ['s3', 'Enrolling', 'agreement · payment · class notice', [9, 10, 11, 12]]];
  let picked = false;
  const _r = window.renderEnq;
  window.renderEnq = function(){ const r = _r.apply(this, arguments);
    try{ const el = $('v-enquiry'); if(!el) return r;
      // tabs: dim 0, open on the first with someone
      const B = [...el.querySelectorAll('#enqBox .seg button')], n = {};
      B.forEach(b => { const k = (String(b.getAttribute('onclick') || '').match(/enqF\('(\w+)'\)/) || [])[1], m = b.textContent.match(/·\s*(\d+)\s*$/); if(k && m){ n[k] = +m[1]; b.classList.toggle('z', +m[1] === 0 && !b.classList.contains('on')); } });
      if(!picked && n.all){ picked = true; const on = B.find(b => b.classList.contains('on')), cur = on ? (String(on.getAttribute('onclick') || '').match(/enqF\('(\w+)'\)/) || [])[1] : '';
        if(cur && n[cur] === 0){ const k = ['follow', 'new', 'trial', 'all'].find(x => n[x]); if(k && k !== cur){ setTimeout(() => enqF(k), 0); return r; } } }
      // toolkit
      const cards = [...el.children].filter(d => d.tagName === 'DIV' && d.querySelector(':scope > button') && /^\d+$/.test((d.firstElementChild && d.firstElementChild.textContent || '').trim()));
      if(cards.length < 4) return r;
      const byN = {}; cards.forEach(c => { byN[+c.firstElementChild.textContent.trim()] = c; c.classList.add('eq2-t'); });
      const anchor = cards[0], frag = document.createDocumentFragment();
      G.forEach(([cls, t, s, ns]) => { const L = ns.map(k => byN[k]).filter(Boolean); if(!L.length) return; const g = document.createElement('section'); g.className = 'eq2-g ' + cls;
        g.innerHTML = '<h3>' + t + ' <span>' + s + '</span></h3><div class="eq2-grid"></div>'; L.forEach(c => g.lastElementChild.appendChild(c)); frag.appendChild(g); });
      const rest = cards.filter(c => !c.parentElement || !c.parentElement.classList.contains('eq2-grid'));
      if(rest.length){ const g = document.createElement('section'); g.className = 'eq2-g'; g.innerHTML = '<h3>More</h3><div class="eq2-grid"></div>'; rest.forEach(c => g.lastElementChild.appendChild(c)); frag.appendChild(g); }
      const h2 = [...el.querySelectorAll('h2')].find(h => /Pictures for any enquiry/.test(h.textContent));
      if(h2){ h2.innerHTML = 'Pictures &amp; messages <span class="c">in Chinese, ready to paste in WeChat</span>'; h2.after(frag); } else el.appendChild(frag);
    }catch(e){ console.warn('enquiry refine', e); }
    return r; };
  try{ if(VIEW === 'enquiry') renderEnq(); }catch(e){}
})();
