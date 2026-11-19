// 2425 (Misty 19 Nov 14:33–14:40) · Talk of the Day: a class opener card on the teacher's Today (instead of "How are you?"),
//   with YLE / Teens / Adults questions, sources and a link to the Talk library (talk/index.html). Management sees a
//   "Talk of the Day" box on To do with the topics waiting for the President's approval. Data: coe-talk (database).
const file = process.argv[2];
const JS = String.raw`<script id="b2425">
(function(){
  var URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-talk', T = null, at = 0, busy = 0, lv = 'yle';
  var ST = { china: 'Today in China', stem: 'STEM / STEAM', ai: 'AI literacy', think: 'Critical thinking', world: 'Real-world talk' };
  var SC = { china: ['#E4F4F1', '#1E6F5C'], stem: ['#E6EEFB', '#2B4C8C'], ai: ['#F0E8FB', '#5B3A8C'], think: ['#FCEDE8', '#B5432C'], world: ['#FFF1D6', '#8A5A00'] };
  var LV = { yle: 'YLE', teens: 'Teens', adults: 'Adults' };
  function tok(){ try{ return (typeof TOKEN !== 'undefined' && TOKEN) || localStorage.getItem('coe.token') || ''; }catch(e){ return ''; } }
  function e(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lb(t, c){ return '<span style="display:inline-block;background:' + c[0] + ';color:' + c[1] + ';border-radius:6px;padding:1px 8px;font-size:12px;font-weight:600;line-height:1.6">' + t + '</span>'; }
  function load(){ if(busy || Date.now() - at < 5 * 60e3) return; var k = tok(); if(!k) return; busy = 1;
    fetch(URL_, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ op: 'list', token: k }) }).then(function(r){ return r.json(); })
      .then(function(j){ if(j && j.ok){ T = j; at = Date.now(); paint(); } }).catch(function(){}).then(function(){ busy = 0; }); }
  var ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#00838C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/></svg>';
  function teacherCard(){ var A = (T.topics || []).filter(function(t){ return t.status === 'approved'; }); if(!A.length) return '';
    var t = A[0], L = (t.levels || []).indexOf(lv) >= 0 ? lv : (t.levels || ['yle'])[0], q = (t.q && t.q[L]) || [], th = t.think && t.think[L];
    var used = (T.used || []).filter(function(u){ return u.topic === t.id; }).length;
    return '<section id="talk2425" style="background:#fff;border:1px solid #ECEAF2;border-radius:16px;padding:14px 18px;margin:0 0 14px;box-shadow:0 1px 2px rgba(43,34,83,.04)">'
      + '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' + ICON + '<b style="font-size:17px;color:#2B2253">Talk of the Day</b>' + lb(ST[t.strand] || '', SC[t.strand] || SC.china)
      + (t.levels || []).map(function(k){ return lb(LV[k], k === 'yle' ? SC.china : k === 'teens' ? SC.stem : SC.ai); }).join(' ')
      + '<span style="margin-left:auto;font-size:13px;color:#6B6880">First 3–5 minutes of class · instead of "How are you?"</span></div>'
      + '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:20px;margin-top:12px">'
      + '<div style="display:flex;flex-direction:column;gap:6px"><b style="font-size:18px;line-height:1.3;color:#2B2253">' + e(t.title) + '</b><span style="font-size:14px;color:#4A4566;line-height:1.55">' + e(t.story) + '</span>'
      + '<span style="font-size:12px;color:#6B6880">Source: ' + (t.sources || []).slice(0, 2).map(function(s){ return '<a href="' + e(s.url) + '" target="_blank" rel="noopener">' + e(s.outlet) + '</a>'; }).join(' · ') + '</span></div>'
      + '<div style="display:flex;flex-direction:column;gap:8px"><div role="tablist" aria-label="Level" style="display:flex;gap:4px;background:#F4F2F8;border-radius:999px;padding:4px;align-self:flex-start">'
      + (t.levels || []).map(function(k){ return '<button type="button" role="tab" aria-selected="' + (k === L) + '" onclick="talk2425Lv(\'' + k + '\')" style="height:32px;padding:0 14px;border:0;border-radius:999px;font:600 13px Inter,sans-serif;cursor:pointer;background:' + (k === L ? '#2B2253;color:#fff' : 'transparent;color:#2B2253') + '">' + LV[k] + '</button>'; }).join('') + '</div>'
      + q.slice(0, 2).map(function(x, i){ return '<div style="display:flex;gap:10px;font-size:15px;line-height:1.45;color:#2B2253"><span style="flex:none;width:22px;height:22px;border-radius:999px;background:#E4F4F1;color:#1E6F5C;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center">' + (i + 1) + '</span><span>' + e(x) + '</span></div>'; }).join('')
      + (th ? '<div style="display:flex;gap:8px;font-size:15px;line-height:1.45;background:#FDF5F2;border-radius:10px;padding:8px 10px;color:#2B2253"><span style="flex:none;background:#FCEDE8;color:#B5432C;border-radius:6px;padding:1px 8px;font-size:12px;font-weight:700;height:20px">THINK</span><span>' + e(th) + '</span></div>' : '')
      + '</div></div>'
      + '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px;padding-top:12px;border-top:1px solid #F1F0F6">'
      + '<a class="btn teal sm" href="talk/?t=' + t.id + '" target="_blank" rel="noopener" style="text-decoration:none">Open · share with student</a>'
      + '<a class="btn ghost sm" href="talk/" target="_blank" rel="noopener" style="text-decoration:none">Talk library · ' + A.length + '</a>'
      + (used ? '<span style="font-size:12px;color:#1E6F5C">Used with ' + used + ' student' + (used === 1 ? '' : 's') + '</span>' : '') + '</div></section>'; }
  function mgmtBox(){ var Dr = (T.topics || []).filter(function(t){ return t.status === 'draft'; }), A = (T.topics || []).filter(function(t){ return t.status === 'approved'; });
    return '<section id="talk2425m" style="background:#fff;border:1px solid #ECEAF2;border-radius:16px;padding:14px 18px;box-shadow:0 1px 2px rgba(43,34,83,.04);display:flex;align-items:center;gap:10px;flex-wrap:wrap">' + ICON
      + '<b style="font-size:17px;color:#2B2253">Talk of the Day</b>' + (Dr.length ? '<span style="background:#D4705A;color:#fff;border-radius:999px;padding:1px 10px;font-weight:700;font-size:13px">' + Dr.length + ' to approve</span>' : lb('All approved', SC.china))
      + '<span style="font-size:13px;color:#6B6880">' + A.length + ' in the library · class openers for YLE, Teens and Adults</span>'
      + '<a class="btn ' + (Dr.length ? 'teal' : 'ghost') + ' sm" href="talk/" target="_blank" rel="noopener" style="margin-left:auto;text-decoration:none">' + (Dr.length && T.pres ? 'Review and approve' : 'Open the library') + '</a></section>'; }
  function paint(){ if(!T) return;
    var v = document.getElementById('v-today');
    if(v && !T.mgmt && !v.classList.contains('hide')){ var h = teacherCard(), o = document.getElementById('talk2425');
      if(!h){ if(o) o.remove(); } else if(!o || o.getAttribute('data-h') !== String(h.length) + lv){ if(o) o.remove(); var ld = v.querySelector('.lead');
        (ld || v).insertAdjacentHTML(ld ? 'afterend' : 'afterbegin', h); var n = document.getElementById('talk2425'); if(n) n.setAttribute('data-h', String(h.length) + lv); } }
    var m = document.getElementById('v-mtoday');
    if(m && T.mgmt && !m.classList.contains('hide')){ var h2 = mgmtBox(), o2 = document.getElementById('talk2425m');
      if(!o2 || o2.getAttribute('data-h') !== String(h2.length)){ if(o2) o2.remove(); m.insertAdjacentHTML('beforeend', h2); var n2 = document.getElementById('talk2425m'); if(n2) n2.setAttribute('data-h', String(h2.length)); } } }
  window.talk2425Lv = function(k){ lv = k; try{ localStorage.setItem('coe.talk.lv', k); }catch(e){} paint(); };
  try{ lv = localStorage.getItem('coe.talk.lv') || 'yle'; }catch(e){}
  function tick(){ load(); paint(); }
  setInterval(tick, 20000); window.addEventListener('hashchange', function(){ setTimeout(tick, 600); }); setTimeout(tick, 2500); setTimeout(tick, 8000);
})();
</script>
<style id="u2425">#v-mtoday>#talk2425m{order:2}@media (max-width:760px){#talk2425>div:nth-child(2){grid-template-columns:1fr!important}}</style>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', JS + '<script id="b2278">']]);
