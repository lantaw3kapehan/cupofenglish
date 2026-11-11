/* 2084 / 2085 (11 Nov, Misty: Finance for the President "like an account manager communicates with the president" · "I wanted to enter it
   here" · "Make it minimal, straightforward, effective, targeted"). Finance › Briefing, President only, first Finance tab.
   v2 (2085): shorter; the peso bank balance and the yuan rate are typed in here and kept in the database (coe-finbrief settings), so every
   device and the Forecast use the same figures. Decisions are a record only. Numbers: the Forecast engine (fc980, expected case) and Packages. */
(function(){
  if(window.__2084) return; window.__2084 = 1;
  var FB = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-finbrief';
  var pres = function(){ try{ return typeof isPres === 'function' && isPres(); }catch(e){ return false; } };
  var tok = function(){ try{ return TOKEN; }catch(e){ return ''; } };
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ML = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var mName = function(m){ return ML[+String(m).slice(5, 7) - 1] || m; };
  var dL = function(d){ var x = new Date(String(d).slice(0, 10) + 'T12:00:00+08:00'); return x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Manila' }); };
  var dS = function(t){ return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Manila' }); };
  var addD = function(d, n){ var x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  var phToday = function(){ return new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); };
  var about = function(v){ if(v == null || isNaN(v)) return null; var a = Math.abs(v), r = a >= 100000 ? Math.round(a / 1000) * 1000 : a >= 10000 ? Math.round(a / 500) * 500 : Math.round(a / 100) * 100; return (v < 0 ? '−' : '') + '₱' + r.toLocaleString('en-US'); };
  var peso = function(v){ return v == null ? '—' : '₱' + Math.round(v).toLocaleString('en-US'); };
  var yuan = function(v){ return v == null ? '—' : '¥' + Math.round(v).toLocaleString('en-US'); };
  var N = function(x){ var n = Number(String(x == null ? '' : x).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? 0 : n; };

  var css = [
    '#v-finbrief{max-width:860px}',
    '#v-finbrief h1{font-family:var(--ui-brand,"Fredoka One",sans-serif);font-weight:400;font-size:var(--fs-h1,26px);color:var(--ui-ink,#2f2752);margin:0}',
    '#v-finbrief .fbz-from{font-size:13px;color:var(--ui-mute,#6B6782);margin:2px 0 12px}',
    '#v-finbrief .fbz-card{background:#fff;border:1px solid var(--ui-line,#E9E7F0);border-radius:var(--ui-r,14px);padding:16px 18px;margin:0 0 12px}',
    '#v-finbrief .fbz-card h2{font-size:16px;font-weight:700;color:var(--ui-ink,#2f2752);margin:0 0 6px}',
    '#v-finbrief .fbz-say{font-size:17px;line-height:1.55;color:#2A2540;margin:8px 0 0}',
    '#v-finbrief .fbz-light{display:inline-flex;align-items:center;gap:8px;font-weight:700;border-radius:999px;padding:5px 12px;font-size:14px}',
    '#v-finbrief .fbz-light i{width:10px;height:10px;border-radius:50%;display:inline-block}',
    '#v-finbrief .g{background:#E8F4EE;color:#1F6B4A}#v-finbrief .g i{background:#2E9D6B}',
    '#v-finbrief .a{background:#FFF5E6;color:#87560D}#v-finbrief .a i{background:#E0A030}',
    '#v-finbrief .r{background:#FBEDEA;color:#9A4330}#v-finbrief .r i{background:#D0533A}',
    '#v-finbrief .n{background:#F1F0F6;color:#4F4A68}#v-finbrief .n i{background:#9A96AE}',
    '#v-finbrief .fbz-k{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 12px}',
    '@media(max-width:700px){#v-finbrief .fbz-k{grid-template-columns:1fr}}',
    '#v-finbrief .fbz-k>div{background:#fff;border:1px solid var(--ui-line,#E9E7F0);border-radius:var(--ui-r,14px);padding:12px 14px}',
    '#v-finbrief .fbz-k span{display:block;font-size:13px;color:var(--ui-mute,#6B6782);font-weight:600}',
    '#v-finbrief .fbz-k b{display:block;font-size:24px;color:var(--ui-ink,#2f2752);margin:4px 0 2px;font-variant-numeric:tabular-nums}',
    '#v-finbrief .fbz-k small{display:block;font-size:13px;color:var(--ui-mute,#6B6782)}',
    '#v-finbrief .fbz-k b.in{color:#1F6B4A}#v-finbrief .fbz-k b.out{color:#9A4330}',
    '#v-finbrief .fbz-d{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:10px 0;border-top:1px solid #F1F0F6;flex-wrap:wrap}',
    '#v-finbrief .fbz-card h2+.fbz-d{border-top:0}',
    '#v-finbrief .fbz-d .t{flex:1 1 300px;font-size:15px;line-height:1.45;color:#2A2540}',
    '#v-finbrief .fbz-d .b{display:flex;gap:6px;flex-wrap:wrap;align-items:center}',
    '#v-finbrief .fbz-btn{border:0;border-radius:999px;padding:8px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;background:#2B2253;color:#fff}',
    '#v-finbrief .fbz-btn.gh{background:#F1F0F6;color:#2B2253}',
    '#v-finbrief .fbz-ok{font-size:13px;font-weight:700;color:#1F6B4A;background:#E8F4EE;border-radius:999px;padding:4px 10px;white-space:nowrap}',
    '#v-finbrief .fbz-wait{font-size:13px;font-weight:700;color:#87560D;background:#FFF5E6;border-radius:999px;padding:4px 10px;white-space:nowrap}',
    '#v-finbrief .fbz-in{width:150px;border:1px solid var(--ui-line,#D9D6E4);border-radius:10px;padding:8px 10px;font:inherit;font-size:15px;font-variant-numeric:tabular-nums}',
    '#v-finbrief ul.fbz-l{margin:0;padding-left:20px;font-size:15px;line-height:1.55;color:#2A2540}#v-finbrief ul.fbz-l li{margin:3px 0}',
    '#v-finbrief .fbz-up{width:100%;border-collapse:collapse;font-size:15px}',
    '#v-finbrief .fbz-up td{padding:6px 2px;border-top:1px solid #F1F0F6}',
    '#v-finbrief .fbz-up td:last-child{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '#v-finbrief .fbz-m{font-size:13px;color:var(--ui-mute,#6B6782);margin-top:6px}',
    '#v-finbrief details{margin:0 0 12px}#v-finbrief summary{cursor:pointer;font-weight:700;color:var(--ui-ink,#2f2752);font-size:15px;padding:4px 0}',
    '#v-finbrief textarea{width:100%;min-height:70px;border:1px solid var(--ui-line,#E9E7F0);border-radius:12px;padding:10px 12px;font:inherit;font-size:15px;box-sizing:border-box;margin-top:6px}',
    '#v-finbrief .fbz-note{border-top:1px solid #F1F0F6;padding:7px 0;font-size:14px;line-height:1.45;white-space:pre-line}',
    '#v-finbrief .fbz-note small{display:block;color:var(--ui-mute,#6B6782);font-size:12px}',
    '#v-finbrief .fbz-links{font-size:13px;color:var(--ui-mute,#6B6782);margin:4px 0 30px}',
    '#v-finbrief .fbz-links a{color:#1E6F6A;font-weight:700;cursor:pointer;margin-right:12px}'
  ].join('');
  try{ var st = document.createElement('style'); st.id = 's2084'; st.textContent = css; document.head.appendChild(st); }catch(e){}

  var B = { rows: null, set: null, edit: {} };
  function post(body){ return fetch(FB, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: tok() }, body)) }).then(function(x){ return x.json(); }); }
  function last(ref){ return (B.rows || []).filter(function(x){ return x.ref === ref && x.kind !== 'note'; })[0] || null; }
  /* the shared figures go into the Forecast's assumptions (this device too), so the Forecast and the Briefing agree */
  function applySet(){ var S = B.set; if(!S || !window.fc980 || !fc980.st) return; try{ var A = fc980.st().A, ch = 0;
      if(S.phpBank && S.phpBank.value && S.phpBank.value.amount != null){ if(A.phpBank !== +S.phpBank.value.amount || A.phpBankDate !== S.phpBank.value.date){ A.phpBank = +S.phpBank.value.amount; A.phpBankDate = S.phpBank.value.date || ''; ch = 1; } }
      if(S.rate && S.rate.value != null && A.rate !== +S.rate.value){ A.rate = +S.rate.value; ch = 1; }
      if(ch) try{ localStorage.setItem('coe.fc980', JSON.stringify(A)); }catch(e){} }catch(e){} }
  function loadAll(){ if(!pres()) return Promise.resolve();
    return Promise.all([
      post({ op: 'get' }).then(function(r){ if(r && r.ok) B.rows = r.rows || []; }).catch(function(){}),
      post({ op: 'settings' }).then(function(r){ if(r && r.ok){ B.set = r.settings || {}; applySet(); } }).catch(function(){})]); }
  function engine(){ try{ if(!window.fc980 || !fc980.inputs || !fc980.st) return null; var S = fc980.st(), A = Object.assign({}, S.A, { sc: 'e' }); return { R: fc980.build(fc980.inputs(), A), S: S }; }catch(e){ try{ console.warn('2084', e); }catch(x){} return null; } }
  function startLoads(){ try{ if(window.fc980 && fc980.load) fc980.load(); }catch(e){}
    try{ if((typeof AT === 'undefined' || !AT) && typeof loadActive === 'function') loadActive(true); }catch(e){}
    loadAll().then(paint);
    var n = 0, iv = setInterval(function(){ n++; var busy = false; try{ busy = !!(window.fc980 && fc980.st && fc980.st().busy); }catch(e){}
      if(typeof VIEW === 'undefined' || VIEW !== 'finbrief'){ clearInterval(iv); return; }
      if(!document.activeElement || !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) paint(); if((!busy && n > 2) || n > 30) clearInterval(iv); }, 800); }

  function compose(){ var X = engine(); if(!X || !X.R) return null; var R = X.R, A = X.S.A, today = R.today;
    var ms = R.months || [], cm = ms.find(function(x){ return x.kind === 'cur'; }), nx = ms.filter(function(x){ return x.kind === 'fut'; })[0];
    var lm = ms.filter(function(x){ return x.kind === 'past'; }).sort(function(a, b){ return a.m < b.m ? 1 : -1; })[0] || null;
    var L = cm ? cm.lines : {}, g = function(k, sc){ var l = L[k]; return l && l.v ? l.v[sc || 'e'] : null; };
    var o = { today: today, cur: R.cur };
    o.net = g('net'); o.netLow = g('net', 'c'); o.inSoFar = (g('salesA') || 0) + (g('one') || 0); o.hasIn = !!L.salesA; o.salaries = g('sal');
    o.next = nx ? { m: nx.m, net: nx.lines.net.v.e } : null;
    o.last = lm ? { m: lm.m, net: lm.net, sales: lm.sales && lm.sales.A, cost: lm.cost, exp: lm.exp, sal: lm.sal, gov: lm.gov } : null;
    o.wal = R.wal; o.walTotal = R.wal && R.wal.Alipay != null ? (R.wal.Alipay || 0) + (R.wal.WeChat || 0) + (R.wal.CCB || 0) : null;
    var pd = A.payDay && A.payDay.e ? A.payDay.e : 9, y = +R.cur.slice(0, 4), m = +R.cur.slice(5, 7) + 1; if(m > 12){ m = 1; y++; }
    o.payDate = y + '-' + (m < 10 ? '0' : '') + m + '-' + (pd < 10 ? '0' : '') + pd;
    o.light = o.net == null ? 'n' : o.netLow != null && o.netLow >= 0 ? 'g' : o.net >= 0 ? 'a' : 'r';
    var up = [], end = addD(today, 30), cash = R.cash && R.cash.e;
    if(cash) cash.rows.forEach(function(w){ (w.items || []).forEach(function(it){ if(!it.out || !it.d || it.d <= today || it.d > end || it.a == null || (it.cur || 'PHP') !== 'PHP') return; up.push({ d: it.d, l: it.l, a: it.a }); }); });
    up.sort(function(a, b){ return a.d < b.d ? -1 : 1; }); o.up = up; o.upTotal = up.reduce(function(s, x){ return s + x.a; }, 0);
    o.bank = A.phpBank == null || A.phpBank === '' ? null : +A.phpBank; o.bankDate = A.phpBankDate || ''; o.rate = A.rate == null || A.rate === '' ? null : +A.rate;
    o.miss = R.miss || [];
    var Xp = null; try{ Xp = fc980.inputs().exp; }catch(e){}
    o.big = Xp && Xp.rows ? Xp.rows.filter(function(r){ return r.d && r.d >= addD(today, -13) && r.d <= today && N(r.a) >= 10000; }).sort(function(a, b){ return N(b.a) - N(a.a); }).slice(0, 3) : [];
    o.low = null; try{ if(typeof AT !== 'undefined' && AT && AT.cols){ var C = {}; AT.cols.forEach(function(c, i){ C[c] = i; });
      o.low = AT.rows.filter(function(r){ return r[C.active] && r[C.available] !== '' && +r[C.available] > 0 && +r[C.available] <= 5; }).map(function(r){ return { name: String(r[C.name] || r[C.code] || ''), left: +r[C.available] }; }).sort(function(a, b){ return a.left - b.left; }); } }catch(e){}
    return o; }

  /* 1 · the message */
  function head(o){ var mn = mName(o.cur);
    var lt = { g: 'On track', a: 'Okay, watch renewals', r: 'Needs attention', n: 'Waiting for numbers' }[o.light], s = '';
    if(o.net == null) s = 'I am still gathering this month\'s numbers.';
    else if(o.light === 'g') s = mn + ' is on track. I expect about <b>' + about(o.net) + '</b> left over after all costs.';
    else if(o.light === 'a') s = mn + ' should end with about <b>' + about(o.net) + '</b> left over, but only if renewals keep coming in.';
    else s = mn + ' may end about <b>' + about(o.net) + '</b>. We need a few more renewals or new students this month.';
    return '<div class="fbz-card"><span class="fbz-light ' + o.light + '"><i></i>' + lt + '</span><p class="fbz-say">' + s + '</p></div>'; }

  function tiles(o){ return '<div class="fbz-k">' +
    '<div><span>Received in ' + E(mName(o.cur)) + '</span><b>' + (o.hasIn ? about(o.inSoFar) : '—') + '</b><small>from students so far</small></div>' +
    '<div><span>Next payroll · ' + E(dL(o.payDate)) + '</span><b>' + (o.salaries == null ? '—' : about(o.salaries)) + '</b><small>' + E(mName(o.cur)) + ' salaries</small></div>' +
    '<div><span>Money we have</span><b>' + (o.bank == null ? '—' : about(o.bank)) + '</b><small>' + (o.bank == null ? 'pesos: not entered yet' : 'pesos' + (o.bankDate ? ' · ' + E(dS(o.bankDate)) : '')) + ' · ' + yuan(o.walTotal) + ' in wallets</small></div></div>'; }

  /* 2 · one action list: everything that needs the President, most important first */
  function decision(ref, text, kinds){ var x = last(ref), b = '';
    if(x && (x.kind === 'approve' || x.kind === 'noted')) b = '<span class="fbz-ok">' + (x.kind === 'approve' ? 'Approved' : 'Noted') + ' · ' + E(dS(x.at)) + '</span>';
    else { if(x && x.kind === 'notyet') b = '<span class="fbz-wait">Not yet · ' + E(dS(x.at)) + '</span>';
      b += kinds.map(function(k){ return '<button class="fbz-btn' + (k === 'notyet' ? ' gh' : '') + '" onclick="fbz2084(\'' + k + '\',\'' + E(ref) + '\',this)" data-label="' + E(text.replace(/<[^>]+>/g, '')) + '">' + { approve: 'Approve', notyet: 'Not yet', noted: 'Noted' }[k] + '</button>'; }).join(''); }
    return '<div class="fbz-d"><div class="t">' + text + '</div><div class="b">' + b + '</div></div>'; }
  function field(key, text, val, ph, unit){ var editing = B.edit[key] || val == null;
    var b = editing ? (unit || '') + '<input class="fbz-in" id="fbzIn_' + key + '" inputmode="decimal" placeholder="' + E(ph) + '" value="' + (val == null ? '' : E(val)) + '" onkeydown="if(event.key===\'Enter\')fbz2084set(\'' + key + '\',this)"><button class="fbz-btn" onclick="fbz2084set(\'' + key + '\',this)">Save</button>'
      : '<span class="fbz-ok">' + E(unit === '₱' ? peso(val) : String(val)) + '</span><button class="fbz-btn gh" onclick="fbz2084edit(\'' + key + '\')">Update</button>';
    return '<div class="fbz-d"><div class="t">' + text + '</div><div class="b">' + b + '</div></div>'; }
  function actions(o){ var D = [], cover = '';
    if(o.bank != null && o.up.length){ var left = o.bank - o.upTotal; cover = left >= 0 ? ' Covers the next 30 days of payments (' + about(o.upTotal) + ') with ' + about(left) + ' to spare.' : ' <b>Not enough</b> for the next 30 days (' + about(o.upTotal) + '): send about ' + about(-left) + ' from the yuan wallets.'; }
    D.push(field('phpBank', '<b>Peso bank balance</b> (with cash on hand)' + (o.bankDate ? ', as of ' + E(dS(o.bankDate)) : '') + '.' + cover, o.bank, 'e.g. 250000', '₱'));
    if(o.salaries != null) D.push(decision('payroll:' + o.cur, 'Approve <b>' + E(mName(o.cur)) + ' payroll</b>, about <b>' + about(o.salaries) + '</b>, paid ' + E(dL(o.payDate)) + '.', ['approve', 'notyet']));
    if(o.last && o.last.net != null) D.push(decision('books:' + o.last.m, 'Sign off <b>' + E(mName(o.last.m)) + '</b>: received ' + about(o.last.sales) + ', spent ' + about(o.last.cost) + ', kept <b>' + about(o.last.net) + '</b>.', ['approve', 'notyet']));
    (o.big || []).forEach(function(r){ D.push(decision('big:' + r.d + ':' + Math.round(N(r.a)) + ':' + String(r.t || r.c || '').slice(0, 30), 'Large payment: <b>' + peso(N(r.a)) + '</b> · ' + E(r.t || r.c || 'expense') + ' · ' + E(dS(r.d + 'T12:00:00+08:00')) + '.', ['noted'])); });
    if(o.miss.some(function(x){ return x.k === 'rate'; }) || o.rate != null) D.push(field('rate', '<b>Yuan-to-peso rate</b> we get when sending money home (pesos for ¥1).', o.rate, 'e.g. 8.10', '₱'.slice(0, 0)));
    return '<div class="fbz-card"><h2>For you</h2>' + D.join('') + '<div class="fbz-m">Approving is a record only. It does not move money.</div></div>'; }

  /* 3 · grow: the one thing that brings money in fastest */
  function grow(o){ if(!o.low || !o.low.length) return '';
    return '<div class="fbz-card"><h2>Next move: renewals</h2><div style="font-size:15px;line-height:1.5"><b>' + o.low.length + ' student' + (o.low.length === 1 ? '' : 's') + '</b> have 5 or fewer lessons left. Talk to their parents this week: ' +
      o.low.slice(0, 5).map(function(x){ return E(x.name) + ' (' + x.left + ')'; }).join(', ') + (o.low.length > 5 ? ' +' + (o.low.length - 5) + ' more' : '') + '.</div><div class="fbz-links" style="margin:8px 0 0"><a onclick="go(\'astudents\')">Open Students ›</a></div></div>'; }

  /* 4 · coming up + watch, short */
  function ahead(o){ var rows = (o.up || []).slice(0, 4).map(function(x){ return '<tr><td>' + E(dL(x.d)) + ' · ' + E(String(x.l).replace(/\s*\((estimate|future-dated in EXPENSES)[^)]*\)/i, '').replace(/ · .*$/, '')) + '</td><td>' + about(x.a) + '</td></tr>'; }).join('');
    var W = [];
    if(o.miss.some(function(x){ return /remit/i.test(x.t || ''); })) W.push('Plan a transfer from the yuan wallets before ' + E(dL(o.payDate)) + ' (salaries are paid in pesos).');
    if(o.miss.some(function(x){ return x.k === 'neg'; })) W.push('CCB wallet is slightly short; top it up before its next payment.');
    if(o.miss.some(function(x){ return /13th/i.test(x.t || ''); })) W.push('13th-month pay (December) is not in the plan yet.');
    if(!rows && !W.length) return '';
    return '<div class="fbz-card"><h2>Coming up</h2>' + (rows ? '<table class="fbz-up">' + rows + '</table>' : '') + (W.length ? '<ul class="fbz-l" style="margin-top:8px">' + W.slice(0, 3).map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') + '</div>'; }

  function more(){ var L = (B.rows || []).filter(function(x){ return x.kind === 'note'; }).slice(0, 5), T = (B.rows || []).filter(function(x){ return x.kind !== 'note'; }).slice(0, 8);
    var lab = function(x){ var m = /^set:(\w+)/.exec(x.ref || ''); if(m) return { phpBank: 'Peso bank balance updated', rate: 'Yuan rate updated' }[m[1]] || 'Figure updated'; return { approve: 'Approved', notyet: 'Not yet', noted: 'Noted' }[x.kind] + ' · ' + x.label; };
    var t = function(x){ return E(new Date(x.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' })); };
    return '<details class="fbz-card"' + (B.open ? ' open' : '') + ' ontoggle="window.__fbzOpen=this.open"><summary>Notes and record</summary>' +
      '<textarea id="fbzNote" placeholder="A note in your own words, e.g. rent goes up in January."></textarea><div style="margin-top:6px"><button class="fbz-btn" onclick="fbz2084note(this)">Save note</button></div>' +
      L.map(function(x){ return '<div class="fbz-note">' + E(x.body) + '<small>' + t(x) + ' · <a style="cursor:pointer;color:#9A4330" onclick="fbz2084rm(' + (+x.id) + ')">Remove</a></small></div>'; }).join('') +
      T.map(function(x){ return '<div class="fbz-note">' + E(lab(x)) + '<small>' + t(x) + '</small></div>'; }).join('') + '</details>'; }

  function paint(){ var v = document.getElementById('v-finbrief'); if(!v) return; if(!pres()){ v.innerHTML = '<div class="empty">The briefing is for the President.</div>'; return; }
    var keep = ''; try{ var ta = document.getElementById('fbzNote'); if(ta) keep = ta.value; }catch(e){} B.open = !!window.__fbzOpen;
    var h = '<h1>Briefing</h1><div class="fbz-from">From your accounts manager · ' + E(new Date().toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' })) + '</div>';
    var o = compose();
    if(!o){ v.innerHTML = h + '<div class="fbz-card"><p class="fbz-say" style="margin:0">One moment, I am gathering the numbers…</p></div>'; return; }
    v.innerHTML = h + head(o) + tiles(o) + actions(o) + grow(o) + ahead(o) + more() +
      '<div class="fbz-links">Details: <a onclick="go(\'finov\')">Overview</a><a onclick="go(\'payroll\')">Payroll</a><a onclick="go(\'forecast\')">Forecast</a><a onclick="go(\'wallets\')">Wallets</a></div>';
    if(keep){ var t2 = document.getElementById('fbzNote'); if(t2) t2.value = keep; } }

  var say = function(t){ try{ toast(t); }catch(e){} };
  window.fbz2084 = function(kind, ref, btn){ var label = btn && btn.getAttribute('data-label') || ''; if(btn) btn.disabled = true;
    post({ op: 'add', kind: kind, ref: ref, label: label }).then(function(r){ if(r && r.ok){ (B.rows = B.rows || []).unshift(r.row); say({ approve: 'Approved · saved in the record', notyet: 'Okay, I will ask again later', noted: 'Noted' }[kind]); paint(); }
      else { if(btn) btn.disabled = false; say('Not saved · ' + ((r && r.error) || 'try again')); } }).catch(function(){ if(btn) btn.disabled = false; say('Not saved · check your internet'); }); };
  window.fbz2084edit = function(key){ B.edit[key] = 1; paint(); setTimeout(function(){ var i = document.getElementById('fbzIn_' + key); if(i){ i.focus(); i.select(); } }, 30); };
  window.fbz2084set = function(key, el){ var i = document.getElementById('fbzIn_' + key), raw = i ? i.value : '', n = Number(String(raw).replace(/[₱,\s]/g, ''));
    if(!raw.trim() || isNaN(n) || n < 0 || (key === 'rate' && (n < 1 || n > 30))){ say(key === 'rate' ? 'Enter pesos for ¥1, e.g. 8.10' : 'Enter the amount in pesos, e.g. 250000'); return; }
    var value = key === 'phpBank' ? { amount: Math.round(n * 100) / 100, date: phToday() } : n;
    post({ op: 'set', key: key, value: value }).then(function(r){ if(r && r.ok){ B.set = B.set || {}; B.set[key] = { value: value, at: new Date().toISOString() }; applySet(); delete B.edit[key]; say('Saved · every device and the Forecast use it now'); loadAll().then(paint); paint(); }
      else say('Not saved · ' + ((r && r.error) || 'try again')); }).catch(function(){ say('Not saved · check your internet'); }); };
  window.fbz2084note = function(btn){ var ta = document.getElementById('fbzNote'), body = ta ? ta.value.trim() : ''; if(!body){ say('Write a note first'); return; } if(btn) btn.disabled = true;
    post({ op: 'add', kind: 'note', ref: 'note', body: body }).then(function(r){ if(btn) btn.disabled = false; if(r && r.ok){ (B.rows = B.rows || []).unshift(r.row); if(ta) ta.value = ''; say('Note saved'); paint(); } else say('Not saved · ' + ((r && r.error) || 'try again')); })
      .catch(function(){ if(btn) btn.disabled = false; say('Not saved · check your internet'); }); };
  window.fbz2084rm = function(id){ post({ op: 'remove', id: id }).then(function(r){ if(r && r.ok){ B.rows = (B.rows || []).filter(function(x){ return x.id !== id; }); paint(); } }).catch(function(){}); };

  try{ if(typeof VIEWS !== 'undefined' && VIEWS.indexOf('finbrief') < 0) VIEWS.push('finbrief');
    if(!document.getElementById('v-finbrief')){ var dv = document.createElement('div'); dv.id = 'v-finbrief'; dv.className = 'hide'; var ref = document.getElementById('v-finov') || document.getElementById('v-money'); if(ref) ref.parentNode.insertBefore(dv, ref); } }catch(e){}
  var _go = window.go; if(typeof _go === 'function') window.go = function(v){
    try{ var ev = window.event; if(v === 'finov' && pres() && ev && ev.type === 'click' && ev.target && ev.target.closest && ev.target.closest('#navIn [data-v="payroll"], nav [data-v="payroll"]')) v = 'finbrief'; }catch(e){}
    var r = _go.apply(this, [v].concat([].slice.call(arguments, 1)));
    try{ if(v === 'finbrief'){ paint(); startLoads(); } if(v === 'forecast' && pres()) loadAll().then(function(){ try{ if(window.fc980 && fc980.load) fc980.load(); }catch(e){} }); }catch(e){ try{ console.warn('2084', e); }catch(x){} }
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'finbrief'){ paint(); startLoads(); } }catch(e){}
})();
