// 2149 (12 Nov, Misty 21:11 "do all now"): the Briefing speaks more like an accounts manager.
//   1 · "Since you last looked": payments in and expenses entered since this device last opened the Briefing (entry time n, coe-expenses v9)
//   2 · Still expected, by how sure: renewals coming up (latest package, 5 or fewer left) confirmed (Renewing) / likely (Reminder sent) / not asked yet
//   3 · Cash: an exact instruction — how many yuan, from which wallet, by which day (2 days before the first payment the bank balance cannot cover)
//   4 · Pace: received by today vs last month by the same day
//   5 · Regular costs vs one-off purchases (equipment, supplies, miscellaneous of ₱10,000 or more; not accounting, rent, utilities, dues)
//   6 · Watch: a short risk note only when something stands out (partner share ≥ 35%, costs ≥ 90% of expected income, teachers full)
// Server: coe_fin_more() adds pace, pipe, oneoff (inside coe_fin_growth().more).
const lib = require("../tools/lib.js"), file = process.argv[2];
const OLD3 = "    if(o.bank != null && o.up.length){ var left = o.bank - o.upTotal; sub = left >= 0 ? 'It covers the next 30 days of payments (' + about(o.upTotal) + '), with ' + about(left) + ' to spare.' : 'It does not cover the next 30 days of payments (' + about(o.upTotal) + '). Please send about <b>' + about(-left) + '</b> from the yuan wallets.'; }";
const NEW3 = "    if(o.bank != null && o.up.length){ var left = o.bank - o.upTotal; sub = left >= 0 ? 'It covers the next 30 days of payments (' + about(o.upTotal) + '), with ' + about(left) + ' to spare.' : cash2149(o, -left); }";
lib(file, [
  [OLD3, NEW3],
  ["try{ if(v === 'finbrief'){ paint(); startLoads(); }",
   "try{ if(v === 'finbrief'){ try{ window.__fbzPrev = +localStorage.getItem('coe.fbz.seen') || 0; localStorage.setItem('coe.fbz.seen', String(Date.now())); }catch(e){} paint(); startLoads(); }"],
  ["'</div><div>' + grow(o) + more() + '</div></div>'", "'</div><div>' + month2149(o) + grow(o) + more() + '</div></div>'"],
  ["hero(o) + tiles(o) + '<div class=\"bz-cols\">", "hero(o) + since2149(o) + tiles(o) + '<div class=\"bz-cols\">"],
  ["  function collect2147(o){",
`  /* 2149 · 3 · cash: the exact instruction */
  function cash2149(o, short){ try{
    var bal = o.bank, first = null; (o.up || []).slice().sort(function(a, b){ return a.d < b.d ? -1 : 1; }).forEach(function(x){ bal -= (+x.a || 0); if(first == null && bal < 0) first = x; });
    var rate = +o.rate || 0, yuan = rate ? Math.ceil(short / rate / 100) * 100 : null, W = ((window.fc980 && fc980.st().wallet && fc980.st().wallet.wallets) || []).filter(function(w){ return +w.balance > 0; }).sort(function(a, b){ return b.balance - a.balance; });
    var have = W.reduce(function(a, w){ return a + (+w.balance || 0); }, 0), by = first ? addD(first.d, -2) : null; if(by && by < o.today) by = o.today;
    var t = 'It does not cover the next 30 days of payments (' + about(o.upTotal) + '). ';
    t += 'Please send <b>' + (yuan ? '¥' + yuan.toLocaleString('en-US') + '</b> (about ' + about(short) + ' at ' + rate + ')' : about(short) + '</b>') + (by ? ' to the peso bank <b>by ' + E(dL(by)) + '</b>, before ' + E(first.l) + ' (' + about(+first.a) + ') on ' + E(dL(first.d)) : '') + '.';
    if(W.length) t += ' The wallets hold ¥' + Math.round(have).toLocaleString('en-US') + ' now (' + W.map(function(w){ return E(w.wallet) + ' ¥' + Math.round(w.balance).toLocaleString('en-US'); }).join(', ') + ').';
    if(yuan && have < yuan) t += ' That is ¥' + Math.round(yuan - have).toLocaleString('en-US') + ' short, so the rest has to come from payments still expected this month.';
    return t; }catch(e){ return 'It does not cover the next 30 days of payments (' + about(o.upTotal) + '). Please send about <b>' + about(short) + '</b> from the yuan wallets.'; } }
  /* 2149 · 1 · since you last looked */
  function since2149(o){ try{ var prev = window.__fbzPrev || 0; if(!prev) return ''; var X = window.fc980 && fc980.st().exp; if(!X || !X.rows) return '';
    var S = (X.sales || []).filter(function(r){ return +r.n > prev; }), Ex = (X.rows || []).filter(function(r){ return +r.n > prev; }), sa = S.reduce(function(a, r){ return a + (+r.a || 0); }, 0), ea = Ex.reduce(function(a, r){ return a + (+r.a || 0); }, 0);
    var when = new Date(prev).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' });
    var parts = []; if(S.length) parts.push(S.length + (S.length === 1 ? ' payment' : ' payments') + ' in (' + peso(Math.round(sa)) + ': ' + S.slice(0, 4).map(function(r){ return E(r.t); }).join(', ') + (S.length > 4 ? ' and ' + (S.length - 4) + ' more' : '') + ')');
    if(Ex.length) parts.push(Ex.length + (Ex.length === 1 ? ' expense' : ' expenses') + ' (' + peso(Math.round(ea)) + ')');
    return '<div class="bz-card" style="padding:12px 18px"><div class="bz-m" style="margin:0;font-size:15px;color:#2f2752"><b>Since you last looked</b> (' + E(when) + '): ' + (parts.length ? parts.join(' · ') + '.' : 'nothing new.') + '</div></div>'; }catch(e){ return ''; } }
  /* 2149 · 2, 4, 5, 6 · how the month is going */
  function month2149(o){ var GM = (B.growth && B.growth.more) || null; if(!GM) return ''; var h = '';
    try{ var P = GM.pace; if(P && P.now != null){ var dd = +o.today.slice(8, 10), diff = P.now - P.prev;
        h += '<div class="bz-d"><div class="t"><b>Pace.</b> By ' + dd + ' ' + E(mName(o.cur).slice(0, 3)) + ' we received ' + peso(P.now) + '. By the same day last month it was ' + peso(P.prev) + (diff ? ' (' + (diff > 0 ? '▲ ' : '▼ ') + peso(Math.abs(diff)) + ')' : '') + '.<small>Last month in total: ' + peso(P.prevAll) + '.</small></div></div>'; } }catch(e){}
    try{ var Q = GM.pipe || {}, c = Q.confirmed || { n: 0, php: 0 }, l = Q.likely || { n: 0, php: 0 }, op = Q.open || { n: 0, php: 0 };
      if(c.n + l.n + op.n){ h += '<div class="bz-d"><div class="t"><b>Renewals coming up</b> (5 lessons or fewer left), at their last price:<small>' +
        '<b style="color:#1F7A55">Confirmed</b> ' + peso(c.php) + (c.n ? ' (' + E(c.names) + ')' : '') + ' · <b style="color:#87560D">Likely</b> ' + peso(l.php) + ' (' + l.n + ' reminded) · <b style="color:#B4442A">Not asked yet</b> ' + peso(op.php) + ' (' + op.n + (op.names ? ': ' + E(String(op.names).split(', ').slice(0, 5).join(', ')) + (op.n > 5 ? '…' : '') : '') + ')' +
        (op.n ? '<br>Only ' + peso(c.php) + ' is sure. A reminder to the ' + op.n + ' not asked yet is the quickest way to firm up the rest.' : '') + '</small></div></div>'; } }catch(e){}
    try{ var X = window.fc980 && fc980.st().exp, ms = o.today.slice(0, 7), exS = X && X.rows ? X.rows.filter(function(r){ return String(r.d).slice(0, 7) === ms && r.d <= o.today; }).reduce(function(a, r){ return a + (+r.a || 0); }, 0) : null;
      var OO = GM.oneoff || [], oo = OO.reduce(function(a, x){ return a + (+x.a || 0); }, 0);
      if(exS != null && OO.length) h += '<div class="bz-d"><div class="t"><b>Costs.</b> Expenses so far ' + peso(Math.round(exS)) + ', of which one-off purchases ' + peso(oo) + ' (' + OO.map(function(x){ return E(x.t); }).join(', ') + '). Regular running costs: ' + peso(Math.round(exS - oo)) + '.<small>One-offs are equipment, supplies and other purchases of ₱10,000 or more. Accounting, rent, utilities and dues count as regular.</small></div></div>'; }catch(e){}
    try{ var W = [], P2 = GM.pace; if(P2 && P2.now > 0 && P2.partnerNow / P2.now >= 0.35) W.push('Partners brought ' + Math.round(P2.partnerNow / P2.now * 100) + '% of this month\\'s income. A lot rests on them.');
      var ci = o.salesMonth, co = o.costMonth; if(ci > 0 && co > 0 && co / ci >= 0.9) W.push('This month\\'s costs take ' + Math.round(co / ci * 100) + '% of the income we expect.');
      var F = B.growth && B.growth.capacity && B.growth.capacity.full; if(F && F.length >= 2) W.push('No free hours: ' + F.map(E).join(', ') + '. New students need other teachers.');
      if(W.length) h += '<div class="bz-d"><div class="t"><b>Watch</b><small>' + W.slice(0, 3).join('<br>') + '</small></div></div>'; }catch(e){}
    return h ? '<div class="bz-card"><h2>How the month is going</h2>' + h + '</div>' : ''; }
  function collect2147(o){`],
]);
