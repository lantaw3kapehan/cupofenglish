// 2724 (Misty 22 Nov 19:19): coe.today.cls also keeps the student's name and code for each class (teacher view only), so a
//   Speaking Activities "Copy screen" opened straight from the side menu still names the student of the class now on.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`.map(function(c){ return [new Date(c.start).getTime(), new Date(c.end).getTime()]; }).filter(function(x){ return x[0] && x[1]; });`,
   `.map(function(c){ var r = [new Date(c.start).getTime(), new Date(c.end).getTime()]; if(!D.mgr){ r.push(String(c.student || '').trim().slice(0, 40), String(c.code || '')); } return r; }).filter(function(x){ return x[0] && x[1]; });`],
]);
