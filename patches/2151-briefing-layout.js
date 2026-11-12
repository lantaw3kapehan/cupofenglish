// 2151 (12 Nov, Misty 21:23: "enhance the layout and design of FINANCE, especially BRIEFING now with the changes").
// The Briefing reads top-down like a manager's page, with nothing said twice:
//   1 · Headline card: the verdict, with "Since you last looked" inside it (no separate strip)
//   2 · Four figures: Received (with the pace against last month) · Still expected (renewals by how sure, one stacked bar) · Next payroll · Cash
//   3 · Left: For you (the cash instruction leads with what to do: "Send ¥… by …") and Coming up
//   4 · Right: Renewals (one card: the bar, the families by how sure, and who is out of lessons, which was "Money to collect"),
//       How the month is going (costs regular vs one-off as a bar, Watch notes as chips), Growing the business, Notes
// "Near the end of their package" leaves Growing the business: the same families are in Renewals. No figure is lost.
const lib = require("../tools/lib.js"), file = process.argv[2];
const CSS = [
  "#v-finbrief{max-width:1180px;margin:0 auto}",
  "#v-finbrief .bz-k{grid-template-columns:repeat(4,minmax(0,1fr))}",
  "#v-finbrief .bz-k>div{display:flex;flex-direction:column}",
  "#v-finbrief .bz-k b{font-size:26px}",
  "#v-finbrief .bz-delta{display:inline-flex;align-items:center;gap:4px;margin-top:8px;font-size:13px;font-weight:600;border-radius:999px;padding:3px 10px;align-self:flex-start}",
  "#v-finbrief .bz-delta.up{background:#E8F5EE;color:#1F7A55}#v-finbrief .bz-delta.dn{background:#FCEDE9;color:#B4442A}",
  "#v-finbrief .bz-stack{display:flex;height:10px;border-radius:999px;overflow:hidden;background:#F1F0F6;margin:8px 0 6px}",
  "#v-finbrief .bz-stack span{display:block;height:100%}",
  "#v-finbrief .s-ok{background:#2E9D6B}#v-finbrief .s-lk{background:#E0A030}#v-finbrief .s-no{background:#E6E3EE}#v-finbrief .s-one{background:#B9A7E8}#v-finbrief .s-reg{background:#7A6BC4}",
  "#v-finbrief .bz-key{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13px;color:#6B6782}#v-finbrief .bz-key i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;vertical-align:0}",
  "#v-finbrief .bz-key b{color:#2f2752;font-weight:600;font-variant-numeric:tabular-nums}",
  "#v-finbrief .bz-since{margin:12px 0 0;font-size:14px;color:#6B6782;line-height:1.5}#v-finbrief .bz-since b{color:#2f2752;font-weight:600}",
  "#v-finbrief .bz-grp{margin-top:12px}#v-finbrief .bz-grp>div:first-child{font-size:14px;font-weight:600;color:#2f2752;margin-bottom:4px}",
  "#v-finbrief .bz-names{font-size:14px;color:#6B6782;line-height:1.55}",
  "#v-finbrief .bz-st{display:grid;grid-template-columns:auto minmax(0,1fr);gap:10px;align-items:start;padding:9px 0;border-top:1px solid #F1F0F6}",
  "#v-finbrief .bz-st:first-of-type{border-top:0}",
  "#v-finbrief .bz-left{min-width:44px;text-align:center;border-radius:10px;padding:4px 6px;font-weight:700;font-size:15px;font-variant-numeric:tabular-nums;background:#FFF5E6;color:#87560D}",
  "#v-finbrief .bz-left.out{background:#FCEDE9;color:#B4442A}#v-finbrief .bz-left small{display:block;font-size:11px;font-weight:600}",
  "#v-finbrief .bz-st .t{font-size:15px;line-height:1.45}#v-finbrief .bz-st .t small{display:block;font-size:13px;color:#6B6782}",
  "#v-finbrief .bz-watch{display:flex;flex-direction:column;gap:6px;margin-top:4px}",
  "#v-finbrief .bz-watch span{display:block;background:#FFF8EC;border:1px solid #F3DFB8;color:#6E4A0C;border-radius:12px;padding:8px 12px;font-size:14px;line-height:1.45}",
  "#v-finbrief .bz-act{display:block;font-size:16px;font-weight:700;color:#2f2752;margin:4px 0 2px}",
  "@media (max-width:1100px){#v-finbrief .bz-k{grid-template-columns:repeat(2,minmax(0,1fr))}}",
  "@media (max-width:640px){#v-finbrief .bz-k{grid-template-columns:minmax(0,1fr)}#v-finbrief .bz-k b{font-size:24px}}"
].join('');
lib(file, [
  // layout
  ["hero(o) + since2149(o) + tiles(o) + '<div class=\"bz-cols\"><div>' + actions(o) + collect2147(o) + ahead(o) + '</div><div>' + month2149(o) + grow(o) + more() + '</div></div>'",
   "hero2151(o) + tiles2151(o) + '<div class=\"bz-cols\"><div>' + actions(o) + ahead(o) + '</div><div>' + renew2151(o) + month2149(o) + grow(o) + more() + '</div></div>'"],
  // pace and renewals move out of "How the month is going"
  ["try{ var P = GM.pace; if(P && P.now != null){", "try{ var P = GM.pace; if(false && P && P.now != null){"],
  ["      if(c.n + l.n + op.n){ h += ", "      if(false && c.n + l.n + op.n){ h += "],
  ["    T.push('<div><span>Near the end of their package</span>", "    if(false) T.push('<div><span>Near the end of their package</span>"],
  // the cash instruction leads with the action
  ["    var t = 'It does not cover the next 30 days of payments (' + about(o.upTotal) + '). ';",
   "    var t = '<span class=\"bz-act\">Send ' + (yuan ? '¥' + yuan.toLocaleString('en-US') : about(short)) + ' to the peso bank' + (by ? ' by ' + E(dL(by)) : '') + '.</span>The balance does not cover the next 30 days of payments (' + about(o.upTotal) + '). ';"],
  ["    t += 'Please send <b>'", "    t += 'That is <b>'"],
  ["  function collect2147(o){",
`  /* 2151 · headline with "since you last looked" inside */
  function hero2151(o){ var h = hero(o), s = since2149(o); if(s){ var m = /<b>Since you last looked<\\/b>([\\s\\S]*?)<\\/div><\\/div>$/.exec(s); if(m) h = h.replace('</p></div>', '</p><p class="bz-since"><b>Since you last looked</b>' + m[1] + '</p></div>'); } return h; }
  /* 2151 · four figures: Received + pace · Still expected (renewals by how sure) · Next payroll · Cash */
  function tiles2151(o){ var h = tiles(o), GM = (B.growth && B.growth.more) || {}, P = GM.pace, Q = GM.pipe || {};
    try{ if(P && P.now != null && P.prev != null){ var d = P.now - P.prev, dd = +o.today.slice(8, 10);
        h = h.replace('<small>From students so far this month.</small></div>', '<small>From students so far this month.</small><span class="bz-delta ' + (d >= 0 ? 'up' : 'dn') + '">' + (d >= 0 ? '▲ ' : '▼ ') + peso(Math.abs(d)) + ' vs ' + dd + ' ' + E(mName(GM.pace && o.cur ? (function(){ var y = +o.cur.slice(0, 4), m = +o.cur.slice(5, 7) - 1; if(m < 1){ m = 12; y--; } return y + '-' + (m < 10 ? '0' : '') + m; })() : o.cur).slice(0, 3)) + '</span></div>'); } }catch(e){}
    try{ var c = Q.confirmed || { n: 0, php: 0 }, l = Q.likely || { n: 0, php: 0 }, n = Q.open || { n: 0, php: 0 }, tot = (+c.php || 0) + (+l.php || 0) + (+n.php || 0);
      if(tot > 0){ var w = function(x){ return (x / tot * 100).toFixed(1); };
        var tile = '<div><span>Renewals coming up</span><b>' + about(tot) + '</b><div class="bz-stack"><span class="s-ok" style="width:' + w(c.php) + '%"></span><span class="s-lk" style="width:' + w(l.php) + '%"></span><span class="s-no" style="width:' + w(n.php) + '%"></span></div>' +
          '<small>' + (c.n + l.n + n.n) + ' families, at their last price. Only ' + about(+c.php || 0) + ' confirmed.</small></div>';
        h = h.replace('<div><span>Next payroll</span>', tile + '<div><span>Next payroll</span>'); } }catch(e){}
    return h; }
  /* 2151 · one Renewals card: by how sure, then who is out of lessons (was Money to collect) */
  function renew2151(o){ var GM = (B.growth && B.growth.more) || null; if(!GM) return ''; var Q = GM.pipe || {}, S = GM.owe || [], h = '';
    var c = Q.confirmed || { n: 0, php: 0 }, l = Q.likely || { n: 0, php: 0 }, n = Q.open || { n: 0, php: 0 }, tot = (+c.php || 0) + (+l.php || 0) + (+n.php || 0);
    if(tot > 0){ var w = function(x){ return (x / tot * 100).toFixed(1); };
      h += '<div class="bz-stack" style="height:12px;margin-top:2px"><span class="s-ok" style="width:' + w(c.php) + '%"></span><span class="s-lk" style="width:' + w(l.php) + '%"></span><span class="s-no" style="width:' + w(n.php) + '%"></span></div>' +
        '<div class="bz-key"><span><i class="s-ok"></i>Confirmed <b>' + peso(+c.php || 0) + '</b></span><span><i class="s-lk"></i>Likely <b>' + peso(+l.php || 0) + '</b></span><span><i class="s-no" style="background:#CFCADB"></i>Not asked yet <b>' + peso(+n.php || 0) + '</b></span></div>';
      var grp = function(lbl, x, sub){ return x && x.n ? '<div class="bz-grp"><div>' + lbl + ' · ' + x.n + (x.n === 1 ? ' family' : ' families') + '</div><div class="bz-names">' + E(x.names || '') + (sub ? '. ' + sub : '') + '</div></div>' : ''; };
      h += grp('Not asked yet', n, n.n ? 'A reminder is the quickest way to firm up this income' : '') + grp('Reminded', l, '') + grp('Renewing', c, ''); }
    if(S.length){ h += '<div class="bz-grp"><div>Out of lessons, or nearly</div>' + S.map(function(x){ var lf = +x.left, st = String(x.status || '').split(' · ')[0];
        return '<div class="bz-st"><div class="bz-left' + (lf <= 0 ? ' out' : '') + '">' + (lf <= 0 ? '0' : lf) + '<small>left</small></div><div class="t"><b>' + E(x.name) + (x.cn ? ' ' + E(x.cn) : '') + '</b>' + (x.shared ? ' & ' + E(x.shared) : '') + ', Teacher ' + E(x.teacher) +
          '<small>' + (st ? E(st) : 'No reminder yet') + (x.last && x.last.php ? '. Last paid ' + peso(+x.last.php) + ' on ' + E(dS(x.last.day + 'T12:00:00+08:00')) + (x.last.partner && !/^CupOfEnglish$/i.test(x.last.partner) ? ' through ' + E(x.last.partner) : '') : '') + '.</small></div></div>'; }).join('') + '</div>'; }
    return h ? '<div class="bz-card"><h2>Renewals</h2>' + h + '<div class="bz-links" style="margin-top:10px"><a onclick="go(\\'renewals\\')">Renewals ›</a><a onclick="go(\\'astudents\\')">Students ›</a></div></div>' : ''; }
  function collect2147(o){`],
  // costs as a bar, watch as chips
  ["      if(exS != null && OO.length) h += '<div class=\"bz-d\"><div class=\"t\"><b>Costs.</b> Expenses so far ' + peso(Math.round(exS)) + ', of which one-off purchases ' + peso(oo) + ' (' + OO.map(function(x){ return E(x.t); }).join(', ') + '). Regular running costs: ' + peso(Math.round(exS - oo)) + '.<small>One-offs are equipment, supplies and other purchases of ₱10,000 or more. Accounting, rent, utilities and dues count as regular.</small></div></div>'; }catch(e){}",
   "      if(exS != null && exS > 0) h += '<div class=\"bz-grp\" style=\"margin-top:0\"><div>Expenses so far: ' + peso(Math.round(exS)) + '</div><div class=\"bz-stack\"><span class=\"s-reg\" style=\"width:' + ((exS - oo) / exS * 100).toFixed(1) + '%\"></span><span class=\"s-one\" style=\"width:' + (oo / exS * 100).toFixed(1) + '%\"></span></div>' +\n" +
   "        '<div class=\"bz-key\"><span><i class=\"s-reg\"></i>Regular running costs <b>' + peso(Math.round(exS - oo)) + '</b></span>' + (oo ? '<span><i class=\"s-one\"></i>One-off purchases <b>' + peso(oo) + '</b></span>' : '') + '</div>' + (OO.length ? '<div class=\"bz-names\" style=\"margin-top:6px\">One-offs: ' + OO.map(function(x){ return E(x.t) + ' (' + peso(+x.a) + ')'; }).join(', ') + '. Accounting, rent, utilities and dues count as regular.</div>' : '') + '</div>'; }catch(e){}"],
  ["      if(W.length) h += '<div class=\"bz-d\"><div class=\"t\"><b>Watch</b><small>' + W.slice(0, 3).join('<br>') + '</small></div></div>'; }catch(e){}",
   "      if(W.length) h += '<div class=\"bz-grp\"><div>Watch</div><div class=\"bz-watch\">' + W.slice(0, 3).map(function(x){ return '<span>' + x + '</span>'; }).join('') + '</div></div>'; }catch(e){}"],
  ["  try{ var st = document.createElement('style'); st.id = 's2084';", "  css += '" + CSS.replace(/'/g, "\\'") + "';\n  try{ var st = document.createElement('style'); st.id = 's2084';"],
]);
