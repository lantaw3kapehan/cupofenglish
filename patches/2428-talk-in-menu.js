// 2428 (Misty 19 Nov 15:05: "it's not here yet?") · "Talk of the Day" in the left menu for everyone (teachers under Schedule,
//   management under To do). Opens the Talk library (talk/) in a new tab, like the books.
const file = process.argv[2];
const JS = String.raw`<script id="b2428">
(function(){
  function svg(){ try{ if(typeof ICON !== 'undefined' && ICON.chat) return ICON.chat; }catch(e){} return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4"/></svg>'; }
  function add(){ var n = document.getElementById('navIn'); if(!n || n.querySelector('[data-v="talk"]')) return;
    var after = n.querySelector('[data-v="mtoday"]') || n.querySelector('[data-v="tsched"]') || n.querySelector('[data-v="today"]'); if(!after) return;
    var b = document.createElement('button'); b.setAttribute('data-v', 'talk'); b.className = after.className.indexOf('sec') >= 0 ? 'sec' : '';
    b.innerHTML = svg() + '<span class="nl">Talk of the Day</span>'; b.title = 'Class openers for YLE, Teens and Adults';
    b.onclick = function(){ window.open('talk/', '_blank', 'noopener'); };
    after.insertAdjacentElement('afterend', b); }
  setInterval(add, 3000); setTimeout(add, 800); setTimeout(add, 2500);
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', JS + '<script id="b2278">']]);
