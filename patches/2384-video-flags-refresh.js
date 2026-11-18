// 2384 (Misty 18 Nov 20:32: Teacher Julia uploaded Lucy's video as Eddie's; "the system didn't flag it yet").
// It was flagged ("Same file as …" at 20:29) but the "Videos to check" box on the Overview only reloads when the Overview is opened,
// so an Overview left open never showed it. Now it reloads every 3 minutes while the Overview is on screen.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["setTimeout(() => { try{ if(typeof VIEW !== 'undefined'){ if(VIEW === 'home'){ mPaint(); mLoad(); } if(VIEW === 'today'){ tPaint(); tLoad(true); } } }catch(e){} }, 1800);",
 "setTimeout(() => { try{ if(typeof VIEW !== 'undefined'){ if(VIEW === 'home'){ mPaint(); mLoad(); } if(VIEW === 'today'){ tPaint(); tLoad(true); } } }catch(e){} }, 1800);\n  setInterval(() => { try{ if(!document.hidden && typeof VIEW !== 'undefined' && VIEW === 'home' && D && D.mgr) mLoad(); }catch(e){} }, 3 * 60000);   /* 2384: an open Overview shows new video flags within 3 min */"]
]);
