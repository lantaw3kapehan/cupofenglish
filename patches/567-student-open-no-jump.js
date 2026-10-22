// 22 Oct · Misty: the student page flickered when opening. The weekly schedule row in the header was added 70–120 ms after
// the page (the header grew by ~76 px and everything below jumped). It is now drawn in the same frame as the page.
require('../tools/lib.js')(process.argv[2], [
["const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); setTimeout(paint, 70); return r; };",
 "const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){} setTimeout(paint, 70); return r; };"],
]);
