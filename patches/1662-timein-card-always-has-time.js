// 1662: (tonight's check · chat_messages 72, Julia 17:22, v1477) a Time-in post with an empty time and status (body "Time-in").
// Her time-in saved 17:21 On time at 17:22:38 (writes 3109). A slow background reload (getBootstrap after the save, 40 s, started
// before the save finished) then replaced the time-in in memory with an older copy without the time. The picture had already been
// drawn with 17:21 (Send stays off without the time and status), but the post took its time and status from that replaced copy.
// Fix:
//  A · the post's time and status come from the picture's own data first, then the time-in in memory, then the time-in saved on
//      this laptop when it was made (kept for the day). A post with no time or no status is never sent: "Your time-in is still
//      saving · tap Try again in a moment".
//  B · the picture uses the same saved time-in when the copy in memory has lost it.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  function here1660(){",
   "  /* 1662 · the time-in as it was saved (time, status, minutes), kept for the day: a later reload of older data cannot blank the post */\n"
   + "  var TIS1662 = null;\n"
   + "  function save1662(t){ try{ if(!t || !t.time || !t.status || t.pending) return; TIS1662 = { day: today(), who: me(), time: String(t.time), status: String(t.status), mins: t.mins }; localStorage.setItem('coe.tisaved1662', JSON.stringify(TIS1662)); }catch(e){} }\n"
   + "  window.tiSaved1662 = function(){ var ok = function(r){ return r && r.time && r.status && r.day === today() && r.who === me() ? r : null; }; if(ok(TIS1662)) return TIS1662; try{ return ok(JSON.parse(localStorage.getItem('coe.tisaved1662') || 'null')); }catch(e){ return null; } };\n"
   + "  function here1660(){"],
  ["D.timeIn.day1270 = today(); here1660();", "D.timeIn.day1270 = today(); here1660(); save1662(D.timeIn);"],
  ["return { name: me(), day: D.today || today(), time: ti.time || '', status: String(ti.status || ''), mins: ti.mins,",
   "if(!redo && ti.time && ti.status && !ti.pending) save1662(ti); var sv1662 = (!ti.time || !ti.status) ? (window.tiSaved1662() || {}) : {};   /* 1662 */\n"
   + "    return { name: me(), day: D.today || today(), time: ti.time || sv1662.time || '', status: String(ti.status || sv1662.status || ''), mins: ti.time ? ti.mins : sv1662.mins,"],
  ["var meta = { time: ti.time || '', status: ti.status || '', speed: x && x.speed ? String(x.speed).slice(0, 80) : '' };",
   "var sv = (window.tiSaved1662 && tiSaved1662()) || {}, tt = (x && x.time) || ti.time || sv.time || '', ts = String((x && x.status) || (ti.pending ? '' : ti.status) || sv.status || '');   /* 1662: the picture's own time first; never blank */\n"
   + "      if(!tt || !ts || /^Saving$/i.test(ts)) return { error: 'Your time-in is still saving · tap Try again in a moment' };\n"
   + "      var meta = { time: tt, status: ts, speed: x && x.speed ? String(x.speed).slice(0, 80) : '' };"],
  ["body: 'Time-in ' + (ti.time || '') + (ti.status ? ' · ' + ti.status : '') + (redo ? ' · Redo' : '') } }); };",
   "body: 'Time-in ' + tt + ' · ' + ts + (redo ? ' · Redo' : '') } }); };"],
]);
