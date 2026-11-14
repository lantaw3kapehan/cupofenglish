// 2206 (14 Nov · Misty: "the screen is adjusting and readjusting when refreshed, President Overview and others"):
// after a refresh several cards arrive one after another (birthday/holiday notes, payroll, China dates…) and push the page down.
// Now, only on the first load after a refresh, the page stays invisible until it stops changing (0.3 s quiet) or 1.2 s at most,
// then fades in once, already settled. Moving between screens is not affected.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["<meta charset=\"utf-8\">\n<style id=\"st2053\">",
 "<meta charset=\"utf-8\">\n<style id=\"st2206\">html.st06 #main1467{opacity:0}html.st06f #main1467{transition:opacity .2s ease}</style>\n" +
 "<script id=\"x2206\">(function(){ var d = document.documentElement, t0 = Date.now(), last = Date.now(), done = false, mo = null; d.classList.add('st06');\n" +
 "  function show(){ if(done) return; done = true; d.classList.add('st06f'); d.classList.remove('st06'); try{ mo && mo.disconnect(); }catch(e){} }\n" +
 "  function tick(){ if(done) return; var n = Date.now(), m = document.getElementById('main1467'), has = m && m.textContent && m.textContent.length > 150;\n" +
 "    if(n - t0 > 1200 || (has && n - last > 300 && n - t0 > 350)) return show(); setTimeout(tick, 80); }\n" +
 "  function start(){ var m = document.getElementById('main1467'); if(!m){ if(Date.now() - t0 > 1200) return show(); return setTimeout(start, 40); }\n" +
 "    try{ mo = new MutationObserver(function(){ last = Date.now(); }); mo.observe(m, { childList: true, subtree: true }); }catch(e){} tick(); }\n" +
 "  setTimeout(show, 2000); start(); })();</script>\n<style id=\"st2053\">"]]);
