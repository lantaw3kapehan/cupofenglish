// 2593 (audit QA-24/25, 21 Nov): the header said "Live" while sections have their own dates (wallets, cash, QA); two buttons were both
// "Refresh"; "In 09:03" was unclear. Now "Connected · 12:53" (the app's link, not the age of every figure), "Refresh data" (icon) and
// "Update ready · Update app" (asks first when a form with typed text is open), and "Timed in 09:03".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<span class=\"live\" id=\"liveTag\"><i></i>Live${PULSE.time?' · '+PULSE.time:''}</span>",
   "<span class=\"live\" id=\"liveTag\" title=\"The app is connected and was last checked at this time. Each section shows the date of its own figures.\"><i></i>Connected${PULSE.time?' · '+PULSE.time:''}</span>"],
  ["const lt = $('liveTag'); if(lt) lt.innerHTML = '<i></i>Live · ' + PULSE.time;", "const lt = $('liveTag'); if(lt) lt.innerHTML = '<i></i>Connected · ' + PULSE.time;"],
  ["<button class=\"iconbtn\" id=\"rf\" onclick=\"reload(true)\" title=\"Refresh\">", "<button class=\"iconbtn\" id=\"rf\" onclick=\"reload(true)\" title=\"Refresh data\" aria-label=\"Refresh data\">"],
  ["b.innerHTML = '<i aria-hidden=\"true\"></i><span class=\"t\">Update ready · </span>Refresh'; b.onclick = function(){ location.reload(); };",
   "b.innerHTML = '<i aria-hidden=\"true\"></i><span class=\"t\">Update ready · </span>Update app'; b.setAttribute('aria-label', 'Update the app to the new version'); b.onclick = function(){ try{ var sh = document.getElementById('sheet'), typed = sh && sh.classList.contains('on') && [].some.call(sh.querySelectorAll('textarea, input[type=text], input:not([type])'), function(x){ return String(x.value || '').trim().length > 0; }); if(typed && !confirm('A form with typed text is open. Update now? The typed text will be lost.')) return; }catch(e){} location.reload(); };   /* 2593 */"],
  ["} else { b.className = 'on'; b.innerHTML = IC + 'In ' + (ti.time || ''); b.title = 'Timed in · tap to time out'; b.onclick = () => tapTimeOut(b); }",
   "} else { b.className = 'on'; b.innerHTML = IC + 'Timed in ' + (ti.time || ''); b.title = 'Timed in · tap to time out'; b.onclick = () => tapTimeOut(b); }"],
  ["b.className = 'on'; b.innerHTML = IC + 'In ' + (ti.time || ''); b.title = 'Timed in ' + (ti.time || '')",
   "b.className = 'on'; b.innerHTML = IC + 'Timed in ' + (ti.time || ''); b.title = 'Timed in ' + (ti.time || '')"],
]);
