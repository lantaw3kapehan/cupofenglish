// 720: (Misty) Overview: "Videos to check" shows only when something is waiting (settled reviews no longer stay on screen).
// New "Lates to decide" card on Overview: each pending late with Excused / Unexcused / Waive right there, the minutes, the class,
// and when it becomes Unexcused automatically (24 h policy).
require('../tools/lib.js')(process.argv[2], [
["if(!open.length && !recent.length){ if(box) box.remove(); return; }", "if(!open.length){ if(box) box.remove(); return; }   /* 720: settled → hidden */"],
["  try{ const hv = document.getElementById('v-home'); if(hv) new MutationObserver(() => { if(MF && D && D.mgr && !document.getElementById('vcmBox')) mPaint(); }).observe(hv, { childList: true }); }catch(e){}",
 `  try{ const hv = document.getElementById('v-home'); if(hv) new MutationObserver(() => { if(MF && D && D.mgr && !document.getElementById('vcmBox')) mPaint(); }).observe(hv, { childList: true }); }catch(e){}
  /* 720: Lates to decide on Overview */
  let LQS = '';
  function lqPaint(force){ const root = document.getElementById('v-home'); if(!root || typeof D === 'undefined' || !D || !D.mgr || typeof MO === 'undefined' || !MO) return;
    const L = (MO.late || []).slice(), sig = JSON.stringify(L.map(x => x.row)); let box = document.getElementById('lqmBox');
    if(!L.length){ if(box) box.remove(); LQS = sig; return; }
    if(box && root.contains(box) && sig === LQS && !force) return; LQS = sig;
    if(!box || !root.contains(box)){ box = document.createElement('section'); box.id = 'lqmBox'; box.style.cssText = 'margin:0 0 16px'; const v = document.getElementById('vcmBox'); if(v && root.contains(v)) v.after(box); else root.insertBefore(box, root.firstChild); }
    const due = x => { const t = +x.row > 1e9 ? +x.row + 864e5 : 0; return t ? new Date(t).toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }) : ''; };
    const row = x => '<div class="lqm-it"><div class="grow"><b>' + esc(typeof tName === 'function' ? tName(x.teacher) : x.teacher) + ' · ' + esc(x.kind) + (x.mins !== '' && x.mins != null ? ' · ' + Math.abs(+x.mins) + ' min' + (+x.mins > 0 ? ' before' : ' after start') : '') + '</b>'
      + '<div class="small mute">' + esc(x.date) + ' · tapped ' + esc(x.time) + (x.first ? ' · class ' + esc(x.first) : '') + (x.cls ? ' · ' + esc(x.cls) : '') + (due(x) ? ' · <span style="color:#B4532F">auto Unexcused ' + esc(due(x)) + '</span>' : '') + '</div></div>'
      + '<div class="lqm-b"><button class="btn sm ghost" onclick="decide(' + x.row + ',\\'Excused\\')">Excused</button><button class="btn sm" style="background:#C2483A;color:#fff;border-color:#C2483A" onclick="decide(' + x.row + ',\\'Unexcused\\')">Unexcused</button><button class="btn sm ghost" onclick="decide(' + x.row + ',\\'Waive\\')">Waive</button></div></div>';
    box.innerHTML = '<div class="lqm"><b>⏱ Lates to decide · ' + L.length + '</b><div class="small mute" style="margin:2px 0 6px">POLICY · Excused or Unexcused adds the case and the deduction · Waive = no penalty · not decided in 24 h → Unexcused automatically</div>' + L.map(row).join('') + '</div>'; }
  (function(){ const st = document.createElement('style'); st.textContent = '.lqm{border:1.5px solid #F0C9BD;background:#FFF6F3;border-radius:16px;padding:14px 16px}.lqm-it{display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid #F6DDD4;flex-wrap:wrap}.lqm-b{display:flex;gap:6px}'; document.head.appendChild(st);
    const _sd = window.sendDecide; if(typeof _sd === 'function') window.sendDecide = async function(){ const p = _sd.apply(this, arguments); setTimeout(() => lqPaint(true), 50); try{ await p; }catch(e){} lqPaint(true); return p; };
    try{ const hv = document.getElementById('v-home'); if(hv) new MutationObserver(() => { if(!document.getElementById('lqmBox')) lqPaint(true); }).observe(hv, { childList: true }); }catch(e){}
    setInterval(() => { if(typeof VIEW !== 'undefined' && VIEW === 'home') lqPaint(); }, 5000); setTimeout(() => lqPaint(true), 3000); })();`],
]);
