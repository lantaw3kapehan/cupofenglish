// 686: Trainings video upload — a retry after a failed upload reuses the same part (no duplicate parts); the storage's own reason
// is shown (e.g. "The object exceeded the maximum allowed size" → the file is bigger than the storage upload limit).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("let r = await call('part_set', { p: { id: pid || undefined", "pid = pid || window._trNewPart || 0; let r = await call('part_set', { p: { id: pid || undefined");
rep("const part = r.part;", "const part = r.part; window._trNewPart = part.id;");
rep("x.onload = () => x.status < 300 ? ok() : no(new Error('Upload failed (' + x.status + ')' + (x.status === 413 ? ': the file is bigger than the storage limit' : '')));",
    "x.onload = () => { if(x.status < 300) return ok(); let m = ''; try{ const j = JSON.parse(x.responseText); m = j.message || j.error || ''; }catch(y){} no(new Error(/exceed|too large|size/i.test(m) || x.status === 413 ? 'The video is bigger than the storage upload limit (' + Math.round(f.size / 1048576) + ' MB). Raise the limit in Supabase › Storage › Settings, or export the video smaller.' : 'Upload failed (' + x.status + ')' + (m ? ': ' + m : ''))); };");
rep("toast('Saved ✓'); await loadAll(true); trList(); paintAll(); }catch(x){ toast(x.message); b.disabled = false; b.textContent = 'Save'; } };",
    "window._trNewPart = 0; toast('Saved ✓'); await loadAll(true); trList(); paintAll(); }catch(x){ toast(x.message); const P = $('tpP'); if(P) P.innerHTML = '<span style=\"color:#B4442F\">' + e(x.message) + '</span>'; b.disabled = false; b.textContent = 'Try again'; } };");
rep("window.trPartEdit = function(pid, tid){", "window.trPartEdit = function(pid, tid){ window._trNewPart = 0;");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
