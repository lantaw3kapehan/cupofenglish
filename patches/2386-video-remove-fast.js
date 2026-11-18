// 2386 (Misty 18 Nov 20:38 "the removing is slow"): Wrong file · remove waited for Google (it never finished for Eddie's video).
// Now the database removes it at once (coe-train vf_remove → coe_vid_remove: kept in coe_vid_removed, class shows no video, the teacher gets
// a message and a phone alert); the flag is marked done for every manager; Google's Drive clean-up is asked in the background (not waited for).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["      let r = null; try{ r = await apiNow('mgmtVidRemove', TOKEN, { id: x.id, ds: x.ds || String(x.start || '').slice(0, 10) }); }catch(e){ r = { ok: false, msg: e.message }; }",
 "      let r = null; try{ r = await vfCall({ action: 'vf_remove', id: x.id, reason: ((x.flags || [])[0] || {}).t || '' }); if(r && !r.ok && /already removed/i.test(r.msg || '')) r = { ok: true }; if(r && !r.ok) r.msg = r.msg || r.error; }catch(e){ r = { ok: false, msg: e.message }; }   /* 2386: the database at once */\n      if(r && r.ok){ try{ vfCall({ action: 'vf_dec', k: vfK(x), st: 'ok', note: 'Removed · wrong file' }).catch(() => {}); }catch(e){} try{ apiNow('mgmtVidRemove', TOKEN, { id: x.id, ds: x.ds || String(x.start || '').slice(0, 10) }).catch(() => {}); }catch(e){} }   /* Google's Drive clean-up in the background */"]
]);
