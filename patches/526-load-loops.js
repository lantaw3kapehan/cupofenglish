// 21 Oct · QA (future issue found): Students and Packages asked the server again immediately, forever, when the packages list or
// the agreements list came back empty or failed (each answer redrew the screen, which asked again). On a bad connection that is a
// stream of requests and redraws. Now: at most one try a minute, and the screen redraws only when the data really arrived.
require('../tools/lib.js')(process.argv[2], [
["if(!P && typeof loadActive === 'function' && !window._stAT){ window._stAT = 1; loadActive(true).then(() => { window._stAT = 0; if(VIEW === 'astudents') renderAStudents(); }).catch(() => { window._stAT = 0; }); }",
 "if(!P && typeof loadActive === 'function' && !window._stAT && Date.now() - (window._stATt || 0) > 60000){ window._stAT = 1; window._stATt = Date.now(); loadActive(true).then(() => { window._stAT = 0; if(VIEW === 'astudents' && pk()) renderAStudents(); }).catch(() => { window._stAT = 0; }); }   /* 526 */"],
["if(P && typeof AGM !== 'undefined' && !AGM && typeof agrMap === 'function' && !window._stAG){ window._stAG = 1; agrMap().then(() => { window._stAG = 0; if(VIEW === 'astudents') renderAStudents(); }).catch(() => { window._stAG = 0; }); }",
 "if(P && typeof AGM !== 'undefined' && !AGM && typeof agrMap === 'function' && !window._stAG && Date.now() - (window._stAGt || 0) > 60000){ window._stAG = 1; window._stAGt = Date.now(); agrMap().then(m => { window._stAG = 0; if(m && VIEW === 'astudents') renderAStudents(); }).catch(() => { window._stAG = 0; }); }   /* 526 */"],
["if(!AGM && typeof agrMap === 'function' && !window._agmL){ window._agmL = 1; agrMap().then(() => { window._agmL = 0; if(VIEW === 'active') renderActive(); }); }",
 "if(!AGM && typeof agrMap === 'function' && !window._agmL && Date.now() - (window._agmLt || 0) > 60000){ window._agmL = 1; window._agmLt = Date.now(); agrMap().then(m => { window._agmL = 0; if(m && VIEW === 'active') renderActive(); }).catch(() => { window._agmL = 0; }); }   /* 526 */"]
]);
