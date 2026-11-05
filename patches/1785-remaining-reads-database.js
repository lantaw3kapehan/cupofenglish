// 1785: (Misty 5 Nov "Any other that we need to move to supabase and let supabase database read all")
//   Answered by the database (edge coe-reads) instead of Google / the sheet copies, now that their saves are database-first:
//   service agreements (mgmtAgreeMap, mgmtAgree · coe_agree), teacher profiles (mgmtProfiles · coe_tprofile), enquiries (mgmtEnqList ·
//   coe_enquiries), open times (mgmtAvailAll, mgmtAvail, teacher tAvail · coe_avail + classes), class-note comments (tNoteComments,
//   tMyComments · coe_note_comments), "Data to fix" hidden items (mgmtFixIgnored · coe_fix_flags), last QA evaluation (mgmtQaLast · coe_qa).
//   Trials (mgmtTrials) and pay readiness (mgmtPayReady, tPayReady) now also take "Redo asked" / "Sending", the Operations items
//   (follow-ups, renewals, late decisions, data to fix) and the pay reminder from the database; "Remind" (mgmtPayNudge) is kept in the
//   database (docs sys:pnudge) and Google is told behind. Checked against Google's saved answers (same apart from data changed since).
//   Still Google: the class-video list of pay readiness (DAILY tab links) — Google is asked behind at most every 30 min so it stays fresh.
//   Google only if the database cannot answer.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<script>\n/* 1785 · remaining reads from the database (coe-reads); Google only when the database cannot answer */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1785) return;\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-reads', an0 = window.apiNow;\n" +
   "  const body = (fn, a) => fn === 'mgmtAgreeMap' ? { op: 'agreemap' } : fn === 'mgmtAgree' ? (a[1] && typeof a[1] === 'object' ? { op: 'agree', q: a[1] } : null)\n" +
   "    : fn === 'mgmtProfiles' ? { op: 'profiles' } : fn === 'mgmtEnqList' ? { op: 'enqlist' }\n" +
   "    : fn === 'mgmtAvailAll' ? (Array.isArray(a[1]) ? { op: 'availall', names: a[1] } : null) : fn === 'mgmtAvail' ? (a[1] ? { op: 'avail', teacher: a[1], days: a[2] } : null)\n" +
   "    : fn === 'tAvail' ? { op: 'tavail', days: a[1] } : fn === 'tNoteComments' ? (a[1] ? { op: 'notecomments', code: a[1] } : null) : fn === 'tMyComments' ? { op: 'mycomments' }\n" +
   "    : fn === 'mgmtFixIgnored' ? { op: 'fixignored' } : fn === 'mgmtQaLast' ? { op: 'qalast', teacher: a[1] }\n" +
   "    : fn === 'mgmtTrials' ? { op: 'trials' } : fn === 'mgmtPayReady' ? { op: 'payready' } : fn === 'tPayReady' ? { op: 'tpayready' }\n" +
   "    : fn === 'mgmtPayNudge' ? { op: 'paynudge', names: a[1] } : null;\n" +
   "  let vidAt = 0;\n" +
   "  const behind = (fn, a) => { try{ if(typeof apiOnce !== 'function') return;\n" +
   "      if(fn === 'mgmtPayNudge') apiOnce('mgmtPayNudge', a, 45000, '').catch(() => {});   /* Google keeps its own copy of the reminder */\n" +
   "      else if(fn === 'mgmtPayReady' && Date.now() - vidAt > 30 * 6e4){ vidAt = Date.now(); setTimeout(() => { try{ apiOnce('mgmtPayReady', a, 120000, '').catch(() => {}); }catch(e){} }, 60000); }   /* the class-video list (DAILY links) */\n" +
   "    }catch(e){} };\n" +
   "  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this, go = () => base.apply(self, [fn].concat(a)), fb = () => (typeof an0 === 'function' ? an0.apply(self, [fn].concat(a)) : go());\n" +
   "    const b = a[0] ? body(fn, a) : null; if(!b) return base.apply(this, arguments);\n" +
   "    return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: a[0] }, b)) })\n" +
   "      .then(x => x.json()).then(r => { if(r && r.ok && r.data != null){ behind(fn, a); return r.data; } return fb(); }, fb); };\n" +
   "  w.__1785 = 1; window.api = w;\n" +
   "  const an = window.apiNow; if(typeof an === 'function') window.apiNow = apiNow = function(fn){ const a = Array.prototype.slice.call(arguments, 1);\n" +
   "    if(a[0] && body(fn, a)) return w.apply(this, arguments); return an.apply(this, arguments); };\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
