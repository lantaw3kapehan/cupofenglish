// 2006 (9 Nov, Misty: "maybe time-in can be soft bell"): the class / time-in sound is now a soft bell ding-dong (E6 then C6),
//   matching the "Soft bell" on the sound samples page. 15 min before: one ding-dong. Time to start: ding-dong twice.
//   Still made in the browser (no file to download), same Turn on / Turn off / Test switches as before.
const file = process.argv[2];
const OLD = "const notes = kind === 'now' ? [[784,0],[988,.16],[1319,.32],[784,.9],[988,1.06],[1319,1.22]] : [[659,0],[880,.22]];\nnotes.forEach(([f,t]) => { const o = a.createOscillator(), g = a.createGain(), at = a.currentTime + t;\no.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(0.35, at + .02); g.gain.exponentialRampToValueAtTime(0.0001, at + .55);\no.connect(g).connect(a.destination); o.start(at); o.stop(at + .6); });";
const NEW = "const notes = kind === 'now' ? [[1319,0],[1047,.45],[1319,1.2],[1047,1.65]] : [[1319,0],[1047,.45]];   /* 2006 · soft bell ding-dong */\n" +
  "const P = [[1,.30,.7],[2.76,.14,.35],[5.4,.07,.15],[8.93,.03,.07]];   /* bell overtones: [ratio, level, fade seconds] */\n" +
  "notes.forEach(([f,t]) => P.forEach(([r,v,d]) => { if(f*r > 18000) return; const o = a.createOscillator(), g = a.createGain(), at = a.currentTime + t;\n" +
  "o.type = 'sine'; o.frequency.value = f*r; g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(v, at + .004); g.gain.exponentialRampToValueAtTime(0.0001, at + .004 + d*6.9);\n" +
  "o.connect(g).connect(a.destination); o.start(at); o.stop(at + .01 + d*6.9); }));";
require('../tools/lib.js')(file, [[OLD, NEW]]);
