// 1547 · Every remaining picture in the brand fonts (29 Oct 2026, Misty 03:19 "font only; wording and layout unchanged").
// Pictures that draw with their own fonts used a slab-serif stack (Rockwell / Arvo / Georgia → a Times-like serif where those fonts do not
// load, e.g. Google Fonts blocked in mainland China). Now Inter (text) and Fredoka One (headings) from the app's own font files
// (fonts/card-inter-var.woff2, fonts/card-fredoka-one.woff2), registered when the app starts so they are loaded before any picture draws:
//   weekly open times + weekly class times (avaPic, avPic) · class / move / cancel / renewal / lesson balance pictures (cxDraw) · leave picture
//   (lvpDraw) · celebration picture (celPic) · Payment Confirmation (picture + PDF page) · documents shown / copied as pictures · memo picture ·
//   refund note · trial report PDF page · monthly report picture (1098) · Lesson Summary picture.
// Chinese characters: PingFang SC / Microsoft YaHei / Noto Sans SC as before. Only font-family strings change. The app's own screen font
// (:root --f) and e-mail bodies are not pictures and are not touched.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const IN = '"COE Card Inter",Inter', FR = '"COE Card Fredoka","Fredoka One"';
function all(a, b, n){ const k = s.split(a).length - 1; if (k !== n) { console.error('1547: expected ' + n + ' × ' + a.slice(0, 70) + ' · found ' + k); process.exit(1); } s = s.split(a).join(b); }
function inRange(start, end, pairs){ const i = s.indexOf(start); const j = s.indexOf(end, i); if (i < 0 || j < 0) { console.error('1547 range ' + start); process.exit(1); } let t = s.slice(i, j); pairs.forEach(([a, b, n]) => { const k = t.split(a).length - 1; if (n != null && k !== n) { console.error('1547 in ' + start.slice(0, 20) + ': ' + k + ' × ' + a); process.exit(1); } t = t.split(a).join(b); }); s = s.slice(0, i) + t + s.slice(j); }
// canvas pictures (weekly times ×2, class pictures, leave, celebration)
all(`F = '"Rockwell","Rockwell Nova",Arvo,"PingFang SC","Microsoft YaHei",serif', B = '"Fredoka One",' + F`, `F = '${IN},"PingFang SC","Microsoft YaHei","Noto Sans SC",sans-serif', B = '${FR},' + F`, 5);
// monthly report picture (1098)
all(`var F = "'Rockwell','Rockwell Nova',Arvo,'PingFang SC','Microsoft YaHei',serif", B = "'Fredoka One'," + F;`, `var F = "'COE Card Inter',Inter,'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif", B = "'COE Card Fredoka','Fredoka One'," + F;`, 1);
// Lesson Summary picture (single + shared)
all(`font-family:Rockwell,'Rockwell Nova',Arvo,'PingFang SC','Microsoft YaHei',serif`, `font-family:'COE Card Inter',Inter,'PingFang SC','Microsoft YaHei','Noto Sans SC',sans-serif`, 2);
// memo picture
all(`.memo{background:#fff;color:#2B2253;font-family:Rockwell,'Rockwell Nova',Arvo,serif;`, `.memo{background:#fff;color:#2B2253;font-family:'COE Card Inter',Inter,'PingFang SC','Microsoft YaHei',sans-serif;`, 1);
// refund note picture
all(`#rfNote{position:fixed;left:-9999px;top:0;width:760px;background:#fff;font-family:Rockwell,"Rockwell Nova",Georgia,serif;`, `#rfNote{position:fixed;left:-9999px;top:0;width:760px;background:#fff;font-family:${IN},"PingFang SC","Microsoft YaHei",sans-serif;`, 1);
// documents shown / copied as pictures
all(`--f:Rockwell,"Rockwell Nova",Arvo,Georgia,serif;--brand:"Fredoka One","Fredoka",Rockwell,"Rockwell Nova",Arvo,Georgia,serif;`, `--f:${IN},"PingFang SC","Microsoft YaHei",sans-serif;--brand:${FR},"Fredoka",${IN},sans-serif;`, 1);
// Payment Confirmation (PDF page .ivp + picture .ivq)
inRange('.ivp{width:794px', '\n.ivq .ty{', [
  ['Rockwell,"Rockwell Nova",Arvo,Georgia,"PingFang SC","Noto Sans CJK SC","Microsoft YaHei",serif', IN + ',"PingFang SC","Noto Sans CJK SC","Microsoft YaHei",sans-serif', 2],
  ['"Fredoka One",Fredoka,Rockwell,Arvo,serif', FR + ',Fredoka,' + IN + ',sans-serif'],
  ['"Fredoka One",Fredoka,Rockwell,serif', FR + ',Fredoka,' + IN + ',sans-serif'],
  ['Rockwell,Arvo,Georgia,serif', IN + ',sans-serif']]);
// monthly report PDF page (score box)
all(`.mr-tot b{display:block;font:42px 'Fredoka One','Fredoka',Rockwell,sans-serif;`, `.mr-tot b{display:block;font:42px 'COE Card Fredoka','Fredoka One','Fredoka',sans-serif;`, 1);
// trial report PDF page
inRange('.tr-page{width:794px', '.tr-st b{', [
  ["font:12px/1.45 Rockwell,'Roboto Slab',Georgia,serif", "font:12px/1.45 'COE Card Inter',Inter,'PingFang SC','Microsoft YaHei',sans-serif", 1],
  ["font:700 14px Rockwell,Arvo,Georgia,serif", "font:700 14px 'COE Card Inter',Inter,sans-serif", 1],
  ["'Fredoka One','Fredoka',Rockwell,sans-serif", "'COE Card Fredoka','Fredoka One','Fredoka',sans-serif"]]);
// the fonts, registered at start-up (before any picture draws)
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + `<script>
/* 1547 · brand fonts for pictures: registered at start-up */
(function(){ if(window.__1547) return; window.__1547 = 1;
  try{ window.__cardFonts = window.__cardFonts || Promise.all([['COE Card Fredoka', 'fonts/card-fredoka-one.woff2', '400'], ['COE Card Inter', 'fonts/card-inter-var.woff2', '100 900']].map(function(a){ var have = false; try{ document.fonts.forEach(function(f){ if(String(f.family).replace(/["']/g, '') === a[0]) have = true; }); }catch(e){} if(have) return 0; try{ var f = new FontFace(a[0], 'url(' + a[1] + ') format("woff2")', { weight: a[2] }); document.fonts.add(f); return f.load().catch(function(){ return 0; }); }catch(e){ return 0; } })); }catch(e){}
})();
/* 1547 marker */
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [['/* 1547 marker */', '/* 1547 · pictures in Inter / Fredoka One */']]);
console.log('1547 pictures in the brand fonts');
