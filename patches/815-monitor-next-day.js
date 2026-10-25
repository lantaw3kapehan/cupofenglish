// 815: (Misty) "And the next day, it's also easy for us to track and the penalties on it"
// Monitor › Yesterday (or any past day):
// · every red item on a class has a "Decide" button: No video → Late video · Excused / Unexcused / Waive (POLICY: ₱100 / ₱200);
//   No "I'm in" → Late to class · Excused / Unexcused / Waive (POLICY by rank). Saved as a case, the teacher sees it on Today and Pay
//   (the same as tagging from the class card). A decided item shows "Decided · Unexcused" and leaves Needs attention.
// · No homework / No class note: there is no POLICY penalty for these yet → "Remind" opens a message to the teacher.
// · Today, until 12:00: a line "Yesterday · N to review" opens yesterday in one tap.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["window.moLoad = () => load(true);", "window.moLoad = () => load(true); window.__monData = () => M.data;"],
  ["['ci', 'vid', 'hw', 'note'].forEach(k => { if(m[k]) a[k]++; });", "['ci', 'vid', 'hw', 'note'].forEach(k => { if(m[k] && !((window.moTagged ? moTagged() : {})[c.id + '|' + (k === 'vid' ? 'video' : k === 'ci' ? 'late' : k)])) a[k]++; });"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 815 · Monitor: next-day review and penalties */
(function(){
  if(window.__815 || !window.moLoad) return; window.__815 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>.mo-dec{border:0;border-radius:999px;padding:4px 10px;margin-left:6px;font:inherit;font-size:12px;font-weight:700;background:#2B2253;color:#fff;cursor:pointer}.mo-done{display:inline-block;margin-left:6px;font-size:12px;font-weight:700;color:#55526E;background:#F1F0F6;border-radius:999px;padding:3px 9px}.mo-yd{border:0;border-radius:12px;padding:9px 14px;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer;background:#FFF4E5;color:#9A5B10}</style>');
  const K = 'coe.motag', get = () => { try{ return JSON.parse(localStorage.getItem(K) || '{}') || {}; }catch(e){ return {}; } };
  const put = (k, v) => { try{ const o = get(); o[k] = v; Object.keys(o).forEach(x => { if(Date.now() - (o[x].at || 0) > 10 * 864e5) delete o[x]; }); localStorage.setItem(K, JSON.stringify(o)); }catch(e){} };
  window.moTagged = get;
  function find(id){ const d = window.__monData && window.__monData(); if(!d) return null;
    for(const t of d.teachers || []) for(const c of t.classes || []) if(c.id === id) return { t, c, d }; return null; }
  window.moDecide = function(id, kind){ const x = find(id); if(!x) return; const { t, c } = x, k = id + '|' + kind;
    const lbl = kind === 'video' ? 'Late class video' : 'Late to class (no “I’m in”)', amt = kind === 'video' ? 'Excused ₱100 · Unexcused ₱200' : 'amount by rank (POLICY)';
    openSheet('<h1>' + esc(lbl) + '</h1><div class="mute small">' + esc(t.name) + ' · ' + esc(c.student || c.code) + ' · ' + esc(c.book || '') + ' · ' + esc(new Date(c.start).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) + '</div>' +
      '<div class="small" style="margin:12px 0 6px">' + amt + ' · saved as a case · ' + esc(t.name) + ' sees it on Today and Pay</div>' +
      '<label class="small mute">Note for the teacher (optional)</label><input id="moDN" class="in-t" placeholder="e.g. no video by 23:59; uploaded next morning">' +
      '<div class="row" style="gap:8px;margin-top:12px;flex-wrap:wrap">' + ['Unexcused', 'Excused', 'Waive'].map(cd => '<button class="btn ' + (cd === 'Unexcused' ? 'teal' : 'ghost') + '" onclick="moDecideGo(\'' + esc(id) + '\',\'' + kind + '\',\'' + cd + '\',this)">' + cd + '</button>').join('') + '</div>'); };
  window.moDecideGo = async function(id, kind, cond, b){ const x = find(id); if(!x) return; const { t, c } = x; b.disabled = true; b.textContent = 'Saving…';
    try{ const r = await api('mgmtTagClass', TOKEN, { id: c.id, start: c.start, end: c.end, teacher: t.name, code: c.code, student: c.student }, kind, cond, ($('moDN') || {}).value || '');
      if(!r || !r.ok) throw r; put(id + '|' + kind, { cond, note: r.note || '', at: Date.now() }); closeSheet(); toast('✓ ' + (r.note || cond) + (r.caseId ? ' · ' + r.caseId : '')); dec(); }
    catch(e){ b.disabled = false; b.textContent = cond; toast((e && e.msg) || 'Not saved · try again'); } };
  window.moRemind = function(name){ try{ go('msgs'); setTimeout(() => toast('Write to ' + name + ' about yesterday’s homework / class notes'), 400); }catch(e){} };
  // add the buttons to the class rows of a past day
  function dec(){ const v = $('v-monitor'); if(!v || !window.__monData) return; const d = window.__monData(); if(!d || d.day === d.today) return yd(v, d); const T = get();
    v.querySelectorAll('.mo-c').forEach(row => { if(row.dataset.d815) return; row.dataset.d815 = '1'; const id = ((row.getAttribute('onclick') || '').match(/moClass\('([^']+)'\)/) || [])[1]; if(!id) return; const x = find(id); if(!x) return;
      const no = [...row.querySelectorAll('.mo-k.no')].map(k => k.textContent.trim()), add = [];
      if(no.some(l => /^Video/.test(l))) add.push(T[id + '|video'] ? '<span class="mo-done">Video · ' + esc(T[id + '|video'].cond) + '</span>' : '<button class="mo-dec" onclick="event.stopPropagation();moDecide(\'' + esc(id) + '\',\'video\')">Decide video</button>');
      if(no.some(l => /I’m in/.test(l))) add.push(T[id + '|late'] ? '<span class="mo-done">Late · ' + esc(T[id + '|late'].cond) + '</span>' : '<button class="mo-dec" onclick="event.stopPropagation();moDecide(\'' + esc(id) + '\',\'late\')">Decide late</button>');
      if(no.some(l => /^(HW|Note)/.test(l))) add.push('<button class="mo-dec" style="background:#fff;color:#2B2253;border:1px solid #E3E1EC" onclick="event.stopPropagation();moRemind(\'' + esc(x.t.name) + '\')">Remind</button>');
      if(add.length) row.insertAdjacentHTML('beforeend', add.join('')); }); }
  // today, before noon: yesterday's open items in one tap
  let YD = null, YDAT = 0;
  async function ydLoad(){ if(Date.now() - YDAT < 10 * 6e4) return; YDAT = Date.now(); try{ const day = new Date(Date.now() + 8 * 3600e3 - 864e5).toISOString().slice(0, 10);
      const r = await fetch(FAST_URL + '-monitor', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, day }) }).then(x => x.json()); if(r && r.ok) YD = r; }catch(e){} }
  function ydCount(r){ const T = get(); let n = 0; (r.teachers || []).forEach(t => t.classes.forEach(c => { if(c.cancelled) return; const nd = c.code && c.type !== 'Trial';
      if(!c.ci && !T[c.id + '|late']) n++; if(c.code && !c.vid && !T[c.id + '|video']) n++; if(nd && !c.hw) n++; if(nd && !c.note) n++; })); return n; }
  function yd(v, d){ if(!d || d.day !== d.today || new Date().getHours() >= 12) return; ydLoad().then(() => { if(!YD) return; const n = ydCount(YD), att = v.querySelector('.mo-att'); if(!att || !n || v.querySelector('.mo-yd')) return;
      att.insertAdjacentHTML('afterbegin', '<button class="mo-yd" onclick="moDay(\'' + YD.day + '\')">Yesterday · ' + n + ' to review ›</button>'); }); }
  new MutationObserver(() => { try{ dec(); }catch(e){} }).observe($('v-monitor') || document.body, { childList: true, subtree: true });
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
