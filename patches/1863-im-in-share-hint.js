// 1863: (Misty 7 Nov "Julia is saying she's been tapping I'm in") On a laptop, "I'm in" first opens the browser's screen-sharing window
//   (screen proof). If that window is behind the class window, the app waited with "Saving…" and further taps were ignored, so nothing
//   was recorded until she picked Entire screen (Julia: tapped before 17:00, saved 17:04). Now, after 5 seconds of waiting, a clear note
//   at the top says to choose Entire screen and tap Share (it may be behind the class window); it goes away as soon as she shares or cancels.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["async function grabScreen(){\nlet st; try{ st = await navigator.mediaDevices.getDisplayMedia(",
   "function shHint(on){ let b = document.getElementById('shHint'); if(!on){ if(b) b.remove(); return; } if(b) return; b = document.createElement('div'); b.id = 'shHint'; b.setAttribute('role', 'status');\n"
   + "b.style.cssText = 'position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:99999;background:#2B2253;color:#fff;border-radius:16px;padding:14px 20px;font-size:16px;line-height:1.45;max-width:560px;width:calc(100% - 32px);box-sizing:border-box;box-shadow:0 10px 30px rgba(0,0,0,.25)';\n"
   + "b.innerHTML = '<b>Waiting for your screen share.</b><br>In the sharing window, choose <b>Entire screen</b>, then tap <b>Share</b>. If you cannot see the window, it may be behind your class window.'; document.body.appendChild(b); }\n"
   + "async function grabScreen(){\nconst hintT = setTimeout(() => shHint(1), 5000);\nlet st; try{ st = await navigator.mediaDevices.getDisplayMedia("],
  ["catch(e){ return { err: e && e.name === 'NotAllowedError' ? (/system/i.test(String(e.message || '')) ? 'blocked' : 'not shared') : 'share failed' }; }\nconst tr = st.getVideoTracks()[0],",
   "catch(e){ clearTimeout(hintT); shHint(0); return { err: e && e.name === 'NotAllowedError' ? (/system/i.test(String(e.message || '')) ? 'blocked' : 'not shared') : 'share failed' }; }\nclearTimeout(hintT); shHint(0);\nconst tr = st.getVideoTracks()[0],"]]);
