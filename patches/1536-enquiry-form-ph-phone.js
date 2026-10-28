// 1536 · New enquiry form: Philippine mode + phone layout (28 Oct 2026, Misty 23:18, her 390-wide screenshot).
// PH mode = a "PH …" programme is picked (the form opens on PH Adult English 1:1 when Enquiries is on Market: Philippines):
//   "Found us through" shows Facebook · Website · Referral · Other (WeChat, 小红书, Partner hidden); the contact field reads
//   "Facebook / Messenger / mobile (optional)" (same stored field). China mode: the original list (WeChat, 小红书, Referral, Partner,
//   Website, Other) and "WeChat ID (optional)".
// Phone: the form's chip groups wrap as plain rows of chips (no rounded track that clipped wrapped chips and drew a curved mask),
//   inputs are 16 px (iPhone no longer zooms in on focus, which pushed Age / level / Save off the right edge), nothing wider than
//   the sheet; checked at 390 and 375, China and PH.
const fs = require('fs'), file = process.argv[2], R = String.raw;
let s = fs.readFileSync(file, 'utf8');
if (s.indexOf('window.__1530') < 0 || s.indexOf("'Facebook', 'Referral'") < 0) { console.error('1536 needs 1530 and 1533'); process.exit(1); }
require('../tools/lib.js')(file, [
  ["'<div class=\"row\" style=\"gap:8px\"><div class=\"grow\">' + inp('eqW', 'WeChat ID (optional)') + '</div><div style=\"width:140px\">' + inp('eqA', 'Age') + '</div></div>'",
   "'<div class=\"row eq36-r\" style=\"gap:8px\"><div class=\"grow\">' + inp('eqW', 'WeChat ID (optional)') + '</div><div class=\"eq36-age\">' + inp('eqA', 'Age') + '</div></div>'"]
]);
s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<style id="eq36">
#sheet #eqP,#sheet #eqS,#sheet #eqPhS{display:flex!important;flex-wrap:wrap;gap:8px;width:auto!important;max-width:100%;overflow:visible!important;background:transparent!important;border:0!important;padding:0!important;box-shadow:none!important;border-radius:0!important;margin:8px 0 4px!important}
#sheet #eqP button,#sheet #eqS button,#sheet #eqPhS button{flex:0 1 auto;max-width:100%;min-width:0;height:auto!important;min-height:40px;padding:8px 14px!important;border:1px solid #DDE6E8!important;border-radius:14px!important;background:#fff!important;color:#2B2253!important;font-size:14px;font-weight:600;white-space:normal!important;text-align:left;box-shadow:none!important;clip-path:none!important;transform:none!important;line-height:1.25}
#sheet #eqP button.on,#sheet #eqS button.on,#sheet #eqPhS button.on{background:#E3F6F6!important;border-color:#00737B!important;color:#00585E!important}
#sheet #eqPhS button{display:inline-flex;flex-direction:column;align-items:flex-start}
#sheet #eqPhS button small{display:block;font-weight:400;font-size:12px;opacity:.85;white-space:normal}
#sheet #eqS button.eq36-off{display:none!important}
#sheet .eq36-r{display:flex;flex-wrap:nowrap}
#sheet .eq36-r>.grow{flex:1 1 0;min-width:0}
#sheet .eq36-age{flex:0 0 30%;min-width:0}
#sheet .eq36-r.eq36-ph{flex-wrap:wrap}
#sheet #eqW::placeholder,#sheet #eqL::placeholder{font-size:14.5px}
#sheet .eq36-r.eq36-ph>.grow{flex:1 1 100%}
#sheet .eq36-r.eq36-ph>.eq36-age{flex:0 0 40%}
#sheet #eqN,#sheet #eqW,#sheet #eqA,#sheet #eqPt,#sheet #eqL,#sheet #eqT{box-sizing:border-box;max-width:100%;min-width:0;font-size:16px!important}
</style>
<script>
/* 1536 · New enquiry: Philippine mode (sources, contact field) */
(function(){
  if(window.__1536) return; window.__1536 = 1;
  var PH_SRC = ['Facebook', 'Website', 'Referral', 'Other'], CN_SRC = ['WeChat', '小红书', 'Referral', 'Partner', 'Website', 'Other'];
  var mk = function(){ try{ return localStorage.getItem('coe.enqMarket') === 'ph'; }catch(e){ return false; } };
  var _n = window.enqNew; if(!_n) return;
  window.enqNew = function(){ var r = _n.apply(this, arguments);
    try{ var g = $('eqP'), S = $('eqS'); if(!g || !S) return r;
      var paint = function(){ var b = g.querySelector('button.on'), ph = !!(b && /^PH /.test(b.textContent)), keep = ph ? PH_SRC : CN_SRC, on = S.querySelector('button.on');
        S.querySelectorAll('button').forEach(function(x){ x.classList.toggle('eq36-off', keep.indexOf(x.textContent) < 0); });
        if(ph){ var order = PH_SRC.map(function(t){ return [].find.call(S.querySelectorAll('button'), function(x){ return x.textContent === t; }); }).filter(Boolean); order.forEach(function(x){ S.appendChild(x); }); }
        else CN_SRC.forEach(function(t){ var x = [].find.call(S.querySelectorAll('button'), function(y){ return y.textContent === t; }); if(x) S.appendChild(x); });
        S.querySelectorAll('button.eq36-off').forEach(function(x){ S.appendChild(x); });
        if(!on || on.classList.contains('eq36-off')){ S.querySelectorAll('button').forEach(function(x){ x.classList.remove('on'); }); var d = [].find.call(S.querySelectorAll('button'), function(x){ return x.textContent === (ph ? 'Facebook' : 'WeChat'); }); if(d) d.classList.add('on'); var pt = $('eqPt'); if(pt) pt.style.display = 'none'; }
        var w = $('eqW'); if(w) w.placeholder = ph ? 'Facebook / Messenger / mobile (optional)' : 'WeChat ID (optional)'; var rw = w && w.closest('.eq36-r'); if(rw) rw.classList.toggle('eq36-ph', ph);
        var n = $('eqN'); if(n) n.placeholder = ph ? 'e.g. Maria Santos' : 'e.g. Lily mum · 王女士';
        var hn = n && n.previousElementSibling; if(hn && /name is fine/.test(hn.textContent)) hn.innerHTML = '<b>Name</b> · parent or learner (' + (ph ? 'Facebook' : 'WeChat') + ' name is fine)'; };
      g.addEventListener('click', function(){ setTimeout(paint, 0); });
      if(mk()){ var p0 = [].find.call(g.querySelectorAll('button'), function(x){ return x.textContent === 'PH Adult English 1:1'; }); if(p0) p0.click(); }
      paint(); }catch(x){ console.warn('1536', x); }
    return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1536 New enquiry: PH mode + phone layout');
