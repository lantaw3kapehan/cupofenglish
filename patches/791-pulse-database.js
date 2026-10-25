// 791: management "anything changed?" (mgmtPulse, every 30 s, ~16 s each on Google — the biggest Google load) now comes from the database:
// app saves (writes queue) and Google-direct saves (activity log). Google is still asked every 5 minutes for changes made straight in the
// sheets / calendar; its items for saves the database already has are dropped (no double toasts).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 791 · pulse from the database */
(function(){
  if(window.__791 || typeof window.api !== 'function') return; window.__791 = 1;
  const URL_ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-train';
  const DBF = /^(timeIn|classIn|saveNote|markHomework|tNoteTag|tGoalsSave|tFbSubmit|tPcSubmit|tTrialSubmit|tPeerSubmit|tSetMeet|tMsgAck|tVisitAck|tMsgSeen|tHwFlag|tMsgSend|tLeaveRequest|tPayVerify|mgmtRenewal|mgmtRenewPaid|mgmtEnrolPaid|mgmtReportSent|mgmtTrialFu|setCaseDone|mgmtMsgSeen|mgmtMsgSend|mgmtMsgReply|tVidStart|tVidDone|tVidExplain|tRemindLog|tNotMine|tLeaveReply|tLeaveCancel)$/;
  let gAt = 0;
  const base = window.api;
  const w = function(fn){ if(fn !== 'mgmtPulse') return base.apply(this, arguments);
    const since = arguments[2], self = this, args = arguments;
    const dbp = fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'pulse', since: since || 0 }) }).then(x => x.json());
    const wantG = Date.now() - gAt > 5 * 6e4; if(wantG) gAt = Date.now();
    const gp = wantG ? Promise.resolve(base.apply(self, args)).catch(() => null) : Promise.resolve(null);
    return dbp.then(async r => { if(!r || r.ok === false) throw new Error('db');
        const g = wantG ? await gp : null; let items = r.items || [];
        if(g && Array.isArray(g.items)) items = items.concat(g.items.filter(x => !(x.fn && DBF.test(x.fn))));
        items.sort((p, q) => q.t - p.t); return { now: r.now, time: r.time, items: items.slice(0, 25) }; })
      .catch(() => { gAt = Date.now(); return base.apply(self, args); });   /* database not answering: Google as before */
  };
  for(const k in base) try{ w[k] = base[k]; }catch(e){}
  window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
