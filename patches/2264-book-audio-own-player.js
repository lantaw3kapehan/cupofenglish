// 2264 (Misty 16 Nov 17:16 "I'm trying to play here but not playing"): Google Drive's preview player stayed at 0:00 in her Chrome
// (it depends on Google's cookies in an embedded frame). The app now plays the MP3 itself in a plain audio player that starts at once,
// fed by our own server (Supabase function coe-audio, which streams the file from Drive; only course-book audio files).
// No Google sign-in needed. If our server ever fails, it switches to Drive's player by itself. Speed 1× / 0.75× for slower listening.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ['<iframe src="https://drive.google.com/file/d/${encodeURIComponent(it.id)}/preview" allow="autoplay" title="Audio player"></iframe>',
  '<audio id="auEl" controls autoplay preload="auto" src="https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-audio?id=${encodeURIComponent(it.id)}" onerror="auFallback(\'${encodeURIComponent(it.id)}\')"></audio>'],
 ["#auBar iframe{display:block;width:100%;height:80px;", "#auBar audio{display:block;width:100%;margin-top:8px}\n#auBar iframe{display:block;width:100%;height:80px;"],
 ["<div class=\"au-h\">Tap ▶ in the player. In an online class,", "<div class=\"au-h\">Plays at once · tap again to replay. In an online class,"],
 ["  window.auCopy = async function(i){",
  "  window.auFallback = function(id){ const el = document.getElementById('auEl'); if(!el) return; const f = document.createElement('iframe'); f.src = 'https://drive.google.com/file/d/' + id + '/preview'; f.allow = 'autoplay'; f.title = 'Audio player'; el.replaceWith(f); };\n  window.auSpeed = function(b){ const el = document.getElementById('auEl'); if(!el) return; el.playbackRate = el.playbackRate === 1 ? 0.75 : 1; b.textContent = el.playbackRate === 1 ? 'Speed 1×' : 'Speed 0.75×'; };\n  window.auCopy = async function(i){"],
 ["<a href=\"${view(it.id)}\" target=\"_blank\" rel=\"noopener\">Open in Drive</a>", "<button onclick=\"auSpeed(this)\">Speed 1×</button><a href=\"${view(it.id)}\" target=\"_blank\" rel=\"noopener\">Open in Drive</a>"],
]);
