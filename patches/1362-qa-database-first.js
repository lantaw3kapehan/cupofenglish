// 1362 · QA evaluations saved in the database first (Misty 27 Oct 23:27).
//   Send evaluation → the evaluation is saved in the database (edge function coe-qa, table coe_qa_saves) and the sheet closes at once;
//   the teacher's Growth shows it within a minute (coe-growth reads the saves).
//   Google is still sent the same evaluation exactly as before (mgmtQaSubmit → QA-DATA, plus the QA-sent mark and QA row copy),
//   behind the screen (once; never resent automatically, so Google never gets it twice). Its answer is recorded (landed / failed). If Google refuses it: a toast says so, the draft is kept
//   (it is only cleared once Google confirms) and the database copy is marked failed so it never shows.
//   If the database save itself fails: the old way (wait for Google) is used.
const file = process.argv[2];
require('../tools/lib.js')(file, [
[`try{ const r = await api('mgmtQaSubmit', TOKEN, a); if(!r.ok) throw r;
store('del', qaDraftK()); closeSheet();`,
`var qaRid1362 = 'qa-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
const QURL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-qa', rid = qaRid1362, dk = qaDraftK();
const qpost = o => fetch(QURL, { method:'POST', headers:{ 'Content-Type':'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, rid }, o)) }).then(x => x.json());
let saved = null;
if(typeof LIVE !== 'undefined' && LIVE) try{ const its = QF.form.items.map(x => ({ id: x.id, title: x.title, type: x.type }));
  saved = await Promise.race([qpost({ op:'save', items: its, answers: a }), new Promise(res => setTimeout(() => res(null), 6000))]); }catch(e){ saved = null; }
if(saved && saved.ok && saved.status === 'pending'){
  closeSheet(); toast('✓ QA evaluation sent · Teacher ' + who + ' · it is on their QA feedback now');
  PF = null; try{ store('del','coe.m.perf'); }catch(e){}
  const done = (ok, msg) => qpost({ op:'done', ok, msg }).catch(() => {});
  api('mgmtQaSubmit', TOKEN, a).then(r => { if(!r || !r.ok) throw r || {};
      try{ store('del', dk); }catch(e){} done(true); if(VIEW === 'perf' && typeof loadPerf === 'function') loadPerf(); })
    .catch(e => { const m = (e && e.msg) || '';
      done(false, m || 'not sent'); toast('QA evaluation for Teacher ' + who + ' did not reach Google' + (m ? ' · ' + m : '') + ' · your writing is kept · open QA and send again'); });
  return; }
try{ const r = await api('mgmtQaSubmit', TOKEN, a); if(!r.ok) throw r;
if(typeof LIVE !== 'undefined' && LIVE) qpost({ op:'done', ok:true }).catch(() => {});   /* also when the database save was slow */
store('del', qaDraftK()); closeSheet();`],
[`catch(e){ b.disabled = false; b.textContent = 'Send evaluation'; $('qaErr').textContent = (e && e.msg) || 'Not sent. Your writing is kept · try again.'; }`,
`catch(e){ if(typeof LIVE !== 'undefined' && LIVE) try{ fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-qa', { method:'POST', headers:{ 'Content-Type':'text/plain' }, body: JSON.stringify({ op:'done', token: TOKEN, rid: qaRid1362, ok: false, msg: (e && e.msg) || 'not sent' }) }).catch(() => {}); }catch(x){}
b.disabled = false; b.textContent = 'Send evaluation'; $('qaErr').textContent = (e && e.msg) || 'Not sent. Your writing is kept · try again.'; }`],
]);
