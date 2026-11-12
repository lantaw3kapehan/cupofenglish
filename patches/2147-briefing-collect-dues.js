// 2147 (12 Nov, Misty 20:54: "we can do 1-5 now"): the Finance Briefing adds
//   1 · Money to collect › students whose lessons are used up or 2 or fewer left (latest package, not "Not renewing"), with their last payment
//   2 · Money to collect › partners who track payments: sales after their last "paid" mark (Dr. Spring)
//   3 · Coming up › government dues not paid yet (Government tab), around the 15th of their month
//   4 · For you › 13th-month pay (from Payroll › 13th month, coe-13th) and how much to set aside each month until 24 Dec
//   5 · For you › the peso bank balance asks to be updated when it is more than 7 days old
// Server: coe_fin_more() (owe, partnerOwe, gov), returned inside coe_fin_growth() as "more" (coe-finbrief op growth).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["post({ op: 'growth' }).then(function(r){ if(r && r.ok) B.growth = r.growth || null; }).catch(function(){})]); }",
   "post({ op: 'growth' }).then(function(r){ if(r && r.ok) B.growth = r.growth || null; }).catch(function(){}),\n" +
   "      fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-13th', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: tok(), op: 'get', year: +new Date().toISOString().slice(0, 4) }) }).then(function(x){ return x.json(); })\n" +
   "        .then(function(r){ if(r && r.ok){ var P = (r.people || []).filter(function(p){ return !(p.saved && p.saved.paid_on); }); B.th13 = { total: P.reduce(function(a, p){ return a + (+p.pay || 0); }, 0), n: P.length, year: r.year }; } }).catch(function(){})]); }"],
  // 5 · bank balance older than 7 days
  ["    D.push(field('phpBank', '<b>Peso bank balance</b>, with cash on hand' + (o.bankDate ? ' (as of ' + E(dS(o.bankDate)) + ')' : '') + '.', sub, o.bank, 'e.g. 250000', true));",
   "    var bAge = o.bankDate ? Math.floor((Date.parse(o.today) - Date.parse(String(o.bankDate).slice(0, 10))) / 864e5) : null;\n" +
   "    if(bAge != null && bAge > 7) sub = '<b style=\"color:#B4442A\">Last updated ' + bAge + ' days ago. Please enter today\\'s balance so Cash available is right.</b> ' + sub;\n" +
   "    D.push(field('phpBank', '<b>Peso bank balance</b>, with cash on hand' + (o.bankDate ? ' (as of ' + E(dS(o.bankDate)) + ')' : '') + '.', sub, o.bank, 'e.g. 250000', true));\n" +
   "    if(B.th13 && B.th13.total > 0){ var dec = o.today.slice(0, 4) + '-12-24', mLeft = Math.max(1, 12 - (+o.today.slice(5, 7)) + 1);\n" +
   "      D.push('<div class=\"bz-d\"><div class=\"t\"><b>13th-month pay</b> of about <b>' + about(B.th13.total) + '</b>, paid by ' + E(dL(dec)) + '.<small>' + (mLeft > 1 ? 'Set aside about <b>' + about(B.th13.total / mLeft) + '</b> a month until then.' : 'Set it aside this month.') + ' From Payroll › 13th month.</small></div><div class=\"b\"><button class=\"bz-btn gh\" onclick=\"go(\\'payroll\\')\">Open</button></div></div>'); }"],
  // 3 + 4 · Coming up
  ["    L.sort(function(a, b){ return a.d < b.d ? -1 : 1; });",
   "    try{ var GM = (B.growth && B.growth.more) || {}; (GM.gov || []).forEach(function(g){ if(!g.amount || g.due > end30) return; var late = g.due < o.today;\n" +
   "        L.push({ d: late ? o.today : g.due, l: 'Government dues for ' + mName(g.month) + (late ? ' (past ' + dS(g.due + 'T12:00:00+08:00') + ')' : '') + ': SSS, PhilHealth, Pag-IBIG' + (+g.bir ? ', BIR' : ''), a: +g.amount, soon: true }); });\n" +
   "      if(B.th13 && B.th13.total > 0){ var d13 = o.today.slice(0, 4) + '-12-24'; if(d13 <= end30) L.push({ d: d13, l: '13th-month pay', a: B.th13.total, est: true, soon: d13 <= soon }); } }catch(e){}\n" +
   "    L.sort(function(a, b){ return a.d < b.d ? -1 : 1; });"],
  ["    if(o.miss.some(function(x){ return /13th/i.test(x.t || ''); }) && !(o.dues || []).some(function(x){ return /13th/i.test(x.l); }))",
   "    if(!(B.th13 && B.th13.total > 0) && o.miss.some(function(x){ return /13th/i.test(x.t || ''); }) && !(o.dues || []).some(function(x){ return /13th/i.test(x.l); }))"],
  // 1 + 2 · Money to collect
  ["hero(o) + tiles(o) + '<div class=\"bz-cols\"><div>' + actions(o) + ahead(o) + '</div><div>' + grow(o) + more() + '</div></div>' +",
   "hero(o) + tiles(o) + '<div class=\"bz-cols\"><div>' + actions(o) + collect2147(o) + ahead(o) + '</div><div>' + grow(o) + more() + '</div></div>' +"],
  ["  function paint(){ var v = document.getElementById('v-finbrief'); if(!v) return;",
   "  function collect2147(o){ var GM = (B.growth && B.growth.more) || null; if(!GM) return ''; var S = GM.owe || [], P = (GM.partnerOwe || []).filter(function(p){ return p.n > 0; }); if(!S.length && !P.length) return '';\n" +
   "    var exp = S.reduce(function(a, x){ return a + (x.last && x.last.php ? +x.last.php : 0); }, 0), h = '';\n" +
   "    if(S.length) h += '<div class=\"bz-sub\">Students · lessons used up or 2 or fewer left</div>' + S.map(function(x){ var l = +x.left, st = String(x.status || '').split(' · ')[0];\n" +
   "      return '<div class=\"bz-d\"><div class=\"t\"><b>' + E(x.name) + (x.cn ? ' ' + E(x.cn) : '') + '</b>' + (x.shared ? ' & ' + E(x.shared) : '') + ' · Teacher ' + E(x.teacher) + '<small>' + (l <= 0 ? '<b style=\"color:#B4442A\">Lessons used up</b>' : l + (l === 1 ? ' lesson' : ' lessons') + ' left') + (st ? ' · ' + E(st) : ' · no reminder yet') +\n" +
   "        (x.last && x.last.php ? ' · last paid ' + peso(+x.last.php) + ' on ' + E(dS(x.last.day + 'T12:00:00+08:00')) + (x.last.partner && !/^CupOfEnglish$/i.test(x.last.partner) ? ' (' + E(x.last.partner) + ')' : '') : '') + '</small></div></div>'; }).join('') +\n" +
   "      (exp ? '<div class=\"bz-m\">If they renew as last time: about ' + about(exp) + '.</div>' : '');\n" +
   "    if(P.length) h += '<div class=\"bz-sub\">Partners</div>' + P.map(function(p){ return '<div class=\"bz-d\"><div class=\"t\"><b>' + E(p.partner) + '</b>: ' + p.n + (p.n === 1 ? ' sale' : ' sales') + (p.since ? ' since ' + E(dS(p.since + 'T12:00:00+08:00')) : '') + ' not marked paid yet<small>' + (p.rmb ? '¥' + Number(p.rmb).toLocaleString('en-US') + ' · ' : '') + 'about ' + about(+p.php) + '. Mark them paid on the partner page when the money arrives.</small></div></div>'; }).join('');\n" +
   "    return '<div class=\"bz-card\"><h2>Money to collect</h2>' + h + '</div>'; }\n" +
   "  function paint(){ var v = document.getElementById('v-finbrief'); if(!v) return;"],
]);
