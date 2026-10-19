// 19 Oct · QA read receipts: the "already confirmed" list is kept per teacher and fetched again when someone else signs in on the same device (Misty signed in as April after another account: April's confirmed QA notice came back).
require('../tools/lib.js')(process.argv[2], [
["  let ACK = null; try{ ACK = JSON.parse(localStorage.getItem('coe.qa.ack') || 'null'); }catch(e){}",
 "  let ACK = null, ACKW = '', ACKT = 0; const meN = () => String((D && D.me && D.me.name) || '').toLowerCase();   /* 334: per person */\n  function ackSoon(){ if(Date.now() - ACKT < 8e3) return; ACKT = Date.now(); const w = meN(); try{ const c = JSON.parse(localStorage.getItem('coe.qa.ack.' + w) || 'null'); if(c){ ACK = c; ACKW = w; } }catch(e){} loadAck(); }"],
["  function pending(){ if(!isT() || !ACK) return null;",
 "  function pending(){ if(!isT()) return null; if(ACKW !== meN()){ ackSoon(); if(ACKW !== meN()) return null; } if(!ACK) return null;"],
["      try{ localStorage.setItem('coe.qa.ack', JSON.stringify(ACK)); }catch(x){} bar(); gate(); toast(",
 "      ACKW = meN(); try{ localStorage.setItem('coe.qa.ack.' + ACKW, JSON.stringify(ACK)); }catch(x){} bar(); gate(); toast("],
["  function loadAck(){ if(!isT()) return; post('tQaAckMe').then(d => { ACK = d || []; try{ localStorage.setItem('coe.qa.ack', JSON.stringify(ACK)); }catch(x){} gate(); bar(); }).catch(() => {}); }",
 "  function loadAck(){ if(!isT()) return; const w = meN(); post('tQaAckMe').then(d => { if(w !== meN()) return; ACK = d || []; ACKW = w; try{ localStorage.setItem('coe.qa.ack.' + w, JSON.stringify(ACK)); }catch(x){} gate(); bar(); }).catch(() => {}); }"]]);
