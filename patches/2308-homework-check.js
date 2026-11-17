// 2308 (Misty 17 Nov 15:44 "a screen during class ... where they can paste the homework of the student submitted on wechat" · 15:48
// "Yes let us make it live now"): a "Check homework" button on every class card (teachers and management) opens the Homework check
// page (homework/) for that student and class: paste the text or picture from WeChat, correct it, show it on screen, save it to the
// student's homework (coe_hw_checks through coe-hw) and copy a bilingual picture for the parent.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["${!D.mgr && window.bkBtn ? bkBtn(c, s) : ''}`:''}",
  "${!D.mgr && window.bkBtn ? bkBtn(c, s) : ''}${window.hwBtn2308 ? hwBtn2308(c) : ''}`:''}"],
 ['<script id="b2278">',
  `<script id="b2308">
/* 2308 · Check homework: opens homework/ for this class (same sign-in, new tab, one tab reused) */
(function(){
  window.hwBtn2308 = function(c){ try{ if(!c || c.cancelled || !c.code || c.type === 'Trial') return '';
    return '<button class="btn ghost sm" style="margin:8px 0 0 6px" title="Paste the homework from WeChat, correct it and share it" onclick="hwOpen2308(\\'' + esc(c.id) + '\\')">Check homework</button>'; }catch(e){ return ''; } };
  window.hwOpen2308 = function(id){ try{ const c = (D && (D.schedule || []).find(x => x.id === id)) || null; if(!c) return toast('Class not found · refresh and try again');
    const nm = String(c.student || '').replace(/\\s+X$/i, '') || c.code;
    const u = 'homework/?code=' + encodeURIComponent(c.code) + '&n=' + encodeURIComponent(nm) + '&cls=' + encodeURIComponent(c.id) + '&day=' + encodeURIComponent(c.day || '') + '&t=' + encodeURIComponent(c.start || '') + '&e=' + encodeURIComponent(c.end || '');
    const w = window.open(u, 'coehw'); if(!w) location.href = u; }catch(e){ toast('Could not open Homework check'); } };
})();
</script>
<script id="b2278">`],
]);
