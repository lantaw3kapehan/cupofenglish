// 2319 (Misty 17 Nov 21:16 "yes, 1, 2, 3 now" · item 2): Check homework linked to the rest of the app
// · class cards: "Check homework" turns into "Homework checked" (green) when a check is saved for that class (coe-hw ids)
// · student page (teachers and management): a "Homework checks" section above Class notes, with the saved checks and Open / Check new
// · monthly feedback form: a "Homework checks · last 45 days" panel under the class notes (checks, mistakes by type, well done, stamps)
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ['<script id="b2278">',
  `<style id="d2319">.hw2319sec .it{display:flex;gap:10px;align-items:center;padding:8px 0;border-top:1px solid #EEF0F3}.hw2319sec .it:first-of-type{border-top:0}
.hw2319sec .g{flex:1;min-width:0}.hw2319sec .chips{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px}.hw2319sec .chips span{font-size:12px;border-radius:999px;padding:1px 8px;background:#F1F3F5}
.btn.hw2319ok{color:#166534;border-color:#86EFAC;background:#F0FDF4}</style>
<script id="b2319">
(function(){ if(window.__b2319) return; window.__b2319 = 1;
  const HW = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-hw', E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const call = (op, b) => fetch(HW, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ op, token: TOKEN }, b || {})) }).then(r => r.json()).catch(() => null);
  const CAT = { grammar: ['Grammar', '#1D4ED8'], spelling: ['Spelling', '#C2410C'], words: ['Word choice', '#6D28D9'], punct: ['Punctuation', '#0F766E'] };
  const errN = c => ['grammar', 'spelling', 'words', 'punct'].reduce((s, k) => s + (+((c || {})[k]) || 0), 0) + (+((c || {}).fix) || 0);
  const dt = s => { const d = new Date(s); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' · ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
  /* 1 · class cards */
  let IDS = new Set(), idAt = 0;
  function mark(){ document.querySelectorAll('button[onclick^="hwOpen2308("], a[onclick*="hwOpenEv2310("]').forEach(b => { const m = (b.getAttribute('onclick') || '').match(/hwOpen(?:2308|Ev2310)\\('([^']+)'\\)/); if(!m) return; const id = m[1].replace(/&#39;/g, "'");
      if(IDS.has(id) && !b.classList.contains('hw2319ok')){ b.classList.add('hw2319ok'); b.textContent = 'Homework checked'; b.title = 'A check is saved for this class · open it again'; } }); }
  async function ids(){ if(typeof TOKEN === 'undefined' || !TOKEN || Date.now() - idAt < 60000) return mark(); idAt = Date.now(); const r = await call('ids'); if(r && r.ok){ IDS = new Set(r.ids || []); } mark(); }
  setTimeout(ids, 4000); setInterval(ids, 120000); window.addEventListener('focus', () => { idAt = 0; ids(); });
  /* 2 · student page */
  async function stuSec(code, nm){ if(!/^ST-\\d{4}-\\d{3}$/.test(code || '')) return;
    for(let i = 0; i < 40; i++){ const h = [...document.querySelectorAll('#sheetBody section.sec > h2')].find(x => /^Class notes/.test(x.textContent.trim()));
      if(h){ if(document.getElementById('hw2319s')) return; const sec = document.createElement('section'); sec.className = 'sec hw2319sec'; sec.id = 'hw2319s'; sec.innerHTML = '<h2>Homework checks</h2><div class="small mute">Loading…</div>';
        h.parentElement.before(sec); const r = await call('list', { code });
        const L = (r && r.ok && r.checks) || [], u = 'homework/?code=' + encodeURIComponent(code) + '&n=' + encodeURIComponent(nm || code);
        sec.innerHTML = '<h2>Homework checks</h2>' + (L.length ? L.slice(0, 6).map(x => { const c = x.counts || {}, ch = ['grammar', 'spelling', 'words', 'punct'].filter(k => +c[k]).map(k => '<span style="color:' + CAT[k][1] + '">' + CAT[k][0] + ' ' + c[k] + '</span>').join('') + (+c.good ? '<span style="color:#15803D">Well done ' + c.good + '</span>' : '') + (Array.isArray(c.stamps) && c.stamps.length ? '<span>Stamps ' + c.stamps.length + '</span>' : '');
            return '<div class="it"><div class="g"><b>' + E(x.title || (x.kind === 'picture' ? 'Picture' : String(x.body || '').split(/\\s+/).slice(0, 6).join(' ') + '…')) + '</b><div class="small mute">' + dt(x.created_at) + ' · ' + E(x.by_name || '') + ' · ' + errN(c) + ' to fix</div>' + (ch ? '<div class="chips">' + ch + '</div>' : '') + '</div>' + (x.img_marked_url ? '<a href="' + E(x.img_marked_url) + '" target="_blank" rel="noopener"><img src="' + E(x.img_marked_url) + '" alt="Marked picture" style="width:56px;height:56px;object-fit:cover;border-radius:8px;border:1px solid #E5E7EB"></a>' : '') + '</div>'; }).join('')
          : '<div class="small mute">No homework checked in the app yet.</div>') + '<div style="margin-top:8px"><a class="btn ghost sm" href="' + E(u) + '" target="coehw">' + (L.length ? 'Open Check homework' : 'Check homework') + '</a></div>';
        return; }
      await new Promise(z => setTimeout(z, 150)); } }
  const os = window.openStudent; if(typeof os === 'function') window.openStudent = function(code){ const r = os.apply(this, arguments); try{ const c = String(code || '').toUpperCase(); let nm = '';
      try{ const s = ((typeof D !== 'undefined' && D && (D.students || D.myStudents)) || []).find(x => String(x.code || '').toUpperCase() === c); nm = s ? (s.name || s.en || '') : ''; }catch(e){}
      setTimeout(() => stuSec(c, nm), 200); }catch(e){} return r; };
  /* 3 · monthly feedback */
  let FBC = '';
  async function fbPanel(){ try{ if(typeof FBF === 'undefined' || !FBF || !FBF.code) return; const p = document.querySelector('#sheetBody .gx-panel'); if(!p || document.getElementById('hw2319f')) return;
      const code = FBF.code, box = document.createElement('details'); box.className = 'gx-panel'; box.id = 'hw2319f'; box.open = true; box.innerHTML = '<summary><b>Homework checks · last 45 days</b> <span class="mute small">loading…</span></summary>'; p.after(box);
      const r = await call('list', { code }); if(!document.body.contains(box)) return; const since = Date.now() - 45 * 864e5, L = ((r && r.ok && r.checks) || []).filter(x => +new Date(x.created_at) >= since);
      if(!L.length){ box.innerHTML = '<summary><b>Homework checks · last 45 days</b> <span class="mute small">none</span></summary><div class="small mute">No homework checked in the app in the last 45 days.</div>'; return; }
      const T = { grammar: 0, spelling: 0, words: 0, punct: 0, good: 0, fix: 0, stamps: 0 }; L.forEach(x => { const c = x.counts || {}; Object.keys(T).forEach(k => { if(k !== 'stamps') T[k] += +c[k] || 0; }); T.stamps += Array.isArray(c.stamps) ? c.stamps.length : 0; });
      const top = ['grammar', 'spelling', 'words', 'punct'].map(k => [k, T[k]]).sort((a, b) => b[1] - a[1]).filter(x => x[1] > 0);
      box.innerHTML = '<summary><b>Homework checks · last 45 days</b> <span class="mute small">' + L.length + ' checked</span></summary>' +
        '<div class="gx-stats"><div><b class="num">' + L.length + '</b><span>checks</span></div><div><b class="num" style="color:#8A3B22">' + (T.grammar + T.spelling + T.words + T.punct + T.fix) + '</b><span>to fix</span></div><div><b class="num" style="color:#2E6B3A">' + T.good + '</b><span>well done</span></div></div>' +
        (top.length ? '<div class="small"><b>Most common:</b> ' + top.map(([k, n]) => '<span style="color:' + CAT[k][1] + '">' + CAT[k][0] + ' ' + n + '</span>').join(' · ') + '</div>' : '') +
        '<div class="small mute" style="margin-top:6px">' + L.slice(0, 5).map(x => dt(x.created_at).split(' · ')[0] + ': ' + E(x.title || (x.kind === 'picture' ? 'picture' : 'writing')) + ' (' + errN(x.counts) + ' to fix)').join(' · ') + '</div>'; }catch(e){} }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; if(IDS.size) mark(); if(document.querySelector('#sheetBody .gx-panel') && !document.getElementById('hw2319f')) fbPanel(); }); }).observe(document.body, { childList: true, subtree: true });   /* one check per frame */
})();
</script>
<script id="b2278">`],
]);
