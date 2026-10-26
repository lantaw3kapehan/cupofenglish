// 1121: (Misty, 26 Oct 14:08) The same professional system across the teacher-management tabs — presentation only.
// · Leave: while a request waits for a decision, Approve is the one solid action and "+ Lodge leave" is an outline.
// · Leave: the attachment emoji becomes the line icon; the request action reads "Review request" (was "Proof & details");
//   rows that open a record say "View ›"; approval still Approve / Decline exactly as before.
// · Leave: a second tap on the same Approve / Decline while the first is saving is ignored (no double save).
// · Cases: every row is named for screen readers and the keyboard as "View case <id> · <subject>"; when a search, a person or a
//   filter is active a line shows what is active with "Clear filters" (search, person and filter back to All at once).
// · Contracts: each teacher row shows the version (Add. 1 …), the signature status, the respond-by date and the NEXT step
//   ("Your countersign", "Teacher to sign · respond by 4 Nov", "Reply to the question" …, overdue in red), and "View ›".
//   "Start again" (voids a signing) is styled as a destructive action and set apart.
// · Notices of breach: the header button no longer sits under the close ✕; rows show the explanation / evidence state and say
//   "Decide ›", "View notice ›" or "View decision ›".
// · Teachers: the team-map dots are named "View <teacher>" for the keyboard and screen readers.
// Everything is applied in the same step as the screen is drawn (no later re-arranging). Records, permissions, confirmations,
// workflows and document wording are unchanged.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["${(r.proof||[]).length ? '📎 ' + r.proof.length + ' proof' : 'No proof yet'}", "${(r.proof||[]).length ? (window.IC1120 ? IC1120('clip') : '') + r.proof.length + ' proof file' + (r.proof.length === 1 ? '' : 's') : 'No proof yet'}"],
  ["onclick=\"lvProof('${esc(x.id)}',${i})\">📎 ", "onclick=\"lvProof('${esc(x.id)}',${i})\">${window.IC1120 ? IC1120('clip') : ''}"],
  ["lvSheet('${esc(r.id)}')\">Proof &amp; details</button>", "lvSheet('${esc(r.id)}')\">Review request</button>"],
  ["${btn ? '' : '<span class=\"mute\">›</span>'}</div>`;", "${btn ? '' : '<span class=\"vl1121\">View ›</span>'}</div>`;"],
  ["'<div style=\"margin-top:5px;display:flex;gap:5px;flex-wrap:wrap\">' + (pills || '<span class=\"pill p-grey\">Nothing sent</span>') + '</div></div><span class=\"mute\">›</span></div>'",
   "'<div style=\"margin-top:5px;display:flex;gap:5px;flex-wrap:wrap\">' + (pills || '<span class=\"pill p-grey\">Nothing sent</span>') + '</div>' + (window.ct1121Next ? ct1121Next(rs.find(x => add && x.doc_id === add.id)) : '') + '</div><span class=\"vl1121\">View ›</span></div>'"],
  ["' · not opened') + (n.conf_req ? ' · asked for a call' : '') + '</div><div style=\"margin-top:5px\">' + pill(n).replace(/Explain within/, 'Explanation due in').replace('Time to explain has ended', 'No explanation · 5 days ended') + '</div></div><span class=\"mute\">›</span></div>'",
   "' · not opened') + (n.conf_req ? ' · asked for a call' : '') + (n.explain_at ? ' · explanation received' : '') + ((n.files || []).length ? ' · ' + n.files.length + ' evidence file' + (n.files.length === 1 ? '' : 's') : '') + '</div><div style=\"margin-top:5px\">' + pill(n).replace(/Explain within/, 'Explanation due in').replace('Time to explain has ended', 'No explanation · 5 days ended') + '</div></div><span class=\"vl1121\">' + (n.decided_at ? 'View decision ›' : (n.explain_at || left(n.due_at) <= 0) ? 'Decide ›' : 'View notice ›') + '</span></div>'"],
  ["<div class=\"ct\"><div style=\"display:flex;justify-content:space-between;align-items:center;gap:10px\"><h1>Notices of breach</h1>", "<div class=\"ct\"><div class=\"hd1121\" style=\"display:flex;justify-content:space-between;align-items:center;gap:10px\"><h1>Notices of breach</h1>"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = `
.vl1121{flex:none;font-size:13px;font-weight:600;color:var(--d-teal-d,#00707A);white-space:nowrap;margin-left:8px;align-self:center}
#sheetBody .ct .hd1121{padding-right:48px}
#sheetBody .ct .nx1121{margin-top:6px;font-size:13px;color:var(--d-mute,#5E5A76)}
#sheetBody .ct .nx1121 b{color:var(--d-ink,#2B2450);font-weight:600}
#sheetBody .ct .nx1121 .due{color:#A23A2D;font-weight:600}
#sheetBody .ct .nx1121 .ok{color:#1E6B49;font-weight:600}
#v-actions .cf1121{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 4px;font-size:13px;color:var(--d-mute,#5E5A76)}
#v-actions .cf1121 b{color:var(--d-ink,#2B2450);font-weight:600}
#v-actions .cf1121 button{font:inherit;font-size:13px;font-weight:600;border:1px solid var(--d-line,#DCD9E6);background:#fff;border-radius:999px;padding:4px 12px;color:var(--d-ink,#2B2450);cursor:pointer;min-height:32px}
#v-actions .cf1121 button:focus-visible{outline:3px solid rgba(1,176,191,.45);outline-offset:2px}
#v-actions .r524:focus-visible,#v-teachers .li:focus-visible,#v-leave .li:focus-visible,#sheetBody .ct .tr:focus-visible{outline:3px solid rgba(1,176,191,.45);outline-offset:-3px;border-radius:10px}
.ic1120{display:inline-block;width:16px;height:16px;vertical-align:-3px;margin-right:4px}
`;
const js = String.raw`
(function(){
  if(window.__1121) return; window.__1121 = 1;
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var dmy = function(iso){ try{ return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };
  /* Contracts: the next required step for the addendum row of a teacher */
  window.ct1121Next = function(r){ if(!r) return '<div class="nx1121">Next · <b>send the set</b> (open the teacher)</div>';
    var od = r.due_at && new Date(r.due_at).getTime() < Date.now(), by = r.due_at ? ' · respond by ' + E(dmy(r.due_at)) : '';
    if(r.status === 'paper') return '<div class="nx1121"><span class="ok">Complete</span> · signed on paper</div>';
    if(r.status === 'signed') return r.pres_at ? '<div class="nx1121"><span class="ok">Complete</span> · signed by both' + (r.wit_at ? ' · witnessed' : ' · witness: Operations') + '</div>' : '<div class="nx1121">Next · <b>your countersign</b> · teacher signed ' + E(dmy(r.signed_at)) + '</div>';
    if(r.status === 'question') return '<div class="nx1121">Next · <b>' + (r.reply ? 'teacher reads the reply' : 'reply to the question') + '</b></div>';
    if(r.status === 'declined') return '<div class="nx1121">Next · <b>review — did not agree</b></div>';
    return '<div class="nx1121">Next · <b>teacher ' + (r.status === 'opened' ? 'signs' : 'opens and signs') + '</b>' + (od ? ' · <span class="due">overdue since ' + E(dmy(r.due_at)) + '</span>' : by) + '</div>'; };
  /* Contracts: "Start again" voids a signing — destructive look, kept last */
  function ctDanger(){ var b = document.getElementById('sheetBody'); if(!b) return; [].forEach.call(b.querySelectorAll('.ct button[onclick^="ctVoid("]:not(.x1101-dz)'), function(x){ x.classList.add('x1101-dz', 'x1101-end'); x.removeAttribute('style'); x.setAttribute('aria-label', 'Start again — voids this signing (asks to confirm)'); }); }
  var _ct = window.ctTeacher; if(typeof _ct === 'function') window.ctTeacher = function(){ var r = _ct.apply(this, arguments); try{ ctDanger(); }catch(e){} return r; };
  /* Cases: names + Clear filters, in the same step as the list is drawn */
  var _ra = window.renderActions;
  if(typeof _ra === 'function') window.renderActions = renderActions = function(){ var r = _ra.apply(this, arguments); try{ cases(); }catch(e){} return r; };
  function cases(){ var v = document.getElementById('v-actions'); if(!v) return;
    v.querySelectorAll('.r524[onclick^="caseView("]:not([data-n1121])').forEach(function(el){ el.dataset.n1121 = '1'; var id = (el.getAttribute('onclick').match(/caseView\('([^']*)'/) || [])[1] || '', t = el.querySelector('.t b'); el.setAttribute('aria-label', 'View case ' + id + (t ? ' · ' + t.textContent : '')); el.title = 'View case ' + id; });
    var q = (document.getElementById('acq') || {}).value || '', sel = v.querySelector('.fl524 select'), who = sel && sel.value || '', f = typeof AC_F !== 'undefined' ? AC_F : 'all';
    var lab = { open: 'Not completed', pen: 'Deductions', bon: 'Bonuses' }[f], act = [];
    if(q) act.push('search “' + E(q) + '”'); if(who) act.push('person <b>' + E(who) + '</b>'); if(lab) act.push('filter <b>' + lab + '</b>');
    var box = v.querySelector('.cf1121'), seg = v.querySelector(':scope>.seg');
    if(act.length && seg){ var h = 'Showing ' + act.join(' · ') + ' <button type="button" onclick="ac1121Clear()">Clear filters</button>'; if(!box){ box = document.createElement('div'); box.className = 'cf1121'; box.setAttribute('role', 'status'); seg.after(box); } if(box.dataset.h !== h){ box.innerHTML = h; box.dataset.h = h; } }
    else if(box) box.remove(); }
  window.ac1121Clear = function(){ var v = document.getElementById('v-actions'), i = document.getElementById('acq'), sel = v && v.querySelector('.fl524 select'); if(i) i.value = ''; try{ AC_F = 'all'; }catch(e){}
    if(sel && sel.value && typeof ac524P === 'function'){ ac524P(sel.value); } else renderActions(); var s2 = document.getElementById('acq'); if(s2) s2.focus(); };
  /* Teachers: explicit names on the rows */
  function teachers(){ var v = document.getElementById('v-teachers'); if(!v) return;
    v.querySelectorAll('[onclick^="openTeacher("]:not([data-n1121])').forEach(function(el){ el.dataset.n1121 = '1'; var n = (el.getAttribute('onclick').match(/openTeacher\('([^']*)'/) || [])[1] || ''; if(!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'View ' + n); });
  }
  var _rt = window.renderTeachers; if(typeof _rt === 'function') window.renderTeachers = function(){ var r = _rt.apply(this, arguments); try{ teachers(); }catch(e){} return r; };
  /* Leave: rows named for the action they open */
  function leave(){ var v = document.getElementById('v-leave'); if(!v) return;
    v.querySelectorAll('[onclick^="lvSheet("]:not(button):not([data-n1121])').forEach(function(el){ el.dataset.n1121 = '1'; var b = el.querySelector('.grow b') || el.querySelector('b'); if(!el.getAttribute('aria-label')) el.setAttribute('aria-label', (el.querySelector('button') ? 'Review request' : 'View leave') + (b && b.textContent.trim() ? ' · ' + b.textContent.trim() : '')); });
    /* a request waiting for a decision is the next step: "+ Lodge leave" steps back to an outline */
    var lodge = v.querySelector(':scope>.lead .btn[onclick^="lvSheet()"]'); if(lodge) lodge.classList.toggle('x1101-sec', !!v.querySelector('.btn[onclick*="lvDecide("][onclick*="Approved"], .btn[onclick^="event.stopPropagation();lvSheet("].teal')); }
  var _rl = window.renderLeave; if(typeof _rl === 'function') window.renderLeave = function(){ var r = _rl.apply(this, arguments); try{ leave(); }catch(e){} return r; };
  /* Leave: one decision per tap — a second tap on the same Approve / Decline while the first is being saved is ignored */
  var _lv = window.lvDecide; if(typeof _lv === 'function'){ var IF = {}; window.lvDecide = function(id, st){ var k = id + '|' + st; if(IF[k]) return; IF[k] = 1; var r; try{ r = _lv.apply(this, arguments); }catch(e){ delete IF[k]; throw e; } Promise.resolve(r).finally(function(){ setTimeout(function(){ delete IF[k]; }, 800); }); return r; }; }
  try{ if(typeof VIEW !== 'undefined'){ if(VIEW === 'actions') renderActions(); if(VIEW === 'teachers') teachers(); if(VIEW === 'leave') leave(); } }catch(e){}
})();
`;
s = s.slice(0, i) + '<style id="d1121">/* 1121 · teacher-management tabs */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
