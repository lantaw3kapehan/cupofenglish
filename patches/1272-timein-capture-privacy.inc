<style id="st1272">
#cap1272{position:fixed;inset:0;z-index:2147483646;background:#F3F6F7;display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}
#cap1272 .c{background:#fff;border:2px solid #E8ECF0;border-radius:28px;padding:36px 40px;max-width:560px;width:100%;text-align:center;font-family:Inter,system-ui,sans-serif;color:#2B2450}
#cap1272 img{height:56px;width:auto;display:block;margin:0 auto 18px}
#cap1272 h2{font:400 30px 'Fredoka One',Inter,sans-serif;margin:0;color:#2B2253;border:0;padding:0}
#cap1272 h2:before,#cap1272 h2:after{content:none!important;display:none!important}
#cap1272 p{margin:12px 0 0;font-size:18px;line-height:1.5;color:#4C4868}
#cap1272 .n{font:400 64px 'Fredoka One',Inter,sans-serif;color:#00707A;margin-top:14px;min-height:72px}
body.cap1272 *:not(#cap1272):not(#cap1272 *){visibility:hidden!important}
</style>
<script>
/* 1272 · the screen picture never shows the app (pay rate, student phone numbers): a neutral cover while it is taken,
   and a 3-second countdown to bring VooV to the front */
(function(){
  if(window.__1272) return; window.__1272 = 1;
  var CAP = 0, logo = function(){ return (document.querySelector('#login img') || {}).src || ''; };
  function show(h, p, n){ var o = document.getElementById('cap1272'); if(!o){ o = document.createElement('div'); o.id = 'cap1272'; o.setAttribute('role', 'status'); o.setAttribute('aria-live', 'polite'); document.body.appendChild(o); }
    document.body.classList.add('cap1272'); var L = logo();
    o.innerHTML = '<div class="c">' + (L ? '<img alt="CupOfEnglish" src="' + L + '">' : '') + '<h2>' + h + '</h2>' + (p ? '<p>' + p + '</p>' : '') + '<div class="n">' + (n == null ? '' : n) + '</div></div>'; }
  function hide(){ var o = document.getElementById('cap1272'); if(o) o.remove(); document.body.classList.remove('cap1272'); }
  var md = navigator.mediaDevices, _gdm = md && md.getDisplayMedia ? md.getDisplayMedia.bind(md) : null;
  if(_gdm) try{ md.getDisplayMedia = async function(){ var st = await _gdm.apply(null, arguments);
      if(CAP){ try{ var tr = st.getVideoTracks()[0], surf = (tr && tr.getSettings && tr.getSettings().displaySurface) || '';
          if(!surf || surf === 'monitor') for(var n = 3; n > 0; n--){ show('Taking your screen picture…', 'Bring your <b>VooV class</b> window to the front now.<br>The picture shows VooV, your clock and the LAN icon.', n); await new Promise(function(z){ setTimeout(z, 1000); }); }
          show('Taking your screen picture…', '', ''); }catch(e){} }
      return st; }; }catch(e){}
  var _g = window.grabScreen;
  if(typeof _g === 'function') window.grabScreen = async function(){ CAP = 1; show('Taking your screen picture…', 'Choose <b>Entire screen</b>, then Share.', '');
    try{ return await _g.apply(this, arguments); } finally{ CAP = 0; hide(); } };
  /* an older saved result "↑ 0.0 Mbps" was an upload test that did not run: show it as not measured */
  var clean = function(s){ return String(s == null ? '' : s).replace(/↑\s*0(?:\.0+)?\s*Mbps\s*·\s*/g, ''); };
  var _nb = window.netBadge; if(typeof _nb === 'function') window.netBadge = function(s, ctx){ return _nb.call(this, clean(s), ctx); };
  var _nq = window.netQ; if(typeof _nq === 'function') window.netQ = function(s){ return _nq.call(this, clean(s)); };
})();
</script>
