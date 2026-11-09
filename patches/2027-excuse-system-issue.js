// 2027 (9 Nov 20:10, Misty: "create an edit for us management that when there's a system issue and they're tagged late we can easily
//   edit it" · 20:13 "ensure it's easy to find because it's in Overview but at the most bottom, since this is a daily operation"):
//   1. Lates to decide moves up on Overview: right under the numbers, above Needs you (it was at the bottom).
//   2. Each late there gets a "System issue" button. When there is nothing to decide, a slim line stays in the same place with
//      "Excuse a system issue", so the edit is always one tap away.
//   3. "Excuse a system issue" opens the lates of the last 14 days (time-ins and late video uploads, decided or not). One tap +
//      Confirm: the time-in becomes On time / the video is not late, the linked case is waived, Growth, awards and ranks are
//      refreshed, and who did it is kept (coe-excuse → coe_excuse_system, coe_excuse_log). Office staff lates: President only.
const file = process.argv[2];
const SCRIPT = `<script id="x2027">
/* 2027 · Excuse a system issue (management) */
(function(){
  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-excuse'; let EX = null;
  const call = b => fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(r => r.json());
  const nm = t => esc(typeof tName === 'function' ? tName(t) : t);
  const ms = at => Date.parse(String(at || '') + '+08:00');
  const dt = at => { const d = new Date(ms(at)); return isNaN(d) ? esc(at || '') : esc(d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' })); };
  const dts = s => { const d = new Date(s); return isNaN(d) ? '' : esc(d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' })); };
  const minsTxt = x => { const m = +x.mins; return isFinite(m) && x.mins !== '' && x.mins != null ? ' · ' + Math.abs(m) + ' min ' + (m > 0 ? 'before class' : 'after start') : ''; };
  const decTxt = d => { d = String(d || ''); if(!d) return 'not decided yet'; const p = d.split(' · '); return esc(p.slice(0, /^(Excused|Unexcused) · ₱/.test(d) ? 3 : 1).join(' · ')); };
  function tiRow(x){ const kind = x.done ? 'Late' + (/to class/.test(x.dec) ? ' to class' : '') : x.kind;
    return '<div class="x27-r"><div class="grow"><b>' + nm(x.teacher) + ' · ' + esc(x.done ? 'time-in' : kind) + '</b><div class="small mute">' + dt(x.at) + (x.done ? '' : minsTxt(x)) + (x.cls ? ' · ' + esc(x.cls) : '') + '</div>'
      + '<div class="small" style="color:' + (x.done ? '#1E7A55' : '#6B6782') + '">' + (x.done ? '✓ Excused · system issue · counts as on time' : 'Decision: ' + decTxt(x.dec)) + '</div></div>'
      + (x.done ? '' : '<button class="btn sm" onclick="exAsk2027(\\'timein\\',' + JSON.stringify(x.ref).replace(/"/g, '&quot;') + ')">Excuse · system issue</button>') + '</div>'; }
  function vRow(x){ return '<div class="x27-r"><div class="grow"><b>' + nm(x.teacher) + ' · late video · ' + esc(x.student || x.code || '') + '</b><div class="small mute">Class ' + dts(x.start) + ' · uploaded ' + dts(x.up) + (x.case ? ' · ' + esc(x.case) : '') + '</div>'
      + '<div class="small" style="color:' + (x.done ? '#1E7A55' : '#6B6782') + '">' + (x.done ? '✓ Excused · system issue · not counted as late' : 'Counted as a late upload') + '</div></div>'
      + (x.done ? '' : '<button class="btn sm" onclick="exAsk2027(\\'video\\',' + JSON.stringify(x.ref).replace(/"/g, '&quot;') + ')">Excuse · system issue</button>') + '</div>'; }
  function body(){ if(!EX) return '<div class="small mute" style="padding:14px 0">Loading the last 14 days…</div>';
    const T = EX.timein || [], V = EX.video || [];
    return '<h3 class="x27-h">Late time-ins · ' + T.filter(x => !x.done).length + '</h3>' + (T.length ? T.map(tiRow).join('') : '<div class="small mute">None in the last 14 days.</div>')
      + '<h3 class="x27-h">Late video uploads · ' + V.filter(x => !x.done).length + '</h3>' + (V.length ? V.map(vRow).join('') : '<div class="small mute">None in the last 14 days.</div>'); }
  function paint(){ const b = document.getElementById('x27b'); if(b) b.innerHTML = body(); }
  async function load(){ try{ const r = await call({ action: 'list', days: 14 }); if(!r || !r.ok) throw new Error((r && r.error) || 'Could not load'); EX = r; paint(); return r; }
    catch(e){ const b = document.getElementById('x27b'); if(b) b.innerHTML = '<div class="small" style="color:#B03A2E;padding:10px 0">Could not load · ' + esc(e.message) + ' · try again.</div>'; return null; } }
  window.exOpen2027 = function(){
    openSheet('<h2 style="margin:0 0 4px">Excuse a system issue</h2><div class="small mute">For a late caused by the app or a system error, not by the teacher. It then counts as on time everywhere: Growth, awards, ranks and payroll. The linked case is waived.</div><div id="x27b">' + body() + '</div>');
    load(); };
  window.exOne2027 = async function(row){
    let r = EX; if(!r) r = await load(); if(!r){ toast('Could not load · try again'); return; }
    const x = (r.timein || []).find(y => ms(y.at) === +row || Math.abs(ms(y.at) - +row) < 1000);
    if(!x){ exOpen2027(); return; } exAsk2027('timein', x.ref); };
  window.exAsk2027 = function(kind, ref){
    const x = ((EX && EX[kind]) || []).find(y => y.ref === ref); if(!x) return;
    const what = kind === 'timein' ? nm(x.teacher) + ' · ' + esc(x.kind) + ' · ' + dt(x.at) + minsTxt(x) : nm(x.teacher) + ' · late video · ' + esc(x.student || x.code || '') + ' · class ' + dts(x.start);
    const cid = kind === 'timein' ? ((String(x.dec || '').match(/OAR-\\d{4}-\\d+/) || [])[0] || '') : (x.case || '');
    window._x27go = async function(){ const btn = document.getElementById('x27go'); if(btn){ btn.disabled = true; btn.textContent = 'Saving…'; }
      const note = ((document.getElementById('x27n') || {}).value || '').trim(); let r = null;
      try{ r = await call({ action: 'excuse', kind, ref, note }); }catch(e){ r = { ok: false, error: e.message }; }
      if(!r || !r.ok){ if(btn){ btn.disabled = false; btn.textContent = 'Confirm · excuse'; } toast((r && (r.msg || r.error)) || 'Not saved · try again'); return; }
      try{ if(kind === 'timein' && typeof MO !== 'undefined' && MO && MO.late){ const t = ms(x.at); MO.late = MO.late.filter(l => Math.abs(+l.row - t) >= 1000); try{ store('set', 'coe.mo', JSON.stringify(MO)); }catch(e){} } }catch(e){}
      toast(r.dup ? 'Already excused' : 'Excused ✓ · ' + (typeof tName === 'function' ? tName(r.teacher || x.teacher) : (r.teacher || x.teacher)) + (r.caseId ? ' · case ' + r.caseId + ' waived' : '') + ' · counts as on time');
      EX = null; exOpen2027(); try{ if(window.lqPaint2027) lqPaint2027(); }catch(e){} };
    openSheet('<h2 style="margin:0 0 4px">Excuse · system issue?</h2><div class="small mute">' + what + '</div>'
      + '<div style="background:#EEF8F9;border:1px solid #CDEBEE;border-radius:14px;padding:12px 14px;margin-top:12px;line-height:1.5">'
      + (kind === 'timein' ? 'The time-in becomes <b>On time</b>.' : 'The video is <b>not counted as late</b>.') + (cid ? ' Case <b>' + esc(cid) + '</b> is waived (no deduction, no points).' : ' No case is made for it.')
      + ' Growth, Perfect Attendance awards and ranks are updated. Your name and today\\'s date are kept on the record.</div>'
      + '<input id="x27n" class="in-t" maxlength="160" style="margin-top:12px;width:100%" placeholder="What happened (optional) · e.g. the app froze at time-in">'
      + '<button class="btn block" id="x27go" style="margin-top:12px" onclick="_x27go()">Confirm · excuse</button><button class="btn ghost block" style="margin-top:8px" onclick="exOpen2027()">Back</button>'); };
  const st = document.createElement('style');
  st.textContent = '.x27-h{font-size:15px;margin:16px 0 4px}.x27-r{display:flex;gap:10px;align-items:center;padding:10px 0;border-top:1px solid #F1EFF5;flex-wrap:wrap}.x27-r .btn{flex:none}.lqm a.x27-l{color:#00636B;font-weight:600;cursor:pointer;font-size:14px}';
  document.head.appendChild(st);
})();
</script>
`;
require('../tools/lib.js')(file, [
 [
  "if(!L.length){ if(box) box.remove(); LQS = sig; return; }",
  "if(!L.length){ if(box && root.contains(box) && LQS === 'none2027' && !force) return; LQS = 'none2027';   /* 2027: a slim line stays so the system-issue edit is always here */\n      if(!box || !root.contains(box)){ box = document.createElement('section'); box.id = 'lqmBox'; box.style.cssText = 'margin:0 0 16px'; root.insertBefore(box, root.firstChild); }\n      box.innerHTML = '<div class=\"lqm\" style=\"background:#fff;border-color:#ECEAF2;padding:10px 16px\"><div class=\"row\" style=\"gap:10px;align-items:center;flex-wrap:wrap\"><b class=\"grow\">⏱ Lates · nothing to decide</b><a class=\"x27-l\" onclick=\"exOpen2027()\">Excuse a system issue →</a></div></div>'; return; }"
 ],
 [
  "'<div class=\"lqm-b\"><button class=\"btn sm ghost\" onclick=\"actLog(",
  "'<div class=\"lqm-b\"><button class=\"btn sm ghost\" title=\"The app or a system error caused it: counts as on time, no case\" onclick=\"exOne2027(' + x.row + ')\">⚙ System issue</button><button class=\"btn sm ghost\" onclick=\"actLog("
 ],
 [
  "box.innerHTML = '<div class=\"lqm\"><b>⏱ Lates to decide · ' + L.length + '</b>",
  "box.innerHTML = '<div class=\"lqm\"><div class=\"row\" style=\"gap:10px;align-items:center;flex-wrap:wrap\"><b class=\"grow\">⏱ Lates to decide · ' + L.length + '</b><a class=\"x27-l\" onclick=\"exOpen2027()\">Excuse a system issue →</a></div>"
 ],
 [
  "#v-home #nd37{order:2}",
  "#v-home #lqmBox{order:2}   /* 2027: Lates to decide right under the numbers (daily work) */\n#v-home #nd37{order:2}"
 ],
 [
  "<script id=\"l1651\">",
  SCRIPT + "<script id=\"l1651\">"
 ]
]);
