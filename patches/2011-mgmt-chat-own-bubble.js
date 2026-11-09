// 2011 (9 Nov 17:08, Misty's screenshot: management's own messages were white text on a pale bubble, almost unreadable).
//   2009's lighter bubble also covered management's own messages, which use white text on the teal bubble. Own messages keep the
//   teal bubble with white text (same as before and as teachers see it); only other people's bubbles are the light grey ones.
//   Also: video/file caption lines readable on the teal bubble (2010).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["#v-chat .ch:not(.tch) .ch-bub{border:0;background:#F3F5F7;border-radius:16px}\n#v-chat .ch:not(.tch) .ch-bub.me{background:#E6F2F1}",
   "#v-chat .ch:not(.tch) .ch-bub:not(.me){border:0;background:#F3F5F7;border-radius:16px}   /* 2011: own messages keep the teal bubble */\n#v-chat .ch-bub.me .ch-fsz{color:#E6F5F4}\n#v-chat .ch-bub.me .ch-fsz a{color:#fff}"],
]);
