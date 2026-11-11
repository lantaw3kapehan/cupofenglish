/* 2084 (11 Nov, Misty: Finance for the President "like an accounting manager and president POV, but president is not good with numbers so make it
   easy" · "like an account manager communicates with the president" · "ensure it's easy for the president to understand, and help the operations
   thrive successfully and positively"). Finance › Briefing, President only, the first tab of Finance (the sidebar's Finance opens it).
   The accounts manager speaks to the President in plain words: where we stand, four simple numbers, what is going well, what I need you to
   decide (Approve / Not yet / Noted · a paper trail only, nothing is blocked), what is coming up, what to watch, the manager's notes.
   Numbers come from the Forecast engine (fc980, expected case) and the packages list; nothing here changes any record except the
   President's own approvals and notes (coe-finbrief, President only). */
(function(){
  if(window.__2084) return; window.__2084 = 1;
  var FB = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-finbrief';
  var pres = function(){ try{ return typeof isPres === 'function' && isPres(); }catch(e){ return false; } };
  var tok = function(){ try{ return TOKEN; }catch(e){ return ''; } };
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ML = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var mName = function(m){ return ML[+String(m).slice(5, 7) - 1] || m; };
  var dL = function(d){ var x = new Date(String(d).slice(0, 10) + 'T12:00:00+08:00'); return x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Manila' }); };
  var addD = function(d, n){ var x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  /* round so the President reads a simple figure: ₱318,000 rather than ₱317,642.17 */
  var about = function(v){ if(v == null || isNaN(v)) return null; var a = Math.abs(v), r = a >= 100000 ? Math.round(a / 1000) * 1000 : a >= 10000 ? Math.round(a / 500) * 500 : Math.round(a / 100) * 100; return (v < 0 ? '−' : '') + '₱' + r.toLocaleString('en-US'); };
  var peso = function(v){ return v == null ? '—' : '₱' + Math.round(v).toLocaleString('en-US'); };
  var yuan = function(v){ return v == null ? '—' : '¥' + Math.round(v).toLocaleString('en-US'); };
  var N = function(x){ var n = Number(String(x == null ? '' : x).replace(/[^0-9.\-]/g, '')); return isNaN(n) ? 0 : n; };

  var css = [
    '#v-finbrief{max-width:1000px}',
    '#v-finbrief .fbz-h h1{font-family:var(--ui-brand,"Fredoka One",sans-serif);font-weight:400;font-size:var(--fs-h1,26px);color:var(--ui-ink,#2f2752);margin:0}',
    '#v-finbrief .fbz-from{font-size:var(--fs-small,13px);color:var(--ui-mute,#6B6782);margin-top:2px}',
    '#v-finbrief .fbz-card{background:#fff;border:1px solid var(--ui-line,#E9E7F0);border-radius:var(--ui-r,14px);padding:16px 18px;margin:12px 0}',
    '#v-finbrief .fbz-card h2{font-size:var(--fs-h2,16px);font-weight:700;color:var(--ui-ink,#2f2752);margin:0 0 8px}',
    '#v-finbrief .fbz-say{font-size:16px;line-height:1.6;color:#2A2540}',
    '#v-finbrief .fbz-say p{margin:0 0 8px}',
    '#v-finbrief .fbz-light{display:inline-flex;align-items:center;gap:8px;font-weight:700;border-radius:999px;padding:5px 12px;font-size:14px;margin-bottom:10px}',
    '#v-finbrief .fbz-light i{width:10px;height:10px;border-radius:50%;display:inline-block}',
    '#v-finbrief .g{background:#E8F4EE;color:#1F6B4A}#v-finbrief .g i{background:#2E9D6B}',
    '#v-finbrief .a{background:#FFF5E6;color:#87560D}#v-finbrief .a i{background:#E0A030}',
    '#v-finbrief .r{background:#FBEDEA;color:#9A4330}#v-finbrief .r i{background:#D0533A}',
    '#v-finbrief .n{background:#F1F0F6;color:#4F4A68}#v-finbrief .n i{background:#9A96AE}',
    '#v-finbrief .fbz-k{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:12px 0}',
    '@media(max-width:820px){#v-finbrief .fbz-k{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    '#v-finbrief .fbz-k>div{background:#fff;border:1px solid var(--ui-line,#E9E7F0);border-radius:var(--ui-r,14px);padding:12px 14px}',
    '#v-finbrief .fbz-k span{display:block;font-size:13px;color:var(--ui-mute,#6B6782);font-weight:600}',
    '#v-finbrief .fbz-k b{display:block;font-size:24px;color:var(--ui-ink,#2f2752);margin:4px 0 2px;font-variant-numeric:tabular-nums}',
    '#v-finbrief .fbz-k small{display:block;font-size:13px;color:var(--ui-mute,#6B6782);line-height:1.4}',
    '#v-finbrief .fbz-k b.in{color:#1F6B4A}#v-finbrief .fbz-k b.out{color:#9A4330}',
    '#v-finbrief ul.fbz-l{margin:0;padding-left:20px;font-size:15px;line-height:1.6;color:#2A2540}#v-finbrief ul.fbz-l li{margin:3px 0}',
    '#v-finbrief .fbz-d{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;padding:10px 0;border-top:1px solid #F1F0F6;flex-wrap:wrap}',
    '#v-finbrief .fbz-d:first-of-type{border-top:0}',
    '#v-finbrief .fbz-d .t{flex:1 1 320px;font-size:15px;line-height:1.5;color:#2A2540}',
    '#v-finbrief .fbz-d .t small{display:block;color:var(--ui-mute,#6B6782);font-size:13px}',
    '#v-finbrief .fbz-d .b{display:flex;gap:6px;flex-wrap:wrap}',
    '#v-finbrief .fbz-btn{border:0;border-radius:999px;padding:8px 14px;font:inherit;font-size:14px;font-weight:700;cursor:pointer;background:#2B2253;color:#fff}',
    '#v-finbrief .fbz-btn.gh{background:#F1F0F6;color:#2B2253}',
    '#v-finbrief .fbz-ok{font-size:13px;font-weight:700;color:#1F6B4A;background:#E8F4EE;border-radius:999px;padding:4px 10px;white-space:nowrap}',
    '#v-finbrief .fbz-wait{font-size:13px;font-weight:700;color:#87560D;background:#FFF5E6;border-radius:999px;padding:4px 10px;white-space:nowrap}',
    '#v-finbrief .fbz-up{width:100%;border-collapse:collapse;font-size:15px}',
    '#v-finbrief .fbz-up td{padding:7px 4px;border-top:1px solid #F1F0F6;vertical-align:top}',
    '#v-finbrief .fbz-up td:last-child{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '#v-finbrief .fbz-up td small{display:block;color:var(--ui-mute,#6B6782);font-size:13px}',
    '#v-finbrief textarea{width:100%;min-height:84px;border:1px solid var(--ui-line,#E9E7F0);border-radius:12px;padding:10px 12px;font:inherit;font-size:15px;box-sizing:border-box}',
    '#v-finbrief .fbz-note{border-top:1px solid #F1F0F6;padding:8px 0;font-size:15px;line-height:1.5;white-space:pre-line}',
    '#v-finbrief .fbz-note small{display:block;color:var(--ui-mute,#6B6782);font-size:12px}',
    '#v-finbrief .fbz-links{font-size:14px;color:var(--ui-mute,#6B6782);margin:6px 0 30px}',
    '#v-finbrief .fbz-links a{color:#1E6F6A;font-weight:700;cursor:pointer;margin-right:12px}',
    '#v-finbrief .fbz-more{font-size:13px;color:var(--ui-mute,#6B6782);margin-top:6px}'
  ].join('');
  try{ var st = document.createElement('style'); st.id = 's2084'; st.textContent = css; document.head.appendChild(st); }catch(e){}

  var B = { rows: null, busy: 0, at: 0, err: '' };
  function post(body){ return fetch(FB, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: tok() }, body)) }).then(function(x){ return x.json(); }); }
  function loadLog(){ if(!pres()) return Promise.resolve(); return post({ op: 'get' }).then(function(r){ if(r && r.ok){ B.rows = r.rows || []; B.err = ''; } else B.err = (r && r.error) || 'not available'; }).catch(function(){ B.err = 'not reachable'; }); }
  function last(ref){ return (B.rows || []).filter(function(x){ return x.ref === ref && x.kind !== 'note'; })[0] || null; }

  function engine(){ try{ if(!window.fc980 || !fc980.inputs || !fc980.st) return null; var S = fc980.st(), A = Object.assign({}, S.A, { sc: 'e' }); return { R: fc980.build(fc980.inputs(), A), S: S }; }catch(e){ try{ console.warn('2084', e); }catch(x){} return null; } }
  function startLoads(){ try{ if(window.fc980 && fc980.load) fc980.load(); }catch(e){}
    try{ if((typeof AT === 'undefined' || !AT) && typeof loadActive === 'function') loadActive(true); }catch(e){}
    loadLog().then(paint);
    var n = 0, iv = setInterval(function(){ n++; var busy = false; try{ busy = !!(window.fc980 && fc980.st && fc980.st().busy); }catch(e){}
      if(typeof VIEW === 'undefined' || VIEW !== 'finbrief'){ clearInterval(iv); return; }
      paint(); if((!busy && n > 2) || n > 30) clearInterval(iv); }, 800); }

  /* ───────── what the manager says ───────── */
  function compose(){ var X = engine(); if(!X || !X.R) return null; var R = X.R, A = X.S.A, today = R.today;
    var ms = R.months || [], cm = ms.find(function(x){ return x.kind === 'cur'; }), nx = ms.filter(function(x){ return x.kind === 'fut'; })[0];
    var past = ms.filter(function(x){ return x.kind === 'past'; }).sort(function(a, b){ return a.m < b.m ? 1 : -1; }), lm = past[0] || null;
    var L = cm ? cm.lines : {}, g = function(k, sc){ var l = L[k]; return l && l.v ? l.v[sc || 'e'] : null; };
    var o = { today: today, cur: R.cur, R: R, A: A };
    o.net = g('net'); o.netLow = g('net', 'c'); o.netHigh = g('net', 'o');
    o.inSoFar = (g('salesA') || 0) + (g('one') || 0); o.hasIn = !!(L.salesA);
    o.spentSoFar = (g('expA') || 0) + (g('salA') || 0) + (cm && cm.lines.gov && cm.lines.gov.t && /^A/.test(cm.lines.gov.t) ? 0 : 0);
    o.salaries = g('sal'); o.expMonth = g('exp'); o.salesMonth = g('sales'); o.govMonth = g('gov');
    o.next = nx ? { m: nx.m, net: nx.lines.net.v.e, low: nx.lines.net.v.c } : null;
    o.last = lm ? { m: lm.m, net: lm.net, sales: lm.sales && lm.sales.A, cost: lm.cost, exp: lm.exp, sal: lm.sal, gov: lm.gov } : null;
    o.wal = R.wal; o.walTotal = R.wal && R.wal.Alipay != null ? (R.wal.Alipay || 0) + (R.wal.WeChat || 0) + (R.wal.CCB || 0) : null;
    o.payDay = R.cur.slice(0, 7); var pd = A.payDay && A.payDay.e ? A.payDay.e : 9; var nm = (function(){ var y = +R.cur.slice(0, 4), m = +R.cur.slice(5, 7) + 1; if(m > 12){ m = 1; y++; } return y + '-' + (m < 10 ? '0' : '') + m; })();
    o.payDate = nm + '-' + (pd < 10 ? '0' : '') + pd;
    o.light = o.net == null ? 'n' : o.netLow != null && o.netLow >= 0 ? 'g' : o.net >= 0 ? 'a' : 'r';
    /* coming up: dated payments in the next 30 days (expected case) */
    var up = [], end = addD(today, 30), cash = R.cash && R.cash.e;
    if(cash) cash.rows.forEach(function(w){ (w.items || []).forEach(function(it){ if(!it.out || !it.d || it.d <= today || it.d > end || it.a == null) return; up.push({ d: it.d, l: it.l, a: it.a, cur: it.cur || 'PHP', t: it.t }); }); });
    up.sort(function(a, b){ return a.d < b.d ? -1 : 1; }); o.up = up;
    o.upTotal = up.filter(function(x){ return x.cur !== 'CNY'; }).reduce(function(s, x){ return s + x.a; }, 0);
    o.bank = A.phpBank == null || A.phpBank === '' ? null : +A.phpBank; o.bankDate = A.phpBankDate || '';
    o.miss = (R.miss || []);
    /* this week: payments in and bills out, last 7 days */
    var Xp = null; try{ Xp = fc980.inputs().exp; }catch(e){}
    var wk0 = addD(today, -6);
    o.salesWk = Xp && Xp.sales ? Xp.sales.filter(function(r){ return r.d && r.d >= wk0 && r.d <= today; }) : null;
    o.expWk = Xp && Xp.rows ? Xp.rows.filter(function(r){ return r.d && r.d >= wk0 && r.d <= today && !/government contributions/i.test(r.c || ''); }) : null;
    o.big = Xp && Xp.rows ? Xp.rows.filter(function(r){ return r.d && r.d >= addD(today, -13) && r.d <= today && N(r.a) >= 10000; }).sort(function(a, b){ return N(b.a) - N(a.a); }).slice(0, 4) : [];
    /* renewals: active packages with 5 or fewer lessons left */
    o.low = null; try{ if(typeof AT !== 'undefined' && AT && AT.cols){ var C = {}; AT.cols.forEach(function(c, i){ C[c] = i; });
      o.low = AT.rows.filter(function(r){ return r[C.active] && r[C.available] !== '' && +r[C.available] > 0 && +r[C.available] <= 5; }).map(function(r){ return { name: String(r[C.name] || r[C.code] || ''), left: +r[C.available] }; }).sort(function(a, b){ return a.left - b.left; }); } }catch(e){}
    return o; }

  function hello(){ var h = +new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: 'Asia/Manila' }); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; }

  function sayTop(o){ var mn = mName(o.cur), p = [];
    var lt = { g: 'Healthy month', a: 'Fine, but keep an eye on it', r: 'Needs attention', n: 'Still gathering the numbers' }[o.light];
    var h = '<div class="fbz-light ' + o.light + '"><i></i>' + lt + '</div><div class="fbz-say">';
    p.push(hello() + ', President. Here is where we stand for ' + mn + '.');
    if(o.hasIn) p.push('So far this month we have received <b>' + about(o.inSoFar) + '</b> from students.');
    if(o.net != null){
      p.push('If the rest of ' + mn + ' goes like a normal month, I expect us to finish with about <b>' + about(o.net) + '</b> ' + (o.net >= 0 ? 'left over' : 'short') + ' after paying salaries, bills and government dues.');
      if(o.light === 'g') p.push('Even if renewals are slower than usual, we should still stay above zero. 👍');
      else if(o.light === 'a') p.push('We should be fine, but if renewals are slow we could end the month a little short (about ' + about(o.netLow) + '). Encouraging renewals this month will help.');
      else if(o.light === 'r') p.push('At the moment we may spend more than we earn this month. Below I suggest what we can do.');
    } else p.push('I am still collecting a few numbers, so I can\'t give you the month-end figure yet. Below is what I need.');
    if(o.last && o.last.net != null) p.push(mName(o.last.m) + ' finished with ' + about(o.last.net) + ' ' + (o.last.net >= 0 ? 'left over' : 'short') + '.');
    if(o.next && o.next.net != null) p.push(mName(o.next.m) + ' looks like about ' + about(o.next.net) + ' ' + (o.next.net >= 0 ? 'left over' : 'short') + ' if things stay as they are.');
    return h + p.map(function(x){ return '<p>' + x + '</p>'; }).join('') + '</div>'; }

  function tiles(o){ var mn = mName(o.cur);
    return '<div class="fbz-k">' +
      '<div><span>Left over in ' + E(mn) + '</span><b class="' + (o.net == null ? '' : o.net >= 0 ? 'in' : 'out') + '">' + (o.net == null ? 'not yet' : about(o.net)) + '</b><small>what I expect after all costs</small></div>' +
      '<div><span>Yuan in our wallets now</span><b>' + yuan(o.walTotal) + '</b><small>Alipay ' + yuan(o.wal && o.wal.Alipay) + ' · WeChat ' + yuan(o.wal && o.wal.WeChat) + ' · CCB ' + yuan(o.wal && o.wal.CCB) + '</small></div>' +
      '<div><span>Next payroll</span><b>' + (o.salaries == null ? 'not yet' : about(o.salaries)) + '</b><small>' + E(mn) + ' salaries, paid ' + E(dL(o.payDate)) + '</small></div>' +
      '<div><span>' + E(o.next ? mName(o.next.m) : 'Next month') + ' outlook</span><b class="' + (!o.next || o.next.net == null ? '' : o.next.net >= 0 ? 'in' : 'out') + '">' + (!o.next || o.next.net == null ? 'not yet' : about(o.next.net)) + '</b><small>left over if things stay the same</small></div></div>'; }

  function wins(o){ var L = [];
    if(o.salesWk && o.salesWk.length){ var t = o.salesWk.reduce(function(s, r){ return s + N(r.a); }, 0); L.push('This week ' + o.salesWk.length + ' payment' + (o.salesWk.length === 1 ? '' : 's') + ' came in, about ' + about(t) + ' in total.'); }
    if(o.last && o.last.net != null && o.last.net > 0) L.push(mName(o.last.m) + ' ended in profit: ' + about(o.last.net) + ' left over.');
    if(o.net != null && o.last && o.last.net != null && o.net > o.last.net) L.push(mName(o.cur) + ' is on course to do better than ' + mName(o.last.m) + '.');
    var grow = [];
    if(o.low && o.low.length){ grow.push('<b>' + o.low.length + ' student' + (o.low.length === 1 ? '' : 's') + '</b> have 5 or fewer lessons left. This is the best moment to talk with their parents about renewing' + (o.low.length ? ': ' + o.low.slice(0, 6).map(function(x){ return E(x.name) + ' (' + x.left + ')'; }).join(', ') + (o.low.length > 6 ? ' and ' + (o.low.length - 6) + ' more' : '') : '') + '.'); }
    if(o.light === 'a' || o.light === 'r') grow.push('A few early renewals or one new student package would move this month back to safe.');
    var h = '<div class="fbz-card"><h2>What is going well</h2>' + (L.length ? '<ul class="fbz-l">' + L.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>' : '<div class="fbz-more">I will list the good news here as the numbers come in.</div>') + '</div>';
    if(grow.length) h += '<div class="fbz-card"><h2>Where we can grow</h2><ul class="fbz-l">' + grow.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul><div class="fbz-links" style="margin:8px 0 0"><a onclick="go(\'astudents\')">Open Students ›</a></div></div>';
    return h; }

  function decision(ref, label, sub, kinds){ var x = last(ref), b = '';
    if(x && x.kind === 'approve') b = '<span class="fbz-ok">Approved · ' + E(new Date(x.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) + '</span>';
    else if(x && x.kind === 'noted') b = '<span class="fbz-ok">Noted · ' + E(new Date(x.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) + '</span>';
    else { b = kinds.map(function(k){ return '<button class="fbz-btn' + (k === 'notyet' ? ' gh' : '') + '" onclick="fbz2084(\'' + k + '\',\'' + E(ref) + '\',this)" data-label="' + E(label.replace(/<[^>]+>/g, '')) + '">' + { approve: 'Approve', notyet: 'Not yet', noted: 'Noted' }[k] + '</button>'; }).join('');
      if(x && x.kind === 'notyet') b = '<span class="fbz-wait">Not yet · ' + E(new Date(x.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) + '</span>' + b; }
    return '<div class="fbz-d"><div class="t">' + label + (sub ? '<small>' + sub + '</small>' : '') + '</div><div class="b">' + b + '</div></div>'; }

  function decide(o){ var D = [];
    if(o.salaries != null) D.push(decision('payroll:' + o.cur, 'Approve the <b>' + E(mName(o.cur)) + ' payroll</b> of about <b>' + about(o.salaries) + '</b>, to be paid on ' + E(dL(o.payDate)) + '.', 'Teachers\' salaries for the lessons they teach this month. The exact figure is in Payroll before pay day.', ['approve', 'notyet']));
    if(o.last && o.last.net != null) D.push(decision('books:' + o.last.m, 'Sign off <b>' + E(mName(o.last.m)) + '\'s books</b>: we received ' + about(o.last.sales) + ', spent ' + about(o.last.cost) + ', and kept ' + about(o.last.net) + '.', 'Costs = salaries ' + about(o.last.sal) + ' · bills ' + about(o.last.exp) + ' · government ' + about(o.last.gov) + '.', ['approve', 'notyet']));
    (o.big || []).forEach(function(r){ D.push(decision('big:' + r.d + ':' + Math.round(N(r.a)) + ':' + String(r.t || r.c || '').slice(0, 30), 'Please note a large payment: <b>' + peso(N(r.a)) + '</b> for ' + E(r.t || r.c || 'an expense') + ' on ' + E(dL(r.d)) + '.', r.c ? 'Category: ' + E(r.c) : '', ['noted'])); });
    if(o.bank == null) D.push('<div class="fbz-d"><div class="t">Please tell me our <b>peso bank balance</b> (and cash on hand), so I can confirm we can cover payroll and bills.<small>It is not recorded anywhere in the app yet. Enter it in Forecast › Assumptions; it stays on this device.</small></div><div class="b"><button class="fbz-btn" onclick="go(\'forecast\')">Enter it</button></div></div>');
    return '<div class="fbz-card"><h2>I need you to decide</h2>' + (D.length ? D.join('') : '<div class="fbz-more">Nothing needs your decision right now.</div>') + '<div class="fbz-more">Approving here is a record for our books (who and when). It does not move any money.</div></div>'; }

  function coming(o){ var up = o.up || [];
    var rows = up.slice(0, 8).map(function(x){ return '<tr><td>' + E(dL(x.d)) + '<small>' + E(String(x.l).replace(/\s*\((estimate|future-dated in EXPENSES)[^)]*\)/i, '')) + (x.t === 'E' ? ' · estimate' : '') + '</small></td><td>' + (x.cur === 'CNY' ? yuan(x.a) : about(x.a)) + '</td></tr>'; }).join('');
    var cover = '';
    if(o.bank != null){ var left = o.bank - o.upTotal; cover = '<p class="fbz-say" style="font-size:15px;margin:8px 0 0">' + (left >= 0 ? 'Our peso balance of ' + about(o.bank) + ' covers these payments, with about ' + about(left) + ' to spare.' : 'These payments add up to more than our peso balance of ' + about(o.bank) + '. We will need to send about ' + about(-left) + ' from the yuan wallets before then.') + '</p>'; }
    else if(up.length) cover = '<p class="fbz-say" style="font-size:15px;margin:8px 0 0">Together these come to about ' + about(o.upTotal) + '. Once you tell me the peso bank balance, I can tell you if it is enough.</p>';
    return '<div class="fbz-card"><h2>Coming up in the next 30 days</h2>' + (rows ? '<table class="fbz-up">' + rows + '</table>' : '<div class="fbz-more">No dated payments in the next 30 days.</div>') + (up.length > 8 ? '<div class="fbz-more">' + (up.length - 8) + ' more in Forecast.</div>' : '') + cover + '</div>'; }

  function watch(o){ var P = [], other = 0;
    (o.miss || []).forEach(function(x){
      if(x.k === 'bank') return;   /* asked above */
      if(x.k === 'rate') P.push('Please confirm the <b>yuan-to-peso rate</b> we get when we send money home, so my peso figures are right.');
      else if(x.k === 'neg') P.push('The <b>CCB wallet</b> may run a little short soon. We may need to move some yuan into it before the next payment from it.');
      else if(/remit/i.test(x.t || '')) P.push('No <b>money transfer from the yuan wallets</b> is planned yet. Salaries are paid in pesos, so we should plan one before ' + E(dL(o.payDate)) + '.');
      else if(/13th/i.test(x.t || '')) P.push('The <b>13th-month pay</b> for December is not in my plan yet.');
      else if(/BIR/i.test(x.t || '')) P.push('<b>BIR</b> due dates for the coming months are not entered yet, so they are not in my plan.');
      else other++; });
    if(o.light === 'r') P.unshift('This month may end below zero. Let\'s hold any spending that can wait until renewals come in.');
    return '<div class="fbz-card"><h2>Things to watch</h2>' + (P.length ? '<ul class="fbz-l">' + P.map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>' : '<div class="fbz-more">Nothing to worry about right now.</div>') +
      (other ? '<div class="fbz-more">' + other + ' smaller detail' + (other === 1 ? '' : 's') + ' for the manager in <a onclick="go(\'forecast\')" style="color:#1E6F6A;font-weight:700;cursor:pointer">Forecast ›</a></div>' : '') + '</div>'; }

  function notes(){ var L = (B.rows || []).filter(function(x){ return x.kind === 'note'; }).slice(0, 6);
    var trail = (B.rows || []).filter(function(x){ return x.kind !== 'note'; }).slice(0, 8);
    var h = '<div class="fbz-card"><h2>Manager\'s note</h2><div class="fbz-more" style="margin:0 0 8px">Anything you want to add in your own words: a payment to remember, a plan, a reminder for next month.</div>' +
      '<textarea id="fbzNote" placeholder="e.g. Rent goes up from January. Plan the 13th-month pay in the first week of December."></textarea>' +
      '<div style="margin-top:8px"><button class="fbz-btn" onclick="fbz2084note(this)">Save note</button></div>' +
      L.map(function(x){ return '<div class="fbz-note">' + E(x.body) + '<small>' + E(new Date(x.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' })) + ' · <a style="cursor:pointer;color:#9A4330" onclick="fbz2084rm(' + (+x.id) + ',this)">Remove</a></small></div>'; }).join('') + '</div>';
    if(trail.length) h += '<div class="fbz-card"><h2>Your decisions (record)</h2>' + trail.map(function(x){ return '<div class="fbz-note">' + { approve: 'Approved', notyet: 'Not yet', noted: 'Noted' }[x.kind] + ' · ' + E(x.label) + '<small>' + E(new Date(x.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' })) + ' · ' + E(x.by) + '</small></div>'; }).join('') + '</div>';
    return h; }

  function paint(){ var v = document.getElementById('v-finbrief'); if(!v) return; if(!pres()){ v.innerHTML = '<div class="empty">The briefing is for the President.</div>'; return; }
    var keep = ''; try{ var ta = document.getElementById('fbzNote'); if(ta) keep = ta.value; }catch(e){}
    var o = compose(), now = new Date().toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' });
    var h = '<div class="fbz-h"><h1>Briefing</h1><div class="fbz-from">From your accounts manager · ' + E(now) + '</div></div>';
    if(!o){ v.innerHTML = h + '<div class="fbz-card"><div class="fbz-say"><p>One moment, I am gathering this month\'s numbers…</p></div></div>'; return; }
    h += '<div class="fbz-card">' + sayTop(o) + '</div>' + tiles(o) + wins(o) + decide(o) + coming(o) + watch(o) + notes() +
      '<div class="fbz-links">The full details for the manager: <a onclick="go(\'finov\')">Overview</a><a onclick="go(\'payroll\')">Payroll</a><a onclick="go(\'forecast\')">Forecast</a><a onclick="go(\'wallets\')">Wallets</a></div>';
    v.innerHTML = h;
    if(keep){ var t2 = document.getElementById('fbzNote'); if(t2) t2.value = keep; } }

  window.fbz2084 = function(kind, ref, btn){ var label = btn && btn.getAttribute('data-label') || ''; if(btn) btn.disabled = true;
    post({ op: 'add', kind: kind, ref: ref, label: label }).then(function(r){ if(r && r.ok){ (B.rows = B.rows || []).unshift(r.row); try{ toast({ approve: 'Approved · saved in the record', notyet: 'Okay · I will bring it back later', noted: 'Noted' }[kind]); }catch(e){} paint(); }
      else { if(btn) btn.disabled = false; try{ toast('Not saved · ' + ((r && r.error) || 'try again')); }catch(e){} } }).catch(function(){ if(btn) btn.disabled = false; try{ toast('Not saved · check your internet'); }catch(e){} }); };
  window.fbz2084note = function(btn){ var ta = document.getElementById('fbzNote'), body = ta ? ta.value.trim() : ''; if(!body){ try{ toast('Write a note first'); }catch(e){} return; } if(btn) btn.disabled = true;
    post({ op: 'add', kind: 'note', ref: 'note', body: body }).then(function(r){ if(btn) btn.disabled = false; if(r && r.ok){ (B.rows = B.rows || []).unshift(r.row); if(ta) ta.value = ''; try{ toast('Note saved'); }catch(e){} paint(); } else try{ toast('Not saved · ' + ((r && r.error) || 'try again')); }catch(e){} })
      .catch(function(){ if(btn) btn.disabled = false; try{ toast('Not saved · check your internet'); }catch(e){} }); };
  window.fbz2084rm = function(id, a){ post({ op: 'remove', id: id }).then(function(r){ if(r && r.ok){ B.rows = (B.rows || []).filter(function(x){ return x.id !== id; }); paint(); } }).catch(function(){}); };

  /* the view and its place in Finance */
  try{ if(typeof VIEWS !== 'undefined' && VIEWS.indexOf('finbrief') < 0) VIEWS.push('finbrief');
    if(!document.getElementById('v-finbrief')){ var dv = document.createElement('div'); dv.id = 'v-finbrief'; dv.className = 'hide'; var ref = document.getElementById('v-finov') || document.getElementById('v-money'); if(ref) ref.parentNode.insertBefore(dv, ref); } }catch(e){}
  var _go = window.go; if(typeof _go === 'function') window.go = function(v){
    try{ /* the President's sidebar Finance opens the Briefing */ var ev = window.event; if(v === 'finov' && pres() && ev && ev.type === 'click' && ev.target && ev.target.closest && ev.target.closest('#navIn [data-v="payroll"], nav [data-v="payroll"]')) v = 'finbrief'; }catch(e){}
    var r = _go.apply(this, [v].concat([].slice.call(arguments, 1)));
    try{ if(v === 'finbrief'){ paint(); startLoads(); } }catch(e){ try{ console.warn('2084', e); }catch(x){} }
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'finbrief'){ paint(); startLoads(); } }catch(e){}
})();
