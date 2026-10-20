// 20 Oct · Plain words in the address bar: #todo, #students, #overview, #messages … instead of the app's inner names (#mtoday, #astudents …).
const DEF = "  /* 401 · plain words in the address bar */\n" +
"  const HN = { mtoday: 'todo', astudents: 'students', students: 'my-students', home: 'overview', msgs: 'messages', tinbox: 'inbox', enquiry: 'enquiries', perf: 'performance', db: 'database', money: 'sales', tsched: 'my-schedule', mypay: 'my-pay', active: 'active-students' };\n" +
"  const HV = {}; Object.keys(HN).forEach(k => { HV[HN[k]] = k; });\n" +
"  window.coeH = v => '#' + (HN[v] || v);\n" +
"  window.coeHV = () => { const h = (location.hash || '').slice(1); return HV[h] || h; };\n";
require('../tools/lib.js')(process.argv[2], [
  ["  /* ── 1. Back / Forward ── */", DEF + "  /* ── 1. Back / Forward ── */"],
  ["location.hash.slice(1) !== v) history.pushState({ v }, '', '#' + v)", "coeHV() !== v) history.pushState({ v }, '', coeH(v))"],
  ["location.hash || ('#' + VIEW)", "location.hash || coeH(VIEW)"],
  ["    const v = (location.hash || '').slice(1);\n    if(isView(v)", "    const v = coeHV();\n    if(isView(v)"],
  ["history.pushState({ v: VIEW }, '', '#' + VIEW); }catch(e){} });", "history.pushState({ v: VIEW }, '', coeH(VIEW)); }catch(e){} });"],
  ["history.replaceState({ v: VIEW, base: 1 }, '', '#' + VIEW); history.pushState({ v: VIEW }, '', '#' + VIEW);", "history.replaceState({ v: VIEW, base: 1 }, '', coeH(VIEW)); history.pushState({ v: VIEW }, '', coeH(VIEW));"],
  ["setTimeout(() => { try{ const v = (location.hash || '').slice(1);", "setTimeout(() => { try{ const v = coeHV();"]]);
