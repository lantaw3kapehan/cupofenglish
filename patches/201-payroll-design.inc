/* 15 Oct night · Payroll, redesigned (Misty: "search the teacher faster instead of scrolling up and down").
   · one search box at the top finds a teacher in this month's pay AND in the history at once;
   · filter chips: All · To pay · Ready to release · Paid · Questions on pay (with counts);
   · this month as a clean list (one row per teacher: units, net, what is still missing, status) instead of big cards;
   · history grouped by month (total, paid / pending), newest first, the latest month open;
   · the dark summary card with the white cup, like Sales & costs. Same data and the same buttons as before. */
(function(){
const css = `
#v-payroll .py-top{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:18px}
#v-payroll .py-top h1{margin:0;font-family:var(--brand);font-weight:400;font-size:38px;color:var(--ink)}
#v-payroll .py-top .sub{font-size:13px;color:#8F8CA3;margin-top:4px}
#v-payroll .py-act{display:flex;gap:8px;margin-left:auto}
.py-hero{position:relative;overflow:hidden;border-radius:24px;padding:24px 26px 20px;color:#fff;background:radial-gradient(120% 140% at 100% 0%,#3B5D8F 0%,#2B2253 55%,#221B44 100%);box-shadow:0 18px 40px -22px rgba(43,34,83,.55)}
.py-cup{position:absolute;right:-22px;top:-30px;width:230px;opacity:.13;filter:brightness(0) invert(1);pointer-events:none}
.py-hero>*:not(.py-cup){position:relative;z-index:1}
.py-hero .r1{display:flex;align-items:baseline;gap:10px} .py-hero .r1 span{font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#BDB8DC}
.py-hero .big{font-family:var(--brand);font-size:38px;line-height:1.1;margin:6px 0 2px;white-space:nowrap}
.py-hero .bs{font-size:13px;color:#D9D6EC}
.py-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:18px}
.py-3>div{background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:12px 14px}
.py-3 span{display:block;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#BDB8DC}
.py-3 b{display:block;font-family:var(--brand);font-weight:400;font-size:22px;margin-top:4px;white-space:nowrap}
.py-3 small{display:block;font-size:12px;color:#CFCBE6;margin-top:2px}
.py-bar{display:flex;height:8px;border-radius:8px;overflow:hidden;background:rgba(255,255,255,.12);margin-top:16px;gap:2px}
.py-bar i{display:block;height:100%}
.py-key{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:#D9D6EC;margin-top:8px}
.py-key i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:6px;vertical-align:-1px}
.py-find{position:sticky;top:0;z-index:5;background:var(--bg,#FBFAF7);padding:16px 0 10px;margin-top:6px}
.py-find .search{margin:0}
.py-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.py-chips button{display:inline-flex;align-items:center;gap:6px;padding:7px 13px;border-radius:999px;border:1.5px solid #ECEAF1;background:#fff;font:inherit;font-size:13px;color:#4C4868;cursor:pointer}
.py-chips button b{font-weight:700;color:#2B2253}
.py-chips button.on{border-color:var(--teal);background:#EAF5F6;color:#00666D}
.py-chips button.on b{color:#00666D}
.py-cap{display:flex;align-items:baseline;gap:8px;margin:18px 2px 10px}
.py-cap h3{margin:0;font-family:var(--brand);font-weight:400;font-size:19px;color:var(--ink)}
.py-cap span{font-size:12.5px;color:#8F8CA3}
.py-cap .grow{flex:1}
.py-list{background:#fff;border:1px solid rgba(236,234,241,.9);border-radius:20px;box-shadow:var(--sh1);overflow:hidden}
.py-row{display:grid;grid-template-columns:44px minmax(0,1.4fr) 70px 120px minmax(0,1.6fr) 150px;gap:12px;align-items:center;padding:12px 18px;border-top:1px solid #F1F0F5;cursor:pointer;transition:background .12s}
.py-row:first-child{border-top:0} .py-row:hover{background:#FAFAFD}
.py-av{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;font-weight:700;font-size:13px;color:#fff;background:#C9A15E}
.py-row.paid .py-av{background:#00A3AD} .py-row.ready .py-av{background:#2E9B6A}
.py-n b{display:block;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.py-n small{display:block;font-size:12px;color:#8F8CA3}
.py-u{font-size:13px;color:#7C7990;font-variant-numeric:tabular-nums}
.py-net{font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums;text-align:right}
.py-cks{display:flex;flex-wrap:wrap;gap:5px}
.py-cks .pr-c{font-size:11.5px}
.py-st{justify-self:end}
.py-st span{display:inline-block;padding:4px 11px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap}
.py-st .paid{background:#E1F4F5;color:#00666D} .py-st .ready{background:#E3F4EC;color:#1C6B4C} .py-st .wait{background:#FBF1DE;color:#8A5A0F}
.py-empty{padding:22px;text-align:center;color:#8F8CA3}
.py-nudge{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px;font-size:12.5px;color:#7C7990}
.py-nudge .grow{flex:1}
.py-h{background:#fff;border:1px solid rgba(236,234,241,.9);border-radius:18px;box-shadow:var(--sh1);margin-top:10px;overflow:hidden}
.py-h>summary{display:grid;grid-template-columns:minmax(0,1fr) auto auto 18px;gap:14px;align-items:center;padding:14px 18px;cursor:pointer;list-style:none}
.py-h>summary::-webkit-details-marker{display:none}
.py-h>summary b{font-family:var(--brand);font-weight:400;font-size:17px;color:var(--ink)}
.py-h>summary small{font-size:12.5px;color:#8F8CA3}
.py-h>summary .t{font-weight:700;font-variant-numeric:tabular-nums;color:var(--ink)}
.py-h>summary .chev{color:#A3A0B5;transition:transform .2s;font-size:18px}
.py-h[open]>summary .chev{transform:rotate(90deg)}
.py-h table{width:100%;border-collapse:collapse;font-size:13.5px}
.py-h td{padding:10px 18px;border-top:1px solid #F1F0F5;font-variant-numeric:tabular-nums}
.py-h td.r{text-align:right} .py-h td.neg{color:var(--red)}
.py-pill{display:inline-block;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:700;white-space:nowrap;background:#F1F0F5;color:#76738A}
.py-pill.ok{background:#E3F4EC;color:#1C6B4C}
mark.py-m{background:#FFF1B8;color:inherit;border-radius:3px;padding:0 1px}
@media(max-width:900px){ .py-row{grid-template-columns:40px minmax(0,1fr) auto;gap:4px 10px} .py-u{display:none} .py-cks{grid-column:2/-1;order:5} .py-st{grid-column:2/-1;justify-self:start;order:6} .py-net{grid-column:3;grid-row:1} }
@media(max-width:640px){ #v-payroll .py-top h1{font-size:30px} #v-payroll .py-act{margin-left:0;width:100%} #v-payroll .py-act .btn{flex:1}
  .py-hero{padding:20px 18px;border-radius:20px} .py-hero .big{font-size:30px} .py-cup{width:150px;right:-18px;top:-18px} .py-3{grid-template-columns:1fr 1fr} .py-3>div:last-child{grid-column:1/-1}
  .py-h>summary{grid-template-columns:minmax(0,1fr) auto 18px} .py-h>summary small.s{display:none} .py-h td{padding:9px 12px} }`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

let PRF = 'all'; const T = s => String(s == null ? '' : s).trim();
const norm = s => T(s).toLowerCase().replace(/^teacher\s+/, '');
const hi = (s, q) => { const e = esc(s); if(!q) return e; const i = e.toLowerCase().indexOf(q); return i < 0 ? e : e.slice(0, i) + '<mark class="py-m">' + e.slice(i, i + q.length) + '</mark>' + e.slice(i + q.length); };
const stOf = x => x.paid ? 'paid' : (typeof RDY !== 'undefined' && RDY && rdyN(x.name) === 0) ? 'ready' : 'wait';
const qv = () => ($('prq') && $('prq').value || '').trim().toLowerCase();

window.payFilter = function(f){ PRF = f; renderPayroll(); };
window.payFind = function(){ paintRows(); payLedger(); };

function paintRows(){
  const box = $('pyRows'); if(!box || !MO) return; const P = MO.payroll || [], q = qv();
  const ok = x => (!q || norm(x.name).includes(q) || tName(x.name).toLowerCase().includes(q)) && (PRF === 'all' || (PRF === 'topay' ? !x.paid : PRF === 'q' ? ['Disputed', 'Changed'].includes((pchkOf(x) || {}).st) : stOf(x) === PRF));
  const rows = P.map((x, i) => ({ x, i })).filter(o => ok(o.x));
  box.innerHTML = rows.map(({ x, i }) => { const s = stOf(x), r = rdyOf(x.name), ck = (l, a) => `<span class="pr-c ${!r ? '' : a && a.length ? 'no' : 'ok'}">${r && !(a && a.length) ? '✓ ' : ''}${l}${a && a.length ? ' · ' + a.length : ''}</span>`;
    return `<div class="py-row ${s}" onclick="payRow(${i})"><span class="py-av">${esc(String(x.name || '?').replace(/^teacher\s+/i, '').slice(0, 2).toUpperCase())}</span>
      <div class="py-n"><b>${hi(tName(x.name), q)}</b><small>${x.units} unit${x.units === 1 ? '' : 's'}${x.rate ? ' × ' + peso(x.rate) : ''}</small></div>
      <span class="py-u">${x.units} u</span><span class="py-net">${peso(x.net)}</span>
      <div class="py-cks">${x.paid ? '' : ck('Feedback', r && r.fb) + ck('Peer review', r && r.peer) + ck('Videos', r && r.vid)}${pchkChip(x)}</div>
      <div class="py-st"><span class="${s}">${x.paid ? '✓ Paid' : s === 'ready' ? 'Ready to release' : r ? rdyN(x.name) + ' to finish' : 'Checking…'}</span></div></div>`; }).join('')
    || `<div class="py-empty">${q ? 'No teacher matches “' + esc(q) + '” this month' : 'Nobody here'}</div>`;
}

window.renderPayroll = function(){
  if(!window._pckm){ window._pckm = 1; if(!PCKM) PCKM = kept('paychkm'); loadPayChecks(); }
  const P = (MO && MO.payroll) || [], q0 = qv(), focus = document.activeElement && document.activeElement.id === 'prq';
  const tot = P.reduce((a, x) => a + x.net, 0), paid = P.filter(x => x.paid), UP = P.filter(x => !x.paid), owed = UP.reduce((a, x) => a + x.net, 0);
  const RD = RDY ? UP.filter(x => rdyN(x.name) === 0) : [], rdyAmt = RD.reduce((a, x) => a + x.net, 0), wait = UP.length - RD.length;
  const S = PCKM ? P.map(x => (pchkOf(x) || {}).st) : [], ver = S.filter(s => s === 'Verified').length, qs = P.filter(x => ['Disputed', 'Changed'].includes((pchkOf(x) || {}).st)).length;
  let h = `<div class="py-top"><div><h1>Payroll</h1><div class="sub">${esc((MO && MO.payMonth) || '')} pay · from the PAY tab</div></div>
    <div class="py-act"><button class="btn ghost" onclick="tabSheet('PAY','PAY tab')">PAY tab</button><button class="btn teal" onclick="payslip('')">Payslip</button></div></div>`;
  if(P.length){
    h += `<section class="py-hero"><img class="py-cup" src="${esc(ovCup())}" alt=""><div class="r1"><span>${esc((MO && MO.payMonth) || '')} · total net</span></div>
      <div class="big">${peso(tot)}</div><div class="bs">${P.length} teacher${P.length === 1 ? '' : 's'} · ${P.reduce((a, x) => a + x.units, 0)} units${PCKM ? ' · pay checked by ' + ver + ' of ' + P.length : ''}</div>
      <div class="py-3"><div><span>Released</span><b>${peso(tot - owed)}</b><small>${paid.length} of ${P.length} paid</small></div>
      <div><span>Ready to release</span><b>${RDY ? peso(rdyAmt) : '—'}</b><small>${RDY ? RD.length + ' teacher' + (RD.length === 1 ? '' : 's') : 'checking…'}</small></div>
      <div><span>Still to pay</span><b style="${owed ? 'color:#FFB4A3' : ''}">${peso(owed)}</b><small>${UP.length} teacher${UP.length === 1 ? '' : 's'}${wait && RDY ? ' · ' + wait + ' still finishing' : ''}</small></div></div>
      <div class="py-bar"><i style="flex:${paid.length};background:#00C2CC"></i><i style="flex:${RD.length};background:#3CC48A"></i><i style="flex:${wait};background:#E3C38A"></i></div>
      <div class="py-key"><span><i style="background:#00C2CC"></i>${paid.length} paid</span><span><i style="background:#3CC48A"></i>${RD.length} ready</span><span><i style="background:#E3C38A"></i>${wait} still finishing</span></div></section>`;
  }
  const cnt = { all: P.length, topay: UP.length, ready: RD.length, paid: paid.length, q: qs };
  const chip = (k, l) => `<button class="${PRF === k ? 'on' : ''}" onclick="payFilter('${k}')">${l} <b>${cnt[k]}</b></button>`;
  h += `<div class="py-find"><input id="prq" class="search" placeholder="Find a teacher — this month and all of the history" oninput="payFind()" autocomplete="off">
    <div class="py-chips">${chip('all', 'All')}${chip('topay', 'To pay')}${RDY ? chip('ready', 'Ready to release') : ''}${chip('paid', 'Paid')}${qs ? chip('q', 'Questions on pay') : ''}</div></div>`;
  if(P.length){
    const notReady = RDY ? P.filter(x => !x.paid && rdyN(x.name)) : [], rest = PCKM ? P.filter(x => !x.paid && (pchkOf(x) || {}).st !== 'Verified').map(x => x.name) : [];
    h += `<div class="py-cap"><h3>${esc((MO && MO.payMonth) || 'This month')}</h3><span>tap a teacher for the breakdown, payslip and Mark paid</span></div><div class="py-list" id="pyRows"></div>
      <div class="py-nudge">${RDY ? `<span class="grow">Ready = ${esc(RDY.fbMonth)} feedback sent · peer reviews done · every ${esc(RDY.month)} class video in · checked ${esc(RDY.at)}H</span>` : '<span class="grow"></span>'}
      ${notReady.length ? `<button class="btn sm ghost" onclick="payNudge(${esc(JSON.stringify(notReady.map(x => x.name)))})">Remind ${notReady.length} not ready</button>` : ''}
      ${rest.length ? `<button class="btn sm ghost" onclick='payVerNudge(${JSON.stringify(rest).replace(/'/g, '&#39;')})'>Ask ${rest.length} to check their pay</button>` : ''}</div>`;
  } else h += '<div class="empty">Loading…</div>';
  h += `<div class="py-cap"><h3>Payroll history</h3><span>PAYROLL tab</span><span class="grow"></span>${sheetLink('PAYROLL')}</div><div id="plList">${PL ? '' : '<div class="sk"></div>'}</div>`;
  $('v-payroll').innerHTML = h;
  if(q0){ $('prq').value = q0; } if(focus){ const i = $('prq'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
  paintRows(); payLedger();
};

window.payLedger = function(){
  const box = $('plList'); if(!PL || !box) return;
  const q = qv(), H = PL.head, c = k => H.findIndex(h => T(h).toUpperCase() === k);
  const iN = c('TEACHER NAME'), iM = c('MONTH'), iNet = c('NET SALARY'), iS = c('STATUS'), iD = c('DATE OF PAYMENT');
  const day = v => { const s = T(v); const m = s.match(/(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : s.replace(/-/g, ' '); };
  const num = v => { const n = parseFloat(String(v || '').replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; };
  const G = [], by = {};
  PL.rows.forEach(r => { const nm = T(r[iN]), mo = plMonth(r[iM]); if(q && !norm(nm).includes(q) && !mo.toLowerCase().includes(q) && !T(r[iM]).toLowerCase().includes(q)) return;
    let g = by[mo]; if(!g){ g = by[mo] = { mo, rows: [] }; G.push(g); } g.rows.push(r); });
  if(!G.length){ box.innerHTML = `<div class="py-list"><div class="py-empty">${q ? 'Nothing in the history for “' + esc(q) + '”' : 'No history yet'}</div></div>`; return; }
  const show = q ? G : G.slice(0, 12);
  box.innerHTML = show.map((g, k) => { const t = g.rows.reduce((a, r) => a + num(r[iNet]), 0), pd = g.rows.filter(r => /paid/i.test(r[iS])).length, all = pd === g.rows.length;
    return `<details class="py-h"${k === 0 || q ? ' open' : ''}><summary><div><b>${esc(g.mo)}</b><br><small>${g.rows.length} teacher${g.rows.length === 1 ? '' : 's'}</small></div>
      <small class="s"><span class="py-pill ${all ? 'ok' : ''}">${all ? 'All paid' : pd + ' paid · ' + (g.rows.length - pd) + ' pending'}</span></small><span class="t">${peso(t)}</span><span class="chev">›</span></summary>
      <table>${g.rows.map(r => { const n = num(r[iNet]), pdR = /paid/i.test(r[iS]);
        return `<tr><td>${hi(T(r[iN]), q)}</td><td class="r ${n < 0 ? 'neg' : ''}"><b>${plNet(r[iNet])}</b></td><td class="r">${pdR ? `<span class="py-pill ok">Paid${T(r[iD]) ? ' · ' + esc(day(r[iD])) : ''}</span>` : `<span class="py-pill">${esc(T(r[iS]) || '—')}</span>`}</td></tr>`; }).join('')}</table></details>`; }).join('')
    + (!q && G.length > show.length ? `<div class="small mute" style="margin-top:10px">Showing the latest ${show.length} months · search to find older ones</div>` : '');
};
try{ if(VIEW === 'payroll') renderPayroll(); }catch(e){}
})();
