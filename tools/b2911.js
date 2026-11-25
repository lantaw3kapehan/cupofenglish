<script id="b2911">
/* 2911 (Misty 25 Nov 15:51) management only:
   1. Deadlines: payroll, government dues, monthly feedback, memos, trainings, holidays and package expiries on one month calendar.
   2. Families: one page per family (siblings joined by a shared package or one WeChat family group) with children, packages,
      payments, reports and the parent's requests together.
   Data: coe-act ops deadlines / famlinks / family (management only). Teachers never see either screen. */
(function(){
  const mgr = () => !!(typeof D !== 'undefined' && D && D.mgr);
  const E = s => (typeof esc === 'function' ? esc(s) : String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  const API = o => fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-act', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, o)) }).then(r => r.json()).then(r => { if(!r || !r.ok) throw new Error((r && r.error) || 'Not loaded'); return r; });
  const MN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MS3 = MN.map(m => m.slice(0, 3));
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const dLong = d => { const t = new Date(d + 'T00:00:00Z'); return t.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }); };
  const dShort = d => { if(!d) return ''; const t = new Date(String(d).slice(0, 10) + 'T00:00:00Z'); return isNaN(t) ? '' : t.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }); };
  const hm = iso => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(11, 16);
  const dOf = iso => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(0, 10);
  const addM = (m, n) => { const y = +m.slice(0, 4), mo = +m.slice(5, 7) - 1 + n; const d = new Date(Date.UTC(y, mo, 1)); return d.toISOString().slice(0, 7); };
  const money = (n, c) => (c && c !== 'PHP' ? (c === 'CNY' ? '¥' : c + ' ') : '₱') + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const SV = d => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const IC = {
    cal: SV('<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    fam: SV('<circle cx="8" cy="8" r="3"/><circle cx="17" cy="9.5" r="2.4"/><path d="M2.8 19.5c.6-3.2 2.7-5 5.2-5s4.6 1.8 5.2 5M13.6 19.5c.4-2.5 1.8-3.9 3.4-3.9s3 1.4 3.4 3.9"/>'),
    l: SV('<path d="M15 6l-6 6 6 6"/>'), r: SV('<path d="M9 6l6 6-6 6"/>')
  };
  const KIND = {
    pay:  { l: 'Payroll', c: '#2F2752', bg: '#EEEDF5' },
    gov:  { l: 'Government', c: '#8A4B0F', bg: '#FCF1E3' },
    fb:   { l: 'Feedback', c: '#0E6F68', bg: '#E6F6F7' },
    memo: { l: 'Memos', c: '#3C3489', bg: '#EEEDFE' },
    tr:   { l: 'Trainings', c: '#1D7A52', bg: '#E3F4EC' },
    hol:  { l: 'Holidays', c: '#B4472F', bg: '#FCECE7' },
    pkg:  { l: 'Packages', c: '#5E5A76', bg: '#F1F0F5' }
  };
  const sv = d => '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const KI = {
    pay: sv('<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>'),
    gov: sv('<path d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3.5 20h17"/>'),
    fb:  sv('<path d="M7 3.5h7l4.5 4.5V20a.5.5 0 0 1-.5.5H7a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 7 3.5z"/><path d="M14 3.5V8h4.5M9 12.5h6M9 16h4"/>'),
    memo: sv('<path d="M4 10v4h3l6 4V6L7 10H4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>'),
    tr:  sv('<path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11v4.5c1.5 1.3 3.2 2 5 2s3.5-.7 5-2V11M21 9v5"/>'),
    hol: sv('<path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5"/>'),
    pkg: sv('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>')
  };
  const ico = k => '<span class="x11-ic" style="background:' + KIND[k].bg + ';color:' + KIND[k].c + '">' + KI[k] + '</span>';
  const PAL = [['#E6F6F7', '#0E6F68'], ['#EEEDFE', '#3C3489'], ['#FCF1E3', '#8A4B0F'], ['#E3F4EC', '#1D7A52'], ['#FCECE7', '#B4472F'], ['#EEEDF5', '#2F2752']];
  const av = (n, big) => { const t = String(n || '?'), h = [...t].reduce((a, c) => a + c.charCodeAt(0), 0), p = PAL[h % PAL.length]; return '<span class="x11-av' + (big ? ' big' : '') + '" style="background:' + p[0] + ';color:' + p[1] + '">' + E(t.trim().charAt(0).toUpperCase()) + '</span>'; };

  /* menu: Today › Deadlines, People › Families */
  try{
    ICON.dl2911 = IC.cal; ICON.fam2911 = IC.fam;
    if(!NAV_M.some(x => x[0] === 'mcal')){ const i = NAV_M.findIndex(x => x[0] === 'schedule'); NAV_M.splice(i > -1 ? i + 1 : 0, 0, ['mcal', 'Deadlines', 'dl2911', 0, 'Today']); }
    if(!NAV_M.some(x => x[0] === 'families')){ const i = NAV_M.findIndex(x => x[0] === 'astudents'); NAV_M.splice(i > -1 ? i + 1 : 0, 0, ['families', 'Families', 'fam2911', 0, 'People']); }
    ['mcal', 'families'].forEach(v => { if(VIEWS.indexOf(v) < 0) VIEWS.push(v); if(!document.getElementById('v-' + v)){ const d = document.createElement('div'); d.id = 'v-' + v; d.className = 'hide'; const ref = document.getElementById('v-more'); ref.parentNode.insertBefore(d, ref); } });
    if(typeof buildNav === 'function' && typeof D !== 'undefined' && D) buildNav();
  }catch(e){ console.warn('2911 nav', e); }

  const css = document.createElement('style'); css.id = 's2911'; css.textContent = [
    'body:not(.role-t) #navIn > [data-v="mcal"]{order:3}body:not(.role-t) #navIn > [data-v="families"]{order:11}',
    '.x11-h{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 16px}.x11-h h1{margin:0}.x11-sub{color:#6F6B85;font-size:14px;margin-top:4px}',
    '.x11-nav{display:flex;align-items:center;gap:6px}.x11-nav b{min-width:150px;text-align:center;font-size:16px;color:#2F2752}',
    '.x11-ib{width:36px;height:36px;border-radius:10px;border:1px solid #E4E2EC;background:#fff;color:#2F2752;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0}',
    '.x11-ib:hover{border-color:#01B0BF}.x11-tb{height:36px;border-radius:10px;border:1px solid #E4E2EC;background:#fff;color:#2F2752;font-weight:600;padding:0 12px;cursor:pointer;font-size:13.5px}',
    '.x11-chips{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}.x11-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #E4E2EC;background:#fff;border-radius:999px;padding:5px 11px;font-size:13px;color:#3B3757;cursor:pointer;font-weight:600}',
    '.x11-chip i{width:8px;height:8px;border-radius:50%;display:inline-block}.x11-chip.off{opacity:.45}#v-families .x11-chip.off{opacity:1;color:#6F6B85;font-weight:500}#v-families .x11-chip:not(.off){background:#2F2752;border-color:#2F2752;color:#fff}#v-families .x11-chip:not(.off) small{color:#C9C5E0}.x11-chip small{color:#8A879C;font-weight:500}',
    '.x11-wrap{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:16px;align-items:start}',
    '.x11-card{background:#fff;border:1px solid #ECEAF1;border-radius:18px;padding:14px 16px}',
    '.x11-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-top:1px solid #F1F0F5;border-left:1px solid #F1F0F5;border-radius:12px;overflow:hidden}',
    '.x11-dw{font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#8A879C;padding:6px 8px;border-right:1px solid #F1F0F5;border-bottom:1px solid #F1F0F5;background:#FAFAFC}',
    '.x11-d{min-height:104px;padding:6px 6px 8px;border-right:1px solid #F1F0F5;border-bottom:1px solid #F1F0F5;cursor:pointer;display:flex;flex-direction:column;gap:3px;min-width:0}',
    '.x11-d:hover{background:#F7FCFD}.x11-d.we{background:#FCFCFE}.x11-d.past .x11-n{color:#B5B2C3}.x11-d.past .x11-p{opacity:.6}.x11-d.x11-o{background:#FBFBFD;cursor:default}.x11-d.sel{box-shadow:inset 0 0 0 2px #01B0BF}',
    '.x11-n{font-size:13px;font-weight:700;color:#3B3757;display:flex;justify-content:space-between;align-items:center}.x11-d.t .x11-n span{background:#2F2752;color:#fff;border-radius:999px;min-width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;padding:0 6px}',
    '.x11-p{font-size:11.5px;line-height:1.3;border-radius:7px;padding:3px 7px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-weight:600}',
    '.x11-p.done{opacity:.55;text-decoration:line-through}.x11-p.late{box-shadow:inset 0 0 0 1.5px #E2876F}.x11-more{font-size:11.5px;color:#6F6B85;padding-left:4px}',
    '.x11-side h2{font-size:16px;margin:0 0 2px;color:#2F2752}.x11-side .x11-sub{margin:0 0 10px;font-size:13px}',
    '.x11-it{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:11px;padding:9px 0;border-top:1px solid #F4F3F8;align-items:center}.x11-it:first-of-type{border-top:0}',
    '.x11-it b{display:block;font-size:14px;color:#2F2752}.x11-it small{display:block;font-size:12.5px;color:#6F6B85;margin-top:2px}',
    '.x11-st{font-size:11px;font-weight:700;border-radius:999px;padding:2px 8px;white-space:nowrap}.x11-st.ok{background:#E3F4EC;color:#1D7A52}.x11-st.late{background:#FCECE7;color:#B4472F}.x11-st.soon{background:#FCF1E3;color:#8A4B0F}',
    '.x11-day{font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#8A879C;margin:14px 0 2px}.x11-day:first-child{margin-top:0}',
    '.x11-empty{color:#8A879C;font-size:13.5px;padding:10px 0}',
    '.x11-skel{height:90px;border-radius:14px;background:linear-gradient(90deg,#F4F3F8,#FAFAFC,#F4F3F8);background-size:200% 100%;animation:x11 1.2s infinite;margin-bottom:10px}@keyframes x11{to{background-position:-200% 0}}',
    /* families */
    '.x11-fw{display:grid;grid-template-columns:360px minmax(0,1fr);gap:16px;align-items:start}',
    '.x11-q{width:100%;height:40px;border:1px solid #E4E2EC;border-radius:12px;padding:0 12px;font-size:14px;box-sizing:border-box;margin-bottom:10px}',
    '.x11-fl{max-height:calc(100vh - 250px);overflow:auto;margin:0 -6px;padding:0 6px}',
    '.x11-f{display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:#fff;border:1px solid #ECEAF1;border-radius:14px;padding:11px 13px;margin-bottom:8px;cursor:pointer;font:inherit;color:inherit}',
    '.x11-f:hover{border-color:#B9E8EC}.x11-f.on{border-color:#01B0BF;box-shadow:0 0 0 1px #01B0BF}',
    '.x11-fm{flex:1;min-width:0}.x11-fm b,.x11-fm small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.x11-f b{font-size:14.5px;color:#2F2752}.x11-f small{color:#6F6B85;font-size:12.5px;margin-top:2px}.x11-fu{text-align:right;flex:none}.x11-fu b{font-variant-numeric:tabular-nums}.x11-fu small{display:block;font-size:11px}',
    '.x11-tag{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:1px 7px;margin-left:6px;vertical-align:1px;background:#E6F6F7;color:#0E6F68}.x11-tag.g{background:#EEEDFE;color:#3C3489}',
    '.x11-kids{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin:12px 0 4px}',
    '.x11-kid{border:1px solid #ECEAF1;border-radius:14px;padding:12px 14px;background:#FCFCFE;cursor:pointer}.x11-kid:hover{border-color:#01B0BF}',
    '.x11-kid b{font-size:15px;color:#2F2752}.x11-kid .cn{color:#6F6B85;font-weight:500;margin-left:4px}.x11-kid small{display:block;color:#6F6B85;font-size:12.5px;margin-top:3px}',
    '.x11-kid .big{font-size:22px;font-weight:700;color:#2F2752;margin-top:8px;font-variant-numeric:tabular-nums}.x11-kid .big span{font-size:12.5px;font-weight:500;color:#6F6B85;margin-left:4px}',
    '.x11-sec{margin-top:16px}.x11-sec h3{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A879C;margin:0 0 6px;font-weight:700}',
    '.x11-tr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 12px;padding:9px 0;border-top:1px solid #F4F3F8;font-size:13.5px;align-items:center}.x11-tr > div:first-child{grid-column:1;grid-row:1}.x11-tr > span{grid-column:1;grid-row:2;font-size:12.5px}.x11-tr .v{grid-column:2;grid-row:1 / span 2}.x11-tr:first-of-type{border-top:0}',
    '.x11-tr b{color:#2F2752;font-weight:600}.x11-tr span{color:#6F6B85}.x11-tr .v{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;color:#3B3757}',
    '.x11-msg{border-top:1px solid #F4F3F8;padding:9px 0;font-size:13.5px}.x11-msg:first-of-type{border-top:0}.x11-msg small{display:block;color:#8A879C;font-size:12px;margin-bottom:2px}',
    '.x11-msg div{color:#3B3757;line-height:1.45}',
    '.x11-ic{width:30px;height:30px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;flex:none}',
    '.x11-av{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex:none;box-shadow:0 0 0 2px #fff}.x11-av.big{width:44px;height:44px;font-size:18px}',
    '.x11-avs{display:inline-flex;flex:none}.x11-avs .x11-av + .x11-av{margin-left:-8px}',
    '.x11-k{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0 0 14px}',
    '.x11-t{background:#fff;border:1px solid #ECEAF1;border-radius:16px;padding:14px 16px;min-width:0}',
    '.x11-t > span{display:block;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:#8A879C}',
    '.x11-t b{display:block;font-size:26px;line-height:1.15;color:#2F2752;margin:6px 0 2px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.x11-t b.sm{font-size:16px;margin:8px 0 4px}',
    '.x11-t small{display:block;font-size:12.5px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.x11-t.warn{border-color:#F3C9BD;background:#FFF9F7}.x11-t.warn b{color:#B4472F}',
    '.x11-sh{display:flex;align-items:center;gap:10px;margin:0 0 6px}.x11-sh h3{margin:0}',
    '.x11-low{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px;background:#FCF1E3;color:#8A4B0F;margin-left:6px;vertical-align:2px}',
    '.x11-fn{font-size:21px;font-weight:700;color:#2F2752;line-height:1.2}',
    '.x11-back{display:none;align-items:center;gap:4px}.x11-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:0 16px;align-items:start}',
    '@media(max-width:899px){.x11-wrap,.x11-fw,.x11-two{grid-template-columns:minmax(0,1fr)}.x11-grid{display:none}.x11-hideph{display:none}.x11-k{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px}.x11-t b{font-size:22px}#v-mcal .x11-chips{flex-wrap:nowrap;overflow-x:auto;margin-right:-16px;padding-right:16px;scrollbar-width:none}#v-mcal .x11-chip{flex:none}.x11-nav b{min-width:0;font-size:15px}',
    '#v-families.det .x11-fcol{display:none}#v-families:not(.det) .x11-dcol{display:none}.x11-back{display:inline-flex}.x11-fl{max-height:none}}'
  ].join(''); document.head.appendChild(css);

  /* ---------------- Deadlines ---------------- */
  const C = { m: today().slice(0, 7), r: {}, err: '', busy: {}, sel: null, off: (() => { try{ return JSON.parse(localStorage.getItem('coe.dl2911') || '{}'); }catch(e){ return {}; } })() };
  function items(m){
    const r = C.r[m] || {}, L = [], t = today();
    const add = (day, kind, title, sub, x) => { if(day && day.slice(0, 7) === m) L.push(Object.assign({ day, kind, title, sub: sub || '' }, x || {})); };
    const pm = MN[+addM(m, -1).slice(5, 7) - 1], tm = MN[+m.slice(5, 7) - 1];
    add(m + '-01', 'pay', 'Teachers check their pay', pm + ' pay opens for checking', { s: 'Pay check opens' });
    add(m + '-09', 'pay', 'Pay day', pm + ' salaries', { due: 1, s: 'Pay day' });
    add(m + '-09', 'fb', 'Monthly feedback due', pm + ' reports to parents', { due: 1, s: 'Feedback due' });
    add(m + '-25', 'fb', 'Monthly feedback opens', tm + ' reports', { s: 'Feedback opens' });
    if(m.slice(5, 7) === '12') add(m + '-24', 'pay', '13th month pay', 'By 24 December', { due: 1, s: '13th month' });
    const g = (r.gov || [])[0];
    if(g) add(g.due, 'gov', 'Government dues', (g.amount ? '₱' + Number(g.amount).toLocaleString('en-US') + ' · ' : '') + 'SSS, Pag-IBIG, PhilHealth, BIR', { due: 1, done: !!g.paid, paidOn: g.paid, s: 'Gov dues' });
    else add(m + '-15', 'gov', 'Government dues', 'SSS, Pag-IBIG, PhilHealth, BIR', { due: 1, s: 'Gov dues' });
    if(r.sunbonus) add(r.sunbonus, 'pay', 'Sunday class incentive starts', 'First Sunday counted', { s: 'Sunday incentive' });
    (r.memos || []).forEach(x => add(x.day, 'memo', 'Memo sent', x.subject, { s: 'Memo' }));
    (r.trainings || []).forEach(x => add(dOf(x.at), 'tr', x.title || 'Training', hm(x.at) + (x.mins ? ' · ' + x.mins + ' min' : '') + (x.who ? ' · ' + x.who : '') + (x.invited && x.invited.length ? ' · ' + x.invited.length + ' invited' : '')));
    (window.CN2195 || []).forEach(h => { let a = h.a, b = h.b || h.a; for(let d = a; d <= b; d = new Date(Date.parse(d + 'T00:00:00Z') + 864e5).toISOString().slice(0, 10)){ add(d, 'hol', h.n, (h.k === 'h' ? 'Holiday in China' : 'China') + (h.t ? ' · ' + h.t : '')); if(d === b) break; } });
    (r.expiries || []).forEach(x => add(x.day, 'pkg', x.name + ' · package ends', x.code + (x.teachers && x.teachers.length ? ' · ' + x.teachers.join(', ') : '') + (x.status ? ' · ' + x.status : ''), { code: x.code, s: x.name + ' ends' }));
    L.forEach(x => { if(x.done) x.st = ['ok', 'Paid ' + dShort(x.paidOn).replace(/ \d{4}$/, '')]; else if(x.kind === 'gov' && x.day < t) x.st = ['late', 'Not recorded']; else if(x.due && (Date.parse(x.day) - Date.parse(t)) / 864e5 <= 5) x.st = ['soon', 'Soon']; });
    const ord = { pay: 0, gov: 1, fb: 2, tr: 3, memo: 4, pkg: 5, hol: 6 };
    return L.sort((a, b) => a.day.localeCompare(b.day) || ord[a.kind] - ord[b.kind]);
  }
  async function loadM(m){ if(C.busy[m] || C.r[m]) return; C.busy[m] = 1; try{ C.r[m] = await API({ op: 'deadlines', month: m }); C.err = ''; }catch(e){ C.err = String(e.message || e); } finally { C.busy[m] = 0; } if(VIEW === 'mcal') paintC(); }
  const pill = x => { const k = KIND[x.kind]; return '<div class="x11-p' + (x.done ? ' done' : '') + (x.st && x.st[0] === 'late' ? ' late' : '') + '" style="background:' + k.bg + ';color:' + k.c + '" title="' + E(x.title + ' · ' + x.sub) + '">' + E(x.s || x.title) + '</div>'; };
  const row = x => { return '<div class="x11-it"' + (x.code ? ' style="cursor:pointer" onclick="openStudent(\'' + E(x.code) + '\')"' : '') + '>' + ico(x.kind) + '<div><b>' + E(x.title) + '</b><small>' + E(x.sub) + '</small></div>' + (x.st ? '<span class="x11-st ' + x.st[0] + '">' + E(x.st[1]) + '</span>' : '<span></span>') + '</div>'; };
  function paintC(){
    const v = document.getElementById('v-mcal'); if(!v) return; const m = C.m, t = today(), r = C.r[m];
    const all = r ? items(m) : [], L = all.filter(x => !C.off[x.kind]);
    let h = '<div class="x11-h"><div><h1>Deadlines</h1><div class="x11-sub">Pay, dues, reports, memos, trainings, holidays and package ends in one month</div></div>'
      + '<div class="x11-nav"><button class="x11-ib" onclick="dl2911.mv(-1)" aria-label="Previous month">' + IC.l + '</button><b>' + MN[+m.slice(5, 7) - 1] + ' ' + m.slice(0, 4) + '</b><button class="x11-ib" onclick="dl2911.mv(1)" aria-label="Next month">' + IC.r + '</button>'
      + (m !== t.slice(0, 7) ? '<button class="x11-tb" onclick="dl2911.mv(0)">This month</button>' : '') + '</div></div>';
    h += '<div class="x11-chips">' + Object.keys(KIND).map(k => { const n = all.filter(x => x.kind === k).length; return '<button class="x11-chip' + (C.off[k] ? ' off' : '') + '" onclick="dl2911.tg(\'' + k + '\')"><i style="background:' + KIND[k].c + '"></i>' + KIND[k].l + ' <small>' + n + '</small></button>'; }).join('') + '</div>';
    if(!r){ v.innerHTML = h + (C.err ? '<div class="x11-card x11-empty">Could not load. ' + E(C.err) + ' <button class="x11-tb" onclick="dl2911.re()">Try again</button></div>' : '<div class="x11-skel" style="height:420px"></div>'); return; }
    const by = {}; L.forEach(x => (by[x.day] = by[x.day] || []).push(x));
    { const late = all.filter(x => x.st && x.st[0] === 'late'), nx = all.filter(x => x.day >= t && x.due && !x.done)[0] || (m === t.slice(0, 7) ? items(addM(m, 1)).filter(x => x.due && !x.done)[0] : null), pk = all.filter(x => x.kind === 'pkg');
      h = h.replace('<div class="x11-chips">', '<div class="x11-k"><div class="x11-t' + (late.length ? ' warn' : '') + '"><span>Needs you</span><b>' + late.length + '</b><small>' + (late.length ? E(late.map(x => x.title).join(', ')) : 'Nothing past and undone') + '</small></div>'
        + '<div class="x11-t"><span>Next deadline</span><b class="sm">' + (nx ? E(nx.title) : 'None this month') + '</b><small>' + (nx ? (nx.day === t ? 'Today' : dLong(nx.day)) + ' · ' + E(nx.sub) : '&nbsp;') + '</small></div>'
        + '<div class="x11-t"><span>Packages ending</span><b>' + pk.length + '</b><small>' + (pk.length ? E(pk.slice(0, 3).map(x => x.s.replace(/ ends$/, '')).join(', ')) + (pk.length > 3 ? ' and ' + (pk.length - 3) + ' more' : '') : 'None this month') + '</small></div>'
        + '<div class="x11-t"><span>Trainings and holidays</span><b>' + all.filter(x => x.kind === 'tr' || x.kind === 'hol').length + '</b><small>' + all.filter(x => x.kind === 'tr').length + ' training · ' + all.filter(x => x.kind === 'hol').length + ' holiday days</small></div></div><div class="x11-chips">'); }
    const y = +m.slice(0, 4), mo = +m.slice(5, 7) - 1, first = new Date(Date.UTC(y, mo, 1)), lead = (first.getUTCDay() + 6) % 7, nd = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate();
    let g = '<div class="x11-grid">' + ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => '<div class="x11-dw">' + d + '</div>').join('');
    const cells = Math.ceil((lead + nd) / 7) * 7;
    for(let i = 0; i < cells; i++){ const dn = i - lead + 1; if(dn < 1 || dn > nd){ g += '<div class="x11-d x11-o"></div>'; continue; }
      const d = m + '-' + String(dn).padStart(2, '0'), X = by[d] || [];
      const wd = (lead + dn - 1) % 7; g += '<div class="x11-d' + (d === t ? ' t' : '') + (d < t ? ' past' : '') + (wd > 4 ? ' we' : '') + (d === C.sel ? ' sel' : '') + '" onclick="dl2911.pick(\'' + d + '\')"><div class="x11-n"><span>' + dn + '</span></div>' + X.slice(0, 3).map(pill).join('') + (X.length > 3 ? '<div class="x11-more">+' + (X.length - 3) + ' more</div>' : '') + '</div>'; }
    g += '</div>';
    /* side: chosen day, or what is next */
    let s = '';
    if(C.sel && C.sel.slice(0, 7) === m){ const X = by[C.sel] || []; s = '<h2>' + dLong(C.sel) + '</h2><div class="x11-sub">' + (X.length ? X.length + (X.length === 1 ? ' item' : ' items') : 'Nothing due') + ' · <a style="cursor:pointer;color:#0E6F68" onclick="dl2911.pick(null)">Show the month</a></div>' + X.map(row).join(''); }
    else { const from = m === t.slice(0, 7) ? t : m + '-01', U = L.filter(x => x.day >= from), late = L.filter(x => x.st && x.st[0] === 'late');
      s = '<h2>' + (m === t.slice(0, 7) ? 'Coming up' : 'This month') + '</h2><div class="x11-sub">' + (late.length ? late.length + ' past and not done' : 'Tap a day to see it') + '</div>';
      if(late.length) s += '<div class="x11-day">Needs you</div>' + late.map(row).join('');
      let last = ''; U.filter(x => !(x.st && x.st[0] === 'late')).forEach(x => { if(x.day !== last){ s += '<div class="x11-day">' + (x.day === t ? 'Today' : dLong(x.day)) + '</div>'; last = x.day; } s += row(x); });
      if(!U.length && !late.length) s += '<div class="x11-empty">Nothing else this month.</div>'; }
    v.innerHTML = h + '<div class="x11-wrap"><div class="x11-card x11-hideph" style="padding:12px">' + g + '</div><div class="x11-card x11-side">' + s + '</div></div>';
  }
  window.dl2911 = {
    mv(n){ C.m = n ? addM(C.m, n) : today().slice(0, 7); C.sel = null; paintC(); loadM(C.m); },
    tg(k){ C.off[k] = !C.off[k]; try{ localStorage.setItem('coe.dl2911', JSON.stringify(C.off)); }catch(e){} paintC(); },
    pick(d){ C.sel = d; paintC(); }, re(){ C.err = ''; delete C.r[C.m]; paintC(); loadM(C.m); }
  };

  /* ---------------- Families ---------------- */
  const F = { links: null, list: null, q: '', f: 'all', sel: null, d: {}, err: '' };
  async function stu(){ if(typeof MS !== 'undefined' && MS && MS.length) return MS; const r = await api('mgmtStudents', TOKEN); if(Array.isArray(r)){ try{ MS = r; }catch(e){} return r; } return (r && (r.rows || r.list)) || []; }
  async function loadF(){
    try{ const [S, L] = await Promise.all([stu(), F.links ? Promise.resolve({ links: F.links }) : API({ op: 'famlinks' })]); F.links = L.links;
      const P = {}, up = c => String(c || '').toUpperCase(), find = x => { while(P[x] && P[x] !== x){ P[x] = P[P[x]] || P[x]; x = P[x]; } return x; };
      const by = {}; S.forEach(s => { const c = up(s.code); by[c] = s; P[c] = P[c] || c; });
      F.links.forEach(([a, b]) => { if(!by[a] || !by[b]) return; const ra = find(a), rb = find(b); if(ra !== rb) P[rb] = ra; });
      const G = {}; Object.keys(by).forEach(c => (G[find(c)] = G[find(c)] || []).push(by[c]));
      F.list = Object.values(G).map(K => { K.sort((a, b) => String(a.code).localeCompare(String(b.code))); const T = [...new Set(K.flatMap(k => (k.teachers || [])))];
        return { id: up(K[0].code), kids: K, teachers: T, name: K.map(k => k.name).join(' & '), left: K.reduce((n, k) => n + (+k.left || 0), 0) }; })
        .sort((a, b) => (b.kids.length - a.kids.length) || a.name.localeCompare(b.name));
      F.err = ''; }catch(e){ F.err = String(e.message || e); }
    if(VIEW === 'families') paintF();
  }
  async function loadD(id){ const f = (F.list || []).find(x => x.id === id); if(!f || F.d[id]) return; F.d[id] = { busy: 1 };
    try{ F.d[id] = await API({ op: 'family', codes: f.kids.map(k => k.code) }); }catch(e){ F.d[id] = { err: String(e.message || e) }; }
    if(VIEW === 'families' && F.sel === id) paintF(); }
  function famDet(f){
    const d = F.d[f.id] || {}, nm = c => (f.kids.find(k => String(k.code).toUpperCase() === String(c).toUpperCase()) || {}).name || c;
    let h = '<button class="x11-tb x11-back" style="margin-bottom:10px" onclick="fam2911.back()">' + IC.l + ' All families</button>';
    const nexts = f.kids.map(k => d.next && d.next[String(k.code).toUpperCase()]).filter(Boolean).sort((a, b) => a.at.localeCompare(b.at)), pays = (d.payments || []), cur = {}; pays.forEach(p => { cur[p.currency || 'PHP'] = (cur[p.currency || 'PHP'] || 0) + (+p.total || 0); });
    const src = [...new Set((d.packages || []).map(p => p.source).filter(Boolean))];
    h += '<div class="x11-card"><div style="display:flex;align-items:center;gap:14px"><span class="x11-avs">' + f.kids.slice(0, 3).map(k => av(k.name, 1)).join('') + '</span><div style="min-width:0"><div class="x11-fn">' + E(f.name) + '</div><div class="x11-sub" style="margin:2px 0 0">' + (f.kids.length > 1 ? f.kids.length + ' children' : '1 child') + ' · ' + E(f.teachers.join(', ') || 'No teacher yet') + (src.length ? ' · ' + E(src.join(', ')) : '') + '</div></div></div>';
    if(d.packages) h += '<div class="x11-k" style="margin:16px 0 4px"><div class="x11-t"><span>Units left</span><b>' + f.left.toLocaleString('en-US') + '</b><small>' + f.kids.map(k => E(k.name) + ' ' + (k.left == null ? '–' : (+k.left).toLocaleString('en-US'))).join(' · ') + '</small></div>'
      + '<div class="x11-t"><span>Next class</span><b class="sm">' + (nexts[0] ? dLong(dOf(nexts[0].at)) + ' ' + hm(nexts[0].at) : 'None booked') + '</b><small>' + (nexts[0] ? 'with ' + E(String(nexts[0].t || '').replace(/^./, c => c.toUpperCase())) : '&nbsp;') + '</small></div>'
      + '<div class="x11-t"><span>Paid</span><b class="sm">' + (Object.keys(cur).length ? Object.keys(cur).map(c => money(cur[c], c)).join(' + ') : 'None recorded') + '</b><small>' + pays.length + (pays.length === 1 ? ' payment' : ' payments') + (pays[0] ? ' · last ' + dShort(pays[0].day) : '') + '</small></div>'
      + '<div class="x11-t"><span>Parent requests</span><b>' + (d.asks ? d.asks.length : 0) + '</b><small>Last 4 months</small></div></div>';
    h += '<div class="x11-kids">' + f.kids.map(k => { const nx = d.next && d.next[String(k.code).toUpperCase()]; return '<div class="x11-kid" onclick="openStudent(\'' + E(k.code) + '\')"><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">' + av(k.name) + '<div style="min-width:0"><b>' + E(k.name) + '</b><span class="cn">' + E(k.cn || '') + '</span>' + (k.left != null && +k.left <= 8 ? '<span class="x11-low">Renew soon</span>' : '') + '</div></div><small>' + E(k.code) + ' · ' + E((k.teachers || []).join(', ')) + (k.book ? ' · ' + E(k.book) : '') + '</small><div class="big">' + (k.left == null ? '–' : (+k.left).toLocaleString('en-US')) + '<span>units left</span></div><small>' + (nx ? 'Next class ' + dLong(dOf(nx.at)) + ' ' + hm(nx.at) : 'No class booked') + '</small></div>'; }).join('') + '</div></div>';
    if(d.busy || !d.packages && !d.err) return h + '<div class="x11-skel" style="margin-top:12px"></div><div class="x11-skel"></div>';
    if(d.err) return h + '<div class="x11-card x11-empty" style="margin-top:12px">Could not load. ' + E(d.err) + '</div>';
    const SI = { Packages: 'pkg', Payments: 'pay', Reports: 'fb', 'Parent requests': 'memo' };
    const sec = (t, body, n) => '<div class="x11-card x11-sec"><div class="x11-sh">' + ico(SI[t]) + '<h3>' + t + (n != null ? ' · ' + n : '') + '</h3></div>' + (body || '<div class="x11-empty">None yet.</div>') + '</div>';
    const pk = (d.packages || []).map(p => '<div class="x11-tr"><div><b>' + E(nm(p.code)) + '</b> ' + (p.active ? '<span class="x11-tag">Active</span>' : '<span class="x11-tag g">Ended</span>') + (p.shared ? '<span class="x11-tag g">Shared</span>' : '') + '</div><span>' + E([p.teacher, p.source, p.course].filter(Boolean).join(' · ')) + '</span><div class="v">' + (p.buy ? dShort(p.buy) : '') + (p.deadline ? ' – ' + dShort(p.deadline) : '') + '</div></div>').join('');
    const pay = (d.payments || []).map(p => { const it = (p.items || []).filter(i => +i.amt > 0).map(i => i.name).join(', '); return '<div class="x11-tr"><div><b>' + dShort(p.day) + '</b> · ' + E(nm(p.code)) + '</div><span>' + E([it, p.method, p.partner && p.partner !== 'CupOfEnglish' ? p.partner : ''].filter(Boolean).join(' · ')) + '</span><div class="v">' + money(p.total, p.currency) + '</div></div>'; }).join('');
    const rep = (d.reports || []).map(p => '<div class="x11-tr"><div><b>' + E(String(p.month || '').slice(0, 7).replace(/^(\d{4})-(\d{2})$/, (a, y, mo) => MN[+mo - 1] + ' ' + y)) + '</b> · ' + E(nm(p.code)) + '</div><span>Monthly feedback · ' + E(p.teacher || '') + '</span><div class="v">' + (p.total != null ? E(p.total) : '') + '</div></div>').join('')
      + (d.trials || []).map(p => '<div class="x11-tr"><div><b>' + dShort(p.trial_date) + '</b> · ' + E(p.student || nm(p.student_code)) + '</div><span>Trial report · ' + E(p.teacher || '') + (p.cefr_teacher ? ' · ' + E(p.cefr_teacher) : '') + '</span><div class="v">' + (p.pdf ? '<a href="' + E(p.pdf) + '" target="_blank" rel="noopener" style="color:#0E6F68;font-weight:600">Open</a>' : '') + '</div></div>').join('');
    const msg = (d.asks || []).map(p => { const w = String(p.why || '').replace(/\s*·\s*(CupOfEnglish|Celine|Misty)[^·]*·\s*[A-Z][a-z]{2} \d{1,2}\s*$/, '').replace(/\s*-?\s*From (the )?par(ent)?\s*/i, ' ').replace(/[\s·]+$/, '').trim(); return '<div class="x11-msg"><small>' + dLong(dOf(p.at)) + ' ' + hm(p.at) + ' · ' + E(p.student) + ' with ' + E(String(p.t || '').replace(/^./, c => c.toUpperCase())) + (p.n > 1 ? ' · ' + p.n + ' classes' : '') + '</small><div>' + E(w || 'Cancelled at the parent\'s request') + '</div></div>'; }).join('');
    return h + '<div class="x11-two">' + '<div>' + sec('Packages', pk, (d.packages || []).length) + sec('Payments', pay, (d.payments || []).length) + '</div><div>' + sec('Reports', rep, (d.reports || []).length + (d.trials || []).length) + sec('Parent requests', msg, (d.asks || []).length) + '</div></div>';
  }
  function paintF(){
    const v = document.getElementById('v-families'); if(!v) return; v.classList.toggle('det', !!F.sel);
    let h = '<div class="x11-h"><div><h1>Families</h1><div class="x11-sub">Each family on one page: children, packages, payments, reports and the parent\'s requests</div></div></div>';
    if(!F.list){ v.innerHTML = h + (F.err ? '<div class="x11-card x11-empty">Could not load. ' + E(F.err) + '</div>' : '<div class="x11-skel"></div><div class="x11-skel"></div>'); return; }
    const sib = F.list.filter(f => f.kids.length > 1), multi = F.list.filter(f => f.teachers.length > 1), q = F.q.trim().toLowerCase();
    let L = F.f === 'sib' ? sib : F.f === 'multi' ? multi : F.list;
    if(q) L = L.filter(f => f.kids.some(k => [k.name, k.cn, k.code].concat(k.teachers || []).join(' ').toLowerCase().includes(q)));
    if(!F.sel && window.innerWidth >= 900 && L.length) F.sel = L[0].id;
    const fl = '<div class="x11-chips">' + [['all', 'All', F.list.length], ['sib', 'Siblings', sib.length], ['multi', 'Several teachers', multi.length]].map(([k, l, n]) => '<button class="x11-chip' + (F.f === k ? '' : ' off') + '" onclick="fam2911.f(\'' + k + '\')">' + l + ' <small>' + n + '</small></button>').join('') + '</div>';
    const list = L.map(f => '<button class="x11-f' + (f.id === F.sel ? ' on' : '') + '" onclick="fam2911.open(\'' + f.id + '\')"><span class="x11-avs">' + f.kids.slice(0, 3).map(k => av(k.name)).join('') + '</span><span class="x11-fm"><b>' + E(f.name) + '</b><small>' + E(f.teachers.join(', ') || 'No teacher') + '</small></span><span class="x11-fu"><b>' + f.left.toLocaleString('en-US') + '</b><small>units left</small></span></button>').join('') || '<div class="x11-empty">No family matches.</div>';
    const sel = F.list.find(f => f.id === F.sel);
    v.innerHTML = h + '<div class="x11-fw"><div class="x11-fcol">' + fl + '<input class="x11-q" id="q2911" placeholder="Search a child, Chinese name, code or teacher" value="' + E(F.q) + '" oninput="fam2911.q(this.value)"><div class="x11-fl">' + list + '</div></div><div class="x11-dcol">' + (sel ? famDet(sel) : '<div class="x11-card x11-empty">Choose a family.</div>') + '</div></div>';
    if(sel) loadD(sel.id);
    const qi = document.getElementById('q2911'); if(qi && F.typing){ qi.focus(); qi.setSelectionRange(qi.value.length, qi.value.length); }
  }
  window.fam2911 = {
    open(id){ F.sel = id; F.typing = 0; paintF(); if(window.innerWidth < 900) window.scrollTo(0, 0); },
    back(){ F.sel = null; paintF(); }, f(k){ F.f = k; F.typing = 0; paintF(); },
    q(s){ F.q = s; F.typing = 1; clearTimeout(F.t); F.t = setTimeout(paintF, 150); }
  };

  const _go = window.go; window.go = function(v){ if((v === 'mcal' || v === 'families') && !mgr()) v = 'today'; const r = _go.apply(this, arguments.length ? [v].concat([].slice.call(arguments, 1)) : arguments);
    try{ if(v === 'mcal'){ paintC(); loadM(C.m); } if(v === 'families'){ paintF(); if(!F.list) loadF(); } }catch(e){} return r; };
  try{ go = window.go; }catch(e){}
  (function w(){ try{ if(typeof D === 'undefined' || !D){ setTimeout(w, 800); return; } if(!mgr()) return; if(VIEW === 'mcal'){ paintC(); loadM(C.m); } if(VIEW === 'families'){ paintF(); loadF(); } }catch(e){ setTimeout(w, 1500); } })();
})();
</script>
