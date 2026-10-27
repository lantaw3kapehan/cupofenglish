// 1412: (Misty 23:27) Team Chat · Retry for failed pictures and voice messages too (not only text), without duplicates (same client id).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"(m.kind === 'text' ? '<button type=\"button\" class=\"ch-chip\" onclick=\"chat1400.retry(' + m.id + ')\">Retry</button>' : '');",
"('<button type=\"button\" class=\"ch-chip\" onclick=\"chat1400.retry(' + m.id + ')\">Retry</button>');"
],
[
"mentions: men, quote: rt ? { author: rt.author, body: rt.body } : null, pending: 1 };",
"mentions: men, quote: rt ? { author: rt.author, body: rt.body } : null, pending: 1, rs: { img: img, imgs: imgs, voice: voice || null, rt: rt, op: op } };"
],
[
"retry: function(id){ var m = S.data && S.data.msgs.find(function(x){ return x.id === id; }); if(!m) return; S.data.msgs.splice(S.data.msgs.indexOf(m), 1); var t = document.getElementById('chTx'); if(t){ t.value = m.body; } S.cid = m.cid; render(true); A.send(); },",
"retry: function(id){ var m = S.data && S.data.msgs.find(function(x){ return x.id === id; }); if(!m) return;\n      /* 1412: pictures and voice messages retry too: the same pictures / recording, reply and options go again with the same client id,\n         so the server never posts it twice (if the first try did reach it, the retry just returns that message). */\n      var R = m.rs || {}, t = document.getElementById('chTx'), keep = t ? t.value : ''; S.data.msgs.splice(S.data.msgs.indexOf(m), 1);\n      S.cid = m.cid; S.replyTo = R.rt || null; S.opt = R.op || {};\n      if(R.voice){ render(true); A.send(R.voice); var t3 = document.getElementById('chTx'); if(t3 && keep) t3.value = keep; return; }\n      S.imgs = (R.imgs && R.imgs.length ? R.imgs : (R.img ? [R.img] : [])).slice(); S.img = S.imgs[0] || null; if(t) t.value = m.body || ''; render(true); var t2 = document.getElementById('chTx'); if(t2) t2.value = m.body || ''; A.send();\n      if(keep && keep !== (m.body || '')){ var t4 = document.getElementById('chTx'); if(t4 && !t4.value) t4.value = keep; } },"
]
]);
