// 2455 (Misty 17:38 "it's directing me here [a separate window] · maybe again open in new tab, or TALK of the DAY can have its own
//   dashboard? check what's best-fitting") · Talk of the Day is now its own screen inside the app (menu item, To do box, teacher
//   Today card), like Books: the library sits in the app frame, the menu stays, nothing opens a separate window (installed app or browser).
//   The page itself (talk/) is unchanged and still works on its own (student links, present view).
const file = process.argv[2];
const JS = String.raw`<script id="b2455">
(function(){
  function ensure(){ try{ if(VIEWS.indexOf('talk') < 0) VIEWS.push('talk'); if(!$('v-talk') && $('v-today')){ var d = document.createElement('div'); d.id = 'v-talk'; d.className = 'hide'; $('v-today').parentNode.appendChild(d); } }catch(e){} return $('v-talk'); }
  function frame(id){ var v = ensure(); if(!v) return; var f = $('talkFr');
    if(!f){ v.innerHTML = '<iframe id="talkFr" title="Talk of the Day" allow="fullscreen; clipboard-write" src="talk/' + (id ? '?t=' + encodeURIComponent(id) : '') + '"></iframe>'; return; }
    if(id){ try{ f.contentWindow.location.replace('talk/?t=' + encodeURIComponent(id)); }catch(e){ f.src = 'talk/?t=' + encodeURIComponent(id); } } }
  window.talk2455 = function(id){ try{ ensure(); go('talk'); frame(id || ''); }catch(e){ window.open('talk/' + (id ? '?t=' + id : ''), '_blank'); } return false; };
  ensure();
  var _g = go; go = function(v){ if(v === 'talk') ensure(); var r = _g.apply(this, arguments); if(v === 'talk') frame(''); return r; };
})();
</script>
<style id="u2455">#v-talk iframe{display:block;width:100%;height:calc(100vh - 120px);min-height:520px;border:1px solid #ECEAF2;border-radius:16px;background:#F6F5FA}
@media (max-width:760px){#v-talk iframe{height:calc(100vh - 170px);border-radius:12px}}</style>
`;
require('../tools/lib.js')(file, [
  ["window.open('talk/', '_blank');", "talk2455();"],
  ["href=\"talk/?t=' + t.id + '\" target=\"_blank\" style=\"text-decoration:none\"", "href=\"talk/?t=' + t.id + '\" onclick=\"return talk2455(\\'' + t.id + '\\')\" style=\"text-decoration:none\""],
  ["href=\"talk/\" target=\"_blank\" style=\"text-decoration:none\"", "href=\"talk/\" onclick=\"return talk2455()\" style=\"text-decoration:none\""],
  ["href=\"talk/\" target=\"_blank\" style=\"margin-left:auto;text-decoration:none\"", "href=\"talk/\" onclick=\"return talk2455()\" style=\"margin-left:auto;text-decoration:none\""],
  ['<script id="b2278">', JS + '<script id="b2278">']
]);
