// 1611: a renewal save (the form that records CARRY OVER in Google) also waits while Google's sync has stopped or the renewal check is
// old: the sheet copy it compares with may be behind. Same reasons and wording as the renewal picture (coeRenew.guard, 1610). The
// numbers check before it (formHold) is unchanged. If the renewal check cannot be loaded at all, the save is not blocked by this.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["const H = R.formHold(S.info.left, R.fromRows(k.rows).now, S.info.early);\n      if(H.hold){",
   "let H = R.formHold(S.info.left, R.fromRows(k.rows).now, S.info.early);\n      if(!H.hold){ let d = null; try{ d = await R.doc(); }catch(e){} const G = d ? R.guard({ doc: d, renew: true }) : null; if(G && !G.ok) H = { hold: true, why: G.why.join(' · ') }; }   /* 1611 */\n      if(H.hold){"]
]);
