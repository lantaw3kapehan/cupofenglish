// 21 Oct · Header recognition line: on screens with the Excellence card in the sidebar, the everyday "leading / within reach" line leaves the header (the card says the same); awards stay.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 21 Oct · 495 · Misty: "how to strategically position it best?"
   The header line ("You are leading the team this month…") repeated the sidebar Excellence card ("Keep Silver and first place to become
   Teacher of the Month") and sat next to the name, competing with the day's classes. Now:
   · laptop (sidebar with the Excellence card): the everyday progress line is shown only in the card — one place, next to the score;
   · an award (Teacher of the Month, Gold Excellence — the gold style) still shows in the header, because it is news worth seeing first;
   · phone (no sidebar): the short chip stays in the header ("🥇 1st · Silver"), the only place it can be seen there. */
(function(){
  const css = document.createElement('style');
  css.textContent = 'body:has(#kxSide) #cmHead:not(.g){display:none!important}';
  document.head.appendChild(css);
})();
` + "</script>\n\n</body>"]]);
