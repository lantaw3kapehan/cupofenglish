/* 2084 / 2085 (11 Nov, Misty: Finance for the President "like an account manager communicates with the president" · "I wanted to enter it
   here" · "Make it minimal, straightforward, effective, targeted"). Finance › Briefing, President only, first Finance tab.
   v5 (2089): new look (Misty 19:29 "enhance visual design, layout"): hero with two bars, three numbers, two columns on a laptop, growth as
   four small pictures, finished items folded into one line, Coming up merged by day, full sentences, no redraw unless something changed.
   v4 (2088): due dates entered once (shown in Coming up, bold within 7 days), "Close last month" in the first 10 days, a Monday
   reminder. v3 (2086): one "Growing the business" card from the database (coe_fin_growth: trials → students, renewals, what a lesson earns and
   costs, teacher room) and a safety-cushion line. v2 (2085): shorter; the peso bank balance and the yuan rate are typed in here and kept in the database (coe-finbrief settings), so every
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
    '#v-finbrief{max-width:1140px;margin:0 auto;font-family:Inter,"Noto Sans SC",system-ui,-apple-system,"Segoe UI",sans-serif;color:#2A2540}',
    '#v-finbrief .bz-top{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;margin:2px 0 14px;flex-wrap:wrap}',
    '#v-finbrief h1{font-family:"Fredoka One",var(--ui-brand,sans-serif);font-weight:400;font-size:30px;color:#2f2752;margin:0;line-height:1.1}',
    '#v-finbrief .bz-from{font-size:14px;color:#6B6782;margin-top:4px}',
    '#v-finbrief .bz-card{background:#fff;border:1px solid #ECEAF2;border-radius:16px;padding:18px 20px;margin:0 0 14px;box-shadow:0 1px 2px rgba(43,34,83,.04)}',
    '#v-finbrief .bz-card h2{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:600;color:#2f2752;margin:0 0 10px}',
    '#v-finbrief .bz-card h2 .bz-n{font-size:13px;font-weight:700;background:#2B2253;color:#fff;border-radius:999px;padding:1px 8px}',
    /* hero */
    '#v-finbrief .bz-hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:22px;align-items:center;border-left:6px solid #9A96AE}',
    '#v-finbrief .bz-hero.g{border-left-color:#2E9D6B}#v-finbrief .bz-hero.a{border-left-color:#E0A030}#v-finbrief .bz-hero.r{border-left-color:#D0533A}',
    '#v-finbrief .bz-chip{display:inline-flex;align-items:center;gap:7px;font-weight:700;border-radius:999px;padding:4px 11px;font-size:13px}',
    '#v-finbrief .bz-chip i{width:8px;height:8px;border-radius:50%;display:inline-block;background:currentColor}',
    '#v-finbrief .g .bz-chip,#v-finbrief .bz-chip.g{background:#E8F4EE;color:#1F6B4A}#v-finbrief .a .bz-chip,#v-finbrief .bz-chip.a{background:#FFF5E6;color:#87560D}',
    '#v-finbrief .r .bz-chip,#v-finbrief .bz-chip.r{background:#FBEDEA;color:#9A4330}#v-finbrief .n .bz-chip{background:#F1F0F6;color:#4F4A68}',
    '#v-finbrief .bz-say{font-size:20px;line-height:1.45;color:#2f2752;margin:10px 0 0;font-weight:500}',
    '#v-finbrief .bz-say b{font-weight:700}',
    '#v-finbrief .bz-bars{display:grid;gap:10px}',
    '#v-finbrief .bz-bar>div:first-child{display:flex;justify-content:space-between;font-size:14px;color:#6B6782;margin-bottom:5px}',
    '#v-finbrief .bz-bar>div:first-child b{color:#2f2752;font-variant-numeric:tabular-nums}',
    '#v-finbrief .bz-track{height:12px;border-radius:999px;background:#F1F0F6;overflow:hidden;display:flex}',
    '#v-finbrief .bz-track span{display:block;height:100%}',
    '#v-finbrief .bz-in1{background:#0E7C7B}#v-finbrief .bz-in2{background:#9ED3CF}#v-finbrief .bz-out{background:#C9A0E8}',
    '#v-finbrief .bz-legend{font-size:12.5px;color:#6B6782;display:flex;gap:12px;flex-wrap:wrap}',
    '#v-finbrief .bz-legend i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:5px;vertical-align:-1px}',
    /* numbers */
    '#v-finbrief .bz-k{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:0 0 14px}',
    '#v-finbrief .bz-k>div{background:#fff;border:1px solid #ECEAF2;border-radius:16px;padding:14px 18px;box-shadow:0 1px 2px rgba(43,34,83,.04)}',
    '#v-finbrief .bz-k span{display:block;font-size:14px;color:#6B6782;font-weight:500}',
    '#v-finbrief .bz-k b{display:block;font-size:28px;font-weight:700;color:#2f2752;margin:6px 0 4px;font-variant-numeric:tabular-nums;letter-spacing:-.01em}',
    '#v-finbrief .bz-k small{display:block;font-size:14px;color:#6B6782;line-height:1.4}',
    /* two columns */
    '#v-finbrief .bz-cols{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:14px;align-items:start}',
    '@media(max-width:900px){#v-finbrief .bz-cols,#v-finbrief .bz-hero{grid-template-columns:1fr}#v-finbrief .bz-k{grid-template-columns:1fr}#v-finbrief .bz-say{font-size:18px}}',
    /* for you */
    '#v-finbrief .bz-d{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px 0;border-top:1px solid #F1F0F6;flex-wrap:wrap}',
    '#v-finbrief .bz-card h2+.bz-d{border-top:0;padding-top:2px}',
    '#v-finbrief .bz-d .t{flex:1 1 260px;font-size:16px;line-height:1.5}',
    '#v-finbrief .bz-d .t small{display:block;font-size:14px;color:#6B6782;margin-top:2px}',
    '#v-finbrief .bz-d .b{display:flex;gap:6px;flex-wrap:wrap;align-items:center}',
    '#v-finbrief .bz-btn{border:0;border-radius:999px;padding:9px 16px;font:inherit;font-size:14px;font-weight:600;cursor:pointer;background:#2B2253;color:#fff;min-height:38px}',
    '#v-finbrief .bz-btn.gh{background:#F1F0F6;color:#2B2253}',
    '#v-finbrief .bz-btn:hover{filter:brightness(1.08)}',
    '#v-finbrief .bz-ok{font-size:13px;font-weight:700;color:#1F6B4A;background:#E8F4EE;border-radius:999px;padding:4px 10px;white-space:nowrap}',
    '#v-finbrief .bz-wait{font-size:13px;font-weight:700;color:#87560D;background:#FFF5E6;border-radius:999px;padding:4px 10px;white-space:nowrap}',
    '#v-finbrief .bz-in{width:150px;border:1px solid #D9D6E4;border-radius:10px;padding:9px 11px;font:inherit;font-size:16px;font-variant-numeric:tabular-nums;min-height:38px;box-sizing:border-box}',
    '#v-finbrief .bz-done{font-size:14px;color:#6B6782;border-top:1px solid #F1F0F6;padding-top:10px;margin-top:4px}',
    '#v-finbrief .bz-done b{color:#1F6B4A}',
    '#v-finbrief .bz-m{font-size:13px;color:#6B6782;margin-top:8px}',
    /* coming up */
    '#v-finbrief .bz-up{display:grid;gap:8px}',
    '#v-finbrief .bz-up>div{display:grid;grid-template-columns:58px minmax(0,1fr) auto;gap:12px;align-items:center}',
    '#v-finbrief .bz-date{background:#F4F3F8;border-radius:12px;text-align:center;padding:5px 0;line-height:1.1}',
    '#v-finbrief .bz-date b{display:block;font-size:19px;color:#2f2752}#v-finbrief .bz-date small{font-size:12px;color:#6B6782;text-transform:uppercase;letter-spacing:.04em}',
    '#v-finbrief .bz-up .soon .bz-date{background:#FFF5E6}#v-finbrief .bz-up .soon .bz-date b{color:#87560D}',
    '#v-finbrief .bz-up .l{font-size:16px}#v-finbrief .bz-up .l small{display:block;font-size:13px;color:#6B6782}',
    '#v-finbrief .bz-up .v{font-size:16px;font-weight:600;font-variant-numeric:tabular-nums;text-align:right}',
    '#v-finbrief ul.bz-w{margin:12px 0 0;padding:12px 0 0 20px;border-top:1px solid #F1F0F6;font-size:15px;line-height:1.5}#v-finbrief ul.bz-w li{margin:4px 0}',
    /* growth */
    '#v-finbrief .bz-g{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
    '#v-finbrief .bz-g>div{background:#F8F7FB;border-radius:14px;padding:12px 14px}',
    '#v-finbrief .bz-g span{display:block;font-size:13px;color:#6B6782;font-weight:500}',
    '#v-finbrief .bz-g b{display:block;font-size:22px;font-weight:700;color:#2f2752;margin:4px 0 6px;font-variant-numeric:tabular-nums}',
    '#v-finbrief .bz-g small{display:block;font-size:13px;color:#6B6782;line-height:1.4}',
    '#v-finbrief .bz-mini{height:8px;border-radius:999px;background:#E9E7F0;overflow:hidden;margin:2px 0 6px}#v-finbrief .bz-mini span{display:block;height:100%;background:#0E7C7B;border-radius:999px}',
    '#v-finbrief .bz-adv{display:flex;gap:10px;align-items:flex-start;background:#EEF7F6;border-radius:14px;padding:12px 14px;margin-top:12px;font-size:15px;line-height:1.5;color:#17504F}',
    '#v-finbrief .bz-adv svg{flex:none;margin-top:2px}',
    '#v-finbrief .bz-links{font-size:14px;color:#6B6782;margin-top:10px}#v-finbrief .bz-links a{color:#00808B;font-weight:700;cursor:pointer;margin-right:14px}',
    /* notes */
    '#v-finbrief details.bz-card>summary{cursor:pointer;font-size:16px;font-weight:600;color:#2f2752;list-style:none}',
    '#v-finbrief details.bz-card>summary::-webkit-details-marker{display:none}',
    '#v-finbrief details.bz-card>summary:before{content:"›";display:inline-block;margin-right:8px;transition:transform .15s;color:#6B6782}',
    '#v-finbrief details[open].bz-card>summary:before{transform:rotate(90deg)}',
    '#v-finbrief textarea{width:100%;min-height:70px;border:1px solid #E9E7F0;border-radius:12px;padding:10px 12px;font:inherit;font-size:16px;box-sizing:border-box;margin-top:6px}',
    '#v-finbrief .bz-note{border-top:1px solid #F1F0F6;padding:8px 0;font-size:15px;line-height:1.45;white-space:pre-line}',
    '#v-finbrief .bz-note small{display:block;color:#6B6782;font-size:13px}',
    '#v-finbrief .bz-sub{font-weight:600;font-size:15px;margin:12px 0 4px;color:#2f2752}',
    '#v-finbrief .bz-foot{font-size:14px;color:#6B6782;margin:4px 0 30px}#v-finbrief .bz-foot a{color:#00808B;font-weight:700;cursor:pointer;margin-right:14px}'
  ].join('');
  try{ var st = document.createElement('style'); st.id = 's2084'; st.textContent = css; document.head.appendChild(st); }catch(e){}

  var B = { rows: null, set: null, edit: {}, growth: null };
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
      post({ op: 'settings' }).then(function(r){ if(r && r.ok){ B.set = r.settings || {}; applySet(); } }).catch(function(){}),
      post({ op: 'growth' }).then(function(r){ if(r && r.ok) B.growth = r.growth || null; }).catch(function(){})]); }
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
    o.salesMonth = g('sales'); o.costMonth = g('cost');
    o.next = nx ? { m: nx.m, net: nx.lines.net.v.e } : null;
    o.last = lm ? { m: lm.m, net: lm.net, sales: lm.sales && lm.sales.A, cost: lm.cost, exp: lm.exp, sal: lm.sal, gov: lm.gov } : null;
    o.wal = R.wal; o.walTotal = R.wal && R.wal.Alipay != null ? (R.wal.Alipay || 0) + (R.wal.WeChat || 0) + (R.wal.CCB || 0) : null;
    var pd = A.payDay && A.payDay.e ? A.payDay.e : 9, y = +R.cur.slice(0, 4), m = +R.cur.slice(5, 7) + 1; if(m > 12){ m = 1; y++; }
    o.payDate = y + '-' + (m < 10 ? '0' : '') + m + '-' + (pd < 10 ? '0' : '') + pd;
    o.light = o.net == null ? 'n' : o.netLow != null && o.netLow >= 0 ? 'g' : o.net >= 0 ? 'a' : 'r';
    /* coming up: dated peso payments in the next 30 days; the same thing on the same day is one line (parts added together, nothing at ₱0) */
    var up = {}, end = addD(today, 30), cash = R.cash && R.cash.e, clean = function(l){ return String(l || '').replace(/\s*\((estimate|future-dated in EXPENSES)[^)]*\)/i, '').replace(/ · .*$/, '').trim(); };
    if(cash) cash.rows.forEach(function(w){ (w.items || []).forEach(function(it){ if(!it.out || !it.d || it.d <= today || it.d > end || it.a == null || (it.cur || 'PHP') !== 'PHP') return;
      var k = it.d + '|' + clean(it.l).toLowerCase(); if(!up[k]) up[k] = { d: it.d, l: clean(it.l), a: 0, est: false }; up[k].a += +it.a || 0; if(it.t === 'E') up[k].est = true; }); });
    o.up = Object.keys(up).map(function(k){ return up[k]; }).filter(function(x){ return x.a >= 1; }).sort(function(a, b){ return a.d < b.d ? -1 : 1; });
    o.upTotal = o.up.reduce(function(s, x){ return s + x.a; }, 0);
    o.bank = A.phpBank == null || A.phpBank === '' ? null : +A.phpBank; o.bankDate = A.phpBankDate || ''; o.rate = A.rate == null || A.rate === '' ? null : +A.rate;
    o.miss = R.miss || []; o.walChecked = R.walChecked || '';
    o.dues = ((B.set && B.set.bir && Array.isArray(B.set.bir.value)) ? B.set.bir.value : []).filter(function(x){ return x && x.d && x.l; }).sort(function(a, b){ return a.d < b.d ? -1 : 1; });
    var Xp = null; try{ Xp = fc980.inputs().exp; }catch(e){}
    o.big = Xp && Xp.rows ? Xp.rows.filter(function(r){ return r.d && r.d >= addD(today, -13) && r.d <= today && N(r.a) >= 10000; }).sort(function(a, b){ return N(b.a) - N(a.a); }).slice(0, 3) : [];
    o.low = null; try{ if(typeof AT !== 'undefined' && AT && AT.cols){ var C = {}; AT.cols.forEach(function(c, i){ C[c] = i; });
      o.low = AT.rows.filter(function(r){ return r[C.active] && r[C.available] !== '' && +r[C.available] > 0 && +r[C.available] <= 5; }).map(function(r){ return { name: String(r[C.name] || r[C.code] || ''), left: +r[C.available] }; }).sort(function(a, b){ return a.left - b.left; }); } }catch(e){}
    return o; }

  var ICON = { tip: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0E7C7B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>' };

  /* 1 · the message, with this month in two bars: coming in (received + still expected) and going out */
  function hero(o){ var mn = mName(o.cur), lt = { g: 'On track', a: 'Okay, watch renewals', r: 'Needs attention', n: 'Waiting for numbers' }[o.light], s;
    if(o.net == null) s = 'I am still gathering this month\'s numbers.';
    else if(o.light === 'g') s = mn + ' is on track. I expect about <b>' + about(o.net) + '</b> left over after all costs.';
    else if(o.light === 'a') s = mn + ' should end with about <b>' + about(o.net) + '</b> left over, as long as renewals keep coming in.';
    else s = mn + ' may end about <b>' + about(-o.net) + ' short</b>. A few more renewals or new students this month will close the gap.';
    var bars = '';
    if(o.salesMonth != null && o.costMonth != null){ var mx = Math.max(o.salesMonth, o.costMonth, 1), rec = Math.min(o.inSoFar, o.salesMonth), rest = Math.max(0, o.salesMonth - rec);
      bars = '<div class="bz-bars"><div class="bz-bar"><div><span>Coming in this month</span><b>' + about(o.salesMonth) + '</b></div><div class="bz-track"><span class="bz-in1" style="width:' + (rec / mx * 100).toFixed(1) + '%"></span><span class="bz-in2" style="width:' + (rest / mx * 100).toFixed(1) + '%"></span></div></div>' +
        '<div class="bz-bar"><div><span>Going out this month</span><b>' + about(o.costMonth) + '</b></div><div class="bz-track"><span class="bz-out" style="width:' + (o.costMonth / mx * 100).toFixed(1) + '%"></span></div></div>' +
        '<div class="bz-legend"><span><i class="bz-in1"></i>Received</span><span><i class="bz-in2"></i>Still expected</span><span><i class="bz-out"></i>Salaries, bills and dues</span></div></div>'; }
    return '<div class="bz-card bz-hero ' + o.light + '"><div><span class="bz-chip"><i></i>' + lt + '</span><p class="bz-say">' + s + '</p></div>' + bars + '</div>'; }

  function tiles(o){ var cushion = o.salaries, gap = o.bank != null && cushion != null ? o.bank - cushion : null;
    var chip = gap == null ? '' : gap >= 0 ? '<span class="bz-chip g">One month of payroll covered</span>' : '<span class="bz-chip r">' + about(-gap) + ' below one month of payroll</span>';
    return '<div class="bz-k">' +
      '<div><span>Received in ' + E(mName(o.cur)) + '</span><b>' + (o.hasIn ? about(o.inSoFar) : '—') + '</b><small>From students so far this month.</small></div>' +
      '<div><span>Next payroll</span><b>' + (o.salaries == null ? '—' : about(o.salaries)) + '</b><small>' + E(mName(o.cur)) + ' salaries, paid on ' + E(dL(o.payDate)) + '.</small></div>' +
      '<div><span>Cash available</span><b>' + (o.bank == null ? '—' : about(o.bank)) + '</b><small>' + (o.bank == null ? 'Enter the peso balance under For you.' : 'In pesos, as of ' + E(dS(o.bankDate || o.today)) + '. Plus ' + yuan(o.walTotal) + ' in the wallets.') + '</small>' + (chip ? '<div style="margin-top:8px">' + chip + '</div>' : '') + '</div></div>'; }

  /* 2 · for you: only what is still open; finished items fold into one line */
  function decision(ref, text, kinds, done){ var x = last(ref);
    if(x && (x.kind === 'approve' || x.kind === 'noted')){ done.push((x.kind === 'approve' ? 'Approved: ' : 'Noted: ') + text.replace(/<[^>]+>/g, '').replace(/\.$/, '')); return ''; }
    var b = (x && x.kind === 'notyet' ? '<span class="bz-wait">Not yet, ' + E(dS(x.at)) + '</span>' : '') +
      kinds.map(function(k){ return '<button class="bz-btn' + (k === 'notyet' ? ' gh' : '') + '" onclick="fbz2084(\'' + k + '\',\'' + E(ref) + '\',this)" data-label="' + E(text.replace(/<[^>]+>/g, '')) + '">' + { approve: 'Approve', notyet: 'Not yet', noted: 'Noted' }[k] + '</button>'; }).join('');
    return '<div class="bz-d"><div class="t">' + text + '</div><div class="b">' + b + '</div></div>'; }
  function field(key, text, sub, val, ph, money){ var editing = B.edit[key] || val == null;
    var b = editing ? '<input class="bz-in" id="fbzIn_' + key + '" inputmode="decimal" placeholder="' + E(ph) + '" value="' + (val == null ? '' : E(val)) + '" onkeydown="if(event.key===\'Enter\')fbz2084set(\'' + key + '\',this)"><button class="bz-btn" onclick="fbz2084set(\'' + key + '\',this)">Save</button>'
      : '<span class="bz-ok">' + E(money ? peso(val) : String(val)) + '</span><button class="bz-btn gh" onclick="fbz2084edit(\'' + key + '\')">Update</button>';
    return '<div class="bz-d"><div class="t">' + text + (sub ? '<small>' + sub + '</small>' : '') + '</div><div class="b">' + b + '</div></div>'; }
  function actions(o){ var D = [], done = [], sub = '';
    if(+o.today.slice(8, 10) <= 10){ var ms0 = o.today.slice(0, 8) + '01', pm = (function(){ var y = +o.today.slice(0, 4), m = +o.today.slice(5, 7) - 1; if(m < 1){ m = 12; y--; } return y + '-' + (m < 10 ? '0' : '') + m; })();
      var ck = [[o.bankDate && o.bankDate >= ms0, 'bank balance'], [o.walChecked && o.walChecked >= ms0, 'wallet balances', 'wallets'], [!!(last('books:' + pm) && last('books:' + pm).kind === 'approve'), 'sign-off']];
      if(ck.some(function(x){ return !x[0]; })) D.push('<div class="bz-d"><div class="t"><b>Close ' + E(mName(pm)) + '</b><small>' + ck.map(function(x){ return (x[0] ? '✓ ' : '○ ') + (x[2] && !x[0] ? '<a style="cursor:pointer;color:#00808B;font-weight:700" onclick="go(\'' + x[2] + '\')">' + x[1] + '</a>' : x[1]); }).join('&nbsp;&nbsp; ') + '</small></div></div>'); }
    if(o.bank != null && o.up.length){ var left = o.bank - o.upTotal; sub = left >= 0 ? 'It covers the next 30 days of payments (' + about(o.upTotal) + '), with ' + about(left) + ' to spare.' : 'It does not cover the next 30 days of payments (' + about(o.upTotal) + '). Please send about <b>' + about(-left) + '</b> from the yuan wallets.'; }
    else if(o.bank == null) sub = 'I need it to tell you whether payroll and bills are covered.';
    D.push(field('phpBank', '<b>Peso bank balance</b>, with cash on hand' + (o.bankDate ? ' (as of ' + E(dS(o.bankDate)) + ')' : '') + '.', sub, o.bank, 'e.g. 250000', true));
    if(o.salaries != null) D.push(decision('payroll:' + o.cur, 'Approve the <b>' + E(mName(o.cur)) + ' payroll</b> of about <b>' + about(o.salaries) + '</b>, paid on ' + E(dL(o.payDate)) + '.', ['approve', 'notyet'], done));
    if(o.last && o.last.net != null) D.push(decision('books:' + o.last.m, 'Sign off <b>' + E(mName(o.last.m)) + '</b>: we received ' + about(o.last.sales) + ', spent ' + about(o.last.cost) + ' and kept <b>' + about(o.last.net) + '</b>.', ['approve', 'notyet'], done));
    (o.big || []).forEach(function(r){ D.push(decision('big:' + r.d + ':' + Math.round(N(r.a)) + ':' + String(r.t || r.c || '').slice(0, 30), 'Large payment of <b>' + peso(N(r.a)) + '</b> for ' + E(r.t || r.c || 'an expense') + ' on ' + E(dS(r.d + 'T12:00:00+08:00')) + '.', ['noted'], done)); });
    if(o.miss.some(function(x){ return x.k === 'rate'; }) || o.rate != null) D.push(field('rate', '<b>Yuan-to-peso rate</b> when sending money home.', 'Pesos for ¥1.', o.rate, 'e.g. 8.10', false));
    D = D.filter(Boolean);
    var open = D.filter(function(x){ return /bz-btn/.test(x) && !/bz-ok/.test(x); }).length;
    return '<div class="bz-card"><h2>For you' + (open ? ' <span class="bz-n">' + open + '</span>' : '') + '</h2>' + D.join('') +
      (done.length ? '<div class="bz-done"><b>Done:</b> ' + done.map(E).join('. ') + '.</div>' : '') +
      '<div class="bz-m">Approving is a record for our books. It does not move money.</div></div>'; }

  /* 3 · coming up: a dated list (due dates you entered first when within 7 days), then what to watch */
  function ahead(o){ var end30 = addD(o.today, 30), soon = addD(o.today, 7), L = [];
    (o.dues || []).forEach(function(x){ if(x.d >= o.today && x.d <= end30) L.push({ d: x.d, l: 'Due: ' + x.l, a: x.a ? +x.a : null, soon: x.d <= soon }); });
    (o.up || []).forEach(function(x){ L.push({ d: x.d, l: x.l, a: x.a, est: x.est, soon: x.d <= soon }); });
    L.sort(function(a, b){ return a.d < b.d ? -1 : 1; });
    var rows = L.slice(0, 6).map(function(x){ var dt = new Date(x.d + 'T12:00:00+08:00');
      return '<div class="' + (x.soon ? 'soon' : '') + '"><div class="bz-date"><b>' + dt.getDate() + '</b><small>' + dt.toLocaleDateString('en-GB', { month: 'short', timeZone: 'Asia/Manila' }) + '</small></div><div class="l">' + E(x.l) + '<small>' + E(dt.toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Asia/Manila' })) + (x.est ? ', estimate' : '') + '</small></div><div class="v">' + (x.a != null ? about(x.a) : '') + '</div></div>'; }).join('');
    var W = [], covered = o.bank != null && o.bank - o.upTotal >= 0;
    if(!covered && o.miss.some(function(x){ return /remit/i.test(x.t || ''); })) W.push('Plan a transfer from the yuan wallets before ' + E(dL(o.payDate)) + ', as salaries are paid in pesos.');
    if(o.miss.some(function(x){ return x.k === 'neg'; })) W.push('The CCB wallet is slightly short. Top it up before its next payment.');
    if(o.miss.some(function(x){ return /13th/i.test(x.t || ''); }) && !(o.dues || []).some(function(x){ return /13th/i.test(x.l); })) W.push('The 13th-month pay is not in the plan yet. Add it under Notes, due dates and record.');
    if(!rows && !W.length) return '';
    return '<div class="bz-card"><h2>Coming up</h2>' + (rows ? '<div class="bz-up">' + rows + '</div>' : '') + (W.length ? '<ul class="bz-w">' + W.slice(0, 3).map(function(x){ return '<li>' + x + '</li>'; }).join('') + '</ul>' : '') + '</div>'; }

  /* 4 · growing the business: four small pictures and one piece of advice (real data: coe_fin_growth) */
  function grow(o){ var G = B.growth; if(!G) return ''; var T = [], adv = '';
    var tc = (G.trials || {})[G.month], tp = (G.trials || {})[G.prev];
    if(tc && tc.trials) T.push('<div><span>Trials that became students</span><b>' + tc.students + ' of ' + tc.trials + '</b><div class="bz-mini"><span style="width:' + Math.round(tc.students / tc.trials * 100) + '%"></span></div><small>' + (tp && tp.trials ? mName(G.prev) + ': ' + tp.students + ' of ' + tp.trials + ' (' + Math.round(tp.students / tp.trials * 100) + '%).' : 'This month so far.') + '</small></div>');
    var low = o.low || [], rn = G.renewing || {};
    T.push('<div><span>Near the end of their package</span><b>' + low.length + ' student' + (low.length === 1 ? '' : 's') + '</b><small>' + (low.length ? E(low.slice(0, 3).map(function(x){ return x.name; }).join(', ')) + (low.length > 3 ? ' and ' + (low.length - 3) + ' more.' : '.') : 'Nobody right now.') + (rn.reminded || rn.renewing ? ' Reminded: ' + (rn.reminded || 0) + '. Renewing: ' + (rn.renewing || 0) + '.' : '') + '</small></div>');
    var P = G.price || {}, C = G.cost || null, dm = null, pmg = null;
    if(P.direct && P.direct.perLesson && C){ dm = P.direct.perLesson - C.allPerLesson; pmg = P.partner && P.partner.perLesson ? P.partner.perLesson - C.allPerLesson : null;
      var top = Math.max(dm, pmg || 0, 1);
      T.push('<div><span>What we keep per lesson</span><b>' + peso(dm) + '</b><div class="bz-mini"><span style="width:' + Math.round(dm / top * 100) + '%"></span></div>' + (pmg != null ? '<div class="bz-mini"><span style="width:' + Math.round(Math.max(0, pmg) / top * 100) + '%;background:#9ED3CF"></span></div>' : '') + '<small>Direct ' + peso(dm) + (pmg != null ? ', partner ' + peso(pmg) : '') + '. A lesson costs about ' + peso(C.allPerLesson) + ' in total' + (C.month ? ' (' + mName(C.month) + ')' : '') + '.</small></div>'); }
    var K = G.capacity || {}, room = null;
    if(K.freeHours != null){ var per = K.activeStudents ? K.lessonsNextWeek / K.activeStudents : null; room = per ? Math.floor(K.freeHours * 60 / 25 / per) : null;
      T.push('<div><span>Room for more students</span><b>' + (room != null ? 'About ' + room : Math.round(K.freeHours) + ' h') + '</b><small>' + Math.round(K.freeHours) + ' free teacher hours a week, if times match.' + (K.full && K.full.length ? ' Full: ' + K.full.map(E).join(', ') + '.' : '') + '</small></div>'); }
    if(K.freeHours != null && K.freeHours < 15) adv = 'Start hiring. The teachers have less than 15 free hours a week left.';
    else if(tc && tc.trials >= 3 && tc.students / tc.trials < 0.6) adv = 'Follow up every trial family within a day. That is where new students are won.';
    else if(low.length >= 5) adv = 'Renewals first. A short message to the ' + low.length + ' families near the end of their package brings income in fastest.';
    else if(dm != null && pmg != null && dm > pmg * 1.4 && room != null && room > 20) adv = 'Grow direct students. Each lesson keeps about ' + peso(dm - pmg) + ' more than a partner lesson, and the teachers have room.';
    return '<div class="bz-card"><h2>Growing the business</h2><div class="bz-g">' + T.join('') + '</div>' + (adv ? '<div class="bz-adv">' + ICON.tip + '<div><b>My advice.</b> ' + adv + '</div></div>' : '') +
      '<div class="bz-links"><a onclick="go(\'astudents\')">Students ›</a><a onclick="go(\'trials\')">Trials ›</a><a onclick="go(\'teachers\')">Teachers ›</a></div></div>'; }

  function more(){ var L = (B.rows || []).filter(function(x){ return x.kind === 'note'; }).slice(0, 5), T = (B.rows || []).filter(function(x){ return x.kind !== 'note'; }).slice(0, 8);
    var lab = function(x){ var m = /^set:(\w+)/.exec(x.ref || ''); if(m) return { phpBank: 'Peso bank balance updated', rate: 'Yuan rate updated', bir: 'Due dates updated' }[m[1]] || 'Figure updated'; return { approve: 'Approved', notyet: 'Not yet', noted: 'Noted' }[x.kind] + ': ' + x.label; };
    var t = function(x){ return E(new Date(x.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' })); };
    var dues = (B.set && B.set.bir && Array.isArray(B.set.bir.value)) ? B.set.bir.value : [];
    return '<details class="bz-card"' + (window.__fbzOpen ? ' open' : '') + ' ontoggle="window.__fbzOpen=this.open"><summary>Notes, due dates and record</summary>' +
      '<div class="bz-sub">Due dates</div><div class="bz-m" style="margin:0 0 6px">BIR, SSS, PhilHealth, Pag-IBIG, 13th month and others. Enter the date your accountant gives you, and I will remind you 7 days ahead.</div>' +
      dues.slice().sort(function(a, b){ return a.d < b.d ? -1 : 1; }).map(function(x){ return '<div class="bz-note">' + E(dL(x.d)) + ': ' + E(x.l) + (x.a ? ', ' + peso(+x.a) : '') + ' <small><a style="cursor:pointer;color:#9A4330" onclick="fbz2084due(\'rm\',' + dues.indexOf(x) + ')">Remove</a></small></div>'; }).join('') +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><input class="bz-in" id="fbzDueL" placeholder="e.g. BIR 2550Q" style="width:170px"><input class="bz-in" id="fbzDueD" type="date" style="width:165px"><input class="bz-in" id="fbzDueA" inputmode="decimal" placeholder="₱ amount (optional)" style="width:170px"><button class="bz-btn" onclick="fbz2084due(\'add\')">Add</button></div>' +
      '<div class="bz-sub">Notes</div><textarea id="fbzNote" placeholder="A note in your own words, for example: rent goes up in January."></textarea><div style="margin-top:6px"><button class="bz-btn" onclick="fbz2084note(this)">Save note</button></div>' +
      L.map(function(x){ return '<div class="bz-note">' + E(x.body) + '<small>' + t(x) + ' <a style="cursor:pointer;color:#9A4330;margin-left:6px" onclick="fbz2084rm(' + (+x.id) + ')">Remove</a></small></div>'; }).join('') +
      (T.length ? '<div class="bz-sub">Record</div>' + T.map(function(x){ return '<div class="bz-note">' + E(lab(x)) + '<small>' + t(x) + '</small></div>'; }).join('') : '') + '</details>'; }

  var LASTH = '';
  function paint(){ var v = document.getElementById('v-finbrief'); if(!v) return; if(!pres()){ v.innerHTML = '<div class="empty">The briefing is for the President.</div>'; LASTH = ''; return; }
    var keep = '', ae = document.activeElement; try{ var ta = document.getElementById('fbzNote'); if(ta) keep = ta.value; }catch(e){}
    if(ae && v.contains(ae) && /INPUT|TEXTAREA/.test(ae.tagName)) return;   /* never redraw under the cursor */
    var h = '<div class="bz-top"><div><h1>Briefing</h1><div class="bz-from">From your accounts manager, ' + E(new Date().toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Manila' })) + '.</div></div></div>';
    var o = compose();
    h += !o ? '<div class="bz-card"><p class="bz-say" style="margin:0">One moment, I am gathering the numbers…</p></div>'
      : hero(o) + tiles(o) + '<div class="bz-cols"><div>' + actions(o) + ahead(o) + '</div><div>' + grow(o) + more() + '</div></div>' +
        '<div class="bz-foot">The details: <a onclick="go(\'finov\')">Overview</a><a onclick="go(\'payroll\')">Payroll</a><a onclick="go(\'forecast\')">Forecast</a><a onclick="go(\'wallets\')">Wallets</a></div>';
    if(h === LASTH) return;   /* nothing changed: no redraw, no flicker */
    LASTH = h; v.innerHTML = h;
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
  window.fbz2084due = function(op, i){ var cur = (B.set && B.set.bir && Array.isArray(B.set.bir.value)) ? B.set.bir.value.slice() : [];
    if(op === 'rm') cur.splice(i, 1);
    else { var l = (document.getElementById('fbzDueL') || {}).value || '', d = (document.getElementById('fbzDueD') || {}).value || '', a = (document.getElementById('fbzDueA') || {}).value || '';
      if(!l.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(d)){ say('Enter what is due and the date'); return; }
      var n = Number(String(a).replace(/[₱,\s]/g, '')); cur.push({ l: l.trim().slice(0, 60), d: d, a: a.trim() && !isNaN(n) ? n : null }); }
    window.__fbzOpen = true;
    post({ op: 'set', key: 'bir', value: cur }).then(function(r){ if(r && r.ok){ B.set = B.set || {}; B.set.bir = { value: cur }; say(op === 'rm' ? 'Removed' : 'Due date saved'); loadAll().then(paint); paint(); } else say('Not saved · ' + ((r && r.error) || 'try again')); }).catch(function(){ say('Not saved · check your internet'); }); };
  /* Monday reminder: once each Monday, a small note at the bottom of the screen (President only) */
  (function(){ var tries = 0; function check(){ tries++; try{ if(!pres()){ if(tries < 30) setTimeout(check, 5000); return; }
      var t = phToday(), dow = new Date(t + 'T12:00:00Z').getUTCDay(); if(dow !== 1) return; var k = 'coe.fbzMon'; var seen = ''; try{ seen = localStorage.getItem(k) || ''; }catch(e){}
      if(seen === t || (typeof VIEW !== 'undefined' && VIEW === 'finbrief') || document.getElementById('fbzMon')) return;
      var d = document.createElement('div'); d.id = 'fbzMon'; d.setAttribute('role', 'status');
      d.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:60;background:#2B2253;color:#fff;border-radius:999px;padding:10px 12px 10px 18px;display:flex;gap:10px;align-items:center;font-size:15px;box-shadow:0 6px 24px rgba(0,0,0,.18);max-width:calc(100% - 32px)';
      d.innerHTML = '<span>Your weekly finance briefing is ready.</span><button style="border:0;border-radius:999px;padding:7px 14px;font:inherit;font-weight:700;background:#fff;color:#2B2253;cursor:pointer">Open</button><button aria-label="Later" style="border:0;background:none;color:#fff;opacity:.75;font:inherit;cursor:pointer;padding:4px 6px">✕</button>';
      var done = function(){ try{ localStorage.setItem(k, t); }catch(e){} d.remove(); };
      d.children[1].onclick = function(){ done(); go('finbrief'); }; d.children[2].onclick = done; document.body.appendChild(d); }catch(e){} }
    setTimeout(check, 6000); })();
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
