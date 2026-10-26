// 1120: (Misty, 26 Oct 14:08) President › Performance as a professional management dashboard — presentation only.
// · One SVG icon family (the navigation's 24px line icons) instead of 🏆 📷 📱 🎯 🌱 on the screen and in Teacher Excellence.
// · Order: a summary strip first (QA coverage · team QA result · teachers needing review · overdue / open actions), then the team
//   QA result and domains, the teacher table, the career ladder; the administrative check-ins (QA read receipts, teaching setup,
//   phone reminders, trials by teacher, first 90 days) sit together in one compact "Administrative check-ins" section at the end.
// · Reporting scopes are labelled separately: the team average is ONE QA round (its evaluations only); the decision counts are the
//   LATEST evaluation of every evaluated teacher, and say so when those come from different months ("mixed periods").
// · Teacher rows: the units are the T-DASH lesson-unit total (regular + trial + substitute, 1 unit = 50 min, so 25-min
//   classes give halves; 1109 already renamed "classes" → "units") → "lesson units this month", explained under "What each number covers". "On-time" is the DAILY time-in (one per working day, class time-ins
//   excluded) → "Daily time-in"; the per-class record (class check-in, video, homework, notes) → "Class record", its on-time part
//   → "Class check-in". Active filter shown with "Clear filter".
// · Teacher Excellence opens as a wide panel on laptops: aligned columns Position · Teacher (career rank) · Score · Tier · Quality ·
//   Progress · Trust · Reliability, no podium (no top three shown twice), "#1 #2 #3" instead of medals, tier ≠ monthly position ≠
//   career rank spelled out, reporting month · last worked out · who is ranked · how the score is made at the top, "no data" kept
//   apart from 0, loading / failed (with Retry) states, facts per teacher behind a "Facts" button (President, as before).
// Scores, thresholds, eligibility, rankings, permissions and data are unchanged (same coe_kpi / coe_performance_live results).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const IC = "(window.IC1120?IC1120('%s'):'')";
lib(file, [
  ["onclick=\"kpiSheet()\">🏆 Teacher Excellence</button> ", "onclick=\"kpiSheet()\">' + " + IC.replace('%s', 'award') + " + 'Teacher Excellence</button> "],
  ["<summary><b>📷 Teaching setup · ", "<summary><b>${" + IC.replace('%s', 'camera') + "}Teaching setup · "],
  ["<summary><b>📱 Phone reminders · ", "<summary><b>${" + IC.replace('%s', 'phone') + "}Phone reminders · "],
  ["<summary><b>🎯 Trials by teacher · ", "<summary><b>${" + IC.replace('%s', 'target') + "}Trial outcomes by teacher · "],
  ["<summary><b>🌱 New teachers · first 90 days checklist</b>", "<summary><b>${" + IC.replace('%s', 'onboard') + "}Onboarding · first 90 days checklist</b>"],
  ["t.units!=null ? t.units+' units this month' : ''", "t.units!=null ? t.units+' lesson units this month' : ''"],
  ["'coral'}\">Compliance ${recScore(t.rec)}%", "'coral'}\">Class record ${recScore(t.rec)}%"],
  ["<span>On-time</span>", "<span>Daily time-in</span>"],
  ["<span>on time${t.timeIns ? ' · ' + t.onTime + ' of ' + t.timeIns + ' time-ins' : ' · no time-ins yet'}</span>", "<span>on time${t.timeIns ? ' · ' + t.onTime + ' of ' + t.timeIns + ' daily time-ins' : ' · no daily time-ins yet'}</span>"],
  ["<div class=\"row\" style=\"gap:6px;flex-wrap:wrap;margin-top:4px\"><span class=\"chip green\">Exceeds",
   "<div class=\"sc1120\">${(() => { const E = T.filter(t => t.latest), P = [...new Set(E.map(t => t.latest.period))]; return 'Latest QA decision of each evaluated teacher · ' + E.length + ' teacher' + (E.length === 1 ? '' : 's') + ' · ' + (P.length > 1 ? '<b class=\"mx1120\">mixed periods: ' + esc(P.join(', ')) + '</b>' : esc(P[0] || '')) + ' · a different group from the round average above'; })()}</div><div class=\"row\" style=\"gap:6px;flex-wrap:wrap;margin-top:4px\"><span class=\"chip green\">Exceeds"],
  ["<div class=\"small mute\">Team QA average · ${esc(tm0.period)} round · ${tm0.n} evaluation${tm0.n === 1 ? '' : 's'}</div>",
   "<div class=\"small mute\">Team QA average · <b>${esc(tm0.period)} round only</b> · ${tm0.n} evaluation${tm0.n === 1 ? '' : 's'} in that round</div>"],
  ["+ '<li><b>On-time</b> · ' + sofar + ' · daily time-ins (not class time-ins)", "+ '<li><b>Lesson units</b> · ' + sofar + ' · from the teacher dashboard: regular, trial and substitute lessons · 1 unit = 50 minutes, so a 25-minute class is 0.5</li>' + '<li><b>Daily time-in</b> · ' + sofar + ' · one time-in per working day (not class check-ins)"],
  ["+ '<li><b>Compliance</b> · '", "+ '<li><b>Class record</b> (per class: class check-in on time, video, homework, notes) · '"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = `
.ic1120{display:inline-block;width:18px;height:18px;vertical-align:-3px;margin-right:6px;color:var(--d-teal-d,#00707A);flex:none}
.ic1120 svg{width:100%;height:100%;display:block}
.btn .ic1120{width:16px;height:16px;margin-right:5px;color:currentColor}
#v-perf .sc1120{margin-top:10px;font-size:13px;color:var(--d-mute,#5E5A76);line-height:1.45}
#v-perf .sc1120 .mx1120{color:#8A5300;font-weight:600}
#p1120{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0 0 16px}
@media(max-width:1180px){#p1120{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:640px){#p1120{grid-template-columns:1fr}}
#p1120>section{min-height:132px;background:#fff;border:1px solid var(--d-line,#E7E5EE);border-radius:var(--d-r,14px);padding:14px 16px;display:flex;flex-direction:column;gap:4px;min-width:0}
#p1120 .k{font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--d-mute,#5E5A76);display:flex;align-items:center;gap:2px}
#p1120 .v{font-size:26px;font-weight:600;color:var(--d-ink,#2B2450);font-variant-numeric:tabular-nums;line-height:1.15}
#p1120 .v small{font-size:14px;font-weight:500;color:var(--d-mute,#5E5A76);margin-left:4px}
#p1120 .s{font-size:13px;color:var(--d-mute,#5E5A76);line-height:1.4}
#p1120 .s b{color:var(--d-ink,#2B2450);font-weight:600}
#p1120 .a{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto;padding-top:6px}
#p1120 .a button{font:inherit;font-size:13px;font-weight:600;border-radius:999px;padding:5px 11px;border:1px solid var(--d-line,#DCD9E6);background:#fff;color:var(--d-teal-d,#00707A);cursor:pointer;min-height:32px}
#p1120 .a button:hover{background:#EAF7F8;border-color:#9ED3D7}
#p1120 .a button:focus-visible{outline:3px solid rgba(1,176,191,.45);outline-offset:2px}
#p1120 ul{list-style:none;margin:2px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}
#p1120 li{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--d-ink,#2B2450)}
#p1120 li .n{min-width:26px;text-align:center;font-weight:700;border-radius:8px;padding:1px 6px;background:#FBF0DD;color:#7A4A00;font-variant-numeric:tabular-nums}
#p1120 li .n.z{background:#EEF6F1;color:#1E6B49}
#p1120 li button{margin-left:auto;font:inherit;font-size:12.5px;font-weight:600;border:0;background:none;color:var(--d-teal-d,#00707A);text-decoration:underline;cursor:pointer;padding:4px 2px}
#p1120 .ok{color:#1E6B49;font-weight:600;font-size:14px}
#v-perf .f1120{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 0;font-size:13px;color:var(--d-mute,#5E5A76)}
#v-perf .f1120 b{color:var(--d-ink,#2B2450)}
#v-perf .f1120 button{font:inherit;font-size:13px;font-weight:600;border:1px solid var(--d-line,#DCD9E6);background:#fff;border-radius:999px;padding:4px 12px;color:var(--d-ink,#2B2450);cursor:pointer}
#v-perf .f1120 button:focus-visible{outline:3px solid rgba(1,176,191,.45);outline-offset:2px}
#p1120adm{margin:18px 0 8px;border:1px solid var(--d-line,#E7E5EE);border-radius:var(--d-r,14px);background:#fff}
#p1120adm>summary{list-style:none;cursor:pointer;padding:14px 18px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#p1120adm>summary::-webkit-details-marker{display:none}
#p1120adm>summary .t{font-weight:600;font-size:16px;color:var(--d-ink,#2B2450)}
#p1120adm>summary .s{font-size:13px;color:var(--d-mute,#5E5A76)}
#p1120adm>summary::after{content:"›";margin-left:auto;font-size:22px;line-height:1;color:#6F6B85;transition:transform .15s}
#p1120adm[open]>summary::after{transform:rotate(90deg)}
#p1120adm>summary:focus-visible{outline:3px solid rgba(1,176,191,.45);outline-offset:-3px;border-radius:var(--d-r,14px)}
#p1120adm>.b{padding:0 14px 14px}
#p1120adm>.b>#qaRc{margin:0 0 12px!important}
#p1120adm #pf3Hub{margin:0!important}
#p1120adm .pf3-hubh{display:none}
#v-perf .pf-name .cp52 small{color:var(--d-mute,#5E5A76)}
/* narrow laptop windows / split screen (900–1180 px): the teacher row wraps into two lines instead of running off the side */
@media(min-width:900px) and (max-width:1180px){#v-perf .pf-head{display:none!important}#v-perf .pf-row{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) auto!important;row-gap:8px}#v-perf .pf-row>.pf-k{min-width:0}}
/* Teacher Excellence · wide panel */
@media(min-width:900px){.sheet.kx1120{width:min(1240px,96vw)!important;margin-left:calc(min(1240px,96vw) / -2)!important}}
.kx1120 .kxh{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap;padding-right:44px}
.kx1120 .kxh h2{margin:0;display:flex;align-items:center}
.kx1120 .kxh select{min-height:40px;border-radius:10px;border:1px solid var(--d-line,#DCD9E6);padding:6px 10px;font:inherit;background:#fff;color:var(--d-ink,#2B2450)}
.kx1120 .kxm{display:flex;flex-wrap:wrap;gap:6px 16px;margin:10px 0 4px;font-size:13px;color:var(--d-mute,#5E5A76)}
.kx1120 .kxm b{color:var(--d-ink,#2B2450);font-weight:600}
.kx1120 .kxl{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12.5px;color:var(--d-mute,#5E5A76);margin:2px 0 10px}
.kx1120 .kxl i{font-style:normal;font-weight:600;color:var(--d-ink,#2B2450)}
.kx1120 .kxw{overflow-x:auto;border:1px solid var(--d-line,#E7E5EE);border-radius:var(--d-r,14px)}
.kx1120 table.kxt{width:100%;border-collapse:collapse;font-size:14px;font-variant-numeric:tabular-nums;min-width:860px}
.kx1120 .kxt th{text-align:left;font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--d-mute,#5E5A76);padding:10px 10px;background:#F7F7FA;border-bottom:1px solid var(--d-line,#E7E5EE);white-space:nowrap}
.kx1120 .kxt th small{display:block;font-size:11px;letter-spacing:0;text-transform:none;font-weight:500}
.kx1120 .kxt td{padding:10px 10px;border-top:1px solid #F0EEF5;vertical-align:middle}
.kx1120 .kxt tr.g td{background:#FBFBFD;font-size:12px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--d-mute,#5E5A76);padding:8px 10px}
.kx1120 .kxt .pos{font-weight:700;font-size:16px;color:var(--d-ink,#2B2450);white-space:nowrap}
.kx1120 .kxt .pos.nr{font-size:12.5px;font-weight:500;color:var(--d-mute,#5E5A76);white-space:normal;max-width:110px}
.kx1120 .kxt .tn b{display:block;color:var(--d-ink,#2B2450)}
.kx1120 .kxt .tn span{font-size:12.5px;color:var(--d-mute,#5E5A76)}
.kx1120 .kxt .sc{font-weight:700;font-size:16px;text-align:right;color:var(--d-ink,#2B2450)}
.kx1120 .kxt .num{text-align:right}
.kx1120 .tier{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 10px;font-size:12.5px;font-weight:600;border:1px solid transparent;white-space:nowrap}
.kx1120 .tier.Gold{background:#FFF4D6;color:#6B4E00;border-color:#EBCB75}
.kx1120 .tier.Silver{background:#EEF1F5;color:#3A4250;border-color:#C9D0DA}
.kx1120 .tier.Bronze{background:#F8EADF;color:#6A3815;border-color:#E2BB98}
.kx1120 .tier.Developing{background:#F3F2F7;color:#4C4868;border-color:#DCD9E6}
.kx1120 .pl{display:flex;align-items:center;gap:8px;justify-content:flex-end}
.kx1120 .pl u{display:block;width:56px;height:6px;border-radius:4px;background:#ECEAF2;overflow:hidden;text-decoration:none}
.kx1120 .pl u i{display:block;height:100%;background:#2A9D8F}
.kx1120 .pl b{min-width:26px;text-align:right}
.kx1120 .nd{font-size:12.5px;color:#6F6B85;font-style:italic;white-space:nowrap}
.kx1120 .fx{font:inherit;font-size:13px;font-weight:600;border:1px solid var(--d-line,#DCD9E6);background:#fff;color:var(--d-ink,#2B2450);border-radius:999px;padding:5px 12px;cursor:pointer;white-space:nowrap}
.kx1120 .fx:focus-visible{outline:3px solid rgba(1,176,191,.45);outline-offset:2px}
.kx1120 .fx[aria-expanded="true"]{background:#EAF7F8;border-color:#9ED3D7;color:#00707A}
.kx1120 tr.ff td{background:#FCFCFE;padding:4px 14px 12px}
.kx1120 .kxs{margin-top:14px;font-size:13px;color:var(--d-mute,#5E5A76);line-height:1.5}
.kx1120 .kxs summary{cursor:pointer;color:var(--d-ink,#2B2450)}
.kx1120 .kxe{padding:18px;border:1px solid #F3C9BD;background:#FDF3EF;border-radius:12px;color:#8A2E1E;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.kx1120 .kxe button{font:inherit;font-weight:600;border-radius:999px;padding:6px 14px;border:1px solid #C2483A;background:#fff;color:#A23A2D;cursor:pointer}
.kx1120 .kxload{color:var(--d-mute,#5E5A76);padding:14px 4px}
.kx1120 #kxBody{min-height:420px}
.kx1120 .kxt td.tn,.kx1120 .kxt th:nth-child(2),.kx1120 .kxt th:nth-child(4),.kx1120 .kxt td:nth-child(4){text-align:left!important}
.kx1120 .kxh h2::before{display:none!important}
@media(max-width:899px){.kx1120 table.kxt{min-width:760px}}
@media(max-width:640px){.kx1120 table.kxt{min-width:600px;font-size:13px}.kx1120 .pl u{display:none}.kx1120 .kxt td,.kx1120 .kxt th{padding:8px 6px}
  #v-perf>.lead.row{flex-wrap:wrap;row-gap:10px}#v-perf>.lead.row>.grow{flex:1 1 100%;min-width:0}}
`;
const js = String.raw`
(function(){
  if(window.__1120) return; window.__1120 = 1;
  /* one icon family: 24 px, 1.7 stroke, round joins — the navigation's own style */
  var P = {
    award: '<circle cx="12" cy="9" r="5.5"/><path d="M8.6 13.4 7.5 21l4.5-2.4 4.5 2.4-1.1-7.6"/>',
    camera: '<path d="M4 8.5h3l1.6-2.5h6.8L17 8.5h3v10.5H4z"/><circle cx="12" cy="13.5" r="3.4"/>',
    phone: '<rect x="7" y="2.8" width="10" height="18.4" rx="2.4"/><path d="M11 18h2"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    onboard: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20a6.5 6.5 0 0 1 11.6-4M18 14v6M15 17h6"/>',
    receipt: '<path d="M6 3.5h12v17l-3-1.8-3 1.8-3-1.8-3 1.8z"/><path d="M9 9.5l2 2 4-4"/>',
    clip: '<path d="M8 12.5l5.6-5.6a3 3 0 0 1 4.3 4.3l-7 7a5 5 0 0 1-7-7l6.4-6.4"/>',
    alert: '<path d="M12 3.5 21.5 20h-19z"/><path d="M12 10v4.5M12 17.2v.3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    chart: '<path d="M3.5 19.5h17M6 16V11M10.5 16V7M15 16v-4M19.5 16V5"/>',
    check: '<rect x="4" y="3.5" width="16" height="17" rx="3"/><path d="M8 12l3 3 5-6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>' };
  window.IC1120 = function(n){ var p = P[n]; if(!p) return ''; return '<span class="ic1120" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg></span>'; };
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ── Performance: summary strip, order, scopes, administrative check-ins ── */
  var ADM_OPEN = false, busy = false, tmr = 0;
  function num(re, el){ if(!el) return null; var m = (el.textContent || '').match(re); return m ? +m[1] : null; }
  function strip(v){
    if(typeof PF === 'undefined' || !PF) return null;
    var T = PF.teachers || [], Ev = T.filter(function(t){ return t.latest; }), Per = []; Ev.forEach(function(t){ if(Per.indexOf(t.latest.period) < 0) Per.push(t.latest.period); });
    var focus = T.filter(function(t){ return t.latest && (t.latest.avg < 3.5 || t.latest.scores.some(function(x){ return x && x < 3; })); }).length;
    var drop = T.filter(function(t){ return t.latest && t.prev && t.latest.avg - t.prev.avg < 0; }).length;
    var nonc = T.filter(function(t){ return t.rec && ((typeof recScore === 'function' && recScore(t.rec) != null && recScore(t.rec) < 85) || t.rec.tags > 0); }).length;
    var tm0 = (PF.team || [])[0], tm1 = (PF.team || [])[1];
    var rc = document.getElementById('qaRc'), rcN = rc ? (rc.querySelector('.chip.coral') ? num(/(\d+)\s*not confirmed/, rc.querySelector('.chip.coral')) : 0) : null;
    var sp = document.getElementById('setupPanel'), spS = sp && sp.querySelector('summary'), spChk = num(/(\d+)\s*to check/, spS), spFix = num(/(\d+)\s*to fix/, spS);
    var open = [];
    open.push(['Class record below 85% or late tags', nonc, 'pfSet(\'comply\')', 'Show teachers']);
    if(rcN != null) open.push(['QA read receipts not confirmed', rcN, 'p1120adm(\'qaRc\')', 'Open']);
    if(spChk != null) open.push(['Teaching setup to check', spChk, 'p1120adm(\'setupPanel\')', 'Open']);
    if(spFix) open.push(['Teaching setup fixes waiting', spFix, 'p1120adm(\'setupPanel\')', 'Open']);
    var due = open.reduce(function(a, x){ return a + (+x[1] || 0); }, 0);
    var per = Per.length > 1 ? 'mixed periods: ' + Per.join(', ') : (Per[0] || '');
    var h = '<section aria-label="QA coverage"><div class="k">' + IC1120('check') + 'QA coverage</div><div class="v">' + Ev.length + '<small>of ' + T.length + ' teachers</small></div>'
      + '<div class="s">evaluated · latest evaluation per teacher · <b>' + E(per || 'no evaluations yet') + '</b></div>'
      + (T.length - Ev.length ? '<div class="a"><button type="button" onclick="pfSet(\'none\')">Not evaluated · ' + (T.length - Ev.length) + '</button></div>' : '') + '</section>'
      + '<section aria-label="Team QA result"><div class="k">' + IC1120('chart') + 'Team QA result</div>'
      + (tm0 ? '<div class="v">' + tm0.avg.toFixed(1) + '<small>/ 5</small></div><div class="s"><b>' + E(tm0.period) + ' round only</b> · ' + tm0.n + ' evaluation' + (tm0.n === 1 ? '' : 's') + (tm1 ? ' · ' + E(String(tm1.period).split(' ')[0]) + ' round ' + tm1.avg.toFixed(1) : '') + '</div>' : '<div class="v">—</div><div class="s">No QA round yet</div>') + '</section>'
      + '<section aria-label="Teachers needing review"><div class="k">' + IC1120('alert') + 'Needs review</div><div class="v">' + focus + '<small>teacher' + (focus === 1 ? '' : 's') + '</small></div>'
      + '<div class="s">latest QA below 3.5, or a domain below 3' + (drop ? ' · <b>' + drop + ' dropped</b> since their previous evaluation' : '') + '</div>'
      + '<div class="a">' + (focus ? '<button type="button" onclick="pfSet(\'focus\')">Review ' + focus + '</button>' : '') + (drop ? '<button type="button" onclick="pfSet(\'down\')">Dropped · ' + drop + '</button>' : '') + '</div></section>'
      + '<section aria-label="Overdue and open actions"><div class="k">' + IC1120('clock') + 'Open actions · now</div>'
      + (due ? '<ul>' + open.filter(function(x){ return +x[1]; }).map(function(x){ return '<li><span class="n">' + x[1] + '</span><span>' + E(x[0]) + '</span><button type="button" onclick="' + x[2] + '">' + E(x[3]) + '</button></li>'; }).join('') + '</ul>'
        : '<div class="ok">✓ Nothing overdue</div><div class="s">class records, read receipts and setup checks are up to date</div>') + '</section>';
    return h;
  }
  window.p1120adm = function(id){ var d = document.getElementById('p1120adm'); if(!d) return; d.open = true; ADM_OPEN = true; var t = document.getElementById(id) || d;
    setTimeout(function(){ try{ t.scrollIntoView({ behavior: 'smooth', block: 'start' }); var dd = t.querySelector && t.querySelector('details'); if(dd) dd.open = true; var f = t.querySelector && t.querySelector('summary,.pf3-rh,button'); if(f && f.focus) f.focus({ preventScroll: true }); }catch(e){} }, 30); };
  function arrange(){
    var v = document.getElementById('v-perf'); if(!v || busy || typeof VIEW === 'undefined' || VIEW !== 'perf' || typeof PF === 'undefined' || !PF) return;
    busy = true;
    try{
      var lead = v.querySelector(':scope>.lead'); if(!lead) return;
      /* summary strip right under the title */
      var st = document.getElementById('p1120'), html = strip(v);
      if(html != null){ if(!st){ st = document.createElement('div'); st.id = 'p1120'; lead.after(st); } else if(st.previousElementSibling !== lead) lead.after(st);
        if(st.dataset.h !== html){ st.innerHTML = html; st.dataset.h = html; } }
      /* administrative check-ins: one compact section at the end */
      var adm = document.getElementById('p1120adm');
      if(!adm){ adm = document.createElement('details'); adm.id = 'p1120adm'; adm.innerHTML = '<summary><span class="t">' + IC1120('receipt') + 'Administrative check-ins</span><span class="s">QA read receipts · teaching setup · phone reminders · trial outcomes · onboarding</span></summary><div class="b"></div>';
        adm.open = ADM_OPEN; adm.addEventListener('toggle', function(){ ADM_OPEN = adm.open; }); v.appendChild(adm); }
      var body = adm.querySelector(':scope>.b');
      ['qaRc', 'pf3Hub'].forEach(function(id){ var x = document.getElementById(id); if(x && x.parentNode !== body) body.appendChild(x); });
      ['setupPanel', 'pushWho', 'trialStats', 'first90'].forEach(function(id){ var x = document.getElementById(id); if(x && !adm.contains(x)){ var hub = document.getElementById('pf3Hub'); (hub && adm.contains(hub) ? hub : body).appendChild(x); } });
      /* career ladder after the teacher table, before the check-ins */
      var lad = [].find.call(v.querySelectorAll(':scope>section.sec'), function(x){ var h2 = x.querySelector('h2'); return h2 && /career ladder/i.test(h2.textContent); });
      if(lad && lad.nextElementSibling !== adm) adm.before(lad);
      if(adm.parentNode === v && v.lastElementChild !== adm) v.appendChild(adm);
      /* active filter + Clear filter */
      var seg = [].find.call(v.querySelectorAll(':scope>.seg'), function(x){ return x.querySelector('[onclick^="pfSet("]'); }), f = document.getElementById('f1120');
      var lab = { focus: 'Needs focus', up: 'Improved', down: 'Dropped', none: 'Not evaluated', comply: 'Not complying' }[typeof PF_F !== 'undefined' ? PF_F : 'all'];
      if(seg){ if(lab){ var n = v.querySelectorAll(':scope>.pf-row').length, all = (PF.teachers || []).length, fh = 'Showing <b>' + E(lab) + '</b> · ' + n + ' of ' + all + ' teachers <button type="button" onclick="pfSet(\'all\')">Clear filter</button>';
          if(!f){ f = document.createElement('div'); f.id = 'f1120'; f.className = 'f1120'; f.setAttribute('role', 'status'); } if(f.previousElementSibling !== seg) seg.after(f); if(f.dataset.h !== fh){ f.innerHTML = fh; f.dataset.h = fh; } }
        else if(f) f.remove(); }
      /* the per-class record's on-time part is the class check-in (not the daily time-in) */
      v.querySelectorAll('.pf-row .cp52:not([data-c1120])').forEach(function(c){ c.dataset.c1120 = '1'; var sm = c.querySelector('small'); if(sm) sm.innerHTML = sm.innerHTML.replace(/\bOn time\b/g, 'Class check-in'); var mb = c.querySelector('.mb'); if(mb && mb.title) mb.title = mb.title.replace(/\bOn time\b/g, 'Class check-in'); });
    }catch(e){ console.warn('1120', e); } finally{ busy = false; }
  }
  function later(){ clearTimeout(tmr); tmr = setTimeout(arrange, 60); }
  var _rp = window.renderPerf; if(typeof _rp === 'function') window.renderPerf = function(){ var r = _rp.apply(this, arguments); arrange(); [1500, 3500].forEach(function(ms){ setTimeout(arrange, ms); }); return r; };
  var host = document.getElementById('v-perf');
  if(host) new MutationObserver(function(m){ if(busy || typeof VIEW === 'undefined' || VIEW !== 'perf') return; arrange(); }).observe(host, { childList: true });   /* microtask: before the next paint, so nothing is seen in the old place */
  var g0 = window.go; if(typeof g0 === 'function') window.go = function(x){ var r = g0.apply(this, arguments); if(x === 'perf') arrange(); return r; };

  /* ── Teacher Excellence: wide panel, aligned columns, #1 #2 #3, tier vs position vs career rank, no podium ── */
  var KX = {}, KM = '', KBUSY = {};
  var post = function(fn, args){ return fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn: fn, args: args || [], token: TOKEN }) }).then(function(x){ return x.json(); }).then(function(r){ if(!(r && r.ok)) throw new Error(r && r.error || fn); return r.data; }); };
  var ymOf = function(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  var months = function(){ var L = [], d = new Date(); d.setDate(1); for(var i = 0; i < 6; i++){ L.push(ymOf(d)); d.setMonth(d.getMonth() - 1); } return L; };
  var mLabel = function(ym){ try{ return new Date(ym + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }); }catch(e){ return ym; } };
  var PL = [['quality', 'Quality'], ['progress', 'Progress'], ['trust', 'Trust'], ['reliability', 'Reliability']];
  var n = function(v){ return v == null ? '—' : v; };
  /* the facts behind a score: the same lines as before (patch 289) */
  function facts(t){ var f = t.facts || {}, p = t.parts || {}, L = [];
    L.push(['Lessons', n(f.lessonsDone) + ' taught · ' + n(f.units) + ' units · ' + n(f.students) + ' students']);
    L.push(['QA', f.qaAvg != null ? f.qaAvg + ' / 5 (' + E(f.qaPeriod || '') + ') → ' + n(p.qa) + (f.concerns ? ' · ' + f.concerns + ' Performance Concern' + (f.concerns > 1 ? 's' : '') + ' (−' + (10 * f.concerns) + ')' : '') : 'no QA yet']);
    L.push(['Class visits', f.visitChecks ? f.visitOk + ' of ' + f.visitChecks + ' checks OK in ' + f.visits + ' visit' + (f.visits > 1 ? 's' : '') + ' → ' + p.visits : 'no visits this month']);
    L.push(['Progress checks', f.progressChecks ? f.progressChecks + ' → ' + n(p.checks) : 'none this month']);
    L.push(['Class notes', f.notes != null ? f.notes + ' for ' + f.lessonsDone + ' lessons → ' + n(p.notes) : 'no notes kept this month']);
    L.push(['New books (3 months)', f.bookUps3m ? f.bookUps3m + ' step' + (f.bookUps3m > 1 ? 's' : '') + ' up (+' + (10 * f.bookUps3m) + ') · ' + E(f.bookUpsWhich || '') : 'none']);
    L.push(['Hours', n(f.units) + ' taught' + (f.hoursOffered != null ? ' · ' + f.hoursOffered + ' offered (taught + open slots in T-AVAIL)' : '') + ' · team middle ' + n(f.medianUnits) + ' → ' + n(p.workload)]);
    L.push(['Trials', f.trials ? f.trialsEnrolled + ' of ' + f.trials + ' enrolled → ' + p.trials : 'no trials']);
    L.push(['Students kept', f.keptFrom ? f.kept + ' of ' + f.keptFrom + ' from last month → ' + p.kept : '—']);
    L.push(['Recognitions', n(f.recognitions) + ' → ' + n(p.recognition)]);
    L.push(['Time-ins', f.timeIns ? f.onTime + ' of ' + f.timeIns + ' on time → ' + p.timeIns : 'no class time-ins this month']);
    L.push(['Attendance', [[f.absences, 'absence'], [f.lateToClass, 'late to class'], [f.cancellations, 'cancellation'], [f.incomplete, 'incomplete'], [f.scheduleChanges, 'schedule change'], [f.leaveShortNotice, 'short-notice leave'], [f.leaveDays, 'leave days']].filter(function(x){ return +x[0] > 0; }).map(function(x){ return x[0] + ' ' + x[1]; }).join(' · ') + (p.attendance != null ? ' → ' + p.attendance : '') || 'perfect → 100']);
    L.push(['Demerits', n(f.demerits) + ' point' + (f.demerits == 1 ? '' : 's') + ' → ' + n(p.demerits) + ' (score only · pay penalties as in the contract)' + (f.demeritWhy ? ' · ' + E(f.demeritWhy) : '')]);
    return '<table class="small" style="width:100%;border-collapse:collapse;margin:2px 0">' + L.map(function(r){ return '<tr><td class="mute" style="padding:3px 12px 3px 0;white-space:nowrap;vertical-align:top;border:0">' + r[0] + '</td><td style="padding:3px 0;border:0">' + r[1] + '</td></tr>'; }).join('') + '</table>'; }
  function career(name){ try{ var t = (typeof PF !== 'undefined' && PF && PF.teachers || []).find(function(x){ return String(x.name).toLowerCase() === String(name).toLowerCase(); }); return t && t.rank ? t.rank : ''; }catch(e){ return ''; } }
  function cell(v){ return v == null ? '<span class="nd" title="No data this month · left out of the total, not counted as 0">no data</span>' : '<span class="pl"><u><i style="width:' + Math.max(0, Math.min(100, v)) + '%"></i></u><b>' + v + '</b></span>'; }
  function trow(t, i, d){ var pl = t.pillars || {}, cr = career(t.name), id = 'kxf' + i;
    var pos = t.rank ? '<td class="pos">#' + t.rank + '</td>' : '<td class="pos nr">Not ranked</td>';
    return '<tr>' + pos + '<td class="tn"><b>' + E(typeof tName === 'function' ? tName(t.name) : t.name) + '</b>' + (cr ? '<span>Career rank · ' + E(cr) + '</span>' : '') + '</td>'
      + '<td class="sc">' + (t.total == null ? '<span class="nd">no total</span>' : t.total) + '</td>'
      + '<td>' + (t.level ? '<span class="tier ' + E(t.level) + '">' + E(t.level) + '</span>' : '<span class="nd">—</span>') + '</td>'
      + PL.map(function(p){ return '<td class="num">' + cell(pl[p[0]]) + '</td>'; }).join('')
      + '<td>' + (t.facts ? '<button type="button" class="fx" aria-expanded="false" aria-controls="' + id + '" onclick="kx1120f(this,\'' + id + '\')">Facts</button>' : '') + '</td></tr>'
      + (t.facts ? '<tr class="ff" id="' + id + '" hidden><td></td><td colspan="8">' + facts(t) + '</td></tr>' : ''); }
  window.kx1120f = function(b, id){ var r = document.getElementById(id); if(!r) return; r.hidden = !r.hidden; b.setAttribute('aria-expanded', r.hidden ? 'false' : 'true'); b.textContent = r.hidden ? 'Facts' : 'Hide facts'; };
  function paint(){ var d = KX[KM], el = document.getElementById('kxBody'); if(!el) return;
    if(!d){ el.innerHTML = '<div class="kxload" role="status" aria-live="polite">Loading the scores for ' + E(mLabel(KM)) + '…</div>'; return; }
    if(d.err){ el.innerHTML = '<div class="kxe" role="alert"><span><b>Could not load the scores.</b> ' + E(mLabel(KM)) + ' · check the connection and try again.</span><button type="button" onclick="kpiReload()">Retry</button></div>'; return; }
    var R = (d.teachers || []).filter(function(t){ return t.rank; }), U = (d.teachers || []).filter(function(t){ return !t.rank; }), w = d.weights || { quality: 35, progress: 15, trust: 15, reliability: 35 };
    var gaps = PL.filter(function(p){ return !R.some(function(t){ return (t.pillars || {})[p[0]] != null; }); }).map(function(p){ return p[1]; });
    var at = d.at ? new Date(d.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
    var head = '<tr><th>Position<small>this month</small></th><th>Teacher<small>career rank</small></th><th style="text-align:right">Score<small>of 100</small></th><th>Tier</th>' + PL.map(function(p){ return '<th style="text-align:right">' + p[1] + '<small>' + (w[p[0]] != null ? w[p[0]] + '% of score' : '') + '</small></th>'; }).join('') + '<th><span class="sr-only" style="position:absolute;left:-9999px">Details</span></th></tr>';
    var i = 0;
    el.innerHTML = '<div class="kxm" role="note"><span>Reporting month · <b>' + E(d.label || mLabel(KM)) + '</b></span><span>Last worked out · <b>' + E(at) + '</b></span><span>Ranked · <b>' + E(d.min) + '+ lesson units</b> that month, not the President</span><span><b>' + R.length + '</b> ranked · <b>' + U.length + '</b> not ranked</span></div>'
      + '<div class="kxl"><span><i>Position</i> = this month\'s place (#1, #2, #3…)</span><span><i>Tier</i> = Gold 88+ · Silver 78+ · Bronze 65+ · else Developing</span><span><i>Career rank</i> = Newly Hired … Master Teacher (lifetime units) — separate from both</span><span><i>no data</i> = left out of the score, not 0</span></div>'
      + (gaps.length ? '<p class="small" style="margin:0 0 8px;color:#7A4A00">No data yet this month for: ' + E(gaps.join(', ')) + ' — the other parts are weighted up.</p>' : '')
      + '<div class="kxw"><table class="kxt"><thead>' + head + '</thead><tbody>'
      + (R.length ? R.map(function(t){ return trow(t, i++, d); }).join('') : '<tr><td colspan="9" class="mute" style="padding:16px">No teacher is ranked for this month yet.</td></tr>')
      + (U.length ? '<tr class="g"><td colspan="9">Not ranked · under ' + E(d.min) + ' lesson units that month, no total, or the President</td></tr>' + U.map(function(t){ return trow(t, i++, d); }).join('') : '')
      + '</tbody></table></div>'
      + '<details class="kxs"><summary><b>How this score is made</b> · definitions, eligibility and missing data</summary><ul style="margin:6px 0 0;padding-left:18px"><li>Four parts: Quality 35 · Reliability 35 · Progress 15 · Trust 15.</li><li>Inside a part, a measure with no data that month is <b>skipped</b>, not counted as 0; the measures that have data share the part.</li><li>A part with no data at all is <b>left out</b>, and the total is re-scaled over the parts that remain (for example, no Trust data: the total is out of the other 85 weight points, scaled to 100).</li><li>Attendance, class videos and demerits start at 100 and go down only when a record is found, so <b>no record counts as full marks</b>, not as missing.</li><li>QA uses the teacher\'s latest evaluation dated before the month ends, so it can be from an earlier month (see the QA line in the facts). Peer reviews received count only from 2 reviews; peer reviews given count once one is sent that month (or after the month ends).</li><li>No total (no data in any part), under ' + E(d.min) + ' units, or the President: not ranked.</li></ul>'
      + '<p style="margin:8px 0 0">Quality 35 (monthly QA 55%, daily class visits 40%, peers 5%) · Reliability 35 (attendance &amp; schedule, class videos by 23:59, class record, hours taught and opened, demerits, peer evaluation done) · Progress 15 (students\' progress + her own growth) · Trust 15 (trials enrolled, students still studying with us, recognitions). Renewals are not counted. Gold 88+ · Silver 78+ · Bronze 65+. # is this month\'s place, not the teacher rank (Junior, Senior…).' + (isPres() ? ' Use "Facts" for the facts behind a score.' : '') + '</p></details>'; }
  function load(ym, force){ KM = ym; if(KX[ym] && !KX[ym].err && !force && KX[ym]._at && Date.now() - KX[ym]._at < 5 * 6e4){ paint(); return; }
    var ck = 'coe.kx.' + ym; if(!KX[ym] || KX[ym].err || force){ try{ var c = JSON.parse(localStorage.getItem(ck) || 'null'); if(c && c.teachers && !force) KX[ym] = c; else if(force) delete KX[ym]; }catch(e){ delete KX[ym]; } }
    paint(); if(KBUSY[ym]) return; KBUSY[ym] = 1;
    post('mgmtKpi', [ym]).then(function(d){ d._at = Date.now(); KX[ym] = d; try{ localStorage.setItem(ck, JSON.stringify(d)); }catch(e){} })
      .catch(function(e){ if(!KX[ym] || KX[ym].err) KX[ym] = { err: String(e && e.message || e) }; })
      .finally(function(){ KBUSY[ym] = 0; if(KM === ym) paint(); }); }
  window.kxMonth = function(ym){ var s = document.getElementById('kxSel'); if(s) s.value = ym; load(ym); };
  window.kpiReload = function(){ if(KM){ delete KX[KM]; load(KM, true); } };
  window.kpiSheet = function(ym){ if(!(D && D.mgr)) return; var L = months(), m = ym || L[1];
    openSheet('<div class="kxh"><div style="flex:1 1 320px"><h2>' + IC1120('award') + 'Teacher Excellence</h2><div class="small mute" style="margin-top:2px">' + (isPres() ? 'Full view · use Facts for what is behind a score' : 'Positions, tiers and the four parts · the facts behind each score stay with the President') + '</div></div>'
      + '<label class="small mute" style="display:flex;flex-direction:column;gap:2px">Reporting month<select id="kxSel" onchange="kxMonth(this.value)">' + L.map(function(x){ return '<option value="' + x + '"' + (x === m ? ' selected' : '') + '>' + mLabel(x) + '</option>'; }).join('') + '</select></label></div><div id="kxBody" style="margin-top:8px"></div>');
    var sh = document.getElementById('sheet'); if(sh){ sh.classList.add('wide', 'kx1120'); }
    load(m); };
  var o0 = window.openSheet; if(typeof o0 === 'function') window.openSheet = function(h){ try{ var sh = document.getElementById('sheet'); if(sh && String(h).indexOf('id="kxBody"') < 0) sh.classList.remove('kx1120'); }catch(e){} return o0.apply(this, arguments); };
  var c0 = window.closeSheet; if(typeof c0 === 'function') window.closeSheet = function(){ var r = c0.apply(this, arguments); try{ var sh = document.getElementById('sheet'); if(sh) setTimeout(function(){ if(!sh.classList.contains('on')) sh.classList.remove('kx1120'); }, 300); }catch(e){} return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'perf' && typeof renderPerf === 'function') renderPerf(); }catch(e){}
})();
`;
s = s.slice(0, i) + '<style id="d1120">/* 1120 · Performance dashboard */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
