// 1711: (QA 2 Nov) two small screen defects found by the final audit's code check.
//   · Payment confirmations › tap a client's email: the email was copied, but the "Email copied" message never showed (the tap called
//     tst(), which exists only inside the confirmations block, so it threw "tst is not defined"). It now uses the app's normal toast.
//   · Teacher menu on a laptop: Team Chat is moved up to sit under Today, but it kept the group "More", so the side menu read
//     CLASSES · Today · MORE · Team Chat · CLASSES · Schedule … (a stray heading and "Classes" twice). It now takes Today's group,
//     so the menu reads CLASSES · Today · Team Chat · Schedule … Order and screens unchanged; phones unaffected (no headings there).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  [".then(()=>tst(\\'Email copied\\'))",
   ".then(()=>{ try{ toast(\\'Email copied\\'); }catch(x){} })"],
  ["if(ci > 1){ var cx = NAV_T.splice(ci, 1)[0]; NAV_T.splice(1, 0, cx); }",
   "if(ci > 1){ var cx = NAV_T.splice(ci, 1)[0]; NAV_T.splice(1, 0, cx); } try{ var cx2 = NAV_T[1]; if(cx2 && cx2[0] === 'chat' && NAV_T[0] && NAV_T[0][4]) cx2[4] = NAV_T[0][4]; }catch(e){}   /* 1711: no stray \"More\" heading above Team Chat */"]
]);
