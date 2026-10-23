// 753: (speed check 23 Oct) the slow waits came from background calls piling up on Google: management's "Live" pulse ran every 20 s
// on every open device (1,337 calls from one laptop today, ~5 s each, overlapping when Google was slow), and every teacher time-in made
// every management device reload everything. Now: pulse every 45 s, never two at once, at least 30 s apart; the full reload after
// time-ins at most once every 2 minutes; pay checks at most every 3 minutes (a nudge still refreshes at once); a teacher's
// feedback-form prefetch at most every 30 minutes.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("async function pulse(){\nif(!D || !D.mgr || document.hidden) return;",
    "let PULSE_BUSY = 0, PULSE_AT = 0, PULSE_RL = 0;   /* 753 */\nasync function pulse(){ if(!D || !D.mgr || document.hidden || PULSE_BUSY || Date.now() - PULSE_AT < 30000) return; PULSE_BUSY = 1; PULSE_AT = Date.now(); try{ return await pulse0(); }finally{ PULSE_BUSY = 0; } }\nasync function pulse0(){\nif(!D || !D.mgr) return;");
rep("if(k.has('Time-in')||k.has('Time-out')||k.has('Class check-in')||k.has('Late review')||k.has('Payroll')) loadMgmt(true);",
    "if((k.has('Time-in')||k.has('Time-out')||k.has('Class check-in')||k.has('Late review')||k.has('Payroll')) && Date.now() - PULSE_RL > 120000){ PULSE_RL = Date.now(); loadMgmt(true); }");
rep("setInterval(pulse, 20000);", "setInterval(pulse, 45000);");
rep("async function loadPayChecks(){ try{", "async function loadPayChecks(force){ if(!force && window._pckAt && Date.now() - window._pckAt < 3 * 6e4) return; window._pckAt = Date.now(); try{");
rep("loadPayChecks(); }catch(e){ toast((e && (e.msg || e.mess", "loadPayChecks(1); }catch(e){ toast((e && (e.msg || e.mess");
rep("async function fbPrefetch(){", "async function fbPrefetch(){ if(window._fbpAt && Date.now() - window._fbpAt < 30 * 6e4) return; window._fbpAt = Date.now();");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
