// 2276 (Misty 16 Nov 18:34–18:37): books media instant and kept open across screens. Audio/video play from our Storage copy
// (bucket book-media, filled by coe-media-sync), fallback Drive stream then Drive player; audio docks bottom-right when the book is
// closed; videos can be minimised; today's books are fetched ahead. Source: patches/src/2276-media-instant-dock.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2276-media-instant-dock.client.js"), "utf8");
lib(file, [
 ['<audio id="auEl" controls autoplay preload="auto" src="https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-audio?id=${encodeURIComponent(it.id)}" onerror="auFallback(\'${encodeURIComponent(it.id)}\')"></audio>',
  '<audio id="auEl" controls autoplay preload="auto" data-id="${E(it.id)}" src="https://rlxkiahqjsabopmuhern.supabase.co/storage/v1/object/public/book-media/${encodeURIComponent(it.id)}" onerror="mErr(this,\'${E(it.id)}\',\'a\')"></audio>'],
 ['<video controls autoplay playsinline preload="auto" src="${SRC(id)}"></video>',
  '<video controls autoplay playsinline preload="auto" src="https://rlxkiahqjsabopmuhern.supabase.co/storage/v1/object/public/book-media/${encodeURIComponent(id)}" onerror="mErr(this,\'${E(id)}\',\'v\')"></video>'],
 ['<button onclick="vdClose()">✕ Close</button>', '<button data-mini onclick="vdMini()">Minimize</button><button onclick="vdClose()">✕ Close</button>'],
 ["    v.addEventListener('error', () => { m.innerHTML = 'This video could not play here. <a href=\"' + view + '\" target=\"_blank\" rel=\"noopener\" style=\"color:#9EE\">Open it in Google Drive</a>.'; });\n", ""],
 ["if(typeof closeSheet === 'function'){ const c0 = closeSheet; closeSheet = function(){ vdClose(); return c0.apply(this, arguments); }; }", "/* 2276: closing the book no longer closes the video (it can be minimised and kept open) */"],
 ["o.addEventListener('click', ev => { if(ev.target === o) vdClose(); });", "o.addEventListener('click', ev => { if(ev.target === o && !o.classList.contains('mini')) vdMini(true); });"],
 ["const id = a ? decodeURIComponent((/id=([^&]+)/.exec(a.src) || [])[1] || '') : '';", "const id = a ? (a.dataset.id || '') : '';"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"],
]);
