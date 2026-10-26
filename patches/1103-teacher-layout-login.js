// 1103: (Misty, 26 Oct 11:59 / 12:00) teacher screens · stage A — laptop-first layout, the narrow-window overlay, sign-in page.
// · Narrow-window overlay fixed: below 900 px wide (half a laptop screen, split screen, phones) the Excellence card was put
//   INSIDE the bottom navigation bar, which grew to ~400 px and covered half of the screen. The card now goes in the side
//   menu only when the side menu is really there (900 px and wider); on narrow windows the short Excellence chip shows in
//   the header again, as it was meant to.
// · Laptop side menu: compact and scrollable; the Excellence card is a slim summary (medal, level, place, score) so it does
//   not push the menu items away; the full card stays in Growth (tap the summary).
// · Small links the older contrast pass had recoloured on tinted boxes are checked again (darker, AA).
// · Sign-in page (everyone): labels you can read above the fields, Teacher / Management choice shows which is selected with
//   colour + outline + check, one solid teal "Sign in", a "Show" button for the password, visible keyboard focus, roomy on
//   phones. Same fields, same ids, same sign-in code — nothing different is sent.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["const sideOn = () => { const n = document.querySelector('nav'); return !!(n && n.offsetWidth >= 200 && isT()); };",
   "const sideOn = () => { const n = document.querySelector('nav'); return !!(n && n.offsetWidth >= 200 && n.offsetWidth < 420 && (!window.matchMedia || matchMedia('(min-width:900px)').matches) && isT()); };"],
  /* the contrast safety net (1102) re-checks text the older contrast pass (1007) recoloured, so the darker colour wins */
  ["var e = E[k]; if(e.dataset.k1101) continue;", "var e = E[k]; if(e.dataset.k1101 && e.dataset.c1007 !== '1') continue;"],
  ["root.querySelectorAll('span,b,i,em,small,strong,div,a,p,td,th,label,li,h3,h4,button')", "root.querySelectorAll('span,b,i,em,small,strong,div,a,p,td,th,label,li,h3,h4,button,u,mark,s')"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = `
/* narrow windows: never inside the bottom bar; the short header chip fits the header */
@media(max-width:899px){#kxSide{display:none!important}
 body.role-t header .who{min-width:0!important;flex:1 1 0!important;overflow:hidden!important}
 body.role-t header #hRank{display:block;min-width:0;overflow:hidden}
 body.role-t header #hRank .kxb{display:block!important;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
 body.role-t header:has(.kxb) #cmHead:not(.g){display:none!important}}
/* laptop side menu: compact, scrollable, slim Excellence summary */
@media(min-width:900px){
 nav{overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
 #navIn .ng{margin-top:10px!important}
 #kxSide{margin:12px 2px 6px!important;padding:10px 12px!important;border-radius:14px!important;box-shadow:none!important;background:#FBFAF7!important}
 #kxSide>div:nth-child(n+3):not(:last-child){display:none!important}
 #kxSide>div:nth-child(2){margin-top:6px!important;gap:10px!important}
 #kxSide>div:nth-child(2)>div:first-child{width:40px!important;height:40px!important}
 #kxSide>div:nth-child(2)>div:first-child>span{display:none}
 #kxSide>div:nth-child(2)>div:first-child>b{font-size:14px!important}
 #kxSide>div:nth-child(2) div[style*="font:800 19px"]{font-size:15px!important}
 #kxSide>div:last-child{margin-top:4px!important}
}
@media(min-width:900px) and (max-height:800px){ #navIn button{min-height:34px} nav{padding-top:84px!important} }
#v-books a:not(.btn){color:#005F67}
/* sign-in */
#login .lgcard{max-width:420px;margin-left:auto;margin-right:auto}
#login .acc button{min-height:48px;color:#2B2450;border:1px solid #CFCBDD;background:#fff;position:relative}
#login .acc button.on{background:#E3F4F5!important;border-color:#00707A!important;box-shadow:inset 0 0 0 1px #00707A!important;color:#00575F!important}
#login .acc button.on b::before{content:"✓ ";font-weight:700}
#login #lgMsg{color:#3A3556;text-align:center;margin:0 0 14px}
#login .l1103{display:block;font-size:.875rem;font-weight:600;color:#2B2450;margin:12px 0 6px}
#login .l1103:first-of-type{margin-top:0}
#login .in-t{min-height:48px;font-size:16px;color:#2B2450;border-color:#CFCBDD}
#login .in-t::placeholder{color:#6B6783}
#login .pw1103{position:relative}
#login .pw1103 .in-t{padding-right:76px;margin-top:0!important}
#login .pw1103 button{position:absolute;right:6px;top:50%;transform:translateY(-50%);min-height:36px;padding:0 12px;border:1px solid #CFCBDD;border-radius:10px;background:#fff;color:#2B2450;font-weight:600;font-size:.875rem;cursor:pointer}
#login .btn:not(.ghost){background:#00707A!important;border:1px solid #00707A!important;color:#fff!important;box-shadow:none!important;min-height:48px;font-size:16px}
#login .btn:not(.ghost):hover{background:#005E66!important}
#login .btn:not(.ghost):active{background:#004E55!important;transform:translateY(1px)}
#login .btn.ghost{background:#fff!important;border:1px solid #CFCBDD!important;color:#2B2450!important;box-shadow:none!important;min-height:44px}
#login #lgOps,#login .small.mute{color:#5E5A76!important}
#login :is(button,input,a):focus-visible{outline:3px solid rgba(0,112,122,.55)!important;outline-offset:2px!important}
@media(max-width:480px){#login .lgcard{padding:22px 16px!important;border-radius:20px!important}}
`;
const js = String.raw`
(function(){
  if(window.__1103) return; window.__1103 = 1;
  function login(){ try{
    var em = document.getElementById('em'), pw = document.getElementById('pw'), pw2 = document.getElementById('pw2'), otp = document.getElementById('otp'); if(!em || em.dataset.l1103) return; em.dataset.l1103 = '1';
    var lab = function(inp, txt){ if(!inp) return; var l = document.createElement('label'); l.className = 'l1103'; l.htmlFor = inp.id; l.textContent = txt; var host = inp.parentElement && inp.parentElement.classList.contains('pw1103') ? inp.parentElement : inp; host.parentElement.insertBefore(l, host); };
    var eye = function(inp){ if(!inp) return; var w = document.createElement('div'); w.className = 'pw1103'; w.style.marginTop = '0'; inp.parentElement.insertBefore(w, inp); w.appendChild(inp);
      var b = document.createElement('button'); b.type = 'button'; b.textContent = 'Show'; b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Show password');
      b.onclick = function(){ var on = inp.type === 'password'; inp.type = on ? 'text' : 'password'; b.textContent = on ? 'Hide' : 'Show'; b.setAttribute('aria-pressed', on ? 'true' : 'false'); b.setAttribute('aria-label', on ? 'Hide password' : 'Show password'); inp.focus(); };
      w.appendChild(b); };
    eye(pw); eye(pw2);
    lab(em, 'Email (Gmail)'); lab(pw, 'Password'); lab(otp, 'Code from the email'); lab(pw2, 'New password');
    [document.getElementById('accT'), document.getElementById('accM')].forEach(function(b){ if(!b) return; b.setAttribute('aria-pressed', b.classList.contains('on') ? 'true' : 'false'); });
  }catch(e){} }
  var _sm = window.setMode; if(typeof _sm === 'function') window.setMode = function(){ var r = _sm.apply(this, arguments); try{ ['accT', 'accM'].forEach(function(id){ var b = document.getElementById(id); if(b) b.setAttribute('aria-pressed', b.classList.contains('on') ? 'true' : 'false'); }); }catch(e){} return r; };
  login(); setTimeout(login, 800);
})();
`;
s = s.slice(0, i) + '<style id="d1103">/* 1103 · teacher layout + sign-in */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
