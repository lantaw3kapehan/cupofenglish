// 2163 (13 Nov · Misty 13:49 "do all now" · sign-in steps 3–6):
// (a) Teacher profile › App e-mail › Save → the database first (coe-pw op 'email': staff.email + auth_users, the password moves with
//     the e-mail). Only when the database answers "fallback" (switch sys:live.emailDb off) is Google's setTeacherEmail asked.
// (b) Remove access… → the database first (coe-pw op 'off' with resign: password, sessions, failed tries removed; the e-mail is blocked so
//     Google cannot add it back; Resigned → staff inactive). Google's mgmtAccessOff then runs in the background (its sheet copy).
// (c) Misty 14:07–14:08: To do › Fix these › Renewal · "Done today" said "Not saved" (coe-ops v4 now takes renew: refs) and "Open" showed
//     an empty screen (there is no "renewals" screen): Open now opens the student; "Done today" says "Hidden until tomorrow";
//     the Briefing's "Renewals ›" goes to To do.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["try{ const r = await api('setTeacherEmail', TOKEN, TT.name, $('ttE').value); if(!r.ok) throw r;",
   "try{ let r = null; try{ r = await fetch(FAST_URL + '-pw', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'email', token: TOKEN, name: TT.name, email: $('ttE').value }) }).then(x => x.json()); }catch(e){ r = null; }   /* 2163 */\n  if(!r || r.fallback || r.error) r = await api('setTeacherEmail', TOKEN, TT.name, $('ttE').value); if(!r.ok) throw r;"],
  ["const r = await api('mgmtAccessOff', TOKEN, name, rs).catch(e => ({ ok:false, msg:String(e && e.message || e) })); window._accBusy = 0;\nif(!r || !r.ok) return toast(r && r.msg || 'Not removed');\nlet dbOff = null; try{ dbOff = await fetch(FAST_URL + '-pw', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'off', token: TOKEN, name: name }) }).then(x => x.json()); }catch(e){ dbOff = null; }   /* 2153 */\n  if(!dbOff || !dbOff.ok) alert('Google removed the access, but the database did not answer.\\n\\nPlease tap Remove access again so the app password is removed too.');",
   "let dbOff = null; try{ dbOff = await fetch(FAST_URL + '-pw', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'off', token: TOKEN, name: name, resign: !!rs }) }).then(x => x.json()); }catch(e){ dbOff = null; }   /* 2163: the database first */\nwindow._accBusy = 0;\nif(!dbOff || !dbOff.ok) return toast(dbOff && dbOff.msg || 'Not removed · try again');\nconst r = { ok: true, signedOut: dbOff.sessions || 0, resigned: !!dbOff.resigned };\ntry{ api('mgmtAccessOff', TOKEN, name, rs).catch(() => {}); }catch(e){}   /* Google's copy, in the background */"],
  ["· marked Resigned in MASTERLIST' : ''}", "· marked Resigned (inactive)' : ''}"],
  ["try{ go(x.go); }catch(e){} };",
   "if(x.kind === 'renew'){ var cd2163 = (String(x.text || '').match(/ST-\\d{4}-\\d{3}/) || [])[0]; if(cd2163 && typeof window.openStudent === 'function'){ try{ return window.openStudent(cd2163); }catch(e){} } try{ return go('mtoday'); }catch(e){} }   /* 2163 */\n    try{ go(x.go); }catch(e){} };"],
  ["toast('✓ Put away. It will not come back.')", "toast(x.kind === 'renew' ? '✓ Done for today · back tomorrow if still due' : '✓ Put away. It will not come back.')"],
  ["<a onclick=\"go(\\'renewals\\')\">Renewals ›</a>", "<a onclick=\"go(\\'mtoday\\')\">Renewals ›</a>"],
]);
