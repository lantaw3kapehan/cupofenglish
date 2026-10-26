// 1145: (Misty, 26 Oct 19:38) Schedule showed "No “I'm in”" for Penny, Mia, Lucy, Prince and Maria although the teachers tapped
//      "I'm in" at 19:26–19:29 (all saved). The Schedule took check-ins only from Google's last schedule copy, which lags.
//      Now the day's "I'm in" / time-in taps come straight from the database (edge function coe-cin, management only) and fill any
//      class still showing none — with Google's own time and on-time/late status when it has answered. Refreshed every minute while
//      the Schedule is open. Nothing is written; Google's check-ins win when present.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1145 · Schedule "I'm in" from the database */
(function(){
  if(window.__1145) return; window.__1145 = 1;
  var C = { day: '', at: 0, busy: 0, ci: {}, ti: {} };
  var hm = function(iso){ try{ return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };
  function dayOf(e){ try{ return new Date(Date.parse(e.start) + 8 * 3600e3).toISOString().slice(0, 10); }catch(x){ return ''; } }
  function fill(e){ try{ if(!e || e.cancelled || (e.ci && (e.ci.time || e.ci.decision))) return;
      var x = C.ci[e.id + '|' + e.start] || C.ci[e.id];
      if(!x && e.first){ var t = String(e.teacher || '').split(',')[0].trim().toLowerCase(); x = C.ti[t]; if(x && !x.status) x = null; }
      if(!x) return;
      var mins = x.mins != null ? +x.mins : Math.max(0, Math.round((Date.parse(x.at) - Date.parse(e.start)) / 6e4));
      var st = x.status || (Date.parse(x.at) <= Date.parse(e.start) ? 'On time' : 'Late to class');
      e.ci = Object.assign({}, e.ci || {}, { time: x.time || hm(x.at), status: st, mins: mins, first: x.kind === 'ti', app1145: 1 }); }catch(err){} }
  async function load(day){
    if(C.busy){ setTimeout(kick, 1500); return false; } if(typeof TOKEN === 'undefined' || !TOKEN || typeof D === 'undefined' || !D || !D.mgr) return false;
    if(C.day === day && Date.now() - C.at < 55000) return false; C.busy = 1;
    try{ var r = await fetch(FAST_URL + '-cin', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, day: day }) }).then(function(y){ return y.json(); });
      if(!r || !r.ok) return false; var ci = {}, ti = {};
      (r.list || []).forEach(function(x){ if(x.kind === 'ci'){ ci[x.id + '|' + x.start] = x; if(!ci[x.id]) ci[x.id] = x; } else { var k = String(x.who || '').trim().toLowerCase(); if(!ti[k] || (x.status && !ti[k].status)) ti[k] = x; } });
      C.ci = ci; C.ti = ti; C.day = day; C.at = Date.now(); return true; }catch(e){ return false; } finally{ C.busy = 0; } }
  var _mc = window.monChips;
  if(typeof _mc === 'function') window.monChips = function(e){ fill(e); return _mc.apply(this, arguments); };
  function kick(){ try{ if(typeof VIEW === 'undefined' || VIEW !== 'schedule' || typeof SC === 'undefined' || !SC || !SC.events || !SC.events.length) return;
      var d = dayOf(SC.events[0]); load(d).then(function(ch){ if(ch && VIEW === 'schedule'){ SC.events.forEach(fill); try{ renderSchedule(); }catch(e){} } }); }catch(e){} }
  var _rs = window.renderSchedule;
  if(typeof _rs === 'function') window.renderSchedule = function(){ try{ if(typeof SC !== 'undefined' && SC && SC.events) SC.events.forEach(fill); }catch(e){} try{ return _rs.apply(this, arguments); } finally{ setTimeout(kick, 0); } };
  setInterval(kick, 60000);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
