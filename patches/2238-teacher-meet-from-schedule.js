// 2238 (Teacher Mayi, 14 Nov): "+ Meeting ID" was only on the Today screen, so a student with no class today
// (Max, Yoyo: next class tomorrow) could not get a meeting ID until the class day, and the evening email showed a blank.
// · Teacher Schedule (list) and the Month day list: every upcoming class has "+ Meeting ID" (or "ID 123 456 789 · Edit").
//   It opens the same Meeting ID sheet and saves the same way (tSetMeet: all upcoming classes with that student).
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="d2238">#v-tsched a.m38{margin-left:6px;font-size:12.5px;font-weight:600;color:#00737B;cursor:pointer;white-space:nowrap}#v-tsched a.m38.add{color:#B5531F}</style>
<script id="x2238">
(function(){
  if(window.__x2238) return; window.__x2238 = 1;
  const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const all = () => [].concat((typeof D !== 'undefined' && D && D.schedule) || [], (typeof TS !== 'undefined' && TS && TS.events) || []);
  const known = code => { const x = all().find(e => e.code === code && e.meet); return x ? String(x.meet) : ''; };
  window.m38Link = e => { try{ if(!e || !e.code || e.cancelled || new Date(e.end || e.start) < Date.now() || (typeof D !== 'undefined' && D && D.mgr)) return '';
    const m = e.meet || known(e.code);
    return ' <a class="m38' + (m ? '' : ' add') + '" onclick="event.stopPropagation();m38Sheet(\'' + E(e.code) + '\')">' + (m ? 'ID ' + E(m) + ' · Edit' : '+ Meeting ID') + '</a>'; }catch(x){ return ''; } };
  window.m38Sheet = code => { const c = all().find(e => e.code === code) || { code: code }, m = known(code);
    openSheet('<h1>Meeting ID</h1><div class="mute small">' + E(c.student || code) + ' · ' + E(code) + '</div>' +
      '<label>VooV meeting ID</label><input id="mtI" class="in-t num" inputmode="numeric" placeholder="123 456 789" value="' + E(m) + '">' +
      '<div class="small mute" style="margin-top:8px">Changes the meeting ID on all your upcoming classes with ' + E(c.student || 'this student') + '. Management sees the new ID in Schedule. Nothing else about the class changes.</div>' +
      '<button class="btn block" id="mtGo" style="margin-top:16px" onclick="m38Send(\'' + E(code) + '\')">Save meeting ID</button>');
    setTimeout(() => { const i = document.getElementById('mtI'); if(i){ i.focus(); i.select(); } }, 250); };
  window.m38Send = async code => { const v = ((document.getElementById('mtI') || {}).value || '').replace(/\D/g, '');
    if(v.length < 9 || v.length > 12) return toast('A meeting ID has 9 to 12 digits');
    if(known(code).replace(/\D/g, '') === v){ closeSheet(); return; }
    const L = all().filter(e => e.code === code), old = L.map(e => e.meet), b = document.getElementById('mtGo'); if(b){ b.disabled = true; b.textContent = 'Saving…'; }
    const put = val => { L.forEach((e, i) => { e.meet = typeof val === 'function' ? val(i) : val; }); try{ store('set', KEY_D, JSON.stringify(D)); }catch(x){} try{ render(); }catch(x){} try{ if(VIEW === 'tsched') tsPaint(); }catch(x){} };
    try{ const r = await api('tSetMeet', TOKEN, code, v); if(!r || !r.ok) throw r; closeSheet(); put(r.meet || v); toast('Meeting ID ' + (r.meet || v) + ' saved'); }
    catch(e){ put(i => old[i]); if(b){ b.disabled = false; b.textContent = 'Save meeting ID'; } toast((e && e.msg) || 'Meeting ID not saved. Check your internet and try again.'); } };
})();
</script>
`;
lib(file, [
 ["<span class=\"sv-n\"><b>${esc(e.student || e.title)}</b> <span class=\"mute\">${esc([e.code, e.book].filter(Boolean).join(' · '))}</span>${e.type?",
  "<span class=\"sv-n\"><b>${esc(e.student || e.title)}</b> <span class=\"mute\">${esc([e.code, e.book].filter(Boolean).join(' · '))}</span>${window.m38Link ? m38Link(e) : ''}${e.type?"],
 ["'</b></span><span class=\"bk\">' + (e.cancelled ? 'cancelled' : E(e.book || '')) + '</span></div>'",
  "'</b>' + (window.m38Link ? m38Link(e) : '') + '</span><span class=\"bk\">' + (e.cancelled ? 'cancelled' : E(e.book || '')) + '</span></div>'"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
