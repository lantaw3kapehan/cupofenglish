// 1196: (Misty, 26 Oct 19:07) "switch the Lesson summary's monthly history lines to the database, so they match the totals
//      instantly". The per-month lessons of every package (Lesson summary history, shared summary, ACTIVE month columns,
//      student history — everything that reads AT.rows[].months) now come from the database (coe_pkg_mon via the new
//      read-only edge function coe-mon): October 2026 on = calendar classes that have ENDED, earlier months = the closed
//      S-MONTHLY months, plus month adjustments — exactly the numbers that add up to "Lessons completed". James ST-2022-004:
//      October 5 (was 4 from Google's sheet). If the database cannot be reached the old numbers stay.
//      The "classes ended today" add-on is set to 0 when database months are used (they already include them).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1196 · monthly lessons per package from the database (coe-mon) */
(function(){
  if(window.__1196) return; window.__1196 = 1;
  var DBM = null, AT0 = 0, BUSY = null;
  var MN = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Sept: 9, Oct: 10, Nov: 11, Dec: 12 };
  function ym(lab){ var m = String(lab || '').trim().match(/^([A-Za-z]{3,4})[a-z]*\.?\s+'?(\d{2}|\d{4})$/); if(!m) return ''; var mo = MN[m[1].charAt(0).toUpperCase() + m[1].slice(1, 3).toLowerCase()] || MN[m[1]]; if(!mo) return ''; var y = m[2].length === 2 ? '20' + m[2] : m[2]; return y + '-' + (mo < 10 ? '0' : '') + mo; }
  window.coeMonYm = ym;
  window.coeMonLoad = function(force){
    if(!force && DBM && Date.now() - AT0 < 120000) return Promise.resolve(DBM);
    if(BUSY) return BUSY;
    if(typeof TOKEN === 'undefined' || !TOKEN || typeof D === 'undefined' || !D || !D.mgr || typeof FAST_URL === 'undefined') return Promise.resolve(DBM);
    var ac = window.AbortController ? new AbortController() : null, t = ac ? setTimeout(function(){ ac.abort(); }, 8000) : 0;
    BUSY = fetch(FAST_URL + '-mon', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }), signal: ac ? ac.signal : undefined })
      .then(function(r){ return r.json(); })
      .then(function(r){ if(r && r.ok && Array.isArray(r.rows)){ var byR = {}, byK = {};
          r.rows.forEach(function(x){ var sr = x[0], code = String(x[1] || '').toUpperCase(), te = String(x[2] || '').trim().toLowerCase(), m = x[3], v = +x[4] || 0;
            if(sr != null){ var a = byR[sr] = byR[sr] || { code: code, t: te, m: {} }; a.m[m] = v; }
            var kk = code + '|' + te, b = byK[kk] = byK[kk] || {}; b[m] = (sr != null && b.__r != null && b.__r !== sr) ? b[m] : v; if(b.__r == null && sr != null) b.__r = sr; });
          DBM = { byR: byR, byK: byK }; AT0 = Date.now(); }
        return DBM; })
      .catch(function(){ return DBM; })
      .finally(function(){ BUSY = null; clearTimeout(t); });
    return BUSY; };
  function apply(v){
    try{ if(!DBM || !v || !Array.isArray(v.cols) || !Array.isArray(v.rows) || !Array.isArray(v.months)) return v; if(v.__mon1196 === AT0) return v;
      var C = {}; v.cols.forEach(function(c, i){ C[c] = i; }); if(C.months == null) return v; var Y = v.months.map(ym);
      v.rows.forEach(function(r){ var code = String(r[C.code] || '').toUpperCase(), te = String(r[C.teacher] || '').trim().toLowerCase(), k = null;
        var br = C.row != null ? DBM.byR[r[C.row]] : null; if(br && br.code === code && br.t === te) k = br.m; else { var bk = DBM.byK[code + '|' + te]; if(bk) k = bk; }
        if(!k) return; var arr = Array.isArray(r[C.months]) ? r[C.months].slice() : Y.map(function(){ return 0; }); var hit = 0;
        Y.forEach(function(y, i){ if(y && Object.prototype.hasOwnProperty.call(k, y)){ arr[i] = k[y]; hit = 1; } });
        if(hit){ r[C.months] = arr; if(C.today != null) r[C.today] = 0; } });
      v.__mon1196 = AT0; }catch(e){ console.warn('1196', e); } return v; }
  window.coeMonApply = apply;
  var now = function(){ try{ if(typeof AT !== 'undefined' && AT) apply(AT); }catch(e){} };
  var cap = function(p, ms){ return Promise.race([p, new Promise(function(z){ setTimeout(z, ms); })]); };
  ['lsRows', 'shGroup', 'shAll', 'agrGroup'].forEach(function(n){ var f = window[n]; if(typeof f !== 'function') return; window[n] = function(){ now(); return f.apply(this, arguments); }; });
  var _ra = window.renderActive; if(typeof _ra === 'function') window.renderActive = function(){ now(); var r = _ra.apply(this, arguments);
    if(!DBM || Date.now() - AT0 > 120000) window.coeMonLoad().then(function(d){ if(d && typeof AT !== 'undefined' && AT && AT.__mon1196 !== AT0){ apply(AT); if(typeof VIEW !== 'undefined' && VIEW === 'active') try{ _ra(); }catch(e){} } });
    return r; };
  var _la = window.loadActive; if(typeof _la === 'function') window.loadActive = async function(){ var r = await _la.apply(this, arguments); try{ await cap(window.coeMonLoad(), 2500); now(); }catch(e){} return r; };
  var _ss = window.shSummary; if(typeof _ss === 'function') window.shSummary = async function(){ try{ await cap(window.coeMonLoad(), 2500); now(); }catch(e){} return _ss.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
