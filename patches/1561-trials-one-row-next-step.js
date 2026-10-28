// 1561 · Trials: one status row, a next step on every trial, analytics in Results (29 Oct 2026, Misty's audit: correctness and daily use
// first, fewer clicks, less text).
// · One row: To send · No report yet · Follow up · Being made · Enrolled · Not enrolling · All · Results, with Source as a small menu at the
//   end of the same row (was a second row of chips). Same filters, same counts, same handlers (tpF / tpSrcF).
// · Phone: a booked trial's chip and each trial's level / status chip wrap under the name (the name and teacher were squeezed to one word
//   per line).
// · Results: the 45-day / year / all-time cards, tiles, by-teacher and CEFR charts now show only on Results (they sat under the list).
//   Tapping a tile there still opens that list.
// · Next step on each trial: one line "Next · what · who · when" (late in red). Worked out from the trial when nobody set one:
//     no report → Write the report · the teacher · day after the trial      report ready → Send the report · Operations · report day
//     report sent → First follow-up · Operations · 2 days after sending     follow-up set → Follow up again · Operations · 3 days later
//     "Check" (1560) → Check the booking · Operations · today               being made → Report being made (no owner)
//     enrolled / not enrolling → no line.
//   Tap the line to set it (what, who, date; or back to automatic). Saved in docs `sys:trial_next` (new row, coe-trials v11 setNext),
//   keyed by the report label or trial date + first name. Follow-ups (mgmtTrialFu), reports and enquiries are not changed.
require('../tools/lib.js')(process.argv[2], [
  ["const tabs = [['send', 'To send'], ['follow', 'Follow up'], ['enrolled', 'Enrolled'], ['not', 'Not enrolling'], ['making', 'Being made'], ['wait', 'No report yet'], ['all', 'All']];",
   "const tabs = [['send', 'To send'], ['wait', 'No report yet'], ['follow', 'Follow up'], ['making', 'Being made'], ['enrolled', 'Enrolled'], ['not', 'Not enrolling'], ['all', 'All']];"],
  ["chips(t) + '</div></div>' +", "chips(t) + '</div>' + (window.trNext1561 ? trNext1561(t) : '') + '</div>' +"]
]);
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="tp61css">
#v-trials:not(.tp-res) #tp2fun{display:none!important}
#v-trials.tp-res #tpList,#v-trials.tp-res #tpAt,#v-trials.tp-res #tpBk,#v-trials.tp-res #tp61src{display:none!important}
#v-trials.tp-res #tp2fun{margin-top:30px!important}
#v-trials #tpTabs>#tpSrcK.sk2{display:none!important}
#v-trials #tp61src{margin-left:auto;font:inherit;font-size:13.5px;font-weight:600;color:var(--ink,#2B2253);padding:6px 30px 6px 12px;border:1px solid var(--line,#E3E5EC);border-radius:999px;background:#fff;max-width:200px}
#v-trials .nx61{display:inline-flex;flex-wrap:wrap;gap:4px;align-items:baseline;margin-top:6px;font-size:13px;color:#4C4868;cursor:pointer;border-radius:8px;padding:2px 6px;margin-left:-6px}
#v-trials .nx61:hover,#v-trials .nx61:focus-visible{background:#F1F0F6}
#v-trials .nx61 b{font-weight:600;color:var(--ink,#2B2253)}
#v-trials .nx61 .w{color:#6F6B85}
#v-trials .nx61.late .w:last-child{color:#B4442F;font-weight:600}
#v-trials .nx61.auto b:after{content:''}
@media(max-width:700px){#v-trials #tp61src{margin-left:0}#v-trials .tpb{flex-wrap:wrap}#v-trials .tpb>.chip{margin-left:56px;max-width:calc(100% - 56px);white-space:normal;height:auto}#v-trials #tpList .rp-row{flex-wrap:wrap}#v-trials #tpList .rp-row>.grow{flex:1 1 calc(100% - 56px)}#v-trials #tpList .rp-row>.grow~*{margin-left:auto}#v-trials #tpList .rp-row>.grow+*{margin-left:52px}}
</style>
<script>
/* 1561 · Trials: one status row · Results · next step */
(function(){ if(window.__1561) return; window.__1561 = 1;
  var RES = 0, NX = null, KEY = 'coe.trNext';
  try{ NX = JSON.parse(localStorage.getItem(KEY) || 'null'); }catch(e){}
  var nx = function(){ var R = window.trRecon1560 && trRecon1560.data(); if(R && R.next && (!NX || (R.at || 0) > (NX._at || 0))){ NX = Object.assign({}, R.next, { _at: R.at || 0 }); try{ localStorage.setItem(KEY, JSON.stringify(NX)); }catch(e){} } return NX || {}; };
  var today = function(){ return new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); };
  var addD = function(d, n){ var t = Date.parse(String(d).slice(0, 10) + 'T00:00:00Z'); return isNaN(t) ? '' : new Date(t + n * 864e5).toISOString().slice(0, 10); };
  var first = function(n){ return String(n || '').trim().split(/\s+/)[0].toLowerCase(); };
  var keyOf = function(t){ return t.label ? 'r:' + t.label : 'w:' + t.date + '|' + first(t.student); };
  var esc_ = function(x){ return typeof esc === 'function' ? esc(x) : String(x == null ? '' : x).replace(/[&<>"']/g, function(c){ return '&#' + c.charCodeAt(0) + ';'; }); };
  var tch = function(t){ var n = String(t.teacher || '').replace(/^teacher\s+/i, '').trim(); return n ? n.charAt(0).toUpperCase() + n.slice(1) : 'Teacher'; };
  function auto(t){ var F = (typeof TFU !== 'undefined' && TFU) || {}, f = F[t.date + '|' + first(t.student)], rc = t._rc;
    if(!t.label){ if(rc && (rc.k === 'check' || rc.k === 'cancelled')) return { what: 'Check the booking', owner: 'Operations', due: today() };
      return { what: 'Write the report', owner: tch(t), due: addD(t.date, 1) }; }
    if((f && f.st === 'Enrolling') || /^(yes|y|enrolled)/i.test(String(t.enrolled || '')) || (f && f.st === 'Not now')) return null;
    if(t.status === 'Ready') return { what: 'Send the report', owner: 'Operations', due: String(t.sub || t.date || '').slice(0, 10) };
    if(t.status === 'Redo asked') return { what: 'Redo the report', owner: tch(t), due: addD(String((t.redo && t.redo.at) || t.date), 1) };
    if(t.status !== 'Sent') return { what: 'Report being made', owner: '', due: '' };
    if(f && f.st) return { what: 'Follow up again', owner: 'Operations', due: addD(String(f.at || '').slice(0, 10) || t.date, 3) };
    return { what: 'First follow-up', owner: 'Operations', due: addD(String((t.sent && t.sent.at) || t.date).slice(0, 10), 2) }; }
  function when(d){ if(!d) return ''; var n = Math.round((Date.parse(d) - Date.parse(today())) / 864e5);
    if(n === 0) return 'today'; if(n === 1) return 'tomorrow'; if(n < 0) return -n === 1 ? '1 day late' : (-n) + ' days late';
    var x = new Date(d + 'T12:00:00'); return x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); }
  window.trNext1561 = function(t){ if(!t || RES) return ''; var k = keyOf(t), set = nx()[k], a = set && (set.what || set.owner || set.due) ? set : auto(t); if(!a) return '';
    var late = a.due && a.due < today(), parts = ['<span class="w">Next</span>', '<b>' + esc_(a.what || 'Next step') + '</b>'];
    if(a.owner) parts.push('<span class="w">' + esc_(a.owner) + '</span>'); if(a.due) parts.push('<span class="w">' + esc_(when(a.due)) + '</span>');
    return '<div class="nx61' + (late ? ' late' : '') + (set ? '' : ' auto') + '" role="button" tabindex="0" title="Set the next step" onclick="event.stopPropagation();nxOpen61(this)" onkeydown="if(event.key===\'Enter\'){event.stopPropagation();nxOpen61(this)}" data-k="' + esc_(k) + '" data-s="' + esc_(t.student) + '" data-t="' + esc_(tch(t)) + '">' + parts.join(' · ') + '</div>'; };
  var ED = null;
  window.nxOpen61 = function(el){ var k = el.dataset.k, cur = nx()[k] || {}, row = null;
    var T = (typeof TRL !== 'undefined' && TRL) || {}; (T.rows || []).concat(T.wait || []).some(function(t){ if(keyOf(t) === k){ row = t; return true; } return false; });
    var a = cur.what || cur.owner || cur.due ? cur : (row ? auto(row) : null) || {}; ED = { k: k, what: a.what || '', owner: a.owner || '', due: a.due || '', note: cur.note || '', set: !!(cur.what || cur.owner || cur.due) };
    var W = ['Send the report', 'First follow-up', 'Follow up again', 'Write the report', 'Book the first class', 'Check the booking'], O = ['Operations', 'Management', el.dataset.t || 'Teacher'];
    var chip = function(id, L, v){ return '<div class="skc" id="' + id + '" style="margin:6px 0 2px">' + L.map(function(x){ return '<button type="button" class="' + (x === v ? 'on' : '') + '" onclick="nxSet61(\'' + id + '\',this.textContent)">' + esc_(x) + '</button>'; }).join('') + '</div>'; };
    openSheet('<h1>Next step · ' + esc_(el.dataset.s || '') + '</h1>'
      + '<label>What</label>' + chip('nxW', W, ED.what) + '<input id="nxWi" class="in-t" value="' + esc_(ED.what) + '" oninput="ED61().what=this.value">'
      + '<label>Who</label>' + chip('nxO', O, ED.owner)
      + '<label>When</label><div class="row" style="gap:8px;align-items:center"><input id="nxD" class="in-t" type="date" value="' + esc_(ED.due) + '" oninput="ED61().due=this.value" style="max-width:200px">'
      + '<div class="skc">' + [['Today', 0], ['Tomorrow', 1], ['In 3 days', 3]].map(function(x){ return '<button type="button" onclick="nxDay61(' + x[1] + ')">' + x[0] + '</button>'; }).join('') + '</div></div>'
      + '<button class="btn teal block" id="nxGo" style="margin-top:14px" onclick="nxSave61()">Save</button>'
      + (ED.set ? '<button class="btn ghost block" style="margin-top:8px" onclick="nxSave61(1)">Back to automatic</button>' : '')); };
  window.ED61 = function(){ return ED || {}; };
  window.nxSet61 = function(id, v){ if(!ED) return; if(id === 'nxW'){ ED.what = v; var i = document.getElementById('nxWi'); if(i) i.value = v; } else ED.owner = v;
    document.querySelectorAll('#' + id + ' button').forEach(function(b){ b.classList.toggle('on', b.textContent === v); }); };
  window.nxDay61 = function(n){ if(!ED) return; ED.due = addD(today(), n); var d = document.getElementById('nxD'); if(d) d.value = ED.due; };
  window.nxSave61 = async function(clear){ if(!ED) return; var e = ED, b = document.getElementById('nxGo'); if(b && b.disabled) return; if(b) b.disabled = true;
    var item = clear ? null : { what: String(e.what || '').trim(), owner: e.owner, due: e.due, note: e.note || '' };
    if(item && !item.what && !item.owner && !item.due){ if(b) b.disabled = false; return toast('Choose what, who or when'); }
    var M = nx(), prev = M[e.k]; if(item) M[e.k] = Object.assign({}, item, { by: (D && D.me && D.me.name) || '' }); else delete M[e.k];
    try{ localStorage.setItem(KEY, JSON.stringify(M)); }catch(x){} closeSheet(); if(VIEW === 'trials') renderTP();
    try{ var r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, op: 'setNext', k: e.k }, item || { what: '', owner: '', due: '', note: '' })) }).then(function(x){ return x.json(); });
      if(!(r && r.ok)) throw r; toast(clear ? 'Next step: automatic' : 'Next step saved'); }
    catch(x){ if(prev) M[e.k] = prev; else delete M[e.k]; try{ localStorage.setItem(KEY, JSON.stringify(M)); }catch(y){} toast((x && x.msg) || 'Not saved · try again'); if(VIEW === 'trials') renderTP(); } };
  /* Results mode + one status row */
  var _f = window.tpF; window.tpF = function(f){ if(f === 'results'){ RES = 1; return renderTP(); } RES = 0; return _f.apply(this, arguments); };
  var _r = window.renderTP; window.renderTP = function(){ var r = _r.apply(this, arguments);
    try{ var el = document.getElementById('v-trials'), tabs = document.getElementById('tpTabs'); if(!el || !tabs) return r; el.classList.toggle('tp-res', !!RES);
      var seg = tabs.querySelector(':scope > .seg'); if(!seg) return r;
      if(RES) seg.querySelectorAll('button.on').forEach(function(b){ b.classList.remove('on'); });
      if(!seg.querySelector('[data-res]')) seg.insertAdjacentHTML('beforeend', '<button type="button" data-res="1" onclick="tpF(\'results\')">Results</button>');
      var rb = seg.querySelector('[data-res]'); rb.classList.toggle('on', !!RES);
      var K = document.getElementById('tpSrcK'), old = document.getElementById('tp61src'); if(old) old.remove();
      if(K){ var B = [].slice.call(K.querySelectorAll('button')), on = B.find(function(b){ return b.classList.contains('on'); }), cls = function(b){ return (String(b.className).match(/\b(pt|ref|coe|none)\b/) || [])[1]; };
        seg.insertAdjacentHTML('beforeend', '<select id="tp61src" aria-label="Source" onchange="tpSrc61(this.value)"><option value="">Source · all</option>' + B.map(function(b){ var k = cls(b), m = b.textContent.match(/^(.*?)\s*(\d+)\s*$/); return '<option value="' + k + '"' + (b === on ? ' selected' : '') + '>' + esc_(m ? m[1] + ' · ' + m[2] : b.textContent) + '</option>'; }).join('') + '</select>'); }
    }catch(e){ console.warn('tp61', e); } return r; };
  window.tpSrc61 = function(k){ var K = document.getElementById('tpSrcK'), on = K && K.querySelector('button.on'), cur = on ? (String(on.className).match(/\b(pt|ref|coe|none)\b/) || [])[1] : '';
    if(k === cur) return; tpSrcF(k || cur); };
  window.addEventListener('coe-trrecon', function(){ nx(); });
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') renderTP(); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1561 Trials: one status row, next step, Results');
