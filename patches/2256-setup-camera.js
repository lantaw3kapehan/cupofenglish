// 2256 (Misty 16 Nov 10:56): Teaching setup card · "when they click it, it opens their camera, then submit".
// The card's button now opens the camera in the app: live picture with a face guide and the setup rules, a 3-second countdown,
// then the picture to check (Retake / Send to Operations). Light check: a dark picture or a background that is not light gets a
// gentle note before sending (it can still be sent). Camera blocked or none: the teacher can still choose a file (as before).
// Sending uses the same setupUp path as before (same storage, same Operations review).
const lib = require("../tools/lib.js"), file = process.argv[2];
const pick = t => '<button type="button" class="btn sm' + (t === 'ghost' ? ' ghost' : '') + '" style="margin-top:8px" onclick="setupCam()">'
  + '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>';
const file2 = '<label class="small" style="display:inline-block;margin:8px 0 0 10px;color:var(--teal);cursor:pointer;text-decoration:underline">or upload a screenshot<input type="file" accept="image/*" hidden onchange="setupUp(this)"></label>';
lib(file, [
 ['<label class="btn sm ghost" style="margin-top:8px">Send another<input type="file" accept="image/*" hidden onchange="setupUp(this)"></label>',
  pick('ghost') + 'Take a new picture</button>' + file2],
 ['<label class="btn sm" style="margin-top:8px">Send a new screenshot<input type="file" accept="image/*" hidden onchange="setupUp(this)"></label>',
  pick() + 'Take a new picture</button>' + file2],
 ['<label class="btn sm" style="margin-top:8px">Send screenshot<input type="file" accept="image/*" hidden onchange="setupUp(this)"></label>',
  pick() + 'Open camera</button>' + file2],
 ['Once a month: open your class screen (camera on) and send one screenshot.',
  'Once a month: sit at your teaching place as you do in class, open the camera here and send one picture.'],
 ["</script>\n</body>\n</html>",
 `</script>
<script>
/* 2256 · Teaching setup: take the picture with the camera in the app */
(function(){
  if(window.setupCam) return;
  let S = null, tick = null;
  const stop = () => { try{ S && S.getTracks().forEach(t => t.stop()); }catch(e){} S = null; clearInterval(tick); tick = null; };
  const RL = ['Solid white background', 'Face lit and centred', 'Headset on', 'Camera at eye level', 'Nothing personal behind you'];
  const rules = '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 0">' + RL.map(r => '<span class="chip" style="font-size:12.5px">✓ ' + r + '</span>').join('') + '</div>';
  const fileLink = '<label class="small" style="display:block;text-align:center;margin-top:10px;color:var(--teal);cursor:pointer;text-decoration:underline">Upload a screenshot instead<input type="file" accept="image/*" hidden onchange="setupCamFile(this)"></label>';
  function look(cv){   // average light of the picture and of the two top corners (the background)
    try{ const w = 64, h = Math.round(64 * cv.height / cv.width), s = document.createElement('canvas'); s.width = w; s.height = h; const g = s.getContext('2d'); g.drawImage(cv, 0, 0, w, h);
      const d = g.getImageData(0, 0, w, h).data, L = (x, y) => { const i = (y * w + x) * 4; return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; };
      let a = 0, n = 0, b = 0, m = 0; for(let y = 0; y < h; y++) for(let x = 0; x < w; x++){ const v = L(x, y); a += v; n++; if(y < h * 0.3 && (x < w * 0.2 || x > w * 0.8)){ b += v; m++; } }
      return { all: a / n, bg: m ? b / m : 255 }; }catch(e){ return { all: 255, bg: 255 }; } }
  window.setupCam = async function(){
    stop();
    openSheet('<h1 style="margin:0">Teaching setup picture</h1><div class="small mute" style="margin-top:4px">Sit as you do in class, headset on, then tap <b>Take picture</b>. You get 3 seconds to get ready.</div>' + rules +
      '<div id="scBox" style="position:relative;margin-top:12px;border-radius:14px;overflow:hidden;background:#1d1a33;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center">' +
        '<video id="scV" playsinline muted autoplay style="width:100%;height:100%;object-fit:cover;transform:scaleX(-1)"></video>' +
        '<div id="scG" style="position:absolute;inset:0;pointer-events:none;display:none"><div style="position:absolute;left:50%;top:44%;width:38%;height:62%;transform:translate(-50%,-50%);border:2.5px dashed rgba(255,255,255,.85);border-radius:50%"></div>' +
          '<div style="position:absolute;left:0;right:0;top:36%;border-top:1px dashed rgba(255,255,255,.45)"></div><div style="position:absolute;left:10px;top:calc(36% - 20px);color:#fff;font-size:11px;opacity:.8">eyes about here</div></div>' +
        '<div id="scN" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;font-size:96px;font-weight:800;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.5)"></div>' +
        '<div id="scM" style="position:absolute;color:#fff;font-size:14px;padding:16px;text-align:center">Opening the camera…</div></div>' +
      '<div id="scT" class="small" style="margin-top:8px;display:none"></div>' +
      '<div id="scB" style="margin-top:12px"><button type="button" class="btn teal block" id="scGo" onclick="setupCamShot()" disabled>Take picture</button></div>' + fileLink);
    try{
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw { name: 'NoCam' };
      S = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
      const v = document.getElementById('scV'); if(!v){ stop(); return; } v.srcObject = S; await v.play().catch(() => {});
      document.getElementById('scM').style.display = 'none'; document.getElementById('scG').style.display = 'block'; document.getElementById('scGo').disabled = false;
      tick = setInterval(() => { const sh = document.getElementById('sheet'); if(!document.getElementById('scV') || !(sh && sh.classList.contains('on'))) stop(); }, 700);   // card closed any way → camera off
    }catch(e){ const m = document.getElementById('scM'); if(m) m.innerHTML = (e && e.name === 'NotAllowedError'
        ? 'The camera is blocked for this app.<br><span style="opacity:.8">Allow the camera in your browser (the camera icon in the address bar), then open this again.</span>'
        : 'No camera found on this device.') + '<br><br><span style="opacity:.8">You can upload a screenshot instead (below).</span>'; }
  };
  window.setupCamShot = function(){ const v = document.getElementById('scV'), n = document.getElementById('scN'), go = document.getElementById('scGo'); if(!v || !S) return; go.disabled = true;
    let k = 3; n.style.display = 'flex'; n.textContent = k; const t = setInterval(() => { k--; if(k > 0){ n.textContent = k; return; } clearInterval(t); n.style.display = 'none';
      const cv = document.createElement('canvas'); cv.width = v.videoWidth || 1280; cv.height = v.videoHeight || 960; const g = cv.getContext('2d'); g.drawImage(v, 0, 0, cv.width, cv.height);
      const box = document.getElementById('scBox'); try{ box.animate([{ opacity: .2 }, { opacity: 1 }], 250); }catch(e){}
      cv.toBlob(b => { window._scPic = new File([b], 'setup.jpg', { type: 'image/jpeg' }); v.pause(); v.style.display = 'none'; document.getElementById('scG').style.display = 'none';
        const im = document.createElement('img'); im.id = 'scI'; im.src = URL.createObjectURL(b); im.style.cssText = 'width:100%;height:100%;object-fit:cover'; box.appendChild(im);
        const L = look(cv), tip = []; if(L.all < 80) tip.push('The picture looks dark · turn on a light in front of you.'); if(L.bg < 150) tip.push('The background does not look white · sit in front of your white background.');
        const T = document.getElementById('scT'); T.style.display = tip.length ? 'block' : 'none'; T.innerHTML = tip.length ? '<div style="background:#FFF6E6;border:1.5px solid #F0D29A;border-radius:12px;padding:8px 12px;color:#7A5410">' + tip.join('<br>') + '<div style="margin-top:4px">You can retake it, or send it anyway.</div></div>' : '';
        document.getElementById('scB').innerHTML = '<label id="scLab" class="btn teal block" onclick="return false">Send to Operations<input type="file" hidden></label><button type="button" class="btn ghost block" style="margin-top:8px" onclick="setupCamRetake()">Retake</button>';
        document.getElementById('scLab').onclick = () => { setupCamSend(window._scPic); return false; };
      }, 'image/jpeg', 0.9); }, 1000); };
  window.setupCamRetake = function(){ const v = document.getElementById('scV'), im = document.getElementById('scI'); if(im) im.remove(); if(!v) return; v.style.display = ''; v.play().catch(() => {}); document.getElementById('scG').style.display = 'block'; document.getElementById('scT').style.display = 'none';
    document.getElementById('scB').innerHTML = '<button type="button" class="btn teal block" id="scGo" onclick="setupCamShot()">Take picture</button>'; };
  window.setupCamSend = async function(f){ const lab = document.getElementById('scLab'); if(!f || !lab || lab.dataset.busy) return; lab.dataset.busy = 1; const inp = lab.querySelector('input');
    try{ const dt = new DataTransfer(); dt.items.add(f); inp.files = dt.files; }catch(e){ lab.dataset.busy = ''; return toast('This browser cannot send it from here · use "Upload a screenshot instead"'); }
    await window.setupUp(inp); delete lab.dataset.busy;
    if(lab.firstChild && lab.firstChild.textContent === 'Sending…'){ stop(); closeSheet(); } };   // setupUp leaves "Sending…" on success, puts the label back on failure
  window.setupCamFile = function(inp){ const f = inp.files && inp.files[0]; if(!f) return; const B = document.getElementById('scB'); if(!B) return;
    B.innerHTML = '<label id="scLab" class="btn teal block">Send to Operations<input type="file" hidden></label>'; window._scPic = f; stop();
    const box = document.getElementById('scBox'); box.innerHTML = '<img id="scI" style="width:100%;height:100%;object-fit:contain" src="' + URL.createObjectURL(f) + '">';
    document.getElementById('scLab').onclick = e => { e.preventDefault(); setupCamSend(f); }; };
})();
</script>
</body>
</html>`]
]);
