// 1651: (Misty 11:57: "the Overview numbers flicker on refresh") the second kind of "old then new": the contrast safety nets
// (1007 contrast(), 1101 fixText) check text colours AFTER a screen is drawn and darken the ones that miss AA (teal links, "Active",
// "lessons left · CEFR · latest /100", "▲ vs Sep", the next-class line, avatar letters …). Every redraw draws the original colour
// again, so it is painted, then darkened a moment later: a colour flick on every refresh (seen in the frame traces at 4× CPU).
// Fix: when a safety net darkens a text colour, the same colour is remembered as a style rule for that place (the element's tag and
// classes and its 3 parents), so the next drawing of that place is painted in the final colour from its first frame and the safety net
// has nothing left to change. Kept for this session only (nothing stored: a new release never meets old rules). If one place ever
// needs two different colours, its rule is dropped (the safety net keeps working element by element, as before). Max 400 rules.
const lib = require('../tools/lib.js'), file = process.argv[2];
const LEARN = `<script id="l1651">
/* 1651 · colours fixed by the contrast safety nets are painted fixed from the first frame on the next drawing */
(function(){
  if(window.__learn1651) return;
  var R = {}, BAD = {}, n = 0, st = null, pend = false, PRE = ':is(html,#a1651):is(html,#b1651):is(html,#c1651) ';
  var esc = function(s){ return W.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/[^\\w-]/g, '\\\\$&'); }, W = window;
  function seg(x){ var s = x.tagName.toLowerCase(); if(x.id && !/\\d/.test(x.id)) s += '#' + esc(x.id);
    var c = [].slice.call(x.classList).filter(function(k){ return !/\\d{3,}-\\d/.test(k); }).slice(0, 5); for(var i = 0; i < c.length; i++) s += '.' + esc(c[i]); return s; }
  function sel(e){ var p = [], x = e; for(var i = 0; i < 4 && x && x.nodeType === 1 && x !== document.body && x !== document.documentElement; i++, x = x.parentElement) p.unshift(seg(x));
    var sa = e.getAttribute('style'); if(sa) p[p.length - 1] += '[style=' + JSON.stringify(sa) + ']';   /* own colours (avatars, chips): only that exact look */
    return PRE + p.join(' > '); }
  function flush(){ pend = false; if(!st){ st = document.createElement('style'); st.id = 'learn1651'; } var css = ''; for(var k in R) if(!BAD[k]) css += k + '{color:' + R[k] + '!important}\\n';
    st.textContent = css; if(!st.parentNode) (document.head || document.documentElement).appendChild(st); }
  W.__learn1651 = function(e, prop, val){ try{ if(prop !== 'color' || !e || e.nodeType !== 1 || (e.closest && e.closest('svg'))) return; var k = sel(e); if(BAD[k]) return;
      if(R[k] === val) return; if(R[k]){ BAD[k] = 1; delete R[k]; } else { if(n >= 400) return; n++; R[k] = val; }
      if(!pend){ pend = true; (W.queueMicrotask || setTimeout)(flush); } }catch(x){} };
  W.__learned1651 = function(){ return { rules: Object.keys(R).length, dropped: Object.keys(BAD).length }; };
})();
</script>`;
lib(file, [
  ['\n<script id="b1506">', '\n' + LEARN + '\n<script id="b1506">'],
  ["W1592.forEach(function(w){ w[0].style.setProperty(w[1], w[2], 'important'); if(w[0].dataset) w[0].dataset.c1007 = '1';",
   "W1592.forEach(function(w){ if(window.__learn1651) __learn1651(w[0], w[1], w[2]); w[0].style.setProperty(w[1], w[2], 'important'); if(w[0].dataset) w[0].dataset.c1007 = '1';"],
  ["W1592.forEach(function(w){ w[0].style.setProperty(w[1], w[2], 'important'); });",
   "W1592.forEach(function(w){ if(window.__learn1651) __learn1651(w[0], w[1], w[2]); w[0].style.setProperty(w[1], w[2], 'important'); });"]
]);
