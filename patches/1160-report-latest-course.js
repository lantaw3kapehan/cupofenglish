// 1160: (Misty, 26 Oct 18:41–18:42, Una ST-2023-046's parent picture) "it's OXFORD DISCOVERY, it should be Oxford Discover —
//      teachers typed this? can it be automated?" · and in the same picture the chart showed "Sep" twice (82 and 69) and the
//      total 82 while the chart's current bar said 83 (Dezza resubmitted 83 on 26 Oct after the return).
// · Course names: typed by teachers in Google's teacher tabs (FEEDBACK DATA), with typos (OXFORD DISCOVERY / SISCOVER,
//   READING EXPLORER DOUNDATION …). Everything parent-facing and the report screens now show one clean name: "Oxford Discover 1",
//   "Oxford Phonics · Short Vowels", "Reading Explorer Foundation", "Raz-Kids · Level C", "Wonders Grade 1" …
// · One bar per feedback cycle: when two teachers wrote feedback for the same cycle (Una: April 30 Sep and Dezza 3 Oct), the
//   report teacher's / latest one counts — in the chart and in the "▲ from last month" comparison.
// · The report always shows the teacher's LATEST feedback: if she sent it again (from the app or Google's copy), the window, the
//   picture and the app PDF use the new scores, skills and texts and say "Updated with the latest feedback · <date>". If the
//   reviewed Chinese was written for the earlier text, it is not used and the report shows "machine translation, not reviewed
//   yet" until the scheduled review writes the new one. Records are not changed.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b, n) => { const k = s.split(a).length - 1; if(n != null && k !== n) throw new Error('1160: expected ' + n + ' of ' + a + ', found ' + k); s = s.split(a).join(b); };
rep("_by: d.data.by || '' }", "_by: d.data.by || '', _at: d.data.at || d.at || '' }", 2);
rep("C[x.code + '|' + m]", "fbcnOk(C[x.code + '|' + m], x)", 3);
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1160 · latest feedback per cycle · clean course names */
(function(){
  if(window.__1160) return; window.__1160 = 1;
  var TT = function(w){ return /^(IELTS|DK|KET|PET|TOEFL|CEFR|GK)$/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase(); };
  window.coeCourse = function(s){
    var t = String(s == null ? '' : s).trim(); if(!t) return t;
    var u = t.toUpperCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ').replace(/\bSISCOVER/g, 'DISCOVER').replace(/\bDISCOVERY\b/g, 'DISCOVER').replace(/\bDOUNDATION\b/g, 'FOUNDATION'), m;
    if((m = u.match(/OXFORD DISCOVER\s*-?\s*(\d)?/))) return 'Oxford Discover' + (m[1] ? ' ' + m[1] : '');
    var ph = /SHORT VOWEL/.test(u) ? 'Short Vowels' : /LONG VOWEL/.test(u) ? 'Long Vowels' : /ALPHABET/.test(u) ? 'The Alphabet' : /CONSONANT/.test(u) ? 'Consonant Blends' : /LETTER COMB/.test(u) ? 'Letter Combinations' : '';
    if(/PHONICS/.test(u) || (ph && /^(THE )?(SHORT VOWELS?|LONG VOWELS?|ALPHABET|CONSONANT BLENDS?|LETTER COMBINATIONS?)$/.test(u))) return 'Oxford Phonics' + (ph ? ' · ' + ph : '');
    if(/READING EXPLORER/.test(u)){ m = u.match(/READING EXPLORER\s*-?\s*(FOUNDATION|\d)?/); return 'Reading Explorer' + (m && m[1] ? ' ' + (m[1] === 'FOUNDATION' ? 'Foundation' : m[1]) : ''); }
    if(/\bRAZ\b/.test(u)){ m = t.match(/LEVEL\s*([A-Za-z]{1,2})\b/i) || t.match(/RAZ\s+(?!KIDS)([A-Za-z]{1,2})\b/i); return 'Raz-Kids' + (m ? ' · Level ' + m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() : ''); }
    if(/WONDERS/.test(u)){ if(/\bG?K\b/.test(u.replace(/.*WONDERS/, ''))) return 'Wonders Kindergarten'; m = u.match(/WONDERS\s*G?(\d)/); return 'Wonders' + (m ? ' Grade ' + m[1] : ''); }
    if((m = u.match(/^PATHWAYS\s*(\d)/))) return 'Pathways ' + m[1];
    if(/ACADEMIC WRITING/.test(u)) return /READING/.test(u) ? 'Academic Writing and Reading' : 'Academic Writing';
    return u.split(' ').map(function(w){ return w.split('-').map(TT).join('-'); }).join(' ').replace(/\bAnd\b/g, 'and').replace(/\bOf\b/g, 'of');
  };
  var MO = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
  var subAt = function(v){ var m = String(v || '').match(/(\d{1,2})[\s-]([A-Za-z]{3})[a-z]*[\s-](\d{4})(?:\s+(\d{1,2}):(\d{2}))?/); if(!m || MO[m[2].toLowerCase()] == null) { var p = Date.parse(v); return isNaN(p) ? 0 : p; }
    return Date.UTC(+m[3], MO[m[2].toLowerCase()], +m[1], (m[4] ? +m[4] : 12) - 8, m[5] ? +m[5] : 0); };
  var cyc = function(iso){ var d = new Date(Date.parse(iso) + 8 * 3600e3), y = d.getUTCFullYear(), mo = d.getUTCMonth() + 1; if(d.getUTCDate() >= 25){ mo++; if(mo > 12){ mo = 1; y++; } } return y + '-' + (mo < 10 ? '0' : '') + mo; };
  var nt = function(v){ return String(v || '').replace(/\s+/g, ' ').trim(); };
  window.fbClean1160 = function(r, code){
    if(!r || !r.ok || !Array.isArray(r.hist) || r.__c1160) return r; r.__c1160 = 1;
    var who = (typeof RPD !== 'undefined' && RPD && RPD.report && String(RPD.report.code) === String(code)) ? String(RPD.report.teacher || '').toLowerCase() : '';
    var by = {};
    r.hist.forEach(function(e){ if(!e || !e.month) return; e.course = coeCourse(e.course); e._at = subAt(e.submitted); (by[e.month] = by[e.month] || []).push(e); });
    (r.sub || []).slice().sort(function(a, b){ return String(a.at).localeCompare(String(b.at)); }).forEach(function(sb){
      if(!sb || !sb.at || !sb.scores || !sb.texts) return; var k = sb.month || cyc(sb.at), L = by[k]; if(!L) return;
      var mine = L.filter(function(e){ return String(e.teacher || '').toLowerCase() === String(sb.who || '').toLowerCase(); }), e = mine[mine.length - 1]; if(!e) return;
      var t = Date.parse(sb.at); if(nt(e.strengths) === nt(sb.texts[0])){ if(t > (e._at || 0)) e._at = t; return; }
      if(t < (e._at || 0) - 12 * 3600e3) return;
      var it = sb.scores.map(function(a){ return (a || []).map(Number); }), sum = function(a){ return (a || []).reduce(function(p, q){ return p + (q || 0); }, 0); };
      e.items = it; e.l = sum(it[0]); e.s = sum(it[1]); e.r = sum(it[2]); e.w = sum(it[3]); e.total = e.l + e.s + e.r + e.w;
      e.strengths = sb.texts[0] || ''; e.areas = sb.texts[1] || ''; e.next = sb.texts[2] || ''; e.cn = {}; e._at = t; e._app = 1; });
    var out = [];
    Object.keys(by).sort().forEach(function(k){ var L = by[k], pick = null;
      if(who){ var w = L.filter(function(e){ return String(e.teacher || '').toLowerCase() === who; }); if(w.length) pick = w.sort(function(a, b){ return (a._at || 0) - (b._at || 0); }).pop(); }
      if(!pick) pick = L.slice().sort(function(a, b){ return (a._at || 0) - (b._at || 0); }).pop();
      out.push(pick); });
    r.hist = out; return r; };
  var f0 = window.fetch;
  window.fetch = function(u, o){ var p = f0.apply(this, arguments);
    try{ if(typeof FAST_URL !== 'undefined' && String(u) === FAST_URL + '-fb' && o && typeof o.body === 'string'){ var b = JSON.parse(o.body); if(b && !b.op && b.code){
      return p.then(function(res){ return res.clone().json().then(function(j){ fbClean1160(j, b.code); return new Response(JSON.stringify(j), { status: res.status, headers: { 'Content-Type': 'application/json' } }); }).catch(function(){ return res; }); }); } } }catch(e){}
    return p; };
  var FB = {};
  function fbGet(code){ var c = FB[code]; if(c && Date.now() - c.t < 60000) return c.p;
    var p = fetch(FAST_URL + '-fb', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: code }) }).then(function(x){ return x.json(); }).catch(function(){ return null; });
    FB[code] = { t: Date.now(), p: p }; return p; }
  var LAT = {};
  window.fbcnOk = function(c, row){ if(!c) return false; try{ var k = row && row.code ? row.code + '|' + (row.month || (typeof RP !== 'undefined' && RP ? (RP.month || RP.current) : '')) : '', at = Date.parse(c._at || '');
      var lat = LAT[k] || (row && row.submitted ? subAt((String(row.submitted) + (/\d{4}/.test(String(row.submitted)) ? '' : ' ' + new Date().getFullYear())).replace(/^(\d{1,2}) ([A-Za-z]{3}) (\d{1,2}:\d{2}) (\d{4})$/, '$1 $2 $4 $3')) : 0);
      if(lat > Date.now() + 2 * 864e5) lat = lat - 365 * 864e5;
      if(at && lat && at < lat - 60000) return false; }catch(e){} return true; };
  var _fa = window.fbcnApply;
  if(typeof _fa === 'function') window.fbcnApply = async function(R){
    try{ if(R && R.report && R.fb){ var x = R.report, k = x.code + '|' + x.month, r = await fbGet(x.code); if(r && !r.__c1160) fbClean1160(r, x.code);
      var e = r && r.ok ? (r.hist || []).filter(function(y){ return y.month === x.month; })[0] : null;
      if(e){ LAT[k] = e._at || 0;
        if(+e.total !== +R.fb.total || nt(e.strengths) !== nt(R.fb.strengths)){
          ['total', 'l', 's', 'r', 'w', 'strengths', 'areas', 'next'].forEach(function(f){ if(e[f] != null) R.fb[f] = e[f]; }); if(e.items) R.fb.items = e.items;
          R.fb.cn = Object.assign({}, e.cn || {}); R.fb._upd = e._at || 0; } }
      R.fb.course = coeCourse(R.fb.course || (e && e.course) || '');
      if(window.fbcnLoad){ var c = await fbcnLoad(x.code, x.month); if(c && !fbcnOk(c, { code: x.code, month: x.month })){ __fbcn[k] = null; R.fb._cnStale = 1; } } } }catch(err){}
    return _fa.apply(this, arguments); };
  var _b = window.rpBtns;
  if(typeof _b === 'function') window.rpBtns = function(){ var r = _b.apply(this, arguments); try{
    if(typeof RPD === 'undefined' || !RPD || !RPD.fb || !RPD.fb._upd) return r; var sb = document.getElementById('sheetBody'); if(!sb || sb.querySelector('.up1160')) return r;
    var d = new Date(RPD.fb._upd + 8 * 3600e3), lab = d.getUTCDate() + ' ' + 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')[d.getUTCMonth()] + ' ' + ('0' + d.getUTCHours()).slice(-2) + ':' + ('0' + d.getUTCMinutes()).slice(-2);
    var t = sb.querySelector('.rp-sk') || sb.querySelector('.rp-tx'); if(t) t.insertAdjacentHTML('beforebegin', '<div class="up1160 small" style="margin-top:8px;color:#1E7A55;font-weight:600">Updated with the teacher\'s latest feedback · ' + lab + '</div>'); }catch(e){} return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
