// 1300: (Misty, 27 Oct 12:35 · backlog 3) Google background lookups ran again and again (mgmtNight/Health ~every 3–5 min, MyPay,
//   PayChecks, schedLists 8–37 s each) although the screens already showed the database copy:
//   1. Google rewrites its database copy only when the answer CHANGED, so an unchanged answer kept an old date and every reload/open
//      saw the copy as "old" → asked Google again. Now, when Google's answer equals the copy, this device remembers "checked at <time>"
//      for that copy and treats it as fresh from then (per device; only when the content is identical, so nothing stale is shown).
//      For lookups Google never copies (My pay, pay checks…), the device keeps its own last answer the same way.
//   2. Some READS counted as saves (clash check while typing, video flags, password info, package check, PDFs…): every one of them
//      marked all copies "old" for 2 minutes → a burst of Google calls. They no longer count as saves. Real saves still do.
//   Numbers, permissions and screens are unchanged; Google still refreshes each lookup on its own timer (SB_BGAGE / SB_OKAGE).
require('../tools/lib.js')(process.argv[2], [
  //   3. Background refresh spacing for slow, rarely-changing lookups (they still refresh at once when a screen is opened and its
  //      copy is older than SB_OKAGE / 3 min): student/teacher lists 15 min, My pay 30, pay checks / pay ready / trial follow-ups 10,
  //      folder links 60, ignored fixes 15 (was 5 min each).
  //   4. My pay (Google only, no database copy): the background preload on every app start now reuses this device's last answer
  //      when it is under 30 min old; opening My pay still asks Google.
  ["try{ await swr('mypay', () => api('mgmtMyPay', TOKEN),",
   "try{ const _t1300 = +(store('get', 'coe.mypayT') || 0), _c1300 = quiet && kept('mypay') && Date.now() - _t1300 < 30 * 6e4;   /* 1300 */\n  await swr('mypay', _c1300 ? () => Promise.resolve(kept('mypay')) : () => api('mgmtMyPay', TOKEN).then(v => { try{ store('set', 'coe.mypayT', String(Date.now())); }catch(e){} return v; }),"],
  ["tStuClasses: 20 * 6e4, tMsgs: 0 };", "tStuClasses: 20 * 6e4, tMsgs: 0, schedLists: 15 * 6e4, mgmtMyPay: 30 * 6e4, mgmtPayChecks: 10 * 6e4, mgmtPayReady: 10 * 6e4, mgmtTrialFus: 10 * 6e4, mgmtUrls: 60 * 6e4, mgmtFixIgnored: 15 * 6e4 };   /* 1300 */"],
  ["if(!API_READ.test(fn) && !API_BG.test(fn) && !SB_R.test(fn) && !/Seen|Ack|Pulse|Nudge/.test(fn)) SB_LASTW = Date.now();",
   "if(!API_READ.test(fn) && !API_BG.test(fn) && !SB_R.test(fn) && !/Seen|Ack|Pulse|Nudge/.test(fn) && !/^(classCheck|tFbPlus|tVidFlags|tVidList|mgmtVidFlags|mgmtRoadmap|mgmtPcPdf|mgmtReportPdf|mgmtTrialPdf|mgmtTrialSentPic|mgmtPwInfo|mgmtPkgCheck)$/.test(fn)) SB_LASTW = Date.now();   /* 1300: reads are not saves */"],
  ["async function sbRead(fn, args, real, ui){\n  const key = sbKey(fn, args), f = SB_FRESH[key]; if(f && Date.now() - f.t < 20000) return f.data;",
   "/* 1300: a copy Google answered identically counts as checked at that time (this device) */\n" +
   "const SBV_KEEP = /^(mgmtMyPay|mgmtPayChecks|mgmtPayReady|mgmtHealth|mgmtNight|mgmtUrls|mgmtFixIgnored|mgmtTrialFus|schedLists|tPayCheck|tPayReady|tGrowth)$/;\n" +
   "function sbvH(s){ let h = 5381; for(let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h + ':' + s.length; }\n" +
   "function sbvAll(){ try{ return JSON.parse(localStorage.getItem('coe.sbv') || '{}'); }catch(e){ return {}; } }\n" +
   "function sbvMark(key, fn, x){ try{ if(x == null || (x && x.ok === false)) return; const s = JSON.stringify(x), A = sbvAll(); A[key] = { t: Date.now(), h: sbvH(s) }; const ks = Object.keys(A); if(ks.length > 300) ks.sort((a, b) => A[a].t - A[b].t).slice(0, ks.length - 300).forEach(k => delete A[k]); localStorage.setItem('coe.sbv', JSON.stringify(A));\n" +
   "  if(SBV_KEEP.test(fn) && s.length < 160000) localStorage.setItem('coe.sbl:' + key, JSON.stringify({ t: Date.now(), data: x })); }catch(e){} }\n" +
   "async function sbDocV(key, fn){ const d = await sbDoc(key); try{ const v = sbvAll()[key];\n" +
   "  if(d && v && v.t > Date.parse(d.at) && v.h === sbvH(JSON.stringify(d.data))) return Object.assign({}, d, { at: new Date(v.t).toISOString() });\n" +
   "  if(SBV_KEEP.test(fn)){ const L = JSON.parse(localStorage.getItem('coe.sbl:' + key) || 'null'); if(L && L.data != null && (!d || L.t > Date.parse(d.at))) return { data: L.data, at: new Date(L.t).toISOString() }; } }catch(e){} return d; }\n" +
   "async function sbRead(fn, args, real, ui){\n  const key = sbKey(fn, args), f = SB_FRESH[key]; if(f && Date.now() - f.t < 20000) return f.data;\n" +
   "  const sbDoc = k => sbDocV(k, fn); { const r0 = real; real = () => { const p = r0(); Promise.resolve(p).then(x => sbvMark(key, fn, x), () => {}); return p; }; }   /* 1300 */"]]);
