// 990: (Misty, 25 Oct 19:02–19:04, teachers' live reports)
// 1 · "Class notes: they save it but it doesn't show" · Ara could not see her note for Austin since morning.
//     The saves DID reach the server (Austin: 6 saves, all ok). Two display gaps:
//     · a class the teacher covers as a substitute (Austin was "Sub" for Ara) is not in her own student list, so the saved
//       note was kept on a throw-away object and the card kept asking "Add today's class note";
//     · when the start data was re-read from Google right after a save (Google gets the save a little later), the fresh
//       copy replaced what the app had just saved, so a saved note, homework or "I'm in" disappeared again.
//     Now every successful save of a class note, homework and "I'm in" is also kept on the device for today and laid over
//     any newer copy until the server has it. The class card, the status pills (In · Homework · Note · Video) and the
//     class-note sheet look the note up by class first, for own and substitute classes alike.
// 2 · Julia: "I'm in" for Ollie at 18:59 was saved On time (server row 2339), but her screen went back to "I'm in · late"
//     → same cause as above; fixed by the same overlay.
// 3 · Class video upload kept pausing during back-to-back classes (783 paused uploads while a class is on, so with
//     continuous classes it never moved). Now it keeps uploading during classes, in smaller pieces with a short gap
//     between them so the class keeps most of the internet.
// 4 · My activity log: every line names the student (class note, homework, I'm in, note tags, meeting ID, class video
//     started / uploaded / explained), looked up from the class or the student code.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["const n = (s.notesEv && s.notesEv[c.id]) || s.note, ci = (D.classIns||{})[c.id];",
   "const n = (window.noteFor ? noteFor(s, c) : ((s.notesEv && s.notesEv[c.id]) || s.note)), ci = (D.classIns||{})[c.id];"],
  ["n = (s.notesEv && s.notesEv[c.id]) || s.note, hw = (D.hw||{})[c.id]",
   "n = (window.noteFor ? noteFor(s, c) : ((s.notesEv && s.notesEv[c.id]) || s.note)), hw = (D.hw||{})[c.id]"],
  ["n = s.note, noteOk = n && n.date === c.day",
   "n = (window.noteFor ? noteFor(s, c) : s.note), noteOk = n && n.date === c.day"],
  ["const n = { code, student: s.name||'', eventId",
   "const n = { code, student: s.name || ((D.schedule||[]).find(x => x.code === code && x.student) || {}).student || '', eventId"],
  ["const what = r => (NAME[r.fn] || r.fn) +",
   "const what = r => (window.actWhat ? actWhat(r, NAME) : '') || (NAME[r.fn] || r.fn) +"],
  ["tVidStart: a => { const f = a[2] || {}; return [f.name,",
   "tVidStart: a => { const f = a[2] || {}; return [window.actStu ? actStu(a[1]) : '', f.name,"],
  ["tVidDone: () => 'Video uploaded and linked',",
   "tVidDone: a => [window.actStu ? actStu({ key: a[1] }) : '', 'Video uploaded and linked'].filter(Boolean).join(' · '),"],
  ["tVidExplain: a => [a[2], a[3]]",
   "tVidExplain: a => [window.actStu ? actStu({ id: a[1] }) : '', a[2], a[3]]"],
  ["/* 783: wait while a class is on */\n        const end = Math.min(off + CH, N);",
   "/* 783: wait while a class is on */\n        const inCls990 = !!(window.vidBusy && vidBusy(c)); if(inCls990) await sleep(1200);   /* 990: during a class keep going, smaller pieces */\n        const end = Math.min(off + (inCls990 ? CH0 : CH), N);"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 990 · saved notes / homework / I'm in stay visible · substitute classes · uploads continue in class · names in the activity log */
(function(){
  if(window.__990) return; window.__990 = 1;
  var K = 'coe.sv990';
  var hm = function(){ return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }); };
  var get = function(){ try{ var o = JSON.parse(localStorage.getItem(K) || 'null'); if(o && o.day) return o; }catch(e){} return null; };
  var day = function(){ try{ return (typeof D !== 'undefined' && D && D.today) || ''; }catch(e){ return ''; } };
  var cur = function(){ var o = get(), d = day(); if(!o || (d && o.day !== d)) o = { day: d, ci: {}, hw: {}, nt: {}, vk: {} }; o.vk = o.vk || {}; return o; };
  var put = function(o){ try{ localStorage.setItem(K, JSON.stringify(o)); }catch(e){} };
  var me = function(){ try{ return (D.me || {}).name || ''; }catch(e){ return ''; } };
  /* 1 · remember each successful save for today */
  var _api = window.api;
  if(typeof _api === 'function') window.api = function(fn){ var p = _api.apply(this, arguments), a = [].slice.call(arguments, 1);
    if(fn === 'saveNote' || fn === 'classIn' || fn === 'markHomework'){
      Promise.resolve(p).then(function(r){ try{ if(!r || !r.ok || !D || D.mgr) return; var o = cur(), x = a[1] || {};
        if(fn === 'saveNote'){ var k = x.eventId || (x.code + '|' + x.date), sv = r.note || {};
          o.nt[k] = { by: me(), date: x.date, ended: x.ended || '', obs: x.obs || '', next: x.next || '', homework: x.homework || '', skills: Array.isArray(x.skills) ? x.skills.join(', ') : (x.skills || ''), eventId: x.eventId || '', code: x.code, at: sv.at || hm(), upd: !!sv.upd };
          if(r.hw && x.eventId) o.hw[x.eventId] = r.hw; }
        else if(fn === 'classIn'){ var ci = r.classIn; if(x.id && ci && ci.time) o.ci[x.id] = Object.assign({}, ci, { pending: false }); }
        else if(fn === 'markHomework'){ if(x.id && r.hw) o.hw[x.id] = r.hw; }
        put(o); apply(); }catch(e){} }, function(){});
    }
    return p; };
  /* 2 · lay today's saves over whatever copy the app holds */
  var older = function(n, o){ return !n || n.pending || String(n.date || '') + String(n.at || '') < String(o.date || '') + String(o.at || ''); };
  function apply(){ try{ if(typeof D === 'undefined' || !D || D.mgr) return; var o = get(); if(!o || o.day !== D.today) { window.NOTE_EV = {}; return; }
      D.classIns = D.classIns || {}; Object.keys(o.ci).forEach(function(id){ var x = D.classIns[id]; if(!x || x.pending || !x.time) D.classIns[id] = o.ci[id]; });
      D.hw = D.hw || {}; Object.keys(o.hw).forEach(function(id){ if(!D.hw[id]) D.hw[id] = o.hw[id]; });
      var ev = {}; Object.keys(o.nt).forEach(function(k){ var n = o.nt[k]; if(n.eventId) ev[n.eventId] = n;
        var st = (D.students || []).find(function(x){ return x.code === n.code; }); if(!st) return;
        if(n.eventId){ st.notesEv = st.notesEv || {}; if(older(st.notesEv[n.eventId], n)) st.notesEv[n.eventId] = n; }
        if(!st.note || st.note.pending || (String(st.note.by || '').toLowerCase() === String(n.by || '').toLowerCase() && older(st.note, n))) st.note = n; });
      window.NOTE_EV = ev; }catch(e){} }
  window.sv990 = apply;
  /* the note for one class: the note written for THAT class (own or substitute), else the student's last note */
  window.noteFor = function(s, c){ s = s || {}; var a = s.notesEv && c && s.notesEv[c.id], b = c && (window.NOTE_EV || {})[c.id], l = s.note;
    var fits = function(n){ return n && c && n.date === c.day && (n.obs || n.ended) && (!n.eventId || n.eventId === c.id); };
    if(fits(a) && !a.pending) return a; if(fits(b)) return b; if(fits(a)) return a; if(fits(l)) return l; return a || l || b || null; };
  var wrapR = function(name){ var f = window[name]; if(typeof f !== 'function' || f.__990) return; var w = function(){ apply(); return f.apply(this, arguments); }; w.__990 = 1; window[name] = w; };
  wrapR('render'); wrapR('renderToday');
  if(typeof renderToday === 'function' && window.renderToday && window.renderToday.__990){ try{ renderToday = window.renderToday; }catch(e){} }
  setTimeout(function(){ apply(); try{ if(typeof VIEW !== 'undefined' && VIEW === 'today' && D && !D.mgr) renderToday(); }catch(e){} }, 1500);
  /* 3 · class video: no pause during classes (back-to-back classes never left a gap); upload in smaller pieces while a class is on */
  if(typeof window.vidHold === 'function'){ window.vidBusy = window.vidHold; window.vidHold = function(){ return null; }; }
  /* 4 · activity log names */
  var nm = function(code){ code = String(code || '').trim(); if(!code) return ''; try{
      var x = (D.students || []).find(function(y){ return y.code === code; }) || (D.moved || []).find(function(y){ return y.code === code; });
      if(x && x.name) return x.name; var c = (D.schedule || []).find(function(y){ return y.code === code && y.student; }); return c ? c.student : ''; }catch(e){ return ''; } };
  window.actStu = function(x){ try{ x = x || {}; var id = x.id || (x.key && (cur().vk || {})[x.key]) || '', c = id && (D.schedule || []).find(function(y){ return y.id === id; });
      if(!c && x.key){ var m = String(x.key).match(/ST-\d{4}-\d{3}/); if(m) return nm(m[0]) || m[0]; }
      return c ? (c.student || nm(c.code) || c.code || '') + (c.start ? ' ' + new Date(c.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' class' : '') : ''; }catch(e){ return ''; } };
  /* remember which class each video upload belongs to (the "uploaded" step only knows the upload key) */
  var _an = window.apiNow; if(typeof _an === 'function') window.apiNow = function(fn){ var p = _an.apply(this, arguments), a = [].slice.call(arguments, 1);
    if(fn === 'tVidStart') Promise.resolve(p).then(function(r){ try{ if(r && r.key && a[1] && a[1].id){ var o = cur(); o.vk[r.key] = a[1].id; put(o); } }catch(e){} }, function(){}); return p; };
  var STU_FN = /^(classIn|saveNote|markHomework|tNoteTag|tHwFlag|tSetMeet|tGoalsSave|tFbSubmit|tPcSubmit|tTrialSubmit|tRemindLog|tNotMine)$/;
  window.actWhat = function(r, NAME){ try{ var base = NAME[r.fn] || r.fn, who = r.student || nm(r.code) || '', hm2 = r.start && /T/.test(r.start) ? new Date(r.start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }) + ' class' : '';
      if(!STU_FN.test(r.fn) || !(who || r.code)) return '';
      return base + ' · ' + (who || r.code) + (who && r.code ? ' (' + r.code + ')' : '') + (hm2 ? ' · ' + hm2 : '') + (r.text ? ' · "' + r.text + '"' : ''); }catch(e){ return ''; } };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
