// 1806: (Misty 6 Nov 16:01–16:02) "In Management Access, we should always see when someone files leave or cancellations or messages"
//   · "also the location where they acknowledge like when they're timing in so it's considered legal".
//   1. Management Home: a pinned "New from teachers" card at the top — notices filed in the app, notices the teacher withdrew,
//      teacher messages (last 7 days, from the database: docs mgmt:feed1806, rebuilt every minute by coe_mgmt_feed_build).
//      New items stay highlighted until opened on this device or "Mark all seen". Tap opens the notice or Messages.
//   2. Notice form: ticking the acknowledgement asks for the location (as at time-in). Saved with the notice: time (PH), text,
//      latitude/longitude/accuracy or why it is missing; the device and IP are already kept with every save (writes.dev).
const lib = require('../tools/lib.js'), file = process.argv[2];
const FEED = "function lv1795count(rows, teacher, upto){";
const FEEDJS = "/* 1806 · New from teachers (management Home) */\n"
  + "const FD1806 = { items: null, at: 0, busy: 0 };\n"
  + "function fd1806seen(){ try{ return JSON.parse(localStorage.getItem('fd1806') || '{}'); }catch(e){ return {}; } }\n"
  + "function fd1806save(s){ try{ localStorage.setItem('fd1806', JSON.stringify(s)); }catch(e){} }\n"
  + "function fd1806new(x, s){ return !(s.all && x.at <= s.all) && !(s.o && s.o[x.id]); }\n"
  + "async function fd1806load(){ if(FD1806.busy || typeof sbDoc !== 'function') return; FD1806.busy = 1; try{ const d = await sbDoc('mgmt:feed1806'); if(d && d.data && Array.isArray(d.data.items)){ FD1806.items = d.data.items; FD1806.at = Date.now(); } }catch(e){} FD1806.busy = 0; fd1806paint(); }\n"
  + "function fd1806paint(){ const v = $('v-home'); if(!v || !(typeof D !== 'undefined' && D && D.mgr)) return; const L = FD1806.items; if(!L) return;\n"
  + "  const s = fd1806seen(), nw = L.filter(x => fd1806new(x, s)), ic = { leave: '🌴', withdrawn: '↩️', msg: '💬' }, lb = { leave: 'filed a notice of unavailability', withdrawn: 'withdrew a notice', msg: 'sent a message' };\n"
  + "  const ago = t => { const m = Math.round((Date.now() - Date.parse(t)) / 6e4); return m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };\n"
  + "  const show = (nw.length ? nw : L.slice(0, 3)).slice(0, 8);\n"
  + "  const h = '<section class=\"fd1806' + (nw.length ? ' on' : '') + '\" id=\"fd1806\"><div class=\"fd-h\"><b>' + (nw.length ? nw.length + ' new from teachers' : 'From teachers · nothing new') + '</b>'\n"
  + "    + (nw.length ? '<button class=\"btn sm ghost\" onclick=\"fd1806all()\">Mark all seen</button>' : '<span class=\"small mute\">last 7 days</span>') + '</div>'\n"
  + "    + (show.length ? show.map(x => '<a class=\"fd-r' + (fd1806new(x, s) ? ' n' : '') + '\" onclick=\"fd1806open(\\'' + esc(x.id) + '\\')\"><span class=\"fd-i\">' + (ic[x.k] || '•') + '</span><span class=\"fd-t\"><b>' + esc(tName(x.who || '')) + '</b> ' + (lb[x.k] || '') + (x.st && x.k === 'leave' ? ' · <i>' + esc(x.st) + '</i>' : '') + '<br><span class=\"small mute\">' + esc(x.d || '') + '</span></span><span class=\"small mute fd-a\">' + ago(x.at) + '</span></a>').join('') : '<div class=\"small mute\" style=\"padding:6px 0\">No notices or messages from teachers in the last 7 days.</div>')\n"
  + "    + '</section>';\n"
  + "  const old = $('fd1806'); if(old) old.outerHTML = h; else { const ov = v.querySelector('.ov') || v; ov.insertAdjacentHTML('afterbegin', h); } }\n"
  + "function fd1806all(){ const s = fd1806seen(); s.all = (FD1806.items && FD1806.items[0] && FD1806.items[0].at) || new Date().toISOString(); s.o = {}; fd1806save(s); fd1806paint(); }\n"
  + "function fd1806open(id){ const x = (FD1806.items || []).find(y => y.id === id); if(!x) return; const s = fd1806seen(); s.o = s.o || {}; s.o[id] = 1; fd1806save(s); fd1806paint();\n"
  + "  if(x.k === 'msg') return go('msgs');\n"
  + "  go('leave'); let n = 0; const t = setInterval(() => { n++; try{ if(typeof LV !== 'undefined' && LV && LV.rows && LV.rows.find(r => r.id === x.ref)){ clearInterval(t); lvSheet(x.ref); } }catch(e){} if(n > 40) clearInterval(t); }, 250); }\n"
  + "window.addEventListener('load', () => { try{ const base = window.renderHome; if(typeof base === 'function' && !base.__fd1806){ const w = function(){ const r = base.apply(this, arguments); try{ fd1806paint(); if(Date.now() - FD1806.at > 55000) fd1806load(); }catch(e){} return r; }; w.__fd1806 = 1; window.renderHome = w; try{ renderHome = w; }catch(e){} } }catch(e){}\n"
  + "  setInterval(() => { try{ if(typeof VIEW !== 'undefined' && VIEW === 'home' && !document.hidden && typeof D !== 'undefined' && D && D.mgr) fd1806load(); }catch(e){} }, 60000);\n"
  + "  setTimeout(() => { try{ if(typeof D !== 'undefined' && D && D.mgr) fd1806load(); }catch(e){} }, 1500); });\n";
lib(file, [
  [FEED, FEEDJS + FEED],
  ["onchange=\"TLV1795.ack=this.checked\"", "onchange=\"TLV1795.ack=this.checked;if(this.checked&&!TLV1795.loc&&typeof getLoc===\\'function\\')TLV1795.locP=getLoc(true).then(l=>TLV1795.loc=l)\""],
  ["' PH: ' + TLV1795.ackText + ']';   /* 1805 */",
   "' PH: ' + TLV1795.ackText + ' · ' + lv1806loc(await lv1806getLoc()) + ']';   /* 1805 + 1806 location */\n"
   + "if(TLV1795.needAck) f.ack = { text: TLV1795.ackText, at: new Date().toISOString(), loc: TLV1795.loc || null, ua: String(navigator.userAgent || '').slice(0, 200) };"],
  ["function lv1795count(rows, teacher, upto){",
   "async function lv1806getLoc(){ if(TLV1795.loc) return TLV1795.loc; try{ const p = TLV1795.locP || (typeof getLoc === 'function' ? getLoc(true) : Promise.resolve({ locErr: 'not supported' })); TLV1795.loc = await Promise.race([p, new Promise(r => setTimeout(() => r({ locErr: 'timed out' }), 9000))]); }catch(e){ TLV1795.loc = { locErr: 'unavailable' }; } return TLV1795.loc; }\n"
   + "function lv1806loc(l){ return l && l.lat != null ? 'location ' + (+l.lat).toFixed(5) + ', ' + (+l.lng).toFixed(5) + ' (±' + Math.round(l.acc || 0) + ' m)' : 'location not shared (' + ((l && l.locErr) || 'unavailable') + ')'; }\n"
   + "function lv1795count(rows, teacher, upto){"],
  ["'#tlN .lv95r{grid-template-columns:1fr auto}", "'.fd1806{background:#fff;border:1px solid #E6E3EE;border-radius:16px;padding:12px 14px;margin:0 0 14px}.fd1806.on{border-color:#E2A93B;box-shadow:0 0 0 3px #FFF1D6}.fd-h{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px}.fd-h b{font-size:15px}.fd-r{display:flex;gap:10px;align-items:flex-start;padding:8px 6px;border-top:1px solid #F1EFF6;cursor:pointer;color:inherit;text-decoration:none;border-radius:8px}.fd-r.n{background:#FFF8EA}.fd-i{font-size:18px;line-height:1.2}.fd-t{flex:1;min-width:0;font-size:13.5px;line-height:1.4}.fd-t .small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fd-a{white-space:nowrap}#tlN .lv95r{grid-template-columns:1fr auto}"],
]);
