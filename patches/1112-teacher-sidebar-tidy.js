// 1112: (Misty 14:15 + 15:52 "I STILL SEE THESE") teacher laptop sidebar, queue titles, decorative emojis, one primary per card.
// 1 · Sidebar (laptop, side menu ≥ 900 px): no category headings (Classes / Team / My growth / Trainings / Pay / Contract).
//     Main: Today · Schedule · Students · Books · Messages — divider — Growth · QA feedback · Trainings · Pay · My Contract ·
//     Activity log. Every destination, badge and click stays (the same buttons, only their order and headings change; phones keep
//     their bottom bar). Students badge says what it counts: "3 to do" under the label + full tooltip/aria-label
//     ("3 to do now (feedback or trial report)").
//     Excellence: one compact line that opens Growth — score, level (or "Not ranked yet"), place and month; the detail stays in Growth.
// 2 · "Needs your action": the chip's symbol/label no longer leaks into the row title ("!FeedbackOctober classes feedback…" →
//     chip "◷ Feedback", title "October classes feedback · 0 of 2 done") — for every item that comes from the To do list.
// 3 · Decorative emojis on teacher screens → text or the 1120 SVG icon family: 🥇🥈🥉 → #1 #2 #3 (Top 3) / "1st place";
//     🌱 → "—" in the not-ranked medal; 📷 Teaching setup check → camera icon; 🏆/🥇 on Excellence cards → target icon;
//     ✨ ⭐ 🏆 🥇 removed from Excellence messages and chips. Messages written to parents (WeChat texts) are not touched.
// 4 · Class card: when Time in / I'm in is the solid button, Class brief is shown as an outline button (one primary per card).
// Display only: routes, permissions, badges, counts, actions and records unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const all = (a, b) => { if(!s.includes(a)) throw new Error('missing: ' + a.slice(0, 60)); s = s.split(a).join(b); };
all("['🥇', '🥈', '🥉'][i]", "['#1', '#2', '#3'][i]");
all("me.rank <= 3 ? ['🥇', '🥈', '🥉'][me.rank - 1] + ' ' : ''", "''");
all('<span style="font-size:22px">🌱</span>', '<span style="font-size:16px;font-weight:700">—</span>');
all('<span style="font-size:30px">🌱</span>', '<span style="font-size:22px;font-weight:700">—</span>');
all('<b>📷 Teaching setup check', "<b>${window.IC1120 ? IC1120('camera') : ''}Teaching setup check");
all('<span class="cm-ic">🥇</span>', "<span class=\"cm-ic\">${window.IC1120 ? IC1120('target') : ''}</span>");
all('<span class="cm-ic">🏆</span>', "<span class=\"cm-ic\">${window.IC1120 ? IC1120('target') : ''}</span>");
all('🥇 <b>You are leading the team this month.</b>', '<b>You are leading the team this month.</b>');
all("'🏆 You are our Teacher of the Month for '", "'You are our Teacher of the Month for '");
all("s: '🏆 Teacher of the Month'", "s: 'Teacher of the Month'");
all("s: '🥇 Leading the team'", "s: 'Leading the team'");
all("'✨ You are at Gold so far. Hold it to the end of '", "'You are at Gold so far. Hold it to the end of '");
all("s: '✨ Gold so far'", "s: 'Gold so far'");
all("'⭐ Only '", "'Only '");
all('<div style="font-size:26px">🏆</div>', '');
all("'Congratulations, you! 🎉'", "'Congratulations, you!'");
all('✨ <b>You are at Gold so far.</b>', '<b>You are at Gold so far.</b>');
/* compact Excellence line in the side menu (same data, same click → Growth) */
all('const html = `<div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:10px;letter-spacing:.1em;color:#9a9aae;text-transform:uppercase;font-weight:600">Excellence</span>`',
    'const html = (typeof kx1112 === \'function\') ? kx1112(me, t, m, g) : `<div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:10px;letter-spacing:.1em;color:#9a9aae;text-transform:uppercase;font-weight:600">Excellence</span>`');
/* queue: clean chip label / title for To do items */
all("add({ sev: x.red ? 1 : 2, kind: x.label, red: x.red, title: x.title, sub: x.sub,", "add({ sev: x.red ? 1 : 2, kind: q1112K(x.label), red: x.red, title: q1112T(x.title, x.label), sub: x.sub,");
all("add({ sev: red ? 2.5 : 3, kind: lab, red: red, title: lines[0] || lab,", "add({ sev: red ? 2.5 : 3, kind: q1112K(lab), red: red, title: q1112T(lines[0] || lab, lab),");
const css = `<style id="d1112">/* 1112 · teacher side menu */
#navIn .n1112{display:none}
@media(min-width:900px) and (max-height:760px){ body.role-t #navIn>button{min-height:34px!important;padding-top:4px!important;padding-bottom:4px!important} body.role-t #navIn>button[data-v="growth"]{margin-top:10px!important} body.role-t #navIn>button[data-v="growth"]::before{top:-6px} #kxSide.kx1112{margin-top:8px!important} }
@media(min-width:900px){
 body.role-t #navIn>.ng{display:none!important}
 body.role-t #navIn>button[data-v="today"]{order:1} body.role-t #navIn>button[data-v="tsched"]{order:2} body.role-t #navIn>button[data-v="students"]{order:3}
 body.role-t #navIn>button[data-v="books"]{order:4} body.role-t #navIn>button[data-v="tinbox"]{order:5}
 body.role-t #navIn>button[data-v="growth"]{order:11;margin-top:14px!important;position:relative}
 body.role-t #navIn>button[data-v="growth"]::before{content:"";position:absolute;left:12px;right:12px;top:-8px;border-top:1px solid var(--line,#ECEAF1)}
 body.role-t #navIn>button[data-v="qa"]{order:12} body.role-t #navIn>button[data-v="train"]{order:13} body.role-t #navIn>button[data-v="pay"]{order:14}
 body.role-t #navIn>button[data-v="contract"]{order:15} body.role-t #navIn>button[data-v="act"]{order:16} body.role-t #navIn>button{order:20}
 body.role-t #navIn>#kxSide{order:40}
 body.role-t #navIn>button{min-height:40px}
 body.role-t #navIn>button .n1112{display:block;font-size:11px;font-weight:600;color:#9A3F2C;line-height:1.1;margin-top:1px}
 body.role-t #navIn>button:has(.n1112){align-items:center} body.role-t #navIn>button:has(.n1112) .nl{text-align:left}
 #kxSide.kx1112{margin:12px 2px 6px!important;padding:8px 10px!important;border-radius:12px!important;box-shadow:none!important;background:#FBFAF7!important;border:1px solid var(--line,#ECEAF1)!important}
 #kxSide.kx1112:hover,#kxSide.kx1112:focus-visible{border-color:#8CC5CA!important;outline:none}
 #kxSide.kx1112:focus-visible{box-shadow:0 0 0 3px rgba(0,112,122,.35)!important}
}
#kxSide .kx12{display:flex;align-items:center;gap:10px;min-width:0}
#kxSide .kx12m{width:36px;height:36px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;font:700 13px/1 var(--brand,inherit);color:#2B2F3A;box-shadow:inset 0 -2px 0 rgba(0,0,0,.12)}
#kxSide .kx12t{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}
#kxSide .kx12t b{font-size:13px;color:#2B2253;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#kxSide .kx12t small{font-size:11.5px;color:#5E5A73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#kxSide .kx12c{flex:none;color:#00707A;font-size:16px;line-height:1}
.cm-ic .ic1120,.cm-ic svg{width:22px;height:22px;margin:0}
</style>`;
const js = String.raw`<script>/* 1112 · teacher side menu + queue labels + one primary per class card */
function q1112K(l){ return String(l || '').replace(/^[\s✓◷!⚠•·]+/, '').trim() || 'To do'; }
function q1112T(t, l){ var x = String(t || '').trim(), raw = String(l || '').trim(), k = q1112K(l);
  [raw, k, '!' + k, '◷' + k, '✓' + k, '! ' + k, '◷ ' + k].forEach(function(p){ if(p && x.indexOf(p) === 0 && x.length > p.length) x = x.slice(p.length).replace(/^[\s·:–-]+/, ''); });
  return x || k; }
function kx1112(me, t, m, g){ var E = function(v){ return String(v == null ? '' : v).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var mon = ''; try{ mon = new Date(String(m.month) + '-15T12:00:00').toLocaleDateString('en-US', { month: 'long' }); }catch(e){} if(!mon || mon === 'Invalid Date') mon = String(m.label || m.month || '').split(' ')[0];
  var ord = function(n){ var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  var bg = g ? 'radial-gradient(circle at 32% 28%,' + g[0] + ',' + g[1] + ')' : '#EEF0F2';
  return '<div class="kx12"><span class="kx12m" style="background:' + bg + '">' + (me.rank && t >= 0 ? E(t) : '—') + '</span><span class="kx12t"><b>Excellence · ' + (me.rank ? E(me.level) : 'Not ranked yet') + '</b><small>'
    + (me.rank ? '#' + me.rank + ' · ' : '') + E(mon.slice(0, 3)) + (m.final ? ' · final' : ' · so far') + '</small></span><span class="kx12c" aria-hidden="true">›</span></div>'; }
(function(){ if(window.__1112) return; window.__1112 = 1;
  function nav(){ try{
    var k = document.getElementById('kxSide'); if(k && !k.classList.contains('kx1112')){ k.classList.add('kx1112'); k.setAttribute('role', 'link'); k.tabIndex = 0;
      k.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); k.click(); } }); }
    if(k){ var lab = 'Teacher Excellence · ' + (k.innerText || '').replace(/\s+/g, ' ').replace(/›/g, '').trim() + ' · open Growth'; if(k.getAttribute('aria-label') !== lab) k.setAttribute('aria-label', lab); }
    var d = document.getElementById('dStu'), b = d && d.closest('button');
    if(b){ var n = (d.textContent || '').trim(), tt = d.getAttribute('title') || '', h = b.querySelector('.n1112'), nl = b.querySelector('.nl');
      if(n && +n > 0 && getComputedStyle(d).display !== 'none'){ var txt = n + ' to do'; if(!h && nl){ h = document.createElement('span'); h.className = 'n1112'; nl.appendChild(h); } if(h && h.textContent !== txt) h.textContent = txt;
        var al = 'Students · ' + (tt || txt); if(b.getAttribute('aria-label') !== al) b.setAttribute('aria-label', al); }
      else if(h){ h.remove(); b.removeAttribute('aria-label'); } }
  }catch(e){} }
  function cards(){ try{ [].forEach.call(document.querySelectorAll('#v-today .cls'), function(c){
      var ti = c.querySelector('button[onclick^="timeInSheet"],button[onclick^="classIn"]'); if(!ti || ti.matches('.ghost,.x1101-sec')) return;
      var br = c.querySelector('button[onclick^="classBrief"]'); if(br && !br.classList.contains('x1101-sec')) br.classList.add('x1101-sec'); }); }catch(e){} }
  var mo = new MutationObserver(function(){ nav(); cards(); });
  function hook(){ var n = document.getElementById('navIn'), t = document.getElementById('v-today'); if(n && !n.__o1112){ n.__o1112 = 1; mo.observe(n, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['title', 'style'] }); }
    if(t && !t.__o1112){ t.__o1112 = 1; mo.observe(t, { childList: true, subtree: true }); } nav(); cards(); }
  hook(); var tries = 0, iv = setInterval(function(){ hook(); if(++tries > 30) clearInterval(iv); }, 1000);
})();
</script>`;
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + css + js + '\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
