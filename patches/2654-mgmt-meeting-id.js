// 2654 (Misty 21 Nov 21:34 "on SCHEDULE we still can't add a MEETING ID unless it is scheduled today · raised before")
//   Management's class sheet (Schedule › tap a class, any day) gets "+ Meeting ID" / "Meeting ID … · Edit".
//   Saving sets it on every upcoming class of that student (next 180 days), whoever the teacher is.
//   Database 2654: coe_meet_from_write / coe_meet_takeover accept management saves for any teacher's classes (teachers: still only their own).
const JS = `<script id="b2654">
(function(){ if(window.__2654) return; window.__2654 = 1;
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var css = document.createElement('style'); css.textContent = '.mt2654{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px;padding:10px 12px;border-radius:12px;background:#F2FBFB;border:1px solid #D5ECEC}.mt2654.add{background:#FCEFE6;border-color:#F3D9C6}.mt2654 b{font-size:14px;color:#2B2253}.mt2654 .grow{flex:1}';
  document.head.appendChild(css);
  var allEv = function(){ var L = []; try{ ['', 'stu', 'tw', 'sw'].forEach(function(s){ L = L.concat(evList(s) || []); }); }catch(e){} try{ L = L.concat((D && D.schedule) || []); }catch(e){} return L; };
  var known = function(code){ var x = allEv().find(function(e){ return e && e.code === code && e.meet; }); return x ? String(x.meet) : ''; };
  window.mt2654 = function(code){ var c = allEv().find(function(e){ return e && e.code === code; }) || {}, m = known(code);
    openSheet('<h1>Meeting ID</h1><div class="mute small">' + E(c.student || code) + ' · ' + E(code) + '</div><label>Tencent / VooV meeting ID</label><input id="mt54" class="in-t num" inputmode="numeric" placeholder="123 456 789" value="' + E(m) + '">'
      + '<div class="small mute" style="margin-top:8px">Sets the meeting ID on every upcoming class with ' + E(c.student || 'this student') + ', whoever the teacher is. The teacher sees it in her app and in the evening email.</div>'
      + '<button class="btn block" id="mt54Go" style="margin-top:16px" onclick="mt2654Save(\\'' + E(code) + '\\')">Save meeting ID</button>');
    setTimeout(function(){ var i = document.getElementById('mt54'); if(i){ i.focus(); i.select(); } }, 250); };
  window.mt2654Save = async function(code){ var v = ((document.getElementById('mt54') || {}).value || '').replace(/\\D/g, '');
    if(v.length < 9 || v.length > 12) return toast('A meeting ID has 9 to 12 digits');
    if(known(code).replace(/\\D/g, '') === v){ closeSheet(); return; }
    var b = document.getElementById('mt54Go'); if(b){ b.disabled = true; b.textContent = 'Saving…'; }
    var shown = v.length === 9 ? v.slice(0, 3) + ' ' + v.slice(3, 6) + ' ' + v.slice(6) : v;
    try{ var r = await (typeof fastWrite === 'function' ? fastWrite('tSetMeet', [TOKEN, code, v]) : api('tSetMeet', TOKEN, code, v)); if(!r || !r.ok) throw r;
      allEv().forEach(function(e){ if(e && e.code === code && !e.cancelled && new Date(e.end || e.start) > Date.now() - 2 * 3600e3) e.meet = shown; });
      closeSheet(); toast('Meeting ID ' + shown + ' saved for all upcoming classes'); try{ if(VIEW === 'schedule' && typeof loadSchedule === 'function') loadSchedule(0, true); }catch(x){} }
    catch(e){ if(b){ b.disabled = false; b.textContent = 'Save meeting ID'; } toast((e && (e.msg || e.error)) || 'Meeting ID not saved. Check your internet and try again.'); } };
  var _ce = window.classEdit; if(typeof _ce !== 'function') return;
  window.classEdit = async function(i, src){ var r = await _ce.apply(this, arguments);
    try{ if(typeof D === 'undefined' || !D || !D.mgr) return r; var e = evList(src || '')[i]; if(!e || e.cancelled) return r;
      var code = String(e.code || (String(e.title || '').match(/ST-\\d{4}-\\d{3}/i) || [])[0] || '').toUpperCase(); if(!/^ST-\\d{4}-\\d{3}$/.test(code)) return r;
      var sb = document.getElementById('sheetBody'); if(!sb || sb.querySelector('.mt2654')) return r;
      var m = e.meet || known(code), h = '<div class="mt2654' + (m ? '' : ' add') + '"><span class="grow">' + (m ? '<span class="small mute">Meeting ID</span> <b>' + E(m) + '</b>' : '<b>No meeting ID yet</b> <span class="small mute">the teacher\\'s evening email shows a blank</span>') + '</span><button class="btn sm ' + (m ? 'ghost' : 'teal') + '" type="button" onclick="mt2654(\\'' + code + '\\')">' + (m ? 'Edit' : '+ Meeting ID') + '</button></div>';
      var sub = sb.querySelector('h1 + .mute.small'); if(sub) sub.insertAdjacentHTML('afterend', h); else sb.insertAdjacentHTML('afterbegin', h);
    }catch(x){ console.warn('2654', x); } return r; };
})();
</script>
</body>`;
const fs = require('fs'); const file = process.argv[2]; let h = fs.readFileSync(file, 'utf8');
if (h.includes('id="b2654"')) throw new Error('already');
const i = h.lastIndexOf('</body>'); h = h.slice(0, i) + JS + h.slice(i + 7); fs.writeFileSync(file, h);
require('../tools/lib.js')(file, []);
