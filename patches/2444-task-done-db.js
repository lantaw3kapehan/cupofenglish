// 2444 (Misty 19 Nov 16:20: Celine marks the Resa task done and it keeps coming back, "Not found.") · the "Your tasks" Mark done
//   button sent a reaction (tMsgAck) that Google answers for sheet messages only; app-sent tasks (APP-…) were never marked.
//   Now it saves the task status (mgmtTaskStatus → database, 2420), marks it done on screen at once and refreshes Notices.
const file = process.argv[2];
const OLD = "onclick=\"msgAckM(\\'' + esc(t.root.id) + '\\',3,this);this.closest(\\'div\\').parentNode.style.opacity=.4\"";
const NEW = "onclick=\"taskDone2444(\\'' + esc(t.root.id) + '\\',this)\"";
const JS = String.raw`<script id="b2444">
window.taskDone2444 = async function(id, el){
  var row = el && el.closest('div') && el.closest('div').parentNode; if(el){ el.disabled = true; el.textContent = 'Saving…'; } if(row) row.style.opacity = .45;
  try{ var tk = (typeof TOKEN !== 'undefined' && TOKEN) || ''; var r = await api('mgmtTaskStatus', tk, id, 'done', ''); if(r && r.ok === false) throw r;
    try{ (MSG.threads || []).forEach(function(t){ if(t && t.root && t.root.id === id) t.root.react = '✅ Done!'; }); }catch(e){}
    var c = document.getElementById('myTask2418'); if(c){ var left = (MSG.threads || []).filter(function(t){ return t && t.root && /📌|Task/.test(String(t.root.text || '')) && !/^✅/.test(String(t.root.react || '')) && String(t.teacher || '').trim().toLowerCase() === String(((D && D.me) || {}).name || '').trim().toLowerCase(); }).length; if(row) row.remove(); if(!left) c.remove(); }
    if(typeof toast === 'function') toast('Done · Management can see it is done');
    try{ if(typeof loadMsgs === 'function') loadMsgs(true); }catch(e){}
  }catch(e){ if(el){ el.disabled = false; el.textContent = 'Mark done'; } if(row) row.style.opacity = 1; if(typeof toast === 'function') toast((e && (e.msg || e.error || e.message)) || 'Not saved. Try again.'); } };
</script>
`;
require('../tools/lib.js')(file, [[OLD, NEW], ['<script id="b2278">', JS + '<script id="b2278">']]);
