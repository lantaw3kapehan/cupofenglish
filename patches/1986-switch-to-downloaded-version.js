// 1986: (Misty 9 Nov "refresh feels slow still") The app frame (index.html) now opens the saved copy at once and downloads a newer version
//   behind it, marking it in localStorage 'coe.newV'. The app treats that as a newer saved copy and switches to it when not in use
//   (applyUpdate: reload, or the "New version ready" button while a form is open or a class is running). Also checked again at 20 s.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["function newerSaved(){ let c = ''; try{ c = localStorage.getItem('coe.app') || ''; }catch(e){} const m = c.match(/const COE_V = (\\d+);/); return m && +m[1] > COE_V; }",
   "function newerSaved(){ try{ const nv = +(localStorage.getItem('coe.newV') || 0); if(nv > COE_V) return true; }catch(e){} let c = ''; try{ c = localStorage.getItem('coe.app') || ''; }catch(e){} const m = c.match(/const COE_V = (\\d+);/); return m && +m[1] > COE_V; }   /* 1986: + the frame's background download */"],
  ["if(API_URL && !GAS){ setTimeout(applyUpdate, 2500); setTimeout(applyUpdate, 8000);",
   "if(API_URL && !GAS){ setTimeout(applyUpdate, 2500); setTimeout(applyUpdate, 8000); setTimeout(applyUpdate, 20000);   /* 1986 */"],
]);
