// 2055 · regression for the 10 Nov final QA (2053, 2054): repeated buttons/information that were removed must stay removed.
// Static checks on app.html, run on every release from tools/check.js. Returns the number of failed cases.
const fs = require('fs');
module.exports = function(file){
  const s = fs.readFileSync(file, 'utf8'); let failed = 0;
  const ok = (c, what) => { console.log((c ? 'ok   ' : 'FAIL ') + what); if(!c) failed++; };
  ok(/#navIn \.sb-rec\{display:none/.test(s), 'menu: Contracts and Notices of breach open from Teachers tabs only');
  ok(/#v-home \.x-pay\{display:none/.test(s), 'Overview: no second pay bar (Needs you has "Teachers to pay")');
  ok(/#v-mtoday \.td2-ok\{display:none/.test(s) && /#v-mtoday #td-ref\{display:none/.test(s), 'To do: no repeated "All clear" line, no no-action deadlines list');
  ok(s.indexOf("'Renew soon', o + ' ran out") < 0, 'Overview Last week: no second renewals tile');
  ok(!/hRank'?\)?\.innerHTML = [^;]*\/unit/.test(s) && s.indexOf("esc([me.rank, me.rate ? peso(me.rate)+'/unit'") < 0, 'teacher header: no pay rate (screen shares)');
  ok(s.indexOf("if(toOpen > 0) return '';") > -1, 'teacher Needs your action: feedback listed only once it opens');
  ok(s.indexOf('onclick="tMsgNew()">New message</button><button class="btn ghost" onclick="tlvSheet()">Request leave</button>') < 0, 'teacher Notices: Request leave only on Schedule');
  ok(s.indexOf("['v-pay', 'v-growth'].forEach") < 0, 'teacher Growth: the unit note only on Pay');
  if(failed) console.error('No-repeats check: ' + failed + ' case(s) failed');
  else console.log('Removed repeats stay removed (8 checks)');
  return failed;
};
