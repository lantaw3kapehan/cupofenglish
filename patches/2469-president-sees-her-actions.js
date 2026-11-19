// 2469 (Misty 18:59 "as President, I would also see what she solved or what, right?") · on "From Operations · Celine" the numbers
//   (done · found · fixed) are links: each opens the same labelled list Celine sees on her desk — time, Done / Cleared / Not a problem /
//   Problem found / Solved by Management, what it was and her note.
const file = process.argv[2];
const OLD = "' · ' + (d.done || 0) + ' done · ' + (d.found || 0) + ' found · ' + (d.fixed || 0) + ' fixed · idle ' + (d.idle || 0) + ' min</span></div>'";
const NEW = "' · ' + (window.__pd2469 = d, '') + '<a class=\"link\" href=\"#\" onclick=\"return pd2469(\\'done\\')\">' + (d.done || 0) + ' done</a> · <a class=\"link\" href=\"#\" onclick=\"return pd2469(\\'found\\')\">' + (d.found || 0) + ' found</a> · <a class=\"link\" href=\"#\" onclick=\"return pd2469(\\'fixed\\')\">' + (d.fixed || 0) + ' fixed</a> · <a class=\"link\" href=\"#\" onclick=\"return pd2469(\\'all\\')\">all she did</a> · idle ' + (d.idle || 0) + ' min</span></div>'";
const JS = String.raw`<script id="b2469">
window.pd2469 = function(k){ try{ var keep = window.__od2447; window.__od2447 = window.__pd2469 || {}; if(typeof od2447Show === 'function') od2447Show(k === 'all' ? 'done' : k);
  var h = document.querySelector('#sheetBody h1'); if(h){ var who = (window.__pd2469 && window.__pd2469.who) || 'Operations'; h.textContent = who + ' · ' + (k === 'all' ? 'everything today' : h.textContent.replace(/ today$/, '').toLowerCase() + ' today'); }
  window.__od2447 = keep; }catch(e){} return false; };
</script>
`;
require('../tools/lib.js')(file, [[OLD, NEW], ['<script id="b2278">', JS + '<script id="b2278">']]);
