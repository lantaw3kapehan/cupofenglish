// 20 Oct · Enrolled · paid / Renewed · paid with an invoice file waited ~30 s for Google ("Saving Elsa's enrolment…" · Misty: "still too slow").
// Now the invoice goes with the save through the database queue (edge function coe-pay → writes → Google's minute job files the invoice and writes
// SALES, ACTIVE, DATABASE, with all its checks). Photos are shrunk on the device first (long side 1800 px); files over ~2.5 MB still go to Google directly.
require('../tools/lib.js')(process.argv[2], [
  ["invoice file is too big (8 MB max)'); f.file = await new Promise(res => { const rd = new FileReader(); rd.onload = () => res({ name: fl.name, mime: fl.type, b64: String(rd.result).split(',')[1] }); rd.readAsDataURL(fl); }); }",
   "invoice file is too big (8 MB max)'); f.file = await invFile(fl); }"],
  ["return toast('The invoice file is too big (8 MB max)'); }\nf.file = await new Promise(res => { const rd = new FileReader(); rd.onload = () => res({ name: fl.name, mime: fl.type, b64: String(rd.result).split(',')[1] }); rd.readAsDataURL(fl); }); }",
   "return toast('The invoice file is too big (8 MB max)'); }\nf.file = await invFile(fl); }"],
  ["!(/^mgmt(Renew|Enrol)Paid$/.test(fn) && (!args[1] || args[1].dry || args[1].file || args[1].transfer))",
   "!(/^mgmt(Renew|Enrol)Paid$/.test(fn) && (!args[1] || args[1].dry || (args[1].file && !(args[1].file.b64 && args[1].file.b64.length <= 3.4e6)) || args[1].transfer))"],
  ["setTimeout(() => ac.abort(), fn === 'timeIn' || fn === 'classIn' ? 15000 : 6000) : 0;",
   "setTimeout(() => ac.abort(), fn === 'timeIn' || fn === 'classIn' || (args[1] && args[1].file) ? 20000 : 6000) : 0;"],
  ["const r = await fetch(/^mgmt((Renew|Enrol)Paid|Renewal)$/.test(fn) ? FAST_URL + '-mgmt' : FAST_URL,",
   "const r = await fetch(/^mgmt(Renew|Enrol)Paid$/.test(fn) && args[1] && args[1].file ? FAST_URL + '-pay' : /^mgmt((Renew|Enrol)Paid|Renewal)$/.test(fn) ? FAST_URL + '-mgmt' : FAST_URL,"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n/* 382 · an invoice photo is made small before it is sent (a PDF is sent as it is) */\n" +
   "window.invFile = fl => new Promise(res => { const rd = new FileReader(); rd.onload = () => { const raw = { name: fl.name, mime: fl.type, b64: String(rd.result).split(',')[1] };\n" +
   "  if(!/^image\\/(jpe?g|png|webp|heic)/i.test(fl.type) || fl.size < 500e3) return res(raw); const im = new Image(); im.onerror = () => res(raw);\n" +
   "  im.onload = () => { try{ const k = Math.min(1, 1800 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);\n" +
   "    const b = cv.toDataURL('image/jpeg', 0.85).split(',')[1]; res(b && b.length < raw.b64.length ? { name: fl.name.replace(/\\.[a-z0-9]+$/i, '') + '.jpg', mime: 'image/jpeg', b64: b } : raw); }catch(e){ res(raw); } }; im.src = rd.result; }; rd.readAsDataURL(fl); });\n</script>\n\n</body>"]
]);
