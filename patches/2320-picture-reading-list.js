// 2320 (Misty 17 Nov 21:16 "yes, 1, 2, 3 now" · item 3): To do (management) · "Picture check" card under Fix these:
// today's (or yesterday's) count of time-in / I'm in pictures read (LAN cable / Wi-Fi / unclear), the readings that need a human look
// (unclear, error, the second look disagreed, or Wi-Fi for a teacher who was on cable the same day) with the picture and two buttons
// "Reading is right" / "Misread", and this week's accuracy from those reviews (coe-wifi reads / readReview).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ['<script id="b2278">',
  `<style id="d2320">#sr2320{margin:14px 0}#sr2320 .it{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid #EEF0F3}
#sr2320 .it img{width:120px;height:68px;object-fit:cover;border-radius:8px;border:1px solid #E5E7EB}#sr2320 .seg{display:inline-flex;gap:4px;background:#F1F3F5;border-radius:10px;padding:3px}
#sr2320 .seg button{border:0;background:transparent;border-radius:8px;padding:4px 10px;font:inherit;font-size:13px;cursor:pointer}#sr2320 .seg button.on{background:#fff;font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.08)}</style>
<script id="b2320">
(function(){ if(window.__b2320) return; window.__b2320 = 1;
  const U = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-wifi', E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const call = b => fetch(U, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(r => r.json()).catch(() => null);
  let DAY = 0, R = null, at = 0, busy = false;
  const dayStr = d => { const x = new Date(Date.now() + 8 * 3600e3 - d * 864e5); return x.toISOString().slice(0, 10); };
  const lab = n => n === 'cable' ? 'LAN cable' : n === 'wifi' ? 'Wi-Fi' : n === 'unclear' ? 'Unclear' : n === 'error' ? 'Not read' : n;
  function paint(){ const box = document.getElementById('sr2320'); if(!box) return; if(!R){ box.innerHTML = '<div class="card"><h3 style="margin:0">Picture check</h3><div class="small mute">Loading…</div></div>'; return; }
    const acc = R.week && R.week.reviewed ? Math.round(100 * (R.week.reviewed - R.week.misread) / R.week.reviewed) + '% right (' + R.week.reviewed + ' reviewed, ' + R.week.misread + ' misread)' : 'no reviews yet';
    box.innerHTML = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><h3 style="margin:0">Picture check' + (R.look.length ? ' <span class="fx-cnt">' + R.look.length + ' to look at</span>' : '') + '</h3>' +
      '<div class="seg"><button type="button" class="' + (DAY === 0 ? 'on' : '') + '" data-d="0">Today</button><button type="button" class="' + (DAY === 1 ? 'on' : '') + '" data-d="1">Yesterday</button></div></div>' +
      '<div class="small" style="margin-top:6px">' + R.total + ' pictures read · <b>' + R.cable + '</b> LAN cable · <b' + (R.wifi ? ' style="color:#B42318"' : '') + '>' + R.wifi + '</b> Wi-Fi · <b>' + (R.unclear + R.error) + '</b> unclear' + (R.pending ? ' · ' + R.pending + ' still being read' : '') + '</div>' +
      '<div class="small mute">Accuracy this week: ' + acc + '</div>' +
      (R.look.length ? R.look.map(x => '<div class="it"><a href="' + E(x.url) + '" target="_blank" rel="noopener" title="Open the picture"><img src="' + E(x.url) + '" alt="Screen picture" loading="lazy"></a><div style="flex:1;min-width:0"><b>Teacher ' + E(x.teacher) + '</b> · ' + E(x.at) + ' · ' + (x.kind === 'Day' ? 'Time-in' : "I'm in") +
          '<div class="small">Read as <b>' + E(lab(x.net)) + '</b>' + (x.flagged ? ' · flagged' : '') + ' · ' + E(x.why || '') + '</div><div class="small mute">Open the picture and look at the network icon next to the speaker.</div>' +
          '<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap"><button type="button" class="btn ghost sm" data-r="right" data-id="' + E(x.id) + '">Reading is right</button><button type="button" class="btn ghost sm" data-r="misread" data-id="' + E(x.id) + '">Misread</button></div></div></div>').join('')
        : '<div class="small" style="margin-top:6px;color:#166534">Nothing to look at: every picture read clearly' + (DAY ? ' yesterday' : ' so far today') + '.</div>') + '</div>';
    box.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { DAY = +b.dataset.d; at = 0; load(true); });
    box.querySelectorAll('[data-r]').forEach(b => b.onclick = async () => { b.disabled = true; const r = await call({ op: 'readReview', id: b.dataset.id, verdict: b.dataset.r });
      if(r && r.ok){ toast(b.dataset.r === 'misread' ? 'Marked as misread · if the teacher was flagged, unlock them in Wi-Fi checks above' : 'Thanks · reading confirmed'); at = 0; load(true); } else { b.disabled = false; toast('Not saved · try again'); } }); }
  async function load(force){ if(busy || (!force && Date.now() - at < 120000 && R)) return paint(); busy = true; at = Date.now(); paint(); const r = await call({ op: 'reads', day: dayStr(DAY) }); busy = false; if(r && r.ok){ R = r; } paint(); }
  function place(){ try{ if(typeof D === 'undefined' || !D || !D.mgr) return; const fx = document.getElementById('o91fix'); if(!fx || document.getElementById('sr2320')) return;
      const box = document.createElement('div'); box.id = 'sr2320'; fx.after(box); load(false); }catch(e){} }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; place(); }); }).observe(document.body, { childList: true, subtree: true });
})();
</script>
<script id="b2278">`],
]);
