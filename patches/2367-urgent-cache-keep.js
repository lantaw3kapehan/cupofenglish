// 2367: the urgent-line copy (2366) is forgotten only after the page has settled (20 s), not before the line arrives.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["else if(document.querySelector('#v-today section.td1104')) localStorage.removeItem(k); }catch(e){} }", "else if(Date.now() - T2366 > 20000 && document.querySelector('#v-today section.td1104')) localStorage.removeItem(k); }catch(e){} }   /* 2367: only after the page has settled */"],
["(function(){ if(window.__b2366) return; window.__b2366 = 1;", "(function(){ if(window.__b2366) return; window.__b2366 = 1; var T2366 = Date.now();"]
]);
