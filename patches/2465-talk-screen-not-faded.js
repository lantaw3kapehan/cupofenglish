// 2465 (Misty 18:36 "like this fade you see") · the in-app Talk of the Day screen stayed faded and could not be clicked: the
//   steady-screen copy (2368) of the page frame was drawn greyed, and the app took that copy for the real frame. The copy is now never used.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function frame(id){ var v = ensure(); if(!v) return; var f = $('talkFr');", "function frame(id){ var v = ensure(); if(!v) return; [].slice.call(v.querySelectorAll('[data-c2368]')).forEach(function(c){ c.remove(); }); var f = $('talkFr'); if(f && f.hasAttribute('data-c2368')){ f.remove(); f = null; }"],
  ['<script id="b2278">', '<style id="u2465">#v-talk [data-c2368]{display:none!important}</style>\n<script id="b2278">']
]);
