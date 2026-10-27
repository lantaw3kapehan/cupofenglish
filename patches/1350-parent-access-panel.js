// 1350: (Misty, 27 Oct 14:07) Parent / student access — management panel. Parents (mostly in mainland China, on phones) sign in at
//   https://app.cupofenglishatph.com/student/ with the student's ST code + the child's English name (Misty's rule; not case-sensitive)
//   and see only their own child: next class, lessons left / valid until, renewal reminder, schedule, homework & class notes (with a
//   "done" tick), level journey, monthly reports sent to parents, attendance. No prices, payments, contact details or other students.
//   Data: edge function coe-student (Supabase only, never Google). Protections: 5 wrong tries per code → 15 min lock, 30 per connection
//   per hour, 30-day sessions, sign-ins logged. Parents may set their own password (the English name then stops working).
//   This patch adds, for management only, a "Parent access" button beside "Partner access" on Students: per student access on/off,
//   last sign-in, clear an own password, and a copyable WeChat message (Chinese + English) for Ops to send the parents.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1350 · Parent access (management) */
(function(){
  if(window.__1350) return; window.__1350 = 1;
  var URLS = 'https://app.cupofenglishatph.com/student/', P = { list: [], q: '', all: false, busy: {} };
  var e = function(x){ return typeof esc === 'function' ? esc(x) : String(x == null ? '' : x).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function call(op, b){ return fetch(FAST_URL + '-student', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ op: op, token: TOKEN }, b || {})) }).then(function(r){ return r.json(); }); }
  function when(t){ if(!t) return 'never'; var d = new Date(t); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
  function msg(x){ var n = x.name || '孩子', cn = x.cn ? x.cn : n;
    return '【CupOfEnglish 一杯英语 · 家长专区 Parent portal】\n' + cn + '家长您好！现在可以在手机上随时查看孩子的课表、课后作业、课堂反馈和月度学习报告。\n'
      + '链接 Link：' + URLS + '\n学号 Student code：' + x.code + '\n'
      + (x.own ? '密码 Password：您已设置的新密码（如忘记请联系我们重置）\n' : '密码 Password：孩子的英文名 ' + n + '（不区分大小写 · not case-sensitive）\n')
      + '建议在微信中直接点击链接打开；登录后30天内无需再次登录。\n\n'
      + 'Hello! You can now see ' + n + '\'s classes, homework, class notes and monthly reports on your phone. Open the link and sign in with the student code and ' + (x.own ? 'the password you set.' : 'your child\'s English name.'); }
  function rows(){ var q = P.q.trim().toLowerCase();
    var L = P.list.filter(function(x){ return (P.all || x.enrolled || x.last) && (!q || [x.code, x.name, x.cn].join(' ').toLowerCase().indexOf(q) > -1); });
    var n = L.length; L = L.slice(0, 60);
    return (L.length ? L.map(function(x){ var b = P.busy[x.code];
      return '<div class="card" style="padding:12px 14px;margin-bottom:8px' + (x.access ? '' : ';opacity:.65') + '"><div class="row" style="gap:8px;flex-wrap:wrap"><div class="grow" style="min-width:180px"><b>' + e(x.name || '—') + '</b>' + (x.cn ? ' <span class="small">' + e(x.cn) + '</span>' : '') + ' <span class="mute small">· ' + e(x.code) + (x.enrolled ? '' : ' · not enrolled') + '</span>'
        + '<div class="small mute">' + (x.access ? 'Access on' : 'Access switched off') + ' · last sign-in ' + e(when(x.last)) + (x.logins ? ' · ' + x.logins + ' sign-in' + (x.logins === 1 ? '' : 's') : '') + (x.own ? ' · parent set own password' : ' · password = English name') + '</div></div>'
        + '<button class="btn teal sm" onclick="psCopy(\'' + x.code + '\')">Copy WeChat message</button>'
        + (x.own ? '<button class="btn ghost sm" ' + (b ? 'disabled ' : '') + 'onclick="psClear(\'' + x.code + '\')">Clear own password</button>' : '')
        + '<button class="btn ghost sm" ' + (b ? 'disabled ' : '') + 'onclick="psActive(\'' + x.code + '\',' + (x.access ? 'false' : 'true') + ')">' + (x.access ? 'Switch off' : 'Switch on') + '</button></div></div>'; }).join('') : '<div class="mute small">No students found.</div>')
      + (n > 60 ? '<div class="mute small" style="margin-top:6px">Showing 60 of ' + n + ' · search to find a student.</div>' : ''); }
  function paint(){ var sb = document.getElementById('sheetBody'), el = sb && sb.querySelector('#ps1350'); if(!el) return;
    var on = P.list.filter(function(x){ return x.last; }).length;
    el.innerHTML = '<h1>Parent access</h1><div class="mute small">Parents sign in at <b>' + e(URLS) + '</b> with the <b>ST code</b> and the <b>child’s English name</b> (not case-sensitive). They see only their own child: next class, lessons left, schedule, homework &amp; class notes, level, reports sent to parents, attendance. No prices, payments, contact details or other students. Works in mainland China (no Google). 5 wrong tries lock that code for 15 minutes.</div>'
      + '<div class="row" style="gap:8px;margin-top:10px;flex-wrap:wrap"><input id="psQ" class="in-t grow" style="min-width:200px" placeholder="Search name, Chinese name or ST code" value="' + e(P.q) + '" oninput="PS_Q(this.value)"><label class="check" style="margin:0"><input type="checkbox" ' + (P.all ? 'checked ' : '') + 'onchange="PS_ALL(this.checked)"><span>Show past students</span></label></div>'
      + '<div class="small mute" style="margin:8px 0">' + on + ' famil' + (on === 1 ? 'y has' : 'ies have') + ' signed in so far.</div><div id="psL">' + rows() + '</div>'; }
  window.PS_Q = function(v){ P.q = v; var L = document.getElementById('psL'); if(L) L.innerHTML = rows(); };
  window.PS_ALL = function(v){ P.all = !!v; var L = document.getElementById('psL'); if(L) L.innerHTML = rows(); };
  window.psCopy = function(code){ var x = P.list.find(function(y){ return y.code === code; }); if(!x) return; var t = msg(x);
    try{ navigator.clipboard.writeText(t).then(function(){ toast('Copied · paste it to ' + (x.name || code) + '’s parents on WeChat'); }, function(){ prompt('Copy this message', t); }); }catch(z){ prompt('Copy this message', t); } };
  window.psActive = function(code, on){ P.busy[code] = 1; paint(); call('sActive', { code: code, active: on }).then(function(r){ delete P.busy[code]; if(!r || !r.ok) toast('Not saved · try again'); load(); }).catch(function(){ delete P.busy[code]; toast('No connection · try again'); paint(); }); };
  window.psClear = function(code){ P.busy[code] = 1; paint(); call('sClearPw', { code: code }).then(function(r){ delete P.busy[code]; toast(r && r.ok ? 'Cleared · the English name works again (the family is signed out)' : 'Not saved · try again'); load(); }).catch(function(){ delete P.busy[code]; toast('No connection · try again'); paint(); }); };
  function load(){ return call('sList').then(function(r){ if(r && r.ok) P.list = r.students || []; paint(); }).catch(function(){ paint(); }); }
  window.psOpen = function(){ openSheet('<div id="ps1350"><h1>Parent access</h1><div class="sk" style="height:180px"></div></div>'); try{ $('sheet').classList.add('wide'); }catch(x){} P.q = ''; load(); };
  function btn(){ try{ if(typeof D === 'undefined' || !D || !D.mgr) return; var v = document.getElementById('v-astudents'); if(!v) return; var ld = v.querySelector('.lead'); if(!ld || ld.querySelector('#ps1350b')) return;
      var pa = ld.querySelector('#pa1340b'), h = '<button id="ps1350b" type="button" class="btn ghost sm" style="margin-left:' + (pa ? '8px' : 'auto') + '" onclick="psOpen()">Parent access</button>';
      if(pa) pa.insertAdjacentHTML('afterend', h); else ld.insertAdjacentHTML('beforeend', h); }catch(x){} }
  var r0 = window.renderAStudents; if(typeof r0 === 'function') window.renderAStudents = function(){ var r = r0.apply(this, arguments); btn(); return r; };
  btn();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
