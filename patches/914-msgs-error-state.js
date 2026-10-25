// 914: (phase 2, D1 Messages · error state) When the message list cannot load, the whole page was one grey line
// "Could not load messages. Try again." — no page title, no way to retry except the top refresh button, and "Try again"
// read like a button but was plain text. Seen in the preview as Operations (no sample data for that request).
// Now: the normal page header (title + sub line + "+ New message"), a card that says what happened, and a real "Try again"
// button that calls loadMsgs() again (with a "Loading…" state). Display only; loading logic unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 914 · Messages: a proper error state with Try again */
(function(){ if(window.__914 || typeof window.loadMsgs !== 'function') return; window.__914 = 1;
  var paint = function(){ var v = document.getElementById('v-msgs'); if(!v) return; var e = v.querySelector(':scope > .empty');
    if(!e || v.children.length !== 1 || !/Could not load messages/.test(e.textContent)) return;
    v.innerHTML = '<div class="lead row"><div class="grow"><h1>Messages</h1><div class="mute small">Notices and replies · one row per notice, tap it to see each person’s status</div></div>' +
      (typeof msgNew === 'function' ? '<button class="btn teal sm" onclick="msgNew()">+ New message</button>' : '') + '</div>' +
      '<div class="ui-card" role="alert" style="margin-top:12px"><div class="ui-ch"><h2>Messages did not load</h2></div>' +
      '<div class="ui-sub" style="margin-bottom:10px">The list could not be read just now (slow or no connection). Nothing was changed.</div>' +
      '<button type="button" class="btn teal sm" id="msg914">Try again</button></div>';
    var b = document.getElementById('msg914'); if(b) b.onclick = function(){ b.disabled = true; b.textContent = 'Loading…'; Promise.resolve(loadMsgs()).then(function(){ setTimeout(paint, 50); var x = document.getElementById('msg914'); if(x){ x.disabled = false; x.textContent = 'Try again'; } }); }; };
  var l0 = window.loadMsgs; window.loadMsgs = function(){ var r = l0.apply(this, arguments); Promise.resolve(r).then(function(){ setTimeout(paint, 0); }); return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
