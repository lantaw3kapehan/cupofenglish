// 1356p (27 Oct, Misty 18:29): management "Online now" also shows the Partner portal and the Student portal.
//   Portals ping coe-portal-ping about once a minute while on screen (portal-update.js). Management reads op:'list' (mgmt session only).
//   Sections: Partners 合作伙伴 · Students & families 学生家长 — online now (green, last 3 min), earlier today, last 7 days, and "Not opened yet".
//   The header pill still counts staff; when someone is in a portal it adds a small "+N portal" after it.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  async function load(){ if(!hasD() || !D.mgr) return; try{ const j = await post('online'); if(j && j.ok){ ROWS = j.rows; NOW = Date.now(); paint(); } }catch(x){} }",
   "  let PR = null; const PV = {}, PING = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-portal-ping';\n"
 + "  async function pload(){ try{ const j = await fetch(PING, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ op: 'list', token: TOKEN }) }).then(r => r.json()); if(j && j.ok) PR = j; }catch(x){}\n"
 + "    await Promise.all(['partner', 'student'].map(k => fetch('/' + k + '/version.txt?t=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.text() : '').then(t => { t = String(t || '').trim(); if(/^[\\w.-]{1,40}$/.test(t)) PV[k] = t; }).catch(() => {}))); }\n"
 + "  async function load(){ if(!hasD() || !D.mgr) return; try{ const [j] = await Promise.all([post('online'), pload()]); if(j && j.ok){ ROWS = j.rows; NOW = Date.now(); paint(); } }catch(x){} }"],
  ["b.style.display = 'inline-flex'; b.innerHTML = '<i></i>' + n + ' online';",
   "b.style.display = 'inline-flex'; const pn = window.onlPortal ? window.onlPortal().n : 0; b.innerHTML = '<i></i>' + n + ' online' + (pn ? '<span style=\"font-weight:600;opacity:.8\">&nbsp;+' + pn + ' portal</span>' : '');"],
  ["    if(keep){ const b = document.getElementById('sheetBody'); if(b && document.getElementById('onlL')) b.innerHTML = h; return; } openSheet(h); };",
   "    const H = h + (window.onlPortal ? window.onlPortal().html : '');\n"
 + "    if(keep){ const b = document.getElementById('sheetBody'); if(b && document.getElementById('onlL')){ const op = [...b.querySelectorAll('details[data-k]')].filter(d => d.open).map(d => d.dataset.k); b.innerHTML = H; op.forEach(k => { const d = b.querySelector('details[data-k=\"' + k + '\"]'); if(d) d.open = true; }); } return; } openSheet(H); };\n"
 + "  /* portals (1356p) */\n"
 + "  const PVN = { partner: { h: 'Home', s: 'Students', t: 'Teachers', f: 'Who\\u2019s free', p: 'Payments', stu: 'A student', today: 'Today\\u2019s classes', tw: 'Teacher week' }, student: { h: 'Home', s: 'Classes', l: 'Lessons', n: 'Notes', p: 'Progress' } };\n"
 + "  const devP = d => String(d || '').split('·').filter(Boolean).map((x, i) => i ? x : x[0].toUpperCase() + x.slice(1)).join(' · ') || 'Device';\n"
 + "  const dayK = t => new Date(t).toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' }), today = () => dayK(Date.now());\n"
 + "  const when = t => (dayK(t) === today() ? '' : new Date(t).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Manila' }) + ' ') + hm(t);\n"
 + "  const pTag = (k, v) => !PV[k] ? '' : v === PV[k] ? ' · <span style=\"color:#2E9E6F\">up to date</span>' : ' · <b style=\"color:#B4532F\">old version' + (v ? ' ' + e(v) : '') + '</b>';\n"
 + "  window.onlPortal = function(){ if(!PR) return { n: 0, html: '' }; let n = 0, html = '';\n"
 + "    [['partner', 'Partners 合作伙伴', PR.partners, (PR.never || {}).partner, 'partners'], ['student', 'Students & families 学生家长', PR.students, (PR.never || {}).student, 'students']].forEach(([k, title, logins, never, noun]) => {\n"
 + "      const by = {}; (PR.rows || []).filter(r => r.kind === k).forEach(r => { (by[r.who] = by[r.who] || []).push(r); });\n"
 + "      const P = Object.keys(by).map(w => { const rs = by[w].sort((a, b) => b.at < a.at ? -1 : 1); return { who: w, name: rs[0].name, rows: rs, on: rs.some(on), at: rs[0].at }; });\n"
 + "      (logins || []).forEach(l => { if(!by[l.who] && Date.now() - new Date(l.last_login).getTime() < 7 * 864e5) P.push({ who: l.who, name: l.name, rows: [], on: false, at: l.last_login, login: true }); });\n"
 + "      const nm = p => e(p.name || p.who) + (k === 'student' ? ' <span class=\"mute small\">' + e(p.who) + '</span>' : '');\n"
 + "      const row = p => '<div class=\"onl-it\"><span class=\"d\" style=\"background:' + (p.on ? '#2FB36B' : '#CFCDD9') + '\"></span><div style=\"flex:1;min-width:0\"><b>' + nm(p) + '</b><small>'\n"
 + "        + (p.on ? p.rows.filter(on).map(x => devP(x.dev) + (x.view ? ' · ' + e(PVN[k][x.view] || x.view) : '') + ' · since ' + hm(x.since) + pTag(k, x.v)).join(' &nbsp;|&nbsp; ')\n"
 + "          : p.login ? 'Signed in ' + when(p.at) : 'Last seen ' + when(p.at) + ' · ' + devP(p.rows[0].dev) + (p.rows[0].view ? ' · ' + e(PVN[k][p.rows[0].view] || p.rows[0].view) : '') + pTag(k, p.rows[0].v)) + '</small></div></div>';\n"
 + "      const onl = P.filter(p => p.on), td = P.filter(p => !p.on && dayK(p.at) === today()), wk = P.filter(p => !p.on && dayK(p.at) !== today()).sort((a, b) => b.at < a.at ? -1 : 1); n += onl.length;\n"
 + "      const sub = (t, L) => L.length ? '<div class=\"mute small\" style=\"margin-top:10px;font-weight:700\">' + t + '</div>' + L.map(row).join('') : '';\n"
 + "      const nv = never || [];\n"
 + "      html += '<h2 style=\"font-size:15px;margin-top:20px\">' + title + '</h2>' + (onl.length ? onl.map(row).join('') : '<div class=\"small mute\" style=\"padding:8px 0\">No one in the ' + (k === 'partner' ? 'Partner' : 'Student') + ' portal right now.</div>')\n"
 + "        + sub('Earlier today', td) + sub('Last 7 days', wk)\n"
 + "        + (nv.length ? '<details data-k=\"' + k + '\" style=\"margin-top:10px\"><summary style=\"cursor:pointer;min-height:44px;display:flex;align-items:center;font-size:14px;color:#5E5A75\">Not opened yet: <b style=\"margin-left:4px;color:inherit\">' + nv.length + ' ' + (nv.length === 1 ? noun.slice(0, -1) : noun) + '</b></summary><div class=\"small\" style=\"line-height:1.9;padding-bottom:6px\">'\n"
 + "          + nv.map(x => e(x.name || x.who) + (k === 'student' ? ' <span class=\"mute\">' + e(x.who) + '</span>' : '')).join('<br>') + '</div></details>' : ''); });\n"
 + "    return { n, html }; };"],
]);
