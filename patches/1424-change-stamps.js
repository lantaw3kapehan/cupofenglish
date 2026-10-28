// 1424: (Misty, 28 Oct 11:21) "the LESSON SUMMARY should also refresh after renewal, why issues like these are being repetitive?"
// The pattern: every screen kept its own saved copy and refreshed on its own rules, so each kind of save was fixed screen by screen.
// Now one change stamp per kind of data (database: table coe_stamp → docs 'sys:stamps', bumped by every write to the class table,
// the packages and every copied sheet tab — database-first saves and Google's catch-up copies alike). The app reads the stamps every
// 15 s while visible (and on focus, and a few seconds after any save made here); each cached view declares what it depends on, and
// a view whose data changed is refetched and REPLACED (its saved copy dropped first), never merged. Typing in a box is never
// interrupted: that view waits for the next check.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ['<style id="st1270">',
   "<script>\n" +
   "/* 1424 · change stamps: what changed in the database → which views refetch */\n" +
   "(function(){\n" +
   "  const delKeys = re => { try{ Object.keys(SB_FRESH).forEach(k => { if(re.test(k)) delete SB_FRESH[k]; }); }catch(e){} };\n" +
   "  const typing = () => { const a = document.activeElement; return !!(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.type !== 'button' && a.type !== 'checkbox' && a.type !== 'radio') || !!(a && a.isContentEditable); };\n" +
   "  const sheetOn = () => { const s = document.getElementById('sheet'); return !!(s && s.classList.contains('on')); };\n" +
   "  function stuRefresh(){ try{ if(typeof STU === 'undefined' || !STU || !STU.code || !sheetOn() || window._stuOpen !== STU.code) return; const code = STU.code;\n" +
   "    api(D.mgr ? 'mgmtStuClasses' : 'tStuClasses', TOKEN, code).then(L => { if(!Array.isArray(L)) return; CLSM[code] = L; try{ store('set', 'coe.cls.' + code, JSON.stringify(L)); }catch(e){} if(STU && STU.code === code){ STU.cls = L; const el = $('stuSch'); if(el) el.innerHTML = stuSched(L); } }).catch(() => {});\n" +
   "    api(D.mgr ? 'mgmtStudent' : 'tStudent', TOKEN, code).then(r => { if(!r || r.ok === false || !(STU && STU.code === code)) return; try{ store('set', 'coe.stu.' + code, JSON.stringify(r)); }catch(e){} STU.r = r; try{ stuRender(); }catch(e){} }).catch(() => {}); }catch(e){} }\n" +
   "  function swRefresh(){ try{ if(typeof SW === 'undefined' || !SW || !SW.code || !sheetOn()) return; const code = SW.code; api('mgmtStuClasses', TOKEN, code).then(L => { if(!Array.isArray(L) || !(SW && SW.code === code)) return; CLSM[code] = L; try{ store('set', 'coe.cls.' + code, JSON.stringify(L)); }catch(e){} SW.events = (window.clsClean ? clsClean(L) : L).slice(); swPaint(); }).catch(() => {}); }catch(e){} }\n" +
   "  function lsRefresh(){ try{ if(typeof DOCV !== 'undefined' && DOCV && DOCV.key === 'SHPKG' && DOCV.pick && sheetOn() && typeof shSummary === 'function') shSummary(DOCV.pick, true, 1); }catch(e){} }\n" +
   "  function viewRefresh(views){ try{ if(views.indexOf(VIEW) < 0) return; if(VIEW === 'schedule' && typeof loadSchedule === 'function'){ loadSchedule(0, true); return; } if(VIEW === 'active' && typeof loadActive === 'function'){ loadActive(true); return; } if(VIEW === 'astudents' && typeof loadStudents === 'function'){ loadStudents(); return; } const S = SCREENS[VIEW]; if(S) S[2](true); }catch(e){} }\n" +
   "  /* the registry: kind of data → what to drop, which screens refetch */\n" +
   "  const REG = {\n" +
   "    classes: { fns: /(StuClasses|Schedule|TeacherWeek|MonDay|LeaveClasses|getBootstrap|mgmtOverview)\\|/, drop(){ try{ Object.keys(CLSM).forEach(k => delete CLSM[k]); }catch(e){} try{ Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); }catch(e){} }, views: ['schedule', 'tsched', 'mtoday', 'today', 'monitor', 'todo'], stu: 1, sw: 1 },\n" +
   "    packages: { fns: /(mgmtActive|mgmtStudents?|tStudent|mgmtRenewals|mgmtOverview|getBootstrap)\\|/, drop(){ try{ AT = null; store('del', 'coe.m.active'); }catch(e){} }, views: ['active', 'astudents', 'students', 'mtoday', 'todo', 'renewals'], stu: 1, ls: 1 },\n" +
   "    lessons: { fns: /(mgmtActive|mgmtStudents?|tStudent|mgmtRenewals|tGrowth|mgmtGrowth)\\|/, drop(){ try{ AT = null; store('del', 'coe.m.active'); }catch(e){} }, views: ['active', 'astudents', 'students', 'mtoday', 'todo'], stu: 1, ls: 1 },\n" +
   "    sales: { fns: /(moneyLists|mgmtActive|mgmtStudent|mgmtRenewals|mgmtOverview)\\|/, drop(){ try{ MN = null; store('del', 'coe.m.money'); }catch(e){} }, views: ['money', 'finov', 'expenses', 'active', 'mtoday', 'todo'], ls: 1 },\n" +
   "    money: { fns: /(moneyLists|mgmtPayroll|mgmtOverview)\\|/, drop(){ try{ MN = null; store('del', 'coe.m.money'); }catch(e){} }, views: ['money', 'finov', 'expenses', 'payroll'] },\n" +
   "    students: { fns: /(mgmtStudents?|mgmtDatabase|dbLists|dbRecord|tStudent|getBootstrap)\\|/, drop(){ try{ DB = null; MS = null; store('del', 'coe.m.db'); }catch(e){} }, views: ['db', 'astudents', 'students'], stu: 1 },\n" +
   "    notes: { fns: /(mgmtStudent|tStudent|tHwHist|tNoteComments|mgmtReports)\\|/, drop(){}, views: ['reports'], stu: 1 },\n" +
   "    reports: { fns: /(mgmtStudent|tStudent|mgmtReports|mgmtReportsWait|tFbStatus|tGrowth|mgmtGrowth|mgmtQaLast)\\|/, drop(){}, views: ['reports', 'qa', 'growth'], stu: 1 },\n" +
   "    timein: { fns: /(mgmtOverview|mgmtHours|tGrowth|getBootstrap)\\|/, drop(){}, views: ['mtoday', 'monitor', 'today', 'todo'] },\n" +
   "    msgs: { fns: /(mgmtMsgs|tMsgs)\\|/, drop(){}, views: ['msgs', 'inbox', 'messages'] },\n" +
   "    agree: { fns: /(mgmtAgree\\w*|mgmtActive)\\|/, drop(){}, views: ['active', 'contract'] } };\n" +
   "  let last = null, busy = false, at = 0; const wait = {};\n" +
   "  function apply(kinds){ const views = [], acts = {}; kinds.forEach(k => { const R = REG[k]; if(!R) return; delKeys(R.fns); try{ R.drop(); }catch(e){} R.views.forEach(v => views.indexOf(v) < 0 && views.push(v)); if(R.stu) acts.stu = 1; if(R.sw) acts.sw = 1; if(R.ls) acts.ls = 1; });\n" +
   "    if(typing()){ kinds.forEach(k => wait[k] = 1); return; }   /* never interrupt typing: try again on the next check */\n" +
   "    viewRefresh(views); if(acts.stu) stuRefresh(); if(acts.sw) swRefresh(); if(acts.ls) lsRefresh(); }\n" +
   "  async function check(){ if(busy || typeof TOKEN === 'undefined' || !TOKEN || typeof D === 'undefined' || !D || document.hidden) return; busy = true; at = Date.now();\n" +
   "    try{ const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:stamps'] }) }).then(x => x.json());\n" +
   "      const s = r && r.ok && r.docs && r.docs['sys:stamps'] && r.docs['sys:stamps'].data; if(!s || typeof s !== 'object') return;\n" +
   "      const kinds = Object.keys(wait); Object.keys(wait).forEach(k => delete wait[k]);\n" +
   "      if(last) Object.keys(s).forEach(k => { if(+s[k] > +(last[k] || 0) && kinds.indexOf(k) < 0) kinds.push(k); });\n" +
   "      last = s; if(kinds.length) apply(kinds); }catch(e){} finally{ busy = false; } }\n" +
   "  window.coeStampCheck = check; window.coeStampReg = REG; window.coeStampApply = apply;\n" +
   "  setInterval(() => { if(!document.hidden && Date.now() - at > 14000) check(); }, 5000);\n" +
   "  document.addEventListener('visibilitychange', () => { if(!document.hidden) check(); }); window.addEventListener('focus', () => check());\n" +
   "  /* a save made here: look again soon (the database-first saves land within seconds, Google's copies within a minute or two) */\n" +
   "  const W = /^(add|edit|save|mgmt(Renew|Enrol)Paid|mgmtRenewal|mgmtSetBook|mgmtAgreeSave|timeIn|timeOut|classIn|tFbSubmit|tPcSubmit|tCancel|mgmtSub|mgmtMsg|tMsg|saveNote|markHomework|mgmtPkgFix|mgmtRefund|addExpense|addSale)/;\n" +
   "  const _api = window.api; window.api = function(fn){ const p = _api.apply(this, arguments); try{ if(W.test(String(fn || ''))) Promise.resolve(p).then(() => { [3000, 15000, 45000, 120000].forEach(t => setTimeout(() => { at = 0; check(); }, t)); }).catch(() => {}); }catch(e){} return p; };\n" +
   "  for(const k in _api) try{ window.api[k] = _api[k]; }catch(e){}\n" +
   "  setTimeout(check, 4000);\n" +
   "})();\n" +
   "</script>\n<style id=\"st1270\">"]
]);
