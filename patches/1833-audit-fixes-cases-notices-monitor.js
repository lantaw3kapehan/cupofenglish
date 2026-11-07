// 1833: (audit 7 Nov) fixes found live as President:
//  · Cases never loaded (stuck on grey bars): the 1170 keep-same layer put back the loading placeholder over the finished list.
//    It now never restores children that are a loading placeholder (.sk).
//  · Notices & requests showed "Not acting on feedback" 7 times: the 1814 same-HTML guard skipped a redraw while add-ons kept adding
//    their card. The guard now skips only when the screen really still shows exactly that HTML (nothing added since), and the card
//    is added once.
//  · Monitor showed an empty "Students" list under no selected tab (a tab remembered from an earlier day that has no items today).
//    An unknown or empty remembered tab falls back to All.
//  · Cases loading title "Actions" → "Cases" · Schedule subtitle "Google Calendar" → "live from the database" · ⚠ removed from the
//    feedback banner (professional icons, no emoji).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["if(post === el.__raw1170 && kids.length && kids[0] === el.__fc1170){",
   "if(post === el.__raw1170 && kids.length && kids[0] === el.__fc1170 && !kids.some(function(k){ return k.nodeType === 1 && (k.classList.contains('sk') || (k.querySelector && k.querySelector('.sk'))); })){   /* 1833: never put a loading placeholder back */"],
  ["if(s.length > 1500 && this.__h1814 === s && this.isConnected",
   "if(s.length > 1500 && this.__h1814 === s && d.get.call(this) === s && this.isConnected"],
  ["function paint(){ const v = $('v-monitor'); if(!v) return; const d = M.data;",
   "function paint(){ const v = $('v-monitor'); if(!v) return; const d = M.data;\n    if(d && ['All', 'Time-ins', 'Classes', 'Videos', 'Homework & notes', 'Reports', 'Schedule'].indexOf(M.tab) < 0 && !(d.feed || []).some(x => x.tab === M.tab)) M.tab = 'All';   /* 1833 */"],
  ["lead.insertAdjacentHTML('afterend', '<div class=\"card\" style=\"margin-top:12px;border-left:5px solid #C0392B\"><b>⚠ Not acting on feedback · '",
   "document.querySelectorAll('#v-msgs details.ft22, #v-msgs > .card.ft1833').forEach(x => x.remove()); lead.insertAdjacentHTML('afterend', '<div class=\"card ft1833\" style=\"margin-top:12px;border-left:5px solid #C0392B\"><b>Not acting on feedback · '"],
  ["d.innerHTML = '<summary><b>⚠ Not acting on feedback</b>", "d.innerHTML = '<summary><b>Not acting on feedback</b>"],
  ["loading('Actions')", "loading('Cases')"]]);
const fs = require('fs'); let s = fs.readFileSync(file, 'utf8'); const n = s.split(' · all teachers · Google Calendar</div>').length - 1;
if(n !== 2){ console.error('schedule label: expected 2, found ' + n); process.exit(1); }
fs.writeFileSync(file, s.split(' · all teachers · Google Calendar</div>').join(' · all teachers · live from the database</div>'));
