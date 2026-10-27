// 1340: (Misty, 27 Oct 13:36) Partner access — management panel. Partners (e.g. "Jinan – Dr. Spring") sign in at
//   https://app.cupofenglishatph.com/partner/ with their own username + password and see only their own referred students
//   (lessons & package, upcoming classes, CEFR journey, monthly reports sent to parents, attendance) and the teachers' open times.
//   This patch adds, for management only, a "Partner access" button on Students that opens a panel to create a partner login,
//   reset its password, choose which partner source(s) it covers, deactivate it and see the last sign-in. Data: edge function
//   coe-partner (Supabase only; partners never touch Google). Passwords are never shown again after saving.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1340 · Partner access (management) */
(function(){
  if(window.__1340) return; window.__1340 = 1;
  var URLP = 'https://app.cupofenglishatph.com/partner/', P = { acc: [], src: [], more: false, edit: null, pw: '', busy: 0, err: '' };
  var e = function(x){ return typeof esc === 'function' ? esc(x) : String(x == null ? '' : x).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function call(op, b){ return fetch(FAST_URL + '-partner', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ op: op, token: TOKEN }, b || {})) }).then(function(r){ return r.json(); }); }
  function when(t){ if(!t) return 'never'; var d = new Date(t); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
  function gen(){ var a = 'abcdefghjkmnpqrstuvwxyz23456789', o = '', r = new Uint32Array(10); crypto.getRandomValues(r); for(var k = 0; k < 10; k++) o += a[r[k] % a.length]; return o; }
  function paint(){
    var E = P.edit, srcs = P.src.filter(function(x){ return P.more || x.partnerLike || (E && E.sources.indexOf(x.source) > -1); });
    var h = '<h1>Partner access</h1><div class="mute small">Partners sign in at <b>' + e(URLP) + '</b> and see only their own students (lessons left, classes, level, reports sent to parents, attendance) and the teachers’ open times. No money, no teacher pay, no other families. Works in mainland China (no Google).</div>'
      + '<div class="row" style="gap:8px;margin-top:10px"><button class="btn ghost sm" onclick="paCopyUrl()">Copy partner link</button><button class="btn teal sm" onclick="paEdit()">+ New partner login</button></div>';
    if(E){
      h += '<div class="card" style="margin-top:14px;padding:14px"><h2 style="margin-top:0">' + (E.id ? 'Edit ' + e(E.username) : 'New partner login') + '</h2>'
        + '<label>Username <span class="mute small">(what the partner types · e.g. jinanpartner)</span></label><input id="paU" class="in-t" value="' + e(E.username) + '" autocapitalize="off" spellcheck="false" oninput="PA_E().username=this.value.trim().toLowerCase()"' + (E.id ? ' disabled' : '') + '>'
        + '<label>Name shown to the partner</label><input id="paN" class="in-t" value="' + e(E.display) + '" oninput="PA_E().display=this.value" placeholder="Dr. Spring (Jinan)">'
        + '<label>Partner source <span class="mute small">(the Source written in DATABASE / ACTIVE · the partner sees exactly these students)</span></label><div style="max-height:220px;overflow:auto;border:1px solid var(--line);border-radius:12px;padding:6px 10px">'
        + srcs.map(function(x){ var on = E.sources.indexOf(x.source) > -1; return '<label class="check" style="margin:4px 0"><input type="checkbox" ' + (on ? 'checked ' : '') + 'onchange="paSrc(this.checked, decodeURIComponent(\'' + encodeURIComponent(x.source).replace(/'/g, '%27') + '\'))"><span>' + e(x.source) + ' <span class="mute small">· ' + x.students + ' student' + (x.students === 1 ? '' : 's') + (x.active ? ' · ' + x.active + ' active' : '') + '</span></span></label>'; }).join('')
        + '</div><button class="btn ghost sm" style="margin-top:6px" onclick="paMore()">' + (P.more ? 'Show partners only' : 'Show all sources (students, family referrals)') + '</button>'
        + '<label>' + (E.id ? 'New password <span class="mute small">(leave empty to keep the current one · a new one signs the partner out)</span>' : 'Password') + '</label><div class="row" style="gap:8px"><input id="paP" class="in-t grow" value="' + e(P.pw) + '" autocomplete="new-password" oninput="PA_PW(this.value)" placeholder="at least 8 characters"><button class="btn ghost sm" onclick="paGen()">Make one</button></div>'
        + (P.err ? '<div class="small" style="color:#B42318;margin-top:8px">' + e(P.err) + '</div>' : '')
        + '<div class="row" style="gap:8px;margin-top:12px"><button class="btn teal grow" id="paGo" onclick="paSave()"' + (P.busy ? ' disabled' : '') + '>' + (P.busy ? 'Saving…' : 'Save') + '</button><button class="btn ghost" onclick="paCancel()">Cancel</button></div></div>';
    }
    h += '<h2>Partner logins</h2>' + (P.acc.length ? P.acc.map(function(a){ return '<div class="card" style="padding:12px 14px;margin-bottom:8px' + (a.active ? '' : ';opacity:.6') + '"><div class="row" style="gap:8px"><div class="grow"><b>' + e(a.display_name || a.username) + '</b> <span class="mute small">· ' + e(a.username) + (a.active ? '' : ' · switched off') + '</span><div class="small mute">' + e((a.sources || []).join(' · ')) + '</div><div class="small mute">Last sign-in: ' + e(when(a.last_login)) + ' · password set ' + e(when(a.pw_set_at)) + '</div></div>'
      + '<button class="btn ghost sm" onclick="paEdit(\'' + a.id + '\')">Edit / reset</button><button class="btn ghost sm" onclick="paActive(\'' + a.id + '\',' + (a.active ? 'false' : 'true') + ')">' + (a.active ? 'Switch off' : 'Switch on') + '</button></div></div>'; }).join('') : '<div class="mute small">No partner logins yet.</div>');
    var sb = document.getElementById('sheetBody'); if(sb && sb.querySelector('#pa1340')) sb.querySelector('#pa1340').innerHTML = h;
  }
  window.PA_E = function(){ return P.edit; }; window.PA_PW = function(v){ P.pw = v; };
  window.paSrc = function(on, x){ var E = P.edit; if(!E) return; var k = E.sources.indexOf(x); if(on && k < 0) E.sources.push(x); if(!on && k > -1) E.sources.splice(k, 1); };
  window.paMore = function(){ P.more = !P.more; paint(); };
  window.paGen = function(){ P.pw = gen(); var el = document.getElementById('paP'); if(el) el.value = P.pw; };
  window.paCancel = function(){ P.edit = null; P.pw = ''; P.err = ''; paint(); };
  window.paEdit = function(id){ var a = id && P.acc.find(function(x){ return x.id === id; }); P.edit = a ? { id: a.id, username: a.username, display: a.display_name || '', sources: (a.sources || []).slice() } : { id: '', username: '', display: '', sources: [] }; P.pw = ''; P.err = ''; paint(); };
  window.paCopyUrl = function(){ try{ navigator.clipboard.writeText(URLP).then(function(){ toast('Copied · ' + URLP); }, function(){ toast(URLP); }); }catch(x){ toast(URLP); } };
  window.paSave = function(){ var E = P.edit; if(!E || P.busy) return; P.busy = 1; P.err = ''; paint(); var pw = P.pw;
    call('pSave', { id: E.id || undefined, username: E.username, display: E.display, sources: E.sources, password: pw }).then(function(r){ P.busy = 0;
      if(!r || !r.ok){ P.err = (r && (r.msg || r.error)) || 'Not saved'; paint(); return; }
      var u = E.username; P.edit = null; P.pw = ''; toast(pw ? 'Saved · send ' + u + ' and the password to the partner now (it is not shown again)' : 'Saved');
      if(pw) try{ navigator.clipboard.writeText('CupOfEnglish 合作伙伴专区 Partner portal\n' + URLP + '\n用户名 Username: ' + u + '\n密码 Password: ' + pw).then(function(){ toast('Saved · link, username and password copied · paste them to the partner on WeChat'); }, function(){}); }catch(x){}
      load(); }).catch(function(){ P.busy = 0; P.err = 'No connection · try again'; paint(); }); };
  window.paActive = function(id, on){ call('pActive', { id: id, active: on }).then(function(){ load(); }); };
  function load(){ return call('pList').then(function(r){ if(r && r.ok){ P.acc = r.accounts || []; P.src = r.sources || []; } paint(); }).catch(function(){ paint(); }); }
  window.paOpen = function(){ openSheet('<div id="pa1340"><h1>Partner access</h1><div class="sk" style="height:180px"></div></div>'); try{ $('sheet').classList.add('wide'); }catch(x){} P.edit = null; P.pw = ''; load(); };
  function btn(){ try{ if(typeof D === 'undefined' || !D || !D.mgr) return; var v = document.getElementById('v-astudents'); if(!v) return; var ld = v.querySelector('.lead'); if(!ld || ld.querySelector('#pa1340b')) return;
      ld.insertAdjacentHTML('beforeend', '<button id="pa1340b" type="button" class="btn ghost sm" style="margin-left:auto" onclick="paOpen()">Partner access</button>'); }catch(x){} }
  var r0 = window.renderAStudents; if(typeof r0 === 'function') window.renderAStudents = function(){ var r = r0.apply(this, arguments); btn(); return r; };
  btn();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
