// 1506 · Several tabs open together (follows 1505, which made opening screens in new tabs easy).
// · One "sounding" tab (the one used last) plays chat / class sounds, shows phone and desktop alerts and the "Before you start" pop-up;
//   the other tabs stay quiet. Reminders are left for that tab instead of being used up silently.
// · Hidden tabs that are not the sounding tab skip their slow background updates (timers of 20 s or more) and catch up when opened.
// · Saves kept on the device are sent by one tab at a time, and a send no longer drops an item added while it ran:
//   coe.wq (notes, homework, feedback …: the server also ignores a repeated rid), class visits (coe.mvq), time-in "posted" ticks,
//   Team Chat › Time-in posts (coe.chq1495).
//   Team Chat keeps no outbox; a retried message reuses its cid and the server posts it once.
// · Signing out in one tab signs out the others; signing in (or as someone else) reloads the others.
// · Drafts (class notes, QA evaluations, monthly feedback): a tab never overwrites a draft that another tab changed after this tab
//   last saved it; it says so once, and reopening the form continues from the newest version.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const boot = fs.readFileSync(path.join(__dirname, '1506-tabs-boot.inc'), 'utf8');
const inc = fs.readFileSync(path.join(__dirname, '1506-tabs.inc'), 'utf8');
const LOCK = "(window.lock1506 || function(n, f){ return Promise.resolve().then(f); })";
require('../tools/lib.js')(file, [
  ['<html lang="en">\n<head>\n<meta charset="utf-8">', '<html lang="en">\n<head>\n<meta charset="utf-8">\n<script id="b1506">\n' + boot + '</script>'],
  // Team Chat sound: only the sounding tab (a test from Chat sounds always plays)
  ["function chime(force, kind){ if(!force && !sndOn()) return;",
   "function chime(force, kind){ if(!force && !sndOn()) return; if(!force && window.tabLead1506 && !tabLead1506()) return;   /* 1506 */"],
  // "Before you start" pop-up: only the sounding tab
  ["clearTimeout(window._mustT); window._mustT = setTimeout(() => { if(POPPED === sig ||",
   "clearTimeout(window._mustT); window._mustT = setTimeout(() => { if((window.tabLead1506 && !tabLead1506()) || POPPED === sig ||"],
  // coe.wq: keep items added while sending; drop only what was sent
  ["put(left); busy = 0;",
   "{ const sent = {}, keep = {}; q.forEach(x => { sent[x.rid] = 1; }); left.forEach(x => { keep[x.rid] = x; }); put(get().filter(x => !sent[x.rid] || keep[x.rid]).map(x => keep[x.rid] || x)); } busy = 0;   /* 1506 */"],
  // class visits kept on the device: one tab sends; a visit saved meanwhile stays in the queue
  ["async function mvFlush(){ let q = []; try{ q = JSON.parse(store('get', MVQ) || '[]'); }catch(x){} if(!q.length || !TOKEN) return; const left = [];\nfor(const p of q){ try{ const r = await api('mgmtMonitor', TOKEN, p); if(!r || (!r.ok && !r.msg)) left.push(p); }catch(x){ left.push(p); } } store('set', MVQ, JSON.stringify(left)); }",
   "function mvFlush(){ return " + LOCK + "('mvq', mvFlush1506); }   /* 1506: one tab at a time */\n" +
   "async function mvFlush1506(){ let q = []; try{ q = JSON.parse(store('get', MVQ) || '[]'); }catch(x){} if(!q.length || !TOKEN) return; const left = [];\nfor(const p of q){ try{ const r = await api('mgmtMonitor', TOKEN, p); if(!r || (!r.ok && !r.msg)) left.push(p); }catch(x){ left.push(p); } }\n" +
   "const J = x => JSON.stringify(x), sent = new Set(q.map(J)), keep = new Set(left.map(J)); let now = []; try{ now = JSON.parse(store('get', MVQ) || '[]'); }catch(x){} store('set', MVQ, JSON.stringify(now.filter(p => !sent.has(J(p)) || keep.has(J(p))))); }"],
  // time-in "posted" ticks not yet sent: one tab re-sends them
  ["setInterval(function(){ try{ var o = rd(); Object.keys(o).forEach(function(k){ if(!o[k].sent && o[k].day === today()) call('post', { time: o[k].time, ti: o[k].ti }).then(function(r){ if(r && r.ok){ var q = rd(); if(q[k]){ q[k].sent = 1; wr(q); } } }); }); }catch(e){} }, 60000);",
   "setInterval(function(){ " + LOCK + "('wct', function(){ var P = []; try{ var o = rd(); Object.keys(o).forEach(function(k){ if(!o[k].sent && o[k].day === today()) P.push(call('post', { time: o[k].time, ti: o[k].ti }).then(function(r){ if(r && r.ok){ var q = rd(); if(q[k]){ q[k].sent = 1; wr(q); } } })); }); }catch(e){} return Promise.all(P); }); }, 60000);   /* 1506: one tab at a time */"],
  // Team Chat › Time-in posts kept on the device (1495): one tab sends them (the server also refuses a repeated cid)
  ["async function qFlush(){ if(!hasD() || qFlush.busy) return;",
   "function qFlush(){ return " + LOCK + "('chq', qFlush1506); }   /* 1506: one tab at a time */\n  async function qFlush1506(){ if(!hasD() || qFlush.busy) return;"],
]);
const s0 = fs.readFileSync(file, 'utf8');
const i = s0.lastIndexOf('</body>');
fs.writeFileSync(file, s0.slice(0, i) + '<script id="t1506">\n' + inc + '</script>\n' + s0.slice(i));
