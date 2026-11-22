// 2696 (Misty 22 Nov 14:33–14:34, Yufan): the Course plan has an IELTS option that sends our IELTS learning roadmap
// (the one built for the IELTS programme: Foundation, Professional, Mastery tracks). An IELTS trial opens on it, with the track
// picked from the trial band. Also: a trial result such as "IELTS 4.0 · B1" now reads as B1 (it was read as A2).
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`band: bandOf(o.cefr), pre: /^pre/i.test(String(o.cefr || '')) ? 1 : 0 }; cpSheet(); };`,
   `band: bandOf(o.cefr), pre: /^pre/i.test(String(o.cefr || '')) ? 1 : 0 };
  { const ie = /^\\s*IELTS/i.test(String(o.cefr || '')) || !!o.ielts, n = parseFloat((/IELTS\\s*([\\d.]+)/i.exec(String(o.cefr || '')) || [])[1]); CP.ie = ie; CP.tr = !ie ? '' : isNaN(n) || n < 5 ? 'foundation' : n < 5.5 ? 'professional' : 'mastery'; }
  cpSheet(); };`],
  [`'<div class="small" style="margin-top:12px"><b>Learner</b></div><div class="seg" id="cpAdS"><button class="' + (CP.ad ? '' : 'on') + '" onclick="cpAd(0)">Kids &amp; teens</button><button class="' + (CP.ad ? 'on' : '') + '" onclick="cpAd(1)">Adults · 18+</button></div>' +`,
   `'<div class="small" style="margin-top:12px"><b>Learner</b></div><div class="seg" id="cpAdS"><button class="' + (!CP.ie && !CP.ad ? 'on' : '') + '" onclick="cpIe2696(0);cpAd(0)">Kids &amp; teens</button><button class="' + (!CP.ie && CP.ad ? 'on' : '') + '" onclick="cpIe2696(0);cpAd(1)">Adults · 18+</button><button class="' + (CP.ie ? 'on' : '') + '" onclick="cpIe2696(1)">IELTS</button></div>' +
(CP.ie ? '<div class="small" style="margin-top:12px"><b>Track</b> · our IELTS learning roadmap</div>' + seg('cpTr', [['foundation', 'Foundation · band 4.5 → 5.0 / 5.5'], ['professional', 'Professional · 5.0 → 6.0'], ['mastery', 'Mastery · 5.5 → 6.5 / 7.0'], ['', 'All tracks']], CP.tr, 'cpTr2696') : '') +`],
  [`(CP.ad ? '<div class="small" style="margin-top:12px"><b>Goal`, `(CP.ie ? '' : CP.ad ? '<div class="small" style="margin-top:12px"><b>Goal`],
  [`(CP.ad ? '' : '<h3 style="margin:18px 0 `, `(CP.ad || CP.ie ? '' : '<h3 style="margin:18px 0 `],
  [`async function cpDraw(){ if(CP.ad) return adDraw();`, `window.cpIe2696 = v => { CP.ie = !!v; if(v && CP.tr == null) CP.tr = 'foundation'; if(v) cpSheet(); };
window.cpTr2696 = v => { CP.tr = v; cpSheet(); };
async function ieDraw2696(){ const my = CP, el = $('cpImg'); let b = null;
  try{ if(window.phRoadPic1539 && window.phPricing1530 && phPricing1530()) b = await phRoadPic1539('ielts', CP.tr || ''); }catch(e){}
  if(CP !== my || !CP.ie) return;
  if(!b){ if(el) el.innerHTML = '<div class="mute small">The IELTS roadmap is loading…</div>'; setTimeout(() => { if(CP === my && CP.ie) ieDraw2696(); }, 2500); return; }
  CP.blob = b; if(el) el.innerHTML = '<img src="' + URL.createObjectURL(b) + '" style="width:100%;border-radius:12px;border:1px solid #E6EEF0">'; }
async function cpDraw(){ if(CP.ie) return ieDraw2696(); if(CP.ad) return adDraw();`],
  [`async function cpRm(){ const el = $('cpRm'); if(!el || CP.ad) return;`, `async function cpRm(){ const el = $('cpRm'); if(!el || CP.ad || CP.ie) return;`],
  [`window.cpText = async function(){ if(CP.ad){`, `window.cpText = async function(){ if(CP.ie){ const o = CP.o, d = window.phPricing1530 && phPricing1530(), P = d && (d.programs || []).find(p => p.id === 'ielts'), T0 = P && (P.tracks || []).find(t => t.id === CP.tr);
    const ta = 'Hello! Here is ' + (o.student ? o.student + '’s' : 'the') + ' IELTS learning roadmap from CupOfEnglish.' + (o.cefr ? ' Trial result: ' + o.cefr + '.' : '') + (T0 ? ' We suggest the ' + T0.name + ' Track: ' + T0.lessons + ' lessons' + (T0.extra ? ' + ' + T0.extra : '') + ', target band ' + T0.target + '.' : '') + ' Please see the picture for the skills we will work on.\\n\\nCupOfEnglish';
    try{ await navigator.clipboard.writeText(ta); toast('Message copied'); }catch(e){ toast(ta); } return; } if(CP.ad){`],
  [`const BANDS = ['A1', 'A2', 'B1', 'B2'], bandOf = c => { c = String(c || '');`, `const BANDS = ['A1', 'A2', 'B1', 'B2'], bandOf = c => { c = String(c || ''); { const m = /(pre-?a1|a1|a2|b1|b2|c1|c2)[^a-z0-9]*$/i.exec(c); if(m) c = m[1]; }   /* 2696: "IELTS 4.0 · B1" → B1 */`],
]);
