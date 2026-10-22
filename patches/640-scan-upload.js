// 640: notarized scans — Operations (Celine) can attach them too, and the file uploads straight to storage (up to 50 MB) instead of inside the request.
require('../tools/lib.js')(process.argv[2], [
[
"(/signed|paper/.test(r.status) && P ? '<label class=\"btn sm ghost\" style=\"cursor:pointer\">' + (r.scan_at ? 'Replace notarized scan' : 'Attach notarized scan')",
"(/signed|paper/.test(r.status) ? '<label class=\"btn sm ghost\" style=\"cursor:pointer\">' + (r.scan_at ? 'Replace notarized scan' : 'Attach notarized scan')"
],
[
"  window.ctPut = async (id, t, inp) => { const f = inp.files && inp.files[0]; if(!f) return; if(f.size > 15e6) return toast('The file is larger than 15 MB');\n    toast('Uploading ' + f.name + '…');\n    try{ const b64 = await new Promise((ok, no) => { const rd = new FileReader(); rd.onload = () => ok(String(rd.result).split(',')[1]); rd.onerror = no; rd.readAsDataURL(f); });\n      await call('scan_put', { id, name: f.name, type: f.type || 'application/pdf', b64 }); toast('Notarized scan attached ✓'); await refresh(t); }catch(x){ toast(x.message); } };",
"  window.ctPut = async (id, t, inp) => { const f = inp.files && inp.files[0]; inp.value = ''; if(!f) return; if(f.size > 50e6) return toast('The file is larger than 50 MB. Scan at a lower resolution and try again.');\n    /* 640: President or Operations · the file goes straight to storage (signed upload link), so large multi-page scans work */\n    const ty = f.type || (/\\.pdf$/i.test(f.name) ? 'application/pdf' : /\\.(heic|heif)$/i.test(f.name) ? 'image/heic' : /\\.png$/i.test(f.name) ? 'image/png' : 'image/jpeg');\n    toast('Uploading ' + f.name + ' (' + Math.max(1, Math.round(f.size / 1e5) / 10) + ' MB)…');\n    try{ const s = await call('scan_sign', { id, type: ty, size: f.size });\n      const up = await fetch(s.url, { method: 'PUT', headers: { 'Content-Type': ty, 'x-upsert': 'false' }, body: f }); if(!up.ok) throw new Error('Upload failed (' + up.status + '). Check the internet and try again.');\n      await call('scan_done', { id, path: s.path, name: f.name }); toast('Notarized scan attached ✓'); await refresh(t); }catch(x){ toast(x.message); } };"
]
]);
