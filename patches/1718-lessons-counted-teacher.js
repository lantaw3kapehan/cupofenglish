// 1718: (Misty, 3 Nov 13:37) teachers get "Lessons counted" for their OWN lessons on Pay — built now, switched on by management later
//   (docs mgmt:tunits_on; while off the database writes no data to the teacher's copy, so the button does not appear).
//   · Pay › "Lessons counted · which students": month chips; her students with dates and units, her trials and subs, the month's totals.
//   · No PAYROLL comparison for teachers (that stays with management). "Something missing? Tell management" opens the existing pay question
//     (payDispute), which management answers on Payroll.
//   · Data: docs me:tunits:<her name> (scope = her own name, so the database gives it to her only), refreshed every 15 min.
const file = process.argv[2];
const JS = String.raw`<script>
/* 1718 · Lessons counted for the teacher herself (own lessons only; on when management switches it on) */
(function(){
  if(window.__1718) return; window.__1718 = 1;
  const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const lab = ym => { const m = String(ym || '').match(/^(\d{4})-(\d{2})$/); return m ? MN[+m[2] - 1] + ' ' + m[1] : ym; };
  const sh = ym => { const m = String(ym || '').match(/^(\d{4})-(\d{2})$/); return m ? MN[+m[2] - 1].slice(0, 3) + (m[1] !== String(new Date().getFullYear()) ? ' ' + m[1].slice(2) : '') : ym; };
  const n1 = x => String(Math.round((+x || 0) * 10) / 10);
  const dd = d => { const t = new Date(d + 'T12:00:00'); return isNaN(t) ? d : t.getDate() + ' ' + MN[t.getMonth()].slice(0, 3); };
  const H = x => (typeof esc === 'function' ? esc(x) : String(x == null ? '' : x));
  let ME = null, AT = 0;
  const myName = () => String((typeof D !== 'undefined' && D && D.me && D.me.name) || '').trim();
  async function load(force){ if(!TOKEN || !myName() || (typeof D !== 'undefined' && D && D.mgr)) return null; if(!force && ME && Date.now() - AT < 10 * 6e4) return ME;
    try{ const k = 'me:tunits:' + myName().toLowerCase(), r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: [k] }) }).then(x => x.json());
      ME = r && r.ok && r.docs && r.docs[k] ? r.docs[k].data : { on: false }; AT = Date.now(); }catch(e){} return ME; }
  function button(){ const el = document.getElementById('v-pay'); if(!el || !ME || !ME.on || el.querySelector('#lc1718')) return; const lead = el.querySelector('.lead');
    const b = '<div id="lc1718" style="margin:8px 0 4px"><button class="btn ghost block" onclick="myUnits()">Lessons counted · which students →</button></div>';
    if(lead) lead.insertAdjacentHTML('afterend', b); else el.insertAdjacentHTML('afterbegin', b); }
  const base = window.renderPay; if(typeof base === 'function') window.renderPay = function(){ const r = base.apply(this, arguments); try{ button(); load().then(button); }catch(e){} return r; };
  window.myUnits = async function(ym){ const M = await load(); if(!M || !M.on){ toast('Not available yet'); return; }
    const months = Object.keys(M.months || {}).sort(); if(!ym) ym = months[months.length - 1]; const T = (M.months || {})[ym] || {};
    const S = T.students || [], tr = T.trials || [], sb = T.subs || [];
    let h = '<h1 style="padding-right:48px">Lessons counted</h1><p class="small mute" style="margin:2px 0 8px">Your classes counted for pay, student by student. If a class is missing or wrong, tell management below.</p>' +
      '<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:10px">' + months.slice().reverse().slice(0, 12).map(m => '<button class="btn sm ' + (m === ym ? 'teal' : 'ghost') + '" onclick="myUnits(\'' + m + '\')">' + H(sh(m)) + '</button>').join('') + '</div>' +
      '<div class="stats" style="margin:4px 0 10px"><div class="stat"><b class="num">' + n1(T.reg) + '</b><span>regular · ' + S.length + ' students</span></div><div class="stat"><b class="num">' + n1(T.trial) + '</b><span>trial units</span></div><div class="stat"><b class="num">' + n1(T.sub) + '</b><span>sub units</span></div></div>';
    h += '<h3 style="margin:12px 0 6px">Regular lessons · ' + H(lab(ym)) + '</h3>' + (S.length ? S.map(s => '<div style="padding:8px 0;border-top:1px solid var(--line)"><div class="row" style="justify-content:space-between;gap:8px"><div><b>' + H(s.name || s.code) + '</b> <span class="mute small">' + H(s.code) + (s.book ? ' · ' + H(s.book) : '') + '</span></div><b>' + n1(s.units) + '</b></div>' +
      '<div class="small mute" style="margin-top:3px;line-height:1.7">' + (s.days || []).map(x => '<span class="chip" style="margin:0 4px 2px 0">' + H(dd(x.d)) + (Math.abs((+x.u) - 1) > 0.01 ? ' · ' + n1(x.u) : '') + '</span>').join('') + '</div></div>').join('') : '<div class="empty">No regular lessons counted.</div>') +
      '<div class="row" style="justify-content:space-between;padding:8px 0;border-top:2px solid var(--line)"><b>Total regular</b><b>' + n1(T.reg) + '</b></div>';
    const lst = (L, title, tot) => !L.length ? '' : '<h3 style="margin:14px 0 6px">' + title + '</h3>' + L.map(x => '<div class="row" style="justify-content:space-between;gap:8px;padding:6px 0;border-top:1px solid var(--line)"><div><b>' + H(x.name || x.code) + '</b> <span class="mute small">' + H(x.code) + ' · ' + H(dd(x.d)) + ' ' + H(x.t || '') + (x.for ? ' · for ' + H(x.for) : '') + '</span></div><b>' + n1(x.u) + '</b></div>').join('') +
      '<div class="row" style="justify-content:space-between;padding:8px 0;border-top:2px solid var(--line)"><b>Total</b><b>' + n1(tot) + '</b></div>';
    h += lst(tr, 'Trial classes', T.trial) + lst(sb, 'Sub classes', T.sub);
    h += '<button class="btn block" style="margin-top:14px" onclick="closeSheet();try{payDispute()}catch(e){toast(\'Use Pay › Something’s wrong\')}">Something missing? Tell management</button>';
    const sy = M.synced && M.synced[ym]; h += '<p class="small mute" style="margin-top:10px">Updated ' + (sy ? new Date(sy).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—') + '.</p>';
    openSheet(h); };
})();
</script>
`;
require('../tools/lib.js')(file, [
  ["<script>\n/* 1717 · Lessons counted: the students behind", JS + "<script>\n/* 1717 · Lessons counted: the students behind"]
]);
