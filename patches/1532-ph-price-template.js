// 1532 · Philippine market on the China template (28 Oct 2026, Misty 22:34: "make the Philippine price list follow the same template
// as the China price list, for uniformity", English content from her flyers).
// 1. ONE price-picture builder for both markets: pricePic / ppSheet / ppDraw / ppText take a market (PP.m = 'ph'). China keeps every
//    literal it had (its pictures are byte-identical, checked before/after); Philippines swaps only the content: English text, ₱ prices
//    and the PH tracks (Foundation / Professional / Mastery: lessons, hours, CEFR or band target, goal) from docs sys:pricing_ph.
//    Same sheet (Learner · Recommend · Copy picture · Share / save · Copy message · payment lines), same card picture, same file flow.
// 2. coeCard (the shared picture frame) takes an optional { en: 1 }: labels in English only. Without it (every China picture): unchanged.
// 3. Enquiries › Philippines = the China toolkit in English: "Pictures & messages" heading, stage 1 "Before the trial" with the same
//    cards: Price list (Price picture), Learning roadmap (Roadmap: a generated picture in the same frame and components: programme,
//    track, the 4 skills with core skills, IELTS key focus per track, result), Invite to a trial (Copy message), Original flyers (extra).
// 4. A PH enquiry's Price / Roadmap buttons open these pictures on its programme and track.
// China prices, partner rates and calculations: unchanged. Display only.
const fs = require('fs'), file = process.argv[2];
const R = String.raw;
require('../tools/lib.js')(file, [
  // ── the shared frame: optional English-only labels ──
  [R`window.coeCard = async function(pill, body){`, R`window.coeCard = async function(pill, body, opt){`],
  [R`T.label = (en, zh, y) => T.text(en + ' · ' + zh, CX, y, '400 22px ' + F, K.MUTE);`,
   R`T.label = (en, zh, y) => T.text(opt && opt.en ? en : en + ' · ' + zh, CX, y, '400 22px ' + F, K.MUTE);`],
  // ── price picture: market parameter ──
  [R`let PP = null;
window.pricePic`, R`/* 1532 · Philippine market content for the same builder (docs sys:pricing_ph via 1530) */
const phPrg = () => { const D = window.phPricing1530 && phPricing1530(); return D && (D.programs || []).find(x => x.id === (PP && PP.ad === 2 ? 'ielts' : 'adult')) || null; };
const phL = () => { const P = phPrg(); if(!P) return []; const KS = { foundation: 'f', professional: 'c', mastery: 'a' }, band = P.measure === 'Band';
  return (P.tracks || []).map(t => { const mk = (String(t.extra || '').match(/^(\d+) mock/) || [])[1];
    return { k: KS[t.id] || t.id, zh: t.name + ' Track', en: t.name, n: t.lessons, bonus: 0, mock: mk ? +mk : 0, pe: mk ? '' : (t.extra || ''), price: t.price, pt: '₱' + Number(t.price).toLocaleString('en-US'), save: 0,
      hrs: '≈' + t.hours + ' hours', mins: P.lessonMins, tgt: band ? 'Target band ' + t.target + (t.gain ? ' · expected band gain ' + t.gain : '') : 'CEFR target ' + t.target + ' · ' + t.goal, d: band ? t.goal + ' ' + t.outcome : t.outcome }; }); };
const phQ = () => { const P = phPrg() || {}, S = P.system || {}, band = P.measure === 'Band';
  return { sub: P.name || '', l3: (S.skills || []).map(k => k.name).join(' · ') + ' · ' + (band ? 'aligned with official IELTS band descriptors' : 'CEFR-aligned · adult learners'),
    l2: p => p.hrs + ' · ' + p.mins + '-minute lessons · 1:1', per: p => '≈ ₱' + Math.round(p.price / (p.n + p.bonus)).toLocaleString('en-US') + ' / lesson',
    notes: [{ t: P.small || '' }, { t: (P.method || '') + '.' }, { t: (S.footer || []).join(' · ') + '.' }, { t: 'Please tell your teacher at least 2 hours before class if you need to cancel or move a lesson.', red: 1 }]
      .concat(band ? [{ t: 'Target bands are a guide; progress depends on starting level, effort and consistency. Official results come from the IELTS test.', mute: 1 }] : []),
    bc: 'CupOfEnglish helps eligible learners register for the IELTS test through its partnership with British Council Philippines.' }; };
let PP = null;
window.pricePic`],
  [R`window.pricePic = function(o){ o = o || {}; PP = { o: o, rec: o.cefr ? recOf(o.cefr) : 'c', ad: o.ket ? 4 : o.pet ? 3 : o.ielts ? 2 : !!o.adult }; ppSheet(); };`,
   R`window.pricePic = function(o){ o = o || {}; if(o.ph){ if(!(window.phPricing1530 && phPricing1530())) return toast('Philippine price list still loading · try again in a moment'); PP = { o: {}, m: 'ph', rec: o.rec ? ({ foundation: 'f', professional: 'c', mastery: 'a' })[o.rec] || 'c' : 'c', ad: o.ph === 'ielts' ? 2 : true }; return ppSheet(); } PP = { o: o, rec: o.cefr ? recOf(o.cefr) : 'c', ad: o.ket ? 4 : o.pet ? 3 : o.ielts ? 2 : !!o.adult }; ppSheet(); };`],
  [R`const ppL = () => PP.ad === true && XLS[PP.partner]`, R`const ppL = () => PP.m === 'ph' ? phL() : PP.ad === true && XLS[PP.partner]`],
  [R`'General price list for new enquiries') + ' · Chinese for parents</div>'`, R`'General price list for new enquiries') + (PP.m === 'ph' ? ' · English · Philippine market (₱)' : ' · Chinese for parents') + '</div>'`],
  [R`['Kids &amp; teens · 4–17', 'Adults · 18+', 'IELTS', 'PET', 'KET'].map((t, i) =>`, R`(PP.m === 'ph' ? [, 'Adult English 1:1', 'IELTS 1:1'] : ['Kids &amp; teens · 4–17', 'Adults · 18+', 'IELTS', 'PET', 'KET']).map((t, i) =>`],
  [R`'</div>' + (PP.ad === true || !PP.ad ? '<div class="small" style="margin-top:12px"><b>Price for</b>`, R`'</div>' + (PP.m !== 'ph' && (PP.ad === true || !PP.ad) ? '<div class="small" style="margin-top:12px"><b>Price for</b>`],
  [R`rec = L.find(p => p.k === PP.rec);
PP.blob = await coeCard(o.student ? 'Course packages · 课程方案'`, R`rec = L.find(p => p.k === PP.rec), Q = PP.m === 'ph' ? phQ() : null;
PP.blob = await coeCard(Q ? (IE ? 'IELTS price list' : 'Adult English price list') : o.student ? 'Course packages · 课程方案'`],
  [R`T.text(KE ? '一对一剑桥 KET 少儿英语课程' : PE ?`, R`T.text(Q ? Q.sub : KE ? '一对一剑桥 KET 少儿英语课程' : PE ?`],
  [R`T.text(PE ? 'Speaking · Listening · Reading · Writing · 口语`, R`T.text(Q ? Q.l3 : PE ? 'Speaking · Listening · Reading · Writing · 口语`],
  [R`T.label('Lesson packages', '课程套餐 · 每节50分钟', y);`, R`T.label(Q ? 'Lesson packages · 50 minutes each' : 'Lesson packages', '课程套餐 · 每节50分钟', y);`],
  [R`if(isR) T.chip('老师推荐 · Recommended', bx, y + 30, T.TEAL, '#fff'); else if(p.top) T.chip('家长首选 · Most chosen',`, R`if(isR) T.chip(Q ? 'Recommended' : '老师推荐 · Recommended', bx, y + 30, T.TEAL, '#fff'); else if(p.top) T.chip(Q ? 'Most chosen' : '家长首选 · Most chosen',`],
  [R`T.text(p.n + '节课' + (p.bonus ?`, R`T.text(Q ? Q.l2(p) : p.n + '节课' + (p.bonus ?`],
  [R`T.text('约 ¥' + Math.round(p.price / (p.n + p.bonus)) + ' / 节'`, R`T.text(Q ? Q.per(p) : '约 ¥' + Math.round(p.price / (p.n + p.bonus)) + ' / 节'`],
  [R`y = coeNotes(T, 'Good to know', '温馨提示', IE ? [`, R`y = coeNotes(T, 'Good to know', '温馨提示', Q ? Q.notes : IE ? [`],
  [R`T.text(r[2][1], T.CX, y + 82, '400 26px ' + T.F, T.SUB); y += 118; });`, R`if(!Q) T.text(r[2][1], T.CX, y + 82, '400 26px ' + T.F, T.SUB); y += Q ? 80 : 118; });`],
  [R`T.wrap('一杯英语（CupOfEnglish）通过与菲律宾英国文化教育协会（British Council Philippines）的合作，协助符合条件的学员进行雅思（IELTS）报名。', T.Wc - T.CX * 2, '400 19px ' + T.F).forEach(s => { T.text(s, T.CX, y + 4, '400 19px ' + T.F, T.MUTE); y += 28; });
return y;
});
const el = $('ppImg');`, R`T.wrap(Q ? Q.bc : '一杯英语（CupOfEnglish）通过与菲律宾英国文化教育协会（British Council Philippines）的合作，协助符合条件的学员进行雅思（IELTS）报名。', T.Wc - T.CX * 2, '400 19px ' + T.F).forEach(s => { T.text(s, T.CX, y + 4, '400 19px ' + T.F, T.MUTE); y += 28; });
return y;
}, Q ? { en: 1 } : undefined);
const el = $('ppImg');`],
  [R`const nm = () => 'CupOfEnglish-price' + (PP.ad === 4`, R`const nm = () => 'CupOfEnglish-price' + (PP.m === 'ph' ? '-ph' : '') + (PP.ad === 4`],
  [R`PP.blob })]); toast('Picture copied · paste it in WeChat');`, R`PP.blob })]); toast(PP.m === 'ph' ? 'Picture copied · paste it in Messenger, Viber or e-mail' : 'Picture copied · paste it in WeChat');`],
  [R`window.ppText = async function(){ const p = ppL().find(z => z.k === PP.rec), o = PP.o;`,
   R`window.ppText = async function(){ const p = ppL().find(z => z.k === PP.rec), o = PP.o;
if(PP.m === 'ph'){ const P = phPrg() || {}, ex = ppExtra().split('\n').filter(l => !/[一-鿿]/.test(l)).join('\n').replace(/\[Joyful\]/g, '');   /* the English lines of the same enrolment / payment text */
  const out = 'Hello! Thank you for your interest in CupOfEnglish ' + (P.name || '1:1 lessons') + '.' + (p ? ' We recommend starting with the ' + p.zh + ' (' + p.n + ' lessons' + (p.mock ? ' + ' + p.mock + ' mock tests' : p.pe ? ' + ' + p.pe : '') + ', ' + p.pt + ').' : '') + ' Please see the picture for the details of each track. You are welcome to book a trial class: your teacher will check your current level and suggest the right track.' + ex + '\n\nCupOfEnglish';
  try{ await navigator.clipboard.writeText(out); toast('Message copied · paste it with the picture'); }catch(e){ toast(out); } return; }`],
  // ── 1530: the Philippine tab becomes the China toolkit in English ──
  [R`window.phPricing1530 = function(){ return PHD; };`, R`window.phPricing1530 = function(){ if(!PHD) load(true); return PHD; }; window.phPics1530 = function(P){ return pics(P); };`],
  [R`return phOpen(ph.pid, ph.tid, k === 'r');`, R`return k === 'r' ? phRoadPic(ph.pid, ph.tid) : pricePic({ ph: ph.pid, rec: ph.tid });`],
  [R`+ '<button class="btn ghost block" style="margin-top:8px" onclick="phOpen(\'' + pid + '\')">‹ Back to ' + e(P.short) + '</button></div>');`,
   R`+ '<button class="btn ghost block" style="margin-top:8px" onclick="phFlyers()">‹ Back to the flyers</button></div>');`],
  [R`function section(){ if(!PHD) return '<section id="ph30"><div class="ph30-intro">Loading the Philippine price list…</div><div class="ph30-sk0" aria-busy="true"></div></section>';
    return '<section id="ph30"><div class="ph30-intro">For enquiries from the Philippines · prices in pesos (\u20B1), separate from the China price list · send a flyer picture or the price text on Messenger, Viber or e-mail. Price list updated ' + e(PHD.updated || '') + '.</div><div class="ph30-grid">' + (PHD.programs || []).map(function(P){ return card(P); }).join('') + '</div></section>'; }`,
   R`function section(){ return window.phKit1532 ? phKit1532() : '<section id="ph30"></section>'; }`]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<style id="css1532">
/* 1532 · Philippine tab = the China toolkit in English */
#v-enquiry #ph30{margin-top:0}
#v-enquiry #ph30 > h2{font-family:var(--ui-font);font-weight:700;color:var(--ui-ink);font-size:var(--fs-h2,17px)}
</style>
<script>
/* 1532 · Philippine toolkit (same cards as China) + the learning roadmap picture (same frame and components as the price picture) */
(function(){
  if(window.__1532) return; window.__1532 = 1;
  var D = function(){ return window.phPricing1530 ? phPricing1530() : null; };
  var prog = function(id){ var d = D(); return d && (d.programs || []).find(function(p){ return p.id === id; }) || null; };
  window.phKit1532 = function(){
    var C = function(n, t, d, b, fn){ return '<div style="background:#fff;border:1px solid #E6EEF0;border-radius:18px;padding:16px 18px;margin-top:12px;display:flex;gap:14px;align-items:center" class="eq2-t"><div style="width:36px;height:36px;border-radius:50%;background:#E3F6F6;color:#00737B;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none">' + n + '</div><div class="grow" style="min-width:0"><b>' + t + '</b><div class="small mute" style="margin-top:3px">' + d + '</div></div><button class="btn teal sm x1101-sec" style="flex:none" onclick="' + fn + '">' + b + '</button></div>'; };
    return '<section id="ph30"><h2 style="margin-top:22px">Pictures &amp; messages <span class="c">in English, for Messenger, Viber or e-mail</span></h2>'
      + '<section class="eq2-g s1"><h3><span class="n31">1</span>Before the trial <span>answer the enquirer · invite to a trial</span></h3><div class="eq2-grid">'
      + C(1, 'Price list', 'Adult English 1:1 or IELTS 1:1 · all three tracks in pesos (₱), price per lesson, quote date · valid 7 days. Tap None to highlight no track.', 'Price picture', "pricePic({ ph: 'adult' })")
      + C(2, 'Learning roadmap', 'The 4-skill learning system · pick a track for its target and, for IELTS, the key focus areas of each skill.', 'Roadmap', "phRoadPic('adult')")
      + C(3, 'Invite to a trial', 'A short English message asking for their goal, IELTS target (if any) and a good trial time.', 'Copy message', 'phInv()')
      + C(4, 'Original flyers', 'Misty’s 8 designed flyers as they are · copy or save each picture.', 'Flyers', 'phFlyers()')
      + '</div></section><div class="small mute" style="margin-top:18px;line-height:1.6"><b>Suggested order:</b> price picture → learning roadmap → trial invitation.</div></section>'; };
  window.phInv = function(){ var t = 'Hello! Thank you for your interest in CupOfEnglish one-to-one English lessons.\n\nWe would be happy to invite you to a trial class with one of our teachers. It helps us check your current level and recommend the right track (Foundation, Professional or Mastery).\n\nMay we know:\n1. Your main goal for learning English (work, daily conversation, travel, IELTS or other)\n2. Your IELTS target band and test date, if you are preparing for IELTS\n3. A good day and time for your trial class\n\nThank you, and we look forward to meeting you!\nCupOfEnglish';
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function(){ toast('Message copied · paste it in Messenger, Viber or e-mail'); }, function(){ try{ prompt('Copy this message', t); }catch(x){} }); };
  window.phFlyers = function(){ var d = D(); if(!d) return toast('Philippine price list still loading · try again in a moment');
    openSheet('<div class="ph30-sh"><h1>Original flyers</h1><div class="mute small">Misty’s designed flyers, as they are · Copy or Save each picture</div>' + (d.programs || []).map(function(P){ return '<h2>' + esc(P.short) + '</h2>' + (window.phPics1530 ? phPics1530(P) : ''); }).join('') + '</div>'); try{ $('sheet').classList.add('wide'); }catch(x){} };

  /* the learning roadmap picture: coeCard frame (English), the price picture's components */
  var RP = null;
  window.phRoadPic = function(pid, tid){ if(!D()) return toast('Philippine price list still loading · try again in a moment'); RP = { pid: pid === 'ielts' ? 'ielts' : 'adult', tid: tid || '' }; rpSheet(); };
  window.rpSet = function(k, v){ if(!RP) return; RP[k] = v; if(k === 'pid' && v !== RP.pid0) RP.pid0 = v; rpSheet(); };
  function rpSheet(){ var d = D(), P = prog(RP.pid); if(!P) return;
    var seg = function(k, opts){ return '<div class="seg" style="flex-wrap:wrap">' + opts.map(function(o){ return '<button class="' + (RP[k] === o[0] ? 'on' : '') + '" onclick="rpSet(\'' + k + '\',\'' + o[0] + '\')">' + esc(o[1]) + '</button>'; }).join('') + '</div>'; };
    openSheet('<h1>Learning roadmap</h1><div class="mute small">General learning roadmap for new enquiries · English · Philippine market</div>'
      + '<div class="small" style="margin-top:12px"><b>Learner</b></div>' + seg('pid', (d.programs || []).map(function(p){ return [p.id, p.short]; }))
      + '<div class="small" style="margin-top:12px"><b>Track</b></div>' + seg('tid', (P.tracks || []).map(function(t){ return [t.id, t.name + ' · ' + t.lessons]; }).concat([['', 'All tracks']]))
      + '<div class="row" style="gap:8px;margin-top:12px"><button class="btn teal grow" onclick="rpCopy()">Copy picture</button><button class="btn ghost grow" onclick="rpSave()">' + (navigator.share ? 'Share / save' : 'Save picture') + '</button><button class="btn ghost" onclick="rpText()">Copy message</button></div>'
      + '<div id="rpImg" style="margin-top:12px"><div class="sk"></div><div class="sk"></div></div>');
    try{ $('sheet').classList.add('wide'); }catch(x){} rpDraw(); }
  async function rpDraw(){ var P = prog(RP.pid); if(!P) return; var S = P.system || {}, band = P.measure === 'Band', T0 = (P.tracks || []).find(function(t){ return t.id === RP.tid; }) || null, my = RP;
    var blob = await coeCard(band ? 'IELTS learning roadmap' : 'Learning roadmap', function(T, y){
      T.label('Programme', '', y); T.text(band ? '1-on-1 IELTS' : '1-on-1 English', T.CX, y + 62, '400 56px ' + T.B, T.NAVY); T.text(S.title || P.name, T.CX, y + 108, '400 32px ' + T.F, T.SUB);
      T.text((S.sub || '') + ' · ' + P.lessonMins + '-minute lessons', T.CX, y + 148, '400 22px ' + T.F, T.MUTE); y += 196;
      if(T0) y = coeHero(T, T0.name, 'Your track', (band ? 'Target band ' : 'CEFR ') + T0.target, T0.lessons + ' lessons' + (T0.extra ? ' + ' + T0.extra : '') + ' · ≈' + T0.hours + ' hours' + (T0.gain ? ' · expected band gain ' + T0.gain : ''), y);
      else { T.label('Tracks', '', y); y += 22; (P.tracks || []).forEach(function(t){ var h = 116; T.box(T.CX, y, T.Wc - T.CX * 2, h, 26, '#fff', T.LINE, 2);
          T.text(t.name + ' Track', T.CX + 32, y + 52, '700 32px ' + T.F, T.NAVY); T.text(t.lessons + ' lessons' + (t.extra ? ' + ' + t.extra : '') + ' · ≈' + t.hours + ' hours', T.CX + 32, y + 90, '400 22px ' + T.F, T.MUTE);
          T.text((band ? 'Band ' : 'CEFR ') + t.target, T.R - 32, y + 66, '700 26px ' + T.F, T.TEAL, 'right'); y += h + 18; }); y += 8; }
      T.label(T0 && band ? 'Four skills · key focus for the ' + T0.name + ' Track' : 'Four skills', '', y); y += 22;
      (S.skills || []).forEach(function(k){ var x0 = T.CX + 32, W = T.Wc - T.CX * 2 - 64, FA = T0 && k.focus && k.focus[T0.id] ? k.focus[T0.id] : [];
        var aim = T.wrap(k.aim, W, '400 22px ' + T.F), core = T.wrap((k.core || []).join(' · '), W, '400 22px ' + T.F), res = T.wrap(k.result, W, '700 22px ' + T.F), fl = FA.map(function(f){ return T.wrap(f[0] + ' — ' + f[1], W - 26, '400 21px ' + T.F); });
        var lay = function(go){ var yy = y + 54; if(go) T.text(k.name, x0, yy, '700 32px ' + T.F, T.NAVY); yy += 40;
          aim.forEach(function(s){ if(go) T.text(s, x0, yy, '400 22px ' + T.F, T.SUB); yy += 30; }); yy += 6;
          core.forEach(function(s){ if(go) T.text(s, x0, yy, '400 22px ' + T.F, T.MUTE); yy += 30; });
          if(fl.length){ yy += 14; if(go) T.text('Key focus · ' + T0.name + ' Track', x0, yy, '700 20px ' + T.F, T.TEAL); yy += 32;
            fl.forEach(function(L){ if(go) T.dot(x0 + 6, yy - 7, T.EDGE); L.forEach(function(s){ if(go) T.text(s, x0 + 26, yy, '400 21px ' + T.F, T.SUB); yy += 28; }); yy += 6; }); }
          yy += 8; res.forEach(function(s){ if(go) T.text(s, x0, yy, '700 22px ' + T.F, T.TEAL); yy += 30; }); return yy; };
        var end = lay(false); T.box(T.CX, y, T.Wc - T.CX * 2, end - y + 4, 26, '#fff', T.LINE, 2); lay(true); y = end + 22; });
      y = coeNotes(T, 'Good to know', '', [{ t: (P.method || '') + '.' }, { t: (S.footer || []).join(' · ') + '.' }, { t: P.small || '', mute: 1 }], y + 10);
      return y; }, { en: 1 });
    if(RP !== my) return; RP.blob = blob; var el = $('rpImg'); if(el) el.innerHTML = '<img src="' + URL.createObjectURL(blob) + '" style="width:100%;border-radius:12px;border:1px solid #E6EEF0">'; }
  var rpName = function(){ return 'CupOfEnglish-roadmap-ph-' + RP.pid + (RP.tid ? '-' + RP.tid : '') + '.png'; };
  window.rpCopy = async function(){ if(!RP || !RP.blob) return toast('Still making the picture…'); try{ await navigator.clipboard.write([new ClipboardItem({ 'image/png': RP.blob })]); toast('Picture copied · paste it in Messenger, Viber or e-mail'); }catch(e){ rpSave(); } };
  window.rpSave = async function(){ if(!RP || !RP.blob) return; var f = new File([RP.blob], rpName(), { type: 'image/png' }); if(navigator.canShare && navigator.canShare({ files: [f] })){ try{ await navigator.share({ files: [f] }); return; }catch(e){ if(e && e.name === 'AbortError') return; } } var a = document.createElement('a'); a.href = URL.createObjectURL(RP.blob); a.download = rpName(); document.body.appendChild(a); a.click(); a.remove(); toast('Picture saved'); };
  window.rpText = async function(){ var P = prog(RP.pid) || {}, T0 = (P.tracks || []).find(function(t){ return t.id === RP.tid; }), band = P.measure === 'Band';
    var out = 'Hello! Here is the CupOfEnglish ' + (P.name || '') + ' learning roadmap. Each lesson is ' + P.lessonMins + ' minutes, one-to-one, with ' + ((P.system && P.system.skills) || []).map(function(k){ return k.name; }).join(', ') + '.'
      + (T0 ? ' The ' + T0.name + ' Track is ' + T0.lessons + ' lessons' + (T0.extra ? ' + ' + T0.extra : '') + ' (≈' + T0.hours + ' hours), ' + (band ? 'target band ' : 'CEFR target ') + T0.target + (T0.gain ? ', expected band gain ' + T0.gain : '') + ': ' + String(T0.goal || '').replace(/\.$/, '') + '.' : '')
      + ' Please see the picture for the skills you will work on. You are welcome to book a trial class.\n\nCupOfEnglish';
    try{ await navigator.clipboard.writeText(out); toast('Message copied · paste it with the picture'); }catch(e){ toast(out); } };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') renderEnq(); }catch(x){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1532 PH price list on the China template · roadmap picture · PH toolkit');
