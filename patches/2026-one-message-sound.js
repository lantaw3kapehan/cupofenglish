// 2026 (9 Nov 19:52, Misty: "did you follow the sound I said · I feel I'm hearing a different sound"): Team Chat already plays the
//   marimba, but the app had a second, older sound (three quick beeps) for Notices & requests messages, replies to management messages
//   and saved-change confirmations. Those now play the same marimba (chat-marimba.wav, at the Chat sounds volume). The tiny "pop" when
//   tapping an emoji stays. Held: released after classes with 2025.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "function ding(kind){ try{ const A = SND || (typeof ACX !== 'undefined' && ACX); if(!A) return;",
  "function ding(kind){ if(kind !== 'pop'){ try{ const au = ding.au2026 || (ding.au2026 = new Audio('chat-marimba.wav')); let v = 1; try{ v = parseFloat(localStorage.getItem('coe.chatVol')); if(isNaN(v)) v = 1; }catch(e){} au.volume = Math.max(0, Math.min(1, v)); au.currentTime = 0; const p = au.play(); if(p && p.catch) p.catch(() => {}); return; }catch(e){} }   /* 2026: every message sound is the marimba (Notices & requests, replies, saves) */\n  try{ const A = SND || (typeof ACX !== 'undefined' && ACX); if(!A) return;"
 ]
]);
