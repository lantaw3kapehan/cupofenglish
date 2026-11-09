// 2022 (9 Nov 18:00, Misty: teachers' apps "unresponsive", "we can do it now"): several teachers had an old CupOfEnglish window running
//   next to the new one (Rose 1655, April/Dezza/Resa 1691, Cy 1582), doubling the work on laptops already running a video call.
//   A teacher's app now keeps only the window she is looking at: when a CupOfEnglish window becomes visible or focused, the other
//   windows of that browser pause themselves (paused.html) unless they are busy. Management windows are never paused. sw.js never
//   caches paused.html as the app frame. Old windows from before this version still need closing by hand once.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "<style id=\"css2020\">",
  "<script>\n/* 2022 (9 Nov 18:00, teachers' apps freezing with two CupOfEnglish windows open on one laptop): a teacher's app keeps only the window\n   she is looking at running. When a CupOfEnglish window becomes the visible one, the others on the same browser pause themselves\n   (paused.html: no timers, no chat polling, no sound) unless they are busy (a form or the time-in sheet open, typing). Management\n   windows are never paused. The paused page has \"Use CupOfEnglish here\". */\n(function(){ try{ if(!('BroadcastChannel' in window)) return; var me = Date.now() + Math.random(), ch = new BroadcastChannel('coe-win2022');\n  var teacher = function(){ try{ return typeof D !== 'undefined' && D && !D.mgr && typeof TOKEN !== 'undefined' && !!TOKEN; }catch(e){ return false; } };\n  var keep = function(){ try{ return (typeof busy === 'function' && busy()) || (!document.hidden && document.hasFocus()); }catch(e){ return true; } };\n  ch.onmessage = function(e){ var m = e.data || {}; if(m.t !== 'here' || m.id === me || !teacher()) return; if(keep()) return; try{ ch.close(); }catch(x){} location.replace('paused.html'); };\n  var here = function(){ if(!document.hidden && teacher()) try{ ch.postMessage({ t: 'here', id: me }); }catch(e){} };\n  setTimeout(here, 4000); document.addEventListener('visibilitychange', function(){ if(!document.hidden) setTimeout(here, 300); }); window.addEventListener('focus', function(){ setTimeout(here, 300); });\n}catch(e){} })();\n</script>\n<style id=\"css2020\">"
 ]
]);
