// 2157 (13 Nov · Misty 13:29–13:31: "yes they should see label after time-in" · "we can turn the lock on now" · "also on succeeding I'm In
// classes" · "only management can unlock it until they explain" · "warning as per contract … systematic and undisputable").
// The picture check (coe-shot-read) now runs live (COE_SHOT_LIVE=1): a time-in or I'm in picture read as Wi-Fi → the contract warning
// (2135 wording) and I'm in locked for the rest of the day. The I'm in already tapped stays saved.
// (a) The warning shows the picture itself (See the picture) and says only Operations can unlock it; the teacher's "cable connected /
//     redone check" (recheck) no longer unlocks by itself: it waits for Operations (coe-wifi v2).
// (b) Today: a small "Picture check" card lists each picture of the day with its reading: LAN cable ✓ · Wi-Fi seen · Can't tell · Checking…
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["const where = f.src === 'browser' ? 'your device says you are connected by <b>Wi-Fi</b>, not a LAN cable' : 'your time-in picture shows you are connected by <b>Wi-Fi</b>, not a LAN cable';",
   "const where = f.src === 'browser' ? 'your device says you are connected by <b>Wi-Fi</b>, not a LAN cable' : 'your time-in / I&#39;m in picture shows you are connected by <b>Wi-Fi</b>, not a LAN cable';"],
  ["when: hh + ' · Time-in',", "when: hh + ' · ' + (f.src === 'browser' ? 'Time-in' : 'Picture check'),"],
  ["const t = text(f), asked = f.status === 'asked', proof = f.src !== 'browser';",
   "const t = text(f), asked = f.status === 'asked' || f.status === 'recheck', proof = f.src !== 'browser';   /* 2157: recheck waits for Operations too */"],
  ["+ '<p>' + t.body + '</p><p>' + E(t.rule) + '</p>'",
   "+ '<p>' + t.body + '</p>' + (f.proof ? '<p><a href=\"' + E(f.proof) + '\" target=\"_blank\" rel=\"noopener\" style=\"font-weight:700\">See the picture (' + E(t.when) + ')</a></p>' : '') + '<p>' + E(t.rule) + '</p>'"],
  ["(asked ? '<div class=\"wf-wait\"><b>Waiting for Operations.</b> You asked to teach without a LAN cable today' + (f.answer === 'approval' ? ' (written approval)' : ' (cable internet down)') + '. <b>I&#39;m in</b> stays locked until Operations allows it.</div>'",
   "(asked ? '<div class=\"wf-wait\"><b>Waiting for Operations.</b> ' + (f.status === 'recheck' ? 'You connected the LAN cable and redid your time-in check. Operations looks at the new picture and your explanation, then unlocks <b>I&#39;m in</b>.' : 'You asked to teach without a LAN cable today' + (f.answer === 'approval' ? ' (written approval)' : ' (cable internet down)') + '. <b>I&#39;m in</b> stays locked until Operations allows it.') + '</div>'"],
  [": '<div class=\"wf-lock\"><b>I&#39;m in is locked while you are on Wi-Fi.</b> Connect your LAN cable before your first class' + (proof ? ', then redo your time-in check so the LAN cable icon shows.' : ', then tap Check again.') + '</div>')",
   ": '<div class=\"wf-lock\"><b>I&#39;m in is locked for today.</b> Connect your LAN cable (MacBook: also turn Wi-Fi off)' + (proof ? ', redo your time-in check so the LAN cable icon shows, and explain to Operations. <b>Only Operations can unlock it.</b>' : ', then tap Check again.') + '</div>')"],
  ["say(asked ? 'Operations has not allowed it yet' : 'Still locked'); };",
   "say(asked ? 'Operations has not unlocked it yet' : 'Still locked · only Operations can unlock it'); };"],
  ["</script>\n</body>\n</html>",
   `</script>
<script id="x2157">
/* 2157 · Today › Picture check: each time-in / I'm in picture of the day with its reading (coe-wifi › shots) */
(function(){
  if(window.__pc2157) return; window.__pc2157 = 1;
  const U = () => (typeof FAST_URL !== 'undefined' ? FAST_URL : 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe') + '-wifi';
  const isT = () => { try{ return typeof D !== 'undefined' && D && !D.mgr && !D.shift; }catch(e){ return false; } };
  const E = x => String(x == null ? '' : x).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let S = [], H = '', busy = 0;
  const hm = t => { try{ return new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };
  const lab = n => n === 'cable' ? ['LAN cable ✓', '#E3F2F3', '#00616A'] : n === 'wifi' ? ['Wi-Fi seen · I’m in locked · Operations checks', '#FBE4DD', '#A6432E']
    : n === 'unclear' ? ['Can’t tell · keep your taskbar showing (MacBook: Wi-Fi icon in the menu bar, Wi-Fi off)', '#ECEAF2', '#4A4660'] : ['Checking…', '#F2F1F6', '#6B6880'];
  function html(){ if(!S.length) return '';
    return '<div id="pc2157" style="background:#fff;border:1px solid #E6E3F0;border-radius:16px;padding:12px 14px;margin:10px 0 12px">'
      + '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px"><b style="font-size:14.5px">Picture check</b><span class="small mute">your LAN cable icon, read from each picture</span></div>'
      + S.map(x => { const l = lab(x.net), what = /class/i.test(x.kind || '') ? 'I’m in' + (x.what ? ' · ' + String(x.what).split(' · ')[0].replace(/^ST-\\d{4}-\\d{3}\\s*/, '') : '') : 'Time-in';
          return '<div style="display:flex;gap:10px;align-items:center;margin-top:8px;flex-wrap:wrap"><span style="font-size:13px;color:#4A4660;min-width:120px">' + E(hm(x.at)) + ' · ' + E(what) + '</span>'
            + '<span style="font-size:12.5px;font-weight:700;padding:3px 10px;border-radius:12px;background:' + l[1] + ';color:' + l[2] + '">' + E(l[0]) + '</span></div>'; }).join('')
      + '</div>'; }
  function place(){ try{ if(!isT()) return; const v = document.getElementById('v-today'); if(!v) return; const old = document.getElementById('pc2157');
    if(!H){ if(old) old.remove(); return; } if(old && old.outerHTML === H) return; if(old) old.remove();
    const box = document.createElement('div'); box.innerHTML = H; const el = box.firstChild; const h1 = v.querySelector('h1');
    (h1 && h1.parentElement === v) ? h1.insertAdjacentElement('afterend', el) : v.insertBefore(el, v.firstChild); }catch(e){} }
  async function load(){ if(busy || !isT() || document.hidden || typeof TOKEN === 'undefined' || !TOKEN) return; busy = 1;
    try{ const r = await fetch(U(), { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'shots' }) }).then(x => x.json());
      if(r && r.ok){ S = r.shots || []; H = html(); place(); } }catch(e){} busy = 0; }
  setTimeout(load, 5000); setInterval(load, 60000);
  document.addEventListener('visibilitychange', () => { if(!document.hidden) load(); });
  /* a picture just sent: look again shortly (the reading takes about a minute) */
  ['sendTimeIn', 'classIn', 'tapClassIn'].forEach(k => { const o = window[k]; if(typeof o !== 'function' || o.__pc) return;
    const w = function(){ const r = o.apply(this, arguments); setTimeout(load, 20000); setTimeout(load, 75000); return r; }; w.__pc = 1; for(const p in o) try{ w[p] = o[p]; }catch(e){} window[k] = w; });
  try{ let q = 0; new MutationObserver(() => { if(q || !H) return; q = 1; setTimeout(() => { q = 0; if(!document.getElementById('pc2157')) place(); }, 200); })
    .observe(document.getElementById('v-today') || document.body, { childList: true }); }catch(e){}
})();
</script>
</body>
</html>`],
]);
