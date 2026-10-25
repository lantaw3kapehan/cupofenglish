// 1002: (Misty, 25 Oct 20:32) "those you didn't do, do it now" — the remaining design-pass items:
// · Teacher Today: clearer priorities. Alerts get one of three weights instead of all being coral boxes:
//   urgent (notice of breach, management comments) = white card with a red left bar · to do (signature, late time-in,
//   "management is waiting") = white card with an amber left bar · info stays as is. The class cards keep their look.
// · Student details on phones: the identity header no longer indents everything behind the avatar (avatar hidden on
//   phones, text uses the full width), so name, code, teacher, balance, level and next class fit higher on the screen.
// · Charts: Overview profit bars can be focused and tapped — each says "Sep 2027 · profit ₱92k" (screen readers too)
//   and a tap shows it as a short message.
// · Payroll history: the "only deductions · check the month" badge no longer overlaps the amount on phones.
// Checked separately (no change needed): 200% zoom (640 px wide) on all 27 management screens — no sideways scroll,
// no errors; long Chinese labels wrap in the student list and dialog; the last content clears the phone bottom bar.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = [
  /* teacher Today: alert weights */
  '#v-today :is(.ct-ban.nt-ban,#ftBox):not(#z1002):not(#y1002){background:#fff!important;border:1px solid var(--d-line,#E7E5EE)!important;border-left:4px solid #C2483A!important;box-shadow:var(--d-sh,0 1px 2px rgba(43,36,80,.05))!important;border-radius:var(--d-r,14px)!important}',
  '#v-today :is(.ct-ban:not(.nt-ban),#mustBox,#txLate):not(#z1002):not(#y1002){background:#fff!important;border:1px solid var(--d-line,#E7E5EE)!important;border-left:4px solid #E2A33A!important;box-shadow:none!important;border-radius:var(--d-r,14px)!important}',
  '#v-today .ct-ban:not(.nt-ban) :is(.small,small,span){color:var(--d-warn,#9A5B00)}',
  /* phones: student header uses the full width */
  '@media(max-width:640px){#sheet .stu2 .shero .av.big{display:none!important}#sheet .stu2 .shero{grid-template-columns:1fr!important}#sheet .stu2 .shero>.grow{margin-left:0!important;padding-left:0!important}}',
  /* payroll badge */
  '#v-payroll .w66{display:block;width:fit-content;max-width:100%;white-space:normal;margin-top:4px}',
  /* chart bars: focus ring */
  '#v-home .bz2-c[tabindex]:focus-visible{outline:3px solid rgba(1,176,191,.45);outline-offset:2px;border-radius:6px}',
  '#v-home .bz2-c[tabindex]{cursor:pointer}'
].join('\n');
const js = String.raw`
(function(){
  if(window.__1002) return; window.__1002 = 1;
  var ML = { Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',Jul:'July',Aug:'August',Sep:'September',Sept:'September',Oct:'October',Nov:'November',Dec:'December' };
  function bars(){ var v = document.getElementById('v-home'); if(!v) return; var yr = '';
    try{ var t = (v.querySelector('.bz2-y') || {}).textContent || ''; var m = t.match(/(20\d\d)/); if(m) yr = m[1]; }catch(e){}
    v.querySelectorAll('.bz2-c').forEach(function(c){ if(c.dataset.d1002) return; c.dataset.d1002 = '1';
      var mon = ((c.querySelector('span') || {}).textContent || '').trim(), val = ((c.querySelector('b') || {}).textContent || '').replace(/^so far\s*/i, '').trim();
      var neg = /^-/.test(val), lab = (ML[mon] || mon) + ' · ' + (c.classList.contains('cur') ? 'profit so far ' : neg ? 'loss ' : 'profit ') + val.replace(/^-/, '');
      c.setAttribute('tabindex', '0'); c.setAttribute('role', 'img'); c.setAttribute('aria-label', lab); c.title = lab;
      var show = function(){ try{ toast(lab); }catch(e){} };
      c.addEventListener('click', show); c.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); show(); } }); }); }
  var q = 0, later = function(){ clearTimeout(q); q = setTimeout(bars, 80); };
  ['render', 'go'].forEach(function(n){ var f = window[n]; if(typeof f !== 'function') return; window[n] = function(){ var r = f.apply(this, arguments); later(); setTimeout(later, 800); return r; }; });
  var h = document.getElementById('v-home'); if(h) new MutationObserver(later).observe(h, { childList: true });
  setTimeout(bars, 2000);
})();
`;
s = s.slice(0, i) + '<style id="d1002">/* 1002 · design v2 finish */\n' + css + '\n</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
