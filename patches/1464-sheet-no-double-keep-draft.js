// 1464 · President QA 28 Oct (Misty's priority 4 "preserve drafts" + "prevent duplicate submissions"). Shared sheet code, all roles.
//   Found in the preview with saving faked (?writes=fake) and a 2.5 s slow answer:
//   · three quick taps on Send in "+ New notice" sent the notice three times (mgmtMsgSend ×6), "+ New case" added three cases
//     (addCase ×3), "+ Log enquiry" saved three enquiries (mgmtEnqSave ×3). The button stayed enabled while saving.
//   · Escape (or ✕ / tapping outside) on any form threw away what was typed: + New notice, + Expense, + Sale, + Log enquiry,
//     + Lodge leave, + New case, + Coaching all reopened empty.
//   · Wallets › Record … dialogs did not close with Escape.
//   Now:
//   · A Save / Send / Add / Lodge / Record / Submit / Book / Create / File / Mark … button in a sheet or wallet dialog takes one tap:
//     further taps are ignored while its request is on the way (aria-busy, dimmed — no size change, nothing moves). If the tap
//     sent nothing (a field was missing) the button is ready again at once (0.9 s at most); it always frees itself after 20 s.
//   · Closing a form you typed in keeps what you typed on this device (memory only — gone on reload or sign-out). Opening the same
//     form again (same title and header, so the same student / teacher) puts it back and says "Your unsent draft is back".
//     After a successful send the draft is dropped. Password and file fields are never kept.
//   · Escape closes a wallet dialog when nothing has been typed in it.
//   Server, saves, validation and permissions unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</body>\n</html>",
   "<style id=\"css1464\">.busy1464{opacity:.62;cursor:progress!important}</style>\n<script>\n" +
   "/* 1464 · one tap per Save/Send in sheets and wallet dialogs; unsent drafts kept when a form is closed (memory only) */\n" +
   "(function(){\n" +
   "  if(window.__1464) return; window.__1464 = 1;\n" +
   "  var SUB = /^(Send|Save|Add|Lodge|Record|Submit|Book|Create|File|Mark|Log|Approve|Decline|Confirm|Countersign|Sign|Request|Undo|Delete|Remove|Pay|Refund|Release)\\b/i;\n" +
   "  var CUR = null, LAST = 0, SENT = 0;\n" +
   "  function isSub(b){ if(!b || b.disabled) return false; var t = (b.textContent || '').replace(/\\s+/g, ' ').trim(); if(!t || /^(✕|×|Cancel|Close|Back)$/i.test(t)) return false;\n" +
   "    return SUB.test(t) || /Go$/.test(b.id || '') || b.id === 'mnB'; }\n" +
   "  function free(st){ if(!st || st.done) return; st.done = 1; var b = st.b; b.__busy1464 = 0; b.removeAttribute('aria-busy'); b.classList.remove('busy1464'); if(CUR === st) CUR = null; }\n" +
   "  document.addEventListener('click', function(e){ var b = e.target && e.target.closest && e.target.closest('#sheet button, #wlM button'); if(!b || !isSub(b)) return;\n" +
   "    if(b.__busy1464){ e.stopImmediatePropagation(); e.preventDefault(); return; }\n" +
   "    var st = { b: b, n: 0, open: 0, win: 1, done: 0 }; CUR = st; b.__busy1464 = 1; b.setAttribute('aria-busy', 'true'); b.classList.add('busy1464'); LAST = Date.now();\n" +
   "    setTimeout(function(){ st.win = 0; if(CUR === st) CUR = null; if(!st.open) setTimeout(function(){ free(st); }, st.n ? 250 : 0); }, 900);\n" +
   "    setTimeout(function(){ free(st); }, 20000); }, true);\n" +
   "  var f0 = window.fetch; if(typeof f0 === 'function') window.fetch = function(){ var st = CUR, p = f0.apply(this, arguments);\n" +
   "    if(st && st.win && !st.done){ st.n++; st.open++; SENT = Date.now(); var end = function(){ st.open--; if(!st.open && !st.win) setTimeout(function(){ free(st); }, 250); }; Promise.resolve(p).then(end, end); }\n" +
   "    return p; };\n" +
   "  /* drafts */\n" +
   "  var DR = {}, DIRTY = {};\n" +
   "  function sh(){ return document.getElementById('sheet'); } function on(){ var s = sh(); return !!(s && s.classList.contains('on')); }\n" +
   "  function key(){ var b = document.getElementById('sheetBody') || sh(); if(!b) return ''; var c = b.cloneNode(true); c.querySelectorAll('select,option,script,style,textarea,.sbk,svg').forEach(function(x){ x.remove(); });\n" +
   "    return String(c.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 200); }\n" +
   "  function fields(){ var s = sh(); return s ? Array.prototype.slice.call(s.querySelectorAll('input[id],textarea[id],select[id]')).filter(function(f){ return !/^(password|file|hidden|button|submit)$/i.test(f.type || ''); }) : []; }\n" +
   "  function mark(e){ var f = e.target; if(!e.isTrusted || !f || !f.id || !f.closest || !f.closest('#sheet') || /^(password|file|hidden)$/i.test(f.type || '')) return; DIRTY[f.id] = 1; SENT = 0; }\n" +
   "  document.addEventListener('input', mark, true); document.addEventListener('change', mark, true);\n" +
   "  function keep(){ try{ var ids = Object.keys(DIRTY); DIRTY = {}; if(!on() || !ids.length) return; var k = key(); if(!k) return;\n" +
   "      if(SENT && Date.now() - SENT < 30000){ delete DR[k]; return; }   /* sent → no draft */\n" +
   "      var v = {}; fields().forEach(function(f){ if(ids.indexOf(f.id) < 0) return; v[f.id] = (f.type === 'checkbox' || f.type === 'radio') ? { c: f.checked } : { v: f.value }; });\n" +
   "      if(Object.keys(v).some(function(id){ var x = v[id]; return x.c != null || String(x.v || '').trim(); })) DR[k] = v; else delete DR[k]; }catch(e){} }\n" +
   "  function back(n){ try{ if(!on()) return; var k = key(), v = k && DR[k]; if(!v) return; var put = 0;\n" +
   "      fields().forEach(function(f){ var x = v[f.id]; if(!x) return; if(x.c != null){ if(f.checked !== x.c){ f.checked = x.c; put++; } }\n" +
   "        else if(!f.value || (f.tagName === 'SELECT' && f.selectedIndex <= 0) || (f.type === 'date' && f.defaultValue === f.value)){ if(f.value !== x.v){ f.value = x.v; if(f.value === x.v) put++; } } else return;\n" +
   "        DIRTY[f.id] = 1; try{ f.dispatchEvent(new Event('input', { bubbles: true })); f.dispatchEvent(new Event('change', { bubbles: true })); }catch(e){} });\n" +
   "      if(put){ delete DR[k]; try{ toast('Your unsent draft is back'); }catch(e){} } else if(n < 3) setTimeout(function(){ back(n + 1); }, [400, 1200, 2500][n]); }catch(e){} }\n" +
   "  var o0 = window.openSheet; if(typeof o0 === 'function') window.openSheet = function(){ keep(); SENT = 0; var r = o0.apply(this, arguments); setTimeout(function(){ back(0); }, 0); return r; };\n" +
   "  var c0 = window.closeSheet; if(typeof c0 === 'function') window.closeSheet = function(){ keep(); var r = c0.apply(this, arguments); setTimeout(function(){ if(on()) back(0); }, 0); return r; };\n" +
   "  var l0 = window.logout; if(typeof l0 === 'function') window.logout = function(){ DR = {}; DIRTY = {}; return l0.apply(this, arguments); };\n" +
   "  /* wallet dialogs: Escape closes an untouched one */\n" +
   "  var WT = 0; document.addEventListener('input', function(e){ if(e.target && e.target.closest && e.target.closest('#wlM')) WT = 1; }, true);\n" +
   "  document.addEventListener('keydown', function(e){ if(e.key !== 'Escape') return; var m = document.getElementById('wlM'); if(!m) { WT = 0; return; } if(!WT && typeof window.wlClose === 'function'){ wlClose(); WT = 0; } });\n" +
   "})();\n" +
   "</script>\n</body>\n</html>"],
]);
