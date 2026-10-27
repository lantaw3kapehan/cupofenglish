<style id="st1270">
.wc70 h1{margin:0 0 4px}
.wc70 .wc-ok{display:flex;align-items:center;gap:8px;font-weight:600;color:#1F7A55}
.wc70 .wc-steps{margin:14px 0 0;background:#EEF7F8;border:1px solid #CFE7EA;border-radius:14px;padding:12px 14px}
.wc70 .wc-steps ol{margin:6px 0 0 20px;padding:0;line-height:1.7;color:#2B2450}
.wc70 .wc-steps .wc-note{margin-top:6px;font-size:.875rem;color:#00575F;font-weight:600}
.wc70 details.wc-steps>summary{cursor:pointer;font-weight:600;color:#00575F}
.wc70 .wc-prev{margin-top:14px;border:1px solid #E7E5EE;border-radius:14px;background:#F3F6F7;overflow:hidden;position:relative;width:100%;aspect-ratio:1600/1000}
.wc70 .wc-prev img{display:block;width:100%;height:100%;object-fit:contain}
.wc70 .wc-prev .wc-wait{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#5E5A76;font-size:.875rem;text-align:center;padding:16px}
.wc70 .wc-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.wc70 .wc-btns .btn{min-height:44px}
.wc70 .wc-tick{margin-top:10px;display:flex;align-items:center;gap:10px;border:2px solid #E7E5EE;border-radius:14px;padding:12px 14px;cursor:pointer;color:#2B2450;background:#fff;width:100%;text-align:left;font:inherit;font-weight:600}
.wc70 .wc-tick .bx{width:24px;height:24px;border-radius:7px;border:2px solid #8C88A3;flex:none;display:flex;align-items:center;justify-content:center;color:#fff}
.wc70 .wc-tick.on{border-color:#1F9D6B;background:#EDF8F2}
.wc70 .wc-tick.on .bx{background:#1F9D6B;border-color:#1F9D6B}
.wc70 .wc-tick:focus-visible{outline:3px solid rgba(0,112,122,.55);outline-offset:2px}
.wc70 .wc-copied{font-size:.875rem;color:#1F7A55;min-height:2.6em;margin-top:6px;line-height:1.3}
.wc70 .wc-net{font-size:.875rem;color:#5E5A76;min-height:1.3em;margin-top:6px}
.wc70 .wc-why{margin-top:10px;background:#FFF4DE;border:1px solid #F3D9A4;border-radius:12px;padding:10px 12px;color:#7A4A00}
.wc70 .wc-why b{color:#7A4A00}
.wc-chip{display:inline-flex;align-items:center;gap:4px;border-radius:999px;padding:2px 9px;font-size:12px;font-weight:600;line-height:1.5;white-space:nowrap;vertical-align:middle;margin:2px 4px 2px 0}
.wc-chip.ok{background:#E7F5EE;color:#1F7A55}.wc-chip.no{background:#F0EEF5;color:#5E5A76}.wc-chip.amb{background:#FFF4DE;color:#7A4A00}.wc-chip.tl{background:#E3F4F5;color:#00575F}
.wc-ask{display:inline-flex;align-items:center;border:1px solid #D8D5E3;background:#fff;color:#2B2450;border-radius:999px;padding:2px 10px;font-size:12px;font-weight:600;cursor:pointer;margin:2px 0}
.wc-ask:hover{background:#F7F6FB}
.wc-rs{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.wc-rs button{border:1px solid #D8D5E3;background:#fff;border-radius:999px;padding:8px 12px;font:inherit;font-size:.875rem;cursor:pointer;color:#2B2450}
.wc-rs button.on{background:#00707A;color:#fff;border-color:#00707A}
.mo-r .wc-mo{display:inline-flex;gap:4px;margin-left:6px;vertical-align:middle}
</style>
<script>
/* 1270 · time-in picture for the WeChat corner · fuller time-in internet test · management "ask to redo the check" */
(function(){
  if(window.__1270) return; window.__1270 = 1;
  var E = function(t){ return String(t == null ? '' : t).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var F = "Inter,'PingFang SC','Microsoft YaHei',system-ui,-apple-system,'Segoe UI',Arial,sans-serif", B = "'Fredoka One',Inter,'PingFang SC','Microsoft YaHei',sans-serif";
  var LS = 'coe.wc1270', SEEN = 'coe.wc1270n', SH = { b64: null, at: 0 }, POSTED = {}, PIC = null, OV = {}, OVAT = 0, OVDAY = '', OVSIG = '';
  var hmM = function(ms){ return new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }); };
  function rd(){ try{ return JSON.parse(localStorage.getItem(LS) || '{}') || {}; }catch(e){ return {}; } }
  function wr(o){ try{ localStorage.setItem(LS, JSON.stringify(o)); }catch(e){} }
  function today(){ try{ return (typeof D !== 'undefined' && D && D.today) || new Date(Date.now() + 8 * 36e5).toISOString().slice(0, 10); }catch(e){ return ''; } }
  function me(){ try{ return String((D.me || {}).name || '').trim(); }catch(e){ return ''; } }
  var nk = function(n){ return String(n || '').replace(/^teacher\s+/i, '').trim().toLowerCase(); };
  function key(d, n){ return String(d || today()).slice(0, 10) + '|' + nk(n); }
  function posted(){ var k = key(today(), me()); return rd()[k] || POSTED[k] || null; }
  function call(op, o){ if(typeof TOKEN === 'undefined' || !TOKEN || typeof FAST_URL === 'undefined') return Promise.resolve(null);
    return fetch(FAST_URL + '-wct', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, op: op, day: today() }, o || {})) }).then(function(y){ return y.json(); }).catch(function(){ return null; }); }
  function race(p, ms, dflt){ return Promise.race([Promise.resolve(p).then(function(v){ return v || dflt; }, function(){ return dflt; }), new Promise(function(z){ setTimeout(function(){ z(dflt); }, ms); })]); }

  /* ── A · fuller internet test for the time-in (Cloudflare's way: ~20 pings, 100 kB / 1 MB / 10 MB rounds, 90th percentile) ── */
  var _nc = window.netCheck, NETF = null, REDO_RUN = 0, PINGP = null;   /* PINGP: the latency pings are running · the picture waits for them so a busy page does not disturb them */
  async function full(){
    var out = { ip: '', net: '', speed: '' }, cn = navigator.connection || {}, t0 = performance.now(), used = function(){ return performance.now() - t0; };
    var go = function(u, ms, o){ var a = new AbortController(); setTimeout(function(){ a.abort(); }, ms); return fetch(u, Object.assign({ signal: a.signal, cache: 'no-store' }, o || {})); };
    var PINGOK = function(){}; PINGP = new Promise(function(z){ PINGOK = z; }); setTimeout(function(){ PINGOK(); }, 7000);
    var kind = cn.type ? ({ wifi: 'Wi-Fi', ethernet: 'LAN cable', cellular: 'Mobile data' }[cn.type] || cn.type) : '';
    try{ var m = await (await go(CFS + '/meta', 3000)).json(); out.ip = m.clientIp || ''; out.net = [kind, m.asOrganization, m.asn ? 'AS' + m.asn : '', m.city].filter(Boolean).join(' · '); }catch(e){ out.net = kind; }
    window.__netPart1270 = { ip: out.ip, net: out.net };
    /* network times from the browser's own timing record (not affected by the page being busy, e.g. while the picture is drawn) */
    try{ performance.setResourceTimingBufferSize(2000); }catch(e){}
    var rt = function(u){ try{ var L = performance.getEntriesByName(u); return L && L.length ? L[L.length - 1] : null; }catch(e){ return null; } };
    var p90 = function(a){ var s = a.slice().sort(function(x, y){ return x - y; }); return s[Math.min(s.length - 1, Math.floor(s.length * 0.9))]; };
    try{
      var pings = [];
      for(var i = 0; i < 20 && used() < 4000; i++){ var t = performance.now(), u0 = CFS + '/__down?bytes=0&r=' + Math.random().toString(36).slice(2); await (await go(u0, 2000)).arrayBuffer(); var e0 = rt(u0); pings.push(e0 && e0.responseStart > e0.requestStart ? e0.responseStart - e0.requestStart : performance.now() - t); }
      PINGOK(); window.__pings1270 = pings.map(function(x){ return Math.round(x); }); if(pings.length > 3) pings.shift();   /* the first one opens the connection (Cloudflare's own test is warmed up the same way) */
      if(pings.length < 3){ PINGOK(); throw 0; }
      var srt = pings.slice().sort(function(a, b){ return a - b; }), lat = srt[Math.floor(srt.length / 2)], jit = 0; for(var j = 1; j < pings.length; j++) jit += Math.abs(pings[j] - pings[j - 1]); jit /= (pings.length - 1);
      var dl = [], ul = [];
      var down = async function(bytes, n, cap){ for(var k = 0; k < n; k++){ if(used() > cap) return false; var t1 = performance.now(), u1 = CFS + '/__down?bytes=' + bytes + '&r=' + Math.random().toString(36).slice(2), ab = await (await go(u1, 8000)).arrayBuffer(), e1 = rt(u1), dt = (e1 && e1.responseEnd > e1.requestStart ? e1.responseEnd - e1.requestStart : performance.now() - t1) / 1000; if(dt > 0.01 && ab.byteLength) dl.push(ab.byteLength * 8 / dt / 1e6); if(dt > 2.5) return false; } return true; };
      var up = async function(bytes, n, cap){ var body = new Uint8Array(bytes); for(var k = 0; k < n; k++){ if(used() > cap) return false; var t1 = performance.now(), u2 = CFS + '/__up?r=' + Math.random().toString(36).slice(2); await (await go(u2, 8000, { method: 'POST', body: body, headers: { 'Content-Type': 'text/plain' } })).text(); var e2 = rt(u2), dt = (e2 && e2.responseStart > e2.startTime ? e2.responseStart - e2.startTime : performance.now() - t1) / 1000; if(dt > 0.01) ul.push(bytes * 8 / dt / 1e6); if(dt > 2.5) return false; } return true; };
      if(await down(1e5, 8, 7000) && await down(1e6, 6, 8500)){ if(dl.length && p90(dl) > 20) await down(1e7, 2, 9500); }
      if(await up(1e5, 6, 11500)) await up(1e6, 4, 13000);
      if(!dl.length) throw 0;
      out.speed = '↓ ' + p90(dl).toFixed(1) + ' Mbps · ↑ ' + (ul.length ? p90(ul).toFixed(1) : '0.0') + ' Mbps · ' + Math.round(lat) + ' ms · jitter ' + jit.toFixed(1) + ' ms';
    }catch(e){ if(cn.downlink) out.speed = '~' + cn.downlink + ' Mbps (browser estimate)'; }
    try{ if(out.speed) localStorage.setItem('coe.netLast', JSON.stringify({ s: out.speed, at: Date.now(), kind: 'timein' })); }catch(e){}
    return out; }
  if(typeof _nc === 'function') window.netCheck = function(f){ if(f === true){ window.__netPart1270 = null; NETF = null; var p = full(); p.then(function(r){ try{ netDone(r); }catch(e){} }); return p; } return _nc.apply(this, arguments); };
  /* the full result after the time-in was already saved: kept with the time-in in the database, shown everywhere as the time-in's internet */
  function netDone(r){ NETF = r || {}; if(typeof D === 'undefined' || !D || D.mgr || D.shift || REDO_RUN) return;
    setTimeout(function(){ try{ var ti = D.timeIn; if(!ti || !ti.time || ti.pending || ti.day1270 !== today() || !r || !/Mbps/.test(r.speed || '')) return;
      if(!ti.speed){ ti.speed = r.speed; if(!ti.net) ti.net = r.net; if(!ti.ip) ti.ip = r.ip; try{ if(VIEW === 'today') renderToday(); }catch(e){} }
      call('net', { speed: r.speed, net: r.net, ip: r.ip, ti: ti.time }); refreshStep(); }catch(e){} }, 0); }

  /* remember the time-in's screen picture + location (the app keeps them only for a moment) */
  var LOCV = null;
  var _g = window.grabScreen; if(typeof _g === 'function') window.grabScreen = async function(){ var r = await _g.apply(this, arguments); try{ if(r && r.b64) SH = { b64: r.b64, at: Date.now() }; }catch(e){} return r; };
  var _s = window.sendTimeIn; if(typeof _s === 'function') window.sendTimeIn = async function(){
    try{ if(typeof LOC !== 'undefined') Promise.resolve(LOC).then(function(v){ LOCV = v || {}; }); }catch(e){}
    var prev = (typeof D !== 'undefined' && D) ? D.timeIn : null, r = await _s.apply(this, arguments);
    try{ if(D && !D.shift && D.timeIn && D.timeIn !== prev && !D.timeIn.pending){ D.timeIn.day1270 = today(); if(NETF && NETF.speed) netDone(NETF); if(!window.__wcTap1270) setTimeout(function(){ window.wcStep1270(); }, 60); } }catch(e){}
    return r; };
  var _tap = window.tapTimeIn; if(typeof _tap === 'function') window.tapTimeIn = function(){ window.__wcTap1270 = 1; setTimeout(function(){ window.__wcTap1270 = 0; }, 120000); return _tap.apply(this, arguments); };

  /* ── B · the picture (landscape, readable as a WeChat thumbnail) ── */
  function checks(x){
    var L = [], st = String(x.status || ''), late = /late/i.test(st);
    L.push(st ? { ok: !late, t: late ? 'Late' + (Math.abs(+x.mins || 0) ? ' ' + Math.abs(+x.mins) + ' min' : '') : st === 'On time' ? 'On time' : st } : { ok: null, t: 'On time · being checked' });
    var lap = /^Laptop/.test(x.device || ''); L.push({ ok: lap, t: lap ? 'Class laptop' : (String(x.device || 'Unknown device').split(' · ')[0]) + ' · not the class laptop' });
    var k = String(x.net || ''); L.push(/LAN cable/.test(k) ? { ok: true, t: 'LAN cable' } : /Wi-Fi|Mobile data/.test(k) ? { ok: false, t: (k.match(/Wi-Fi|Mobile data/) || ['Wi-Fi'])[0] + ' · not LAN' } : { ok: null, t: 'LAN cable · see the picture' });
    L.push(x.shot ? { ok: true, t: 'Screen proof · VooV + date/time' } : { ok: false, t: 'No screen proof' });
    var q = window.netQ ? window.netQ(x.speed) : { lvl: '', label: '' };
    L.push(x.measuring ? { ok: null, t: 'Internet · measuring…' } : !q.lvl ? { ok: null, t: 'Internet · not measured' } : { ok: q.lvl === 'good' ? true : q.lvl === 'ok' ? 'warn' : false, t: q.label });
    L.push(x.lat != null || x.place ? { ok: true, t: 'Location shared' } : { ok: false, t: 'Location · ' + (x.locErr || 'not shared') });
    return L; }
  function num(s, re){ var m = String(s || '').match(re); return m ? m[1] : ''; }
  function card(x){
    var logo = (document.querySelector('#login img') || {}).src || '';
    var C = checks(x), ic = function(o){ return o === true ? ['✓', '#1F7A55', '#E7F5EE'] : o === null ? ['…', '#4C4868', '#EEF0F4'] : o === 'warn' ? ['!', '#8A5300', '#FFF0D2'] : ['⚠', '#B42318', '#FDECEA']; };
    var rows = C.map(function(c){ var k = ic(c.ok); return '<div style="display:flex;align-items:center;gap:14px;background:' + k[2] + ';border-radius:14px;padding:0 16px;height:58px"><span style="width:40px;height:40px;border-radius:50%;background:' + k[1] + ';color:#fff;display:flex;align-items:center;justify-content:center;font:700 24px ' + F + ';flex:none">' + k[0] + '</span><span style="font:600 29px ' + F + ';color:' + k[1] + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + E(c.t) + '</span></div>'; }).join('');
    var dn = num(x.speed, /↓\s*([\d.]+)/) || num(x.speed, /~\s*([\d.]+)/), up = num(x.speed, /↑\s*([\d.]+)/), ms = num(x.speed, /([\d.]+)\s*ms\s*·\s*jitter/) || num(x.speed, /·\s*([\d.]+)\s*ms\s*$/), jt = num(x.speed, /jitter\s*([\d.]+)/);
    var q = window.netQ ? window.netQ(x.speed) : { label: '' };
    var tile = function(l, v, u){ return '<div style="background:#F6F7FA;border-radius:14px;padding:12px 18px;height:96px;box-sizing:border-box"><div style="font:500 22px ' + F + ';color:#5E5A76">' + l + '</div><div style="font:700 38px ' + F + ';color:#2B2450;margin-top:2px;white-space:nowrap">' + (v ? E(v) + ' <span style="font:500 22px ' + F + ';color:#5E5A76">' + u + '</span>' : '<span style="font:500 24px ' + F + ';color:#8C88A3">' + (x.measuring ? 'measuring…' : 'not measured') + '</span>') + '</div></div>'; };
    var dt = new Date(String(x.day) + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    var late = /late/i.test(x.status || ''), sc = x.status ? (late ? ['#B42318', '#FDECEA'] : ['#1F7A55', '#E7F5EE']) : ['#4C4868', '#EEF0F4'];
    /* privacy (the card is posted in the teachers' group): provider + city only · no IP, no address, no coordinates (management sees those in the app) */
    var line = [String(x.net || '').replace(/\s*·\s*AS\d+/g, ''), String(x.device || '').replace(/ · \d+×\d+$/, '')].filter(Boolean).join('  ·  ');
    var shot = x.shot ? '<img src="data:image/jpeg;base64,' + x.shot + '" style="display:block;width:100%;height:100%;object-fit:contain;background:#1E1F24">' : '<div style="height:100%;display:flex;align-items:center;justify-content:center;font:600 28px ' + F + ';color:#B42318;background:#FDECEA">No screen proof</div>';
    return '<div style="width:1600px;box-sizing:border-box;padding:26px;background:#F3F6F7;color:#2B2450;font-family:' + F + '"><div style="background:#fff;border-radius:28px;padding:26px 32px 12px;border:2px solid #E8ECF0">'
      + (x.redo ? '<div style="background:#FFF0D2;border:2px solid #F0C36D;border-radius:16px;padding:12px 20px;margin-bottom:18px;font:700 30px ' + F + ';color:#7A4A00;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">REDO · Internet re-checked ' + E(x.redo.time) + ' · asked by management: ' + E(x.redo.reason || '') + '</div>' : '')
      + '<div style="display:flex;align-items:center;gap:20px;height:64px">' + (logo ? '<img src="' + E(logo) + '" style="height:60px;width:auto;display:block">' : '<b style="font:400 40px ' + B + ';color:#2B2253">CupOfEnglish</b>') + '<span style="flex:1"></span>'
      + '<span style="background:#E3F4F5;color:#00575F;font:700 28px ' + F + ';border-radius:30px;padding:10px 24px;white-space:nowrap">Time-in · ' + E(dt) + '</span></div>'
      + '<div style="height:2px;background:#EEF0F4;margin:16px 0 18px"></div>'
      + '<div style="display:grid;grid-template-columns:640px 1fr;gap:28px;align-items:start">'
      + '<div><div style="font:400 58px ' + B + ';color:#2B2253;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + E(x.name) + '</div>'
      + '<div style="display:flex;align-items:center;gap:16px;margin-top:10px"><span style="font:500 28px ' + F + ';color:#5E5A76">Timed in</span><span style="font:400 54px ' + B + ';color:#00707A;line-height:1">' + E(x.time) + '</span>'
      + '<span style="background:' + sc[1] + ';color:' + sc[0] + ';font:700 32px ' + F + ';border-radius:999px;padding:6px 20px;white-space:nowrap">' + E(x.status ? (late ? 'Late' + (Math.abs(+x.mins || 0) ? ' ' + Math.abs(+x.mins) + ' min' : '') : x.status) : 'being checked') + '</span></div>'
      + '<div style="font:500 26px ' + F + ';color:#4C4868;margin-top:8px;height:34px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + (x.first ? 'First class ' + E(x.first) : '') + '</div>'
      + '<div style="display:grid;gap:10px;margin-top:12px">' + rows + '</div></div>'
      + '<div><div style="font:700 22px ' + F + ';color:#5E5A76;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px">' + (x.redo ? 'Screen proof · re-check ' + E(x.redo.time) : 'Screen proof') + '</div><div style="height:490px;border-radius:16px;overflow:hidden;border:2px solid #E8ECF0">' + shot + '</div></div></div>'
      + '<div style="font:700 22px ' + F + ';color:#5E5A76;letter-spacing:.06em;text-transform:uppercase;margin:18px 0 10px">' + (x.redo ? 'Internet · re-checked ' + E(x.redo.time) : 'Internet') + (q.label && !x.measuring ? ' · <span style="text-transform:none;letter-spacing:0;color:#2B2450">' + E(q.label) + '</span>' : '') + '</div>'
      + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">' + tile('Download', dn, 'Mbps') + tile('Upload', up, 'Mbps') + tile('Latency', ms, 'ms') + tile('Jitter', jt, 'ms') + '</div>'
      + '<div style="font:500 22px ' + F + ';color:#4C4868;margin-top:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;height:30px">' + E(line) + '</div>'
      + '<div class="wc-foot" style="height:54px;margin-top:6px;border-top:2px solid #EEF0F4"></div>'
      + '</div></div>'; }
  async function data(shot, redo){
    var ti = (D && D.timeIn) || {}, n = (redo && redo.n) || NETF || window.__netPart1270 || {}, l = (redo && redo.l) || LOCV || await race(typeof LOC !== 'undefined' ? LOC : null, 1500, {});
    var fl = (D.schedule || []).filter(function(x){ return x.day === D.today && !x.cancelled; }).sort(function(a, c){ return String(a.start).localeCompare(String(c.start)); })[0];
    var sp = redo ? (n.speed || '') : (ti.speed || (NETF && NETF.speed) || ''), measuring = !redo && !sp && !NETF;
    var place = redo ? '' : (ti.place || ''), b64 = shot || (!redo && SH.b64 && Date.now() - SH.at < 3 * 36e5 ? SH.b64 : null);
    return { name: me(), day: D.today || today(), time: ti.time || '', status: String(ti.status || ''), mins: ti.mins,
      first: fl ? (typeof tm === 'function' ? tm(fl.start) : String(fl.start).slice(11, 16)) + (fl.student ? ' · ' + fl.student : '') : '',
      speed: sp, measuring: measuring, net: (/LAN cable|Wi-Fi|Mobile data/.test(n.net || '') ? n.net : (redo ? n.net : ti.net || n.net)) || '', ip: (redo ? n.ip : ti.ip || n.ip) || '',
      device: redo ? (typeof deviceInfo === 'function' ? deviceInfo() : '') : (ti.device || (typeof deviceInfo === 'function' ? deviceInfo() : '')),
      lat: l.lat, place: place, locErr: l.locErr, locTxt: place || (l.lat != null ? Number(l.lat).toFixed(4) + ', ' + Number(l.lng).toFixed(4) + ' (±' + Math.round(l.acc || 0) + ' m)' : ''),
      shot: b64, redo: redo || null }; }
  var TAG = null;
  function tagImg(){ if(TAG) return TAG; var src = (document.querySelector('#login .tagl img') || {}).src || ''; TAG = new Promise(function(z){ if(!src) return z(null); var i = new Image(); i.onload = function(){ z(i); }; i.onerror = function(){ z(null); }; i.src = src; }); return TAG; }
  async function picture(x){
    var box = document.createElement('div'); box.style.cssText = 'position:fixed;left:-12000px;top:0;z-index:-1'; box.innerHTML = card(x); document.body.appendChild(box);
    try{ var imgs = [].slice.call(box.querySelectorAll('img')); await Promise.all(imgs.map(function(i){ return i.complete ? 0 : new Promise(function(z){ i.onload = i.onerror = z; }); }));
      try{ await Promise.all([document.fonts.load('400 58px "Fredoka One"'), document.fonts.load('600 29px Inter'), document.fonts.load('700 38px Inter'), document.fonts.load('500 22px Inter')]); await document.fonts.ready; }catch(e){}
      var el = box.firstElementChild, ft = el.querySelector('.wc-foot'), fr = ft.getBoundingClientRect(), er = el.getBoundingClientRect();
      var H = await h2c(), cv = await H(el, { scale: 1, backgroundColor: '#F3F6F7', useCORS: true, logging: false }), sc = cv.width / er.width;
      var tag = await tagImg(); if(tag){ var th = Math.round(38 * cv.width / 1600), tw = Math.round(th * tag.width / tag.height), g = cv.getContext('2d'), fy = (fr.top - er.top) * sc, fh = fr.height * sc;   /* the Lesson summary tagline artwork, small (38 px tall on the 1600 px card), centred */
        g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingQuality = 'high'; g.drawImage(tag, Math.round((cv.width - tw) / 2), Math.round(fy + (fh - th) / 2 + 3 * sc), tw, th); }
      var blob = await new Promise(function(r){ cv.toBlob(r, 'image/png'); }); return { blob: blob, w: cv.width, h: cv.height, name: 'CupOfEnglish-time-in-' + String(x.name || 'teacher').replace(/[^\w　-鿿-]+/g, '-') + '-' + x.day + (x.redo ? '-redo' : '') + '.png' }; }
    finally{ box.remove(); } }
  window.__pic1270 = picture; window.__card1270 = card;
  function stepsHtml(redo){ var n = 0; try{ n = +localStorage.getItem(SEEN) || 0; }catch(e){}
    var inner = '<ol><li>Tap <b>Copy picture</b></li><li>Open the <b>WeChat corner</b> and paste it (<b>Ctrl+V</b> · Mac <b>⌘V</b>)</li><li><b>Send</b></li><li>Come back and tick <b>Posted in WeChat</b></li></ol><div class="wc-note">You no longer need to send the speed-test screenshot — this picture has everything.</div>';
    return n < 3 || redo ? '<div class="wc-steps"><b>Post it in the WeChat corner</b>' + inner + '</div>' : '<details class="wc-steps"><summary>How to post it in the WeChat corner</summary>' + inner + '</details>'; }
  function tickHtml(p){ return '<button type="button" class="wc-tick' + (p ? ' on' : '') + '" id="wcTick" aria-pressed="' + (p ? 'true' : 'false') + '" onclick="wcTick1270()"><span class="bx">' + (p ? '✓' : '') + '</span><span>' + (p ? 'Posted in WeChat · ' + E(p.time || '') : 'Posted in WeChat') + '</span></button>'; }
  var STEP = null;
  async function render(){ if(!STEP) return; var st = STEP; if(PINGP) await race(PINGP, 5000, 0); var x = await data(st.shot, st.redo), pv = document.getElementById('wcPrev'); if(!pv) return;
    try{ var P = await picture(x); if(STEP !== st) return; PIC = P; pv = document.getElementById('wcPrev'); if(!pv) return; var u = URL.createObjectURL(P.blob), im = new Image(); im.alt = 'Time-in picture for the WeChat corner'; im.src = u; try{ await im.decode(); }catch(e){}
      pv.style.aspectRatio = P.w + ' / ' + P.h; pv.innerHTML = ''; pv.appendChild(im);
      ['wcCopy', 'wcSave'].forEach(function(id){ var b = document.getElementById(id); if(b) b.disabled = false; });
      var nm = document.getElementById('wcNet'); if(nm) nm.textContent = x.measuring ? 'Internet check still running · the picture fills in by itself in a few seconds' : '';
      st.measuring = x.measuring; }
    catch(e){ pv.innerHTML = '<div class="wc-wait">The picture could not be made here · take a screenshot of your time-in instead</div>'; } }
  function refreshStep(){ if(STEP && STEP.measuring && document.getElementById('wcPrev')) render(); }
  window.wcStep1270 = function(shot, redo){
    if(typeof D === 'undefined' || !D || D.mgr || D.shift || !D.timeIn) return;
    try{ var n = +localStorage.getItem(SEEN) || 0; localStorage.setItem(SEEN, String(n + 1)); }catch(e){}
    var ti = D.timeIn; STEP = { shot: shot || null, redo: redo || null }; PIC = null;
    var p = redo ? (redo.posted ? { time: redo.posted } : null) : posted();
    openSheet('<div class="wc70"><h1>' + (redo ? 'Internet re-checked · ' + E(redo.time) : 'Time-in saved · ' + E(ti.time || '')) + '</h1><div class="wc-ok">' + (redo ? 'Your time-in stays ' + E(ti.time || '') + ' · ' + E(ti.status || '') : E(ti.status || 'Saved') + (ti.flag ? ' · ' + E(ti.flag) : '')) + '</div>' + stepsHtml(!!redo)
      + '<div class="wc-prev" id="wcPrev"><div class="wc-wait">Making the picture…</div></div><div class="wc-net" id="wcNet" aria-live="polite"></div>'
      + '<div class="wc-btns"><button class="btn teal" id="wcCopy" onclick="wcCopy1270()" disabled>Copy picture</button><button class="btn ghost" id="wcSave" onclick="wcSave1270()" disabled>Save picture</button></div>'
      + '<div class="wc-copied" id="wcMsg" aria-live="polite"></div>' + tickHtml(p) + '</div>');
    render(); };
  window.wcCopy1270 = async function(){ var m = document.getElementById('wcMsg'); if(!PIC) return;
    try{ if(!window.ClipboardItem || !navigator.clipboard || !navigator.clipboard.write) throw 0; await navigator.clipboard.write([new ClipboardItem({ 'image/png': PIC.blob })]);
      if(m) m.textContent = 'Copied ✓ · now paste it in the WeChat corner (Ctrl+V · ⌘V) and send' + (STEP && STEP.measuring ? ' · the internet check is still running: copy again in a few seconds for the full picture' : ''); }
    catch(e){ window.wcSave1270(); if(m) m.textContent = 'Copy is blocked in this browser · the picture was saved instead · drag it into the WeChat corner'; } };
  window.wcSave1270 = function(){ if(!PIC) return; var u = URL.createObjectURL(PIC.blob), a = document.createElement('a'); a.href = u; a.download = PIC.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); }, 4000); };
  window.wcTick1270 = async function(){ var t = hmM(Date.now()), b = document.getElementById('wcTick');
    if(STEP && STEP.redo){ if(STEP.redo.posted) return; STEP.redo.posted = t; if(MINE && MINE.redone && MINE.redone.id === STEP.redo.id) MINE.redone.posted_at = new Date().toISOString(); if(b) b.outerHTML = tickHtml({ time: t }); call('redoPost', { id: STEP.redo.id, time: t }); try{ if(VIEW === 'today') renderToday(); }catch(e){} return; }
    if(posted()) return; var k = key(today(), me()), rec = { day: today(), time: t, ti: (D.timeIn || {}).time || '', sent: 0 }, o = rd(); o[k] = rec; wr(o); POSTED[k] = rec;
    if(b) b.outerHTML = tickHtml(rec); try{ if(typeof renderToday === 'function' && VIEW === 'today') renderToday(); }catch(e){}
    var r = await call('post', { time: t, ti: rec.ti }); if(r && r.ok){ o = rd(); if(o[k]){ o[k].sent = 1; wr(o); } } };
  setInterval(function(){ try{ var o = rd(); Object.keys(o).forEach(function(k){ if(!o[k].sent && o[k].day === today()) call('post', { time: o[k].time, ti: o[k].ti }).then(function(r){ if(r && r.ok){ var q = rd(); if(q[k]){ q[k].sent = 1; wr(q); } } }); }); }catch(e){} }, 60000);

  /* ── teacher: what the database knows (ticked on another device, a redo request) ── */
  var MINE = null, MINEAT = 0, MINEBUSY = 0;
  function mine(force){ if(MINEBUSY || typeof D === 'undefined' || !D || D.mgr || D.shift || !D.timeIn || !D.timeIn.time) return; if(!force && Date.now() - MINEAT < 60000) return; MINEBUSY = 1; MINEAT = Date.now();
    call('mine').then(function(r){ MINEBUSY = 0; if(!r || !r.ok) return; var sig = JSON.stringify(MINE || {}); MINE = r; var k = key(today(), me());
      if(r.posted) POSTED[k] = { day: today(), time: r.posted.time || '', sent: 1 };
      var ti = D.timeIn; if(ti && r.redone && r.redone.speed){ if(ti.speed0 == null) ti.speed0 = ti.speed || ''; ti.speed = r.redone.speed; }
      else if(ti && !ti.speed && r.speed) ti.speed = r.speed;
      if(JSON.stringify(MINE) !== sig){ try{ if(VIEW === 'today') renderToday(); }catch(e){} } }, function(){ MINEBUSY = 0; }); }
  setInterval(function(){ try{ if(typeof VIEW !== 'undefined' && VIEW === 'today' && !document.hidden) mine(); }catch(e){} }, 60000);
  window.wcMine1270 = function(r){ MINE = r; };   /* preview tests */

  /* Needs your action: the redo request (urgent, first) and "Post your time-in picture" until ticked */
  var _m = window._MUST;
  try{ Object.defineProperty(window, '_MUST', { configurable: true, get: function(){ return _m; }, set: function(v){ _m = v; try{
    if(!Array.isArray(v) || typeof D === 'undefined' || !D || D.mgr || D.shift || !D.timeIn || !D.timeIn.time || D.timeIn.pending) return; mine();
    var mk = function(fn){ var li = document.createElement('div'); li.onclick = fn; return li; };
    if(MINE && MINE.redo) v.unshift({ label: 'Time-in', red: true, title: 'Management asked you to redo your time-in check', sub: (MINE.redo.reason || '') + ' · your time-in time stays the same', verb: 'Redo now', li: mk(function(){ window.wcRedo1270(); }) });
    else if(MINE && MINE.redone && !MINE.redone.posted_at) v.push({ label: 'WeChat', red: false, title: 'Post your redo picture in the WeChat corner', sub: 'Internet re-checked ' + (MINE.redone.done_time || '') + ' · copy · paste · tick Posted', verb: 'Open', li: mk(function(){ window.wcRedoCard1270(); }) });
    if(!posted()) v.push({ label: 'WeChat', red: false, title: 'Post your time-in picture in the WeChat corner', sub: 'Copy picture · paste it in the WeChat corner · tick Posted in WeChat', verb: 'Open', li: mk(function(){ window.wcStep1270(); }) }); }catch(e){} } }); }catch(e){}

  /* ── teacher: redo the time-in check (the time-in time and On time / Late never change) ── */
  var RNET = null, RLOC = null, LASTREDO = null;
  window.wcRedo1270 = function(){ if(!MINE || !MINE.redo) return; var r = MINE.redo, ti = D.timeIn || {};
    REDO_RUN = 1; RNET = full(); RLOC = typeof getLoc === 'function' ? getLoc(true) : Promise.resolve({});
    openSheet('<div class="wc70"><h1>Redo your time-in check</h1><div class="wc-why"><b>Management asked:</b> ' + E(r.reason || '') + '</div>'
      + '<div class="mute small" style="margin-top:10px">Your time-in stays <b>' + E(ti.time || '') + ' · ' + E(ti.status || '') + '</b>. Only the internet check, the screen picture and the location are taken again, then you post the new picture in the WeChat corner.</div>'
      + '<div class="fbfix" style="margin-top:12px"><b>Pick “Entire screen”, then Share</b>Show VooV, your computer’s date and time, and the LAN cable icon.</div>'
      + '<div class="wc-net" id="wcRNet" aria-live="polite">Checking internet…</div>'
      + '<button class="btn teal block" id="wcRGo" style="margin-top:12px" onclick="wcRedoGo1270()">Share entire screen · Re-check</button></div>');
    RNET.then(function(n){ var el = document.getElementById('wcRNet'); if(el) el.textContent = n && n.speed ? 'Internet checked · ' + (window.netQ ? netQ(n.speed).label : n.speed) : 'Internet check did not finish · it will be marked not measured'; }); };
  window.wcRedoGo1270 = async function(){ var r = MINE && MINE.redo, b = document.getElementById('wcRGo'); if(!r) return;
    if(b){ b.disabled = true; b.textContent = 'Share your entire screen…'; }
    var fail = function(msg){ if(b){ b.disabled = false; b.textContent = 'Share entire screen · Re-check'; } toast(msg); };
    var shot = await window.grabScreen();
    if(shot.err === 'blocked'){ if(typeof macPerm === 'function') macPerm(); return fail('Allow screen sharing for this browser, then try again'); }
    if(shot.err === 'not shared') return fail('Choose Entire screen to re-check');
    if(shot.surface && shot.surface !== 'monitor') return fail('Choose “Entire screen” so your date, time and LAN icon show');
    if(!shot.b64) return fail('The screen picture did not work. Tap again.');
    if(b) b.textContent = 'Finishing the internet check…';
    var n = await race(RNET, 16000, {}), l = await race(RLOC, 9000, {}), t = hmM(Date.now());
    var loc = l.lat != null ? Number(l.lat).toFixed(5) + ',' + Number(l.lng).toFixed(5) + ' ±' + Math.round(l.acc || 0) + 'm' : 'not shared' + (l.locErr ? ' (' + l.locErr + ')' : '');
    if(b) b.textContent = 'Saving…';
    var res = await call('redo', { id: r.id, time: t, speed: n.speed || '', net: n.net || '', ip: n.ip || '', device: typeof deviceInfo === 'function' ? deviceInfo() : '', loc: loc, shot: shot.b64 });
    REDO_RUN = 0;
    if(!res || !res.ok) return fail('Not saved · check your internet and tap again');
    LASTREDO = { id: r.id, time: t, reason: r.reason, n: n, l: l, shot: shot.b64, posted: '' };
    MINE.redo = null; MINE.redone = { id: r.id, done_at: new Date().toISOString(), done_time: t, speed: n.speed || '', reason: r.reason };
    if(n.speed){ var ti = D.timeIn; if(ti){ if(ti.speed0 == null) ti.speed0 = ti.speed || ''; ti.speed = n.speed; } }
    window.wcStep1270(shot.b64, LASTREDO); try{ if(VIEW === 'today') renderToday(); }catch(e){} };
  window.wcRedoCard1270 = function(){ if(LASTREDO) return window.wcStep1270(LASTREDO.shot, LASTREDO); var x = MINE && MINE.redone; if(!x) return;
    window.wcStep1270(null, { id: x.id, time: x.done_time, reason: x.reason || '', n: { speed: x.speed || '' }, l: {}, posted: '' }); };

  /* ── management: WeChat ✓ / not posted · redo asked / redone · the redo's internet is the time-in's internet ── */
  var DAYBUSY = 0;
  function loadDay(force){ if(DAYBUSY || typeof D === 'undefined' || !D || !D.mgr) return; var d = today(); if(!force && OVDAY === d && Date.now() - OVAT < 60000) return; DAYBUSY = 1;
    call('day', { day: d }).then(function(r){ DAYBUSY = 0; if(!r || !r.ok) return; window.wcDay1270(r); }, function(){ DAYBUSY = 0; }); }
  window.wcDay1270 = function(r){ var o = {};
    (r.rows || []).forEach(function(x){ var k = key(r.day, x.teacher); o[k] = Object.assign(o[k] || {}, { posted: x.posted_at ? (x.posted_time || hmM(Date.parse(x.posted_at))) : '', full: x.speed || '' }); });
    (r.redo || []).forEach(function(x){ var k = key(r.day, x.teacher), c = o[k] = o[k] || {}; if(!x.done_at) c.asked = { reason: x.reason || '', at: hmM(Date.parse(x.asked_at)) }; else { c.redo = { time: x.done_time || hmM(Date.parse(x.done_at)), speed: x.speed || '', net: x.net || '', ip: x.ip || '', device: x.device || '', loc: x.loc || '', proof: x.proof || '', reason: x.reason || '', posted: x.posted_at ? (x.posted_time || '') : '' }; delete c.asked; } });
    var sig = JSON.stringify(o); OV = o; OVAT = Date.now(); OVDAY = r.day; if(sig !== OVSIG){ OVSIG = sig; deco(true); } };
  function ovFor(ctx){ try{ if(!ctx || ctx.kind === 'class') return null; var d = String(ctx.date || today()).slice(0, 10), n = ctx.mine ? me() : ctx.who; if(!n) return null;
      if(ctx.mine){ var M2 = MINE || {}, o = {}; if(M2.redone && M2.redone.done_at && M2.redone.speed) o.redo = { time: M2.redone.done_time || '', speed: M2.redone.speed, reason: M2.redone.reason || '' }; if(M2.redo) o.asked = { reason: M2.redo.reason || '' }; return (o.redo || o.asked) ? o : null; }
      return OV[key(d, n)] || null; }catch(e){ return null; } }
  function chips(o){ if(!o) return '';   /* only the current state: an open request, else the last redo */
    if(o.asked) return '<span class="wc-chip amb" title="Management asked to redo the time-in check">Redo asked · ' + E(o.asked.reason || '') + '</span>';
    if(o.redo) return '<span class="wc-chip tl" title="The internet check was redone · this is the current result">Redone · ' + E(o.redo.time) + (o.redo.reason ? ' · ' + E(o.redo.reason) : '') + '</span>'; return ''; }
  var _nb = window.netBadge;
  if(typeof _nb === 'function') window.netBadge = function(s, ctx){ var o = ovFor(ctx), s2 = s, c2 = ctx;
    try{ if(o && o.redo && o.redo.speed){ s2 = o.redo.speed; c2 = Object.assign({}, ctx || {}, { orig: String(s || ''), redo: o.redo.time }); }
      else if(o && !String(s || '').trim() && o.full){ s2 = o.full; } }catch(e){}
    return _nb.call(this, s2, c2) + chips(o); };
  var _nd = window.netDetail1210;
  if(typeof _nd === 'function') window.netDetail1210 = function(el){ var r = _nd.apply(this, arguments); try{ var c = {}; try{ c = JSON.parse(el.getAttribute('data-nbc') || '{}'); }catch(e){} var sb = document.getElementById('sheetBody'); if(!sb) return r;
      var bs = sb.querySelectorAll('button.btn.ghost.block'), cl = bs[bs.length - 1], o = ovFor(c), h = '';
      if(c.redo) h += '<div class="small" style="margin-top:10px;padding:10px 12px;border-radius:12px;background:#E3F4F5;color:#00575F"><b>Redone · ' + E(c.redo) + '</b> · this is now the time-in\'s internet result. First check ' + E(c.at || '') + ' · ' + E(c.orig || 'not measured') + ' · replaced by the redo ' + E(c.redo) + '. The time-in time and On time / Late stay the original.</div>';
      if(o && o.redo && o.redo.proof && D && D.mgr) h += '<a class="btn sm ghost" style="margin-top:8px" href="' + E(o.redo.proof) + '" target="_blank" rel="noopener">Re-check screen proof ↗</a>' + (o.redo.loc ? '<div class="small mute" style="margin-top:4px">Re-check location ' + E(o.redo.loc) + '</div>' : '');
      if(o && o.asked) h += '<div class="small" style="margin-top:10px;padding:10px 12px;border-radius:12px;background:#FFF4DE;color:#7A4A00"><b>Redo asked</b> ' + E(o.asked.at || '') + ' · ' + E(o.asked.reason || '') + '</div>';
      if(D && D.mgr && c.who && c.kind !== 'class') h += '<button class="btn ghost block" style="margin-top:10px" onclick="wcAsk1270(\'' + E(String(c.who).replace(/'/g, '')) + '\')">Ask to redo check</button>';
      if(h){ if(cl) cl.insertAdjacentHTML('beforebegin', h); else sb.insertAdjacentHTML('beforeend', h); } }catch(e){} return r; };
  var RS = ['Internet too weak', 'Screen proof not clear / not entire screen', 'Wi-Fi not LAN', 'Not the class laptop', 'Other'], PICK = [];
  window.wcAsk1270 = function(who){ PICK = []; who = String(who || '').replace(/^teacher\s+/i, '');
    openSheet('<div class="wc70"><h1>Ask ' + E(who) + ' to redo the time-in check</h1><div class="mute small">The time-in time and On time / Late stay as they are. ' + E(who) + ' sees it at the top of Today, re-checks internet, screen and location, and posts a new picture in the WeChat corner.</div>'
      + '<div class="wc-rs" id="wcRs">' + RS.map(function(x, i){ return '<button type="button" aria-pressed="false" onclick="wcPick1270(' + i + ',this)">' + E(x) + '</button>'; }).join('') + '</div>'
      + '<textarea id="wcRt" rows="2" placeholder="Add a note (needed for Other)" style="margin-top:10px;width:100%;box-sizing:border-box"></textarea>'
      + '<button class="btn teal block" id="wcRgo" style="margin-top:12px" onclick="wcAskGo1270(\'' + E(who.replace(/'/g, '')) + '\')">Send the request</button></div>'); };
  window.wcPick1270 = function(i, b){ var k = PICK.indexOf(i); if(k < 0) PICK.push(i); else PICK.splice(k, 1); b.classList.toggle('on', k < 0); b.setAttribute('aria-pressed', k < 0 ? 'true' : 'false'); };
  window.wcAskGo1270 = async function(who){ var t = (document.getElementById('wcRt') || {}).value || '', L = PICK.filter(function(i){ return RS[i] !== 'Other'; }).map(function(i){ return RS[i]; });
    if(PICK.indexOf(RS.length - 1) > -1 && !t.trim()) return toast('Write what to redo for Other');
    if(t.trim()) L.push(t.trim()); if(!L.length) return toast('Pick a reason or write one'); var b = document.getElementById('wcRgo'); if(b){ b.disabled = true; b.textContent = 'Sending…'; }
    var r = await call('ask', { teacher: who, reason: L.join(' · ') });
    if(r && r.ok){ var k = key(today(), who); OV[k] = Object.assign(OV[k] || {}, { asked: { reason: L.join(' · '), at: hmM(Date.now()) } }); OVSIG = ''; closeSheet(); toast('Asked · ' + who + ' sees it at the top of Today'); deco(true); setTimeout(function(){ loadDay(true); }, 1500); }
    else { if(b){ b.disabled = false; b.textContent = 'Send the request'; } toast('Not sent · try again'); } };
  /* rows on Team (time-ins) and Monitor: the current internet (redo wins), WeChat posted, redo status, Ask to redo */
  function deco(force){ try{ if(typeof D === 'undefined' || !D || !D.mgr) return; var d = today();
    [].forEach.call(document.querySelectorAll('#v-team .ti-list .ti-r'), function(row){ var nm = row.querySelector('.ti-who b'), tin = row.querySelector('.ti-in b'); if(!nm) return; var who = nm.textContent.replace(/^teacher\s+/i, '').trim(), o = OV[key(d, who)] || {}, sig = JSON.stringify(o);
      if(row.dataset.w1270 === sig && !force) return; row.dataset.w1270 = sig; var tags = row.querySelector('.ti-tags'); if(!tags) return; var timed = !!(tin && /\d/.test(tin.textContent));
      [].forEach.call(tags.querySelectorAll('.wc-x'), function(x){ x.remove(); });
      var q = tags.querySelector('.ti-q'), cur = o.redo && o.redo.speed ? o.redo.speed : (!q && o.full ? o.full : '');
      if(q) q.style.display = o.redo && o.redo.speed ? 'none' : '';
      var orig = q ? ((q.getAttribute('data-nb') || '') || ((q.getAttribute('title') || '').match(/((?:↓|~)[^·]*(?:·[^·]*){0,3}ms(?: · jitter [\d.]+ ms)?)/) || ['', ''])[1]) : '';
      if(cur){ var cx = { kind: 'timein', who: who, date: d, at: tin ? tin.textContent : '' }; if(o.redo && o.redo.speed){ cx.orig = orig.trim(); cx.redo = o.redo.time; } var nb = '<span class="wc-x">' + _nb(cur, cx) + '</span>'; if(q) q.insertAdjacentHTML('afterend', nb); else tags.insertAdjacentHTML('afterbegin', nb); }
      var h = chips(o); if(timed) h += (o.posted ? '<span class="wc-chip ok" title="Posted the time-in picture in the WeChat corner">WeChat ✓ ' + E(o.posted) + '</span>' : '<span class="wc-chip no">WeChat not posted</span>') + '<button type="button" class="wc-ask" onclick="event.stopPropagation();wcAsk1270(\'' + E(who.replace(/'/g, '')) + '\')">Ask to redo check</button>';
      if(h) tags.insertAdjacentHTML('beforeend', '<span class="wc-x">' + h + '</span>'); });
    [].forEach.call(document.querySelectorAll('#v-monitor .mo-r'), function(row){ var nm = row.querySelector('b'), cell = nm && nm.nextElementSibling; if(!nm || !cell) return; var who = nm.textContent.trim(), o = OV[key((window.M && M.day) || d, who)] || {}, sig = JSON.stringify(o);
      if(row.dataset.w1270 === sig && !force) return; row.dataset.w1270 = sig; var old = cell.querySelector('.wc-mo'); if(old) old.remove();
      if(!/\d/.test(cell.textContent)) return; var h = (o.posted ? '<span class="wc-chip ok">WeChat ✓</span>' : '<span class="wc-chip no">WeChat –</span>') + (o.asked ? '<span class="wc-chip amb">Redo asked</span>' : o.redo ? '<span class="wc-chip tl">Redone ' + E(o.redo.time) + '</span>' : '');
      cell.insertAdjacentHTML('beforeend', '<span class="wc-mo">' + h + '</span>'); }); }catch(e){} }
  var mq = 0, mo = new MutationObserver(function(){ if(mq) return; mq = 1; queueMicrotask(function(){ mq = 0; deco(false); }); });
  (function w(){ var a = document.getElementById('v-team'), b = document.getElementById('v-monitor'); if(a) mo.observe(a, { childList: true, subtree: true }); if(b) mo.observe(b, { childList: true, subtree: true }); if(!a && !b) setTimeout(w, 1500); })();
  setInterval(function(){ try{ if(typeof VIEW !== 'undefined' && (VIEW === 'team' || VIEW === 'monitor') && !document.hidden) loadDay(); }catch(e){} }, 20000);
  var _go = window.go; if(typeof _go === 'function') window.go = function(v){ var r = _go.apply(this, arguments); try{ if(v === 'team' || v === 'monitor') loadDay(); if(v === 'today') mine(); }catch(e){} return r; };
  setTimeout(function(){ try{ if(D && D.mgr) loadDay(true); else mine(true); }catch(e){} }, 2500);
})();
</script>
