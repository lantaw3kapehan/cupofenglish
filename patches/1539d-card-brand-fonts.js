// 1539d · Picture frame fonts = brand fonts (29 Oct 2026, Misty 03:01 / 03:02 "fix China too, font only").
// coeCard (every picture in the CupOfEnglish frame: China price lists, partner prices, personalised price, CEFR picture, course plan,
// PH price lists and roadmaps) drew its text in a slab-serif stack (Rockwell / Arvo, and a serif fallback where those fonts do not load,
// e.g. phones in mainland China where Google Fonts are blocked). Now: Inter for text and Fredoka One for headings, from the app's own font
// files (fonts/card-inter-var.woff2, fonts/card-fredoka-one.woff2, the same ones the time-in card uses), loaded before the canvas draws.
// Chinese characters use PingFang SC / Microsoft YaHei / Noto Sans SC as before. Wording and layout code unchanged (font only).
require('../tools/lib.js')(process.argv[2], [
  ["window.coeCard = async function(pill, body, opt){\ntry{ await document.fonts.ready; await Promise.all(['400 40px \"Fredoka One\"', '700 20px Arvo', '400 20px Arvo'].map(f => document.fonts.load(f).catch(() => 0))); }catch(e){}",
   "window.coeCard = async function(pill, body, opt){\ntry{ await document.fonts.ready; if(!window.__cardFonts) window.__cardFonts = Promise.all([['COE Card Fredoka', 'fonts/card-fredoka-one.woff2', '400'], ['COE Card Inter', 'fonts/card-inter-var.woff2', '100 900']].map(a => { let have = false; try{ document.fonts.forEach(f => { if(String(f.family).replace(/[\"']/g, '') === a[0]) have = true; }); }catch(e){} if(have) return 0; try{ const f = new FontFace(a[0], 'url(' + a[1] + ') format(\"woff2\")', { weight: a[2] }); document.fonts.add(f); return f.load().catch(() => 0); }catch(e){ return 0; } }));\n  await window.__cardFonts; await Promise.all(['400 40px \"COE Card Fredoka\"', '400 20px \"COE Card Inter\"', '700 20px \"COE Card Inter\"'].map(f => document.fonts.load(f).catch(() => 0))); }catch(e){}"],
  ["const S = 2, CX = 80, Wc = 1160, F = '\"Rockwell\",\"Rockwell Nova\",Arvo,\"PingFang SC\",\"Microsoft YaHei\",\"Noto Sans SC\",serif', B = '\"Fredoka One\",' + F;",
   "const S = 2, CX = 80, Wc = 1160, F = '\"COE Card Inter\",Inter,\"PingFang SC\",\"Microsoft YaHei\",\"Noto Sans SC\",sans-serif', B = '\"COE Card Fredoka\",\"Fredoka One\",' + F;"]
]);
console.log('1539d picture frame in Inter / Fredoka One');
