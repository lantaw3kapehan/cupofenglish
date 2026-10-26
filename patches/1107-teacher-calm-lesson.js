// 1107: (Misty, 26 Oct · stage F) calm during a lesson — non-urgent pop-ups, sounds and phone/laptop notifications wait until
//      the class ends, then arrive together ("While you were teaching: 3 updates").
// · While one of the teacher's classes is running (start ≤ now < end, not cancelled):
//   - notifications that are not about classes are held: management to-do reminders, messages, pay / leave updates;
//   - the message chime is held;
//   - a dialog that opens by itself (not from a tap or key in the last 30 seconds) is held — e.g. the "Before you start"
//     list — unless it is urgent. Dialogs that load their content after opening are not held (they would open empty).
// · Always shown at once: class reminders (starting now / next class / time-in), class cancelled, "not saved" problems,
//   notices of breach — and anything the teacher opens herself.
// · Existing settings are respected: if notifications or sounds are off, nothing extra is shown afterwards.
// · When the class ends, held notifications become one summary notification + a short message in the app; held dialogs open.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const js = String.raw`
(function(){
  if(window.__1107) return; window.__1107 = 1;
  var URGENT = /^coe-(now|cx|pre|ti|tin|on)|^rmd|class at|starting now|time.?in|i.?m in|cancel|not saved|notice of breach|breach/i;
  var LAST = 0; ['pointerdown', 'keydown', 'touchstart'].forEach(function(ev){ addEventListener(ev, function(){ LAST = Date.now(); }, true); });
  function inLesson(){ try{ if(typeof D === 'undefined' || !D || D.mgr) return false; var now = Date.now(); return (D.schedule || []).some(function(c){ return c && c.day === D.today && !c.cancelled && Date.parse(c.start) <= now && Date.parse(c.end) > now; }); }catch(e){ return false; } }
  window.calmLesson = inLesson; window.calmHeld = function(){ return { notes: HELD.length, sheets: SHEETS.length, chime: CHIME }; };
  var HELD = [], SHEETS = [], CHIME = false;
  var _n = window.notify;
  if(typeof _n === 'function') window.notify = function(title, body, tag){ if(inLesson() && !URGENT.test(String(tag || '') + ' ' + String(title || ''))){ HELD.push({ title: String(title || ''), body: String(body || '') }); return Promise.resolve(false); } return _n.apply(this, arguments); };
  var _d = window.ding;
  if(typeof _d === 'function') window.ding = function(kind){ if(inLesson() && (kind === 'msg' || kind === 'ack') && Date.now() - LAST > 3000){ CHIME = true; return; } return _d.apply(this, arguments); };
  var _o = window.openSheet;
  if(typeof _o === 'function') window.openSheet = function(html){ try{ var on = document.getElementById('sheet'); if(inLesson() && Date.now() - LAST > 30000 && !(on && on.classList.contains('on')) && !/class="sk"|class=\\?'sk|Loading|Reading /.test(String(html || '')) && String(html || '').replace(/<[^>]+>/g, '').trim().length > 20 && !URGENT.test(String(html || '').replace(/<[^>]+>/g, ' ').slice(0, 600))){ SHEETS.push(html); return; } }catch(e){} return _o.apply(this, arguments); };
  function flush(){ if(inLesson()) return; try{
    if(HELD.length){ var n = HELD.length, t = HELD.map(function(x){ return x.title; }).filter(function(x, k, a){ return a.indexOf(x) === k; }).slice(0, 3).join(' · '); HELD = [];
      try{ _n && _n.call(window, 'While you were teaching · ' + n + ' update' + (n === 1 ? '' : 's'), t, 'coe-calm'); }catch(e){}
      try{ toast('While you were teaching: ' + n + ' update' + (n === 1 ? '' : 's') + ' · see Needs your action'); }catch(e){} }
    if(CHIME){ CHIME = false; try{ _d && _d.call(window, 'msg'); }catch(e){} }
    if(SHEETS.length){ var on = document.getElementById('sheet'); if(!(on && on.classList.contains('on'))){ var h = SHEETS.shift(); try{ _o.call(window, h); }catch(e){}   /* oldest first; the next one at the next check */ } }
  }catch(e){} }
  setInterval(flush, 20000);
})();
`;
s = s.slice(0, i) + '<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
