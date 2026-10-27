// 1408p (Misty 22:25): teacher names are stored lowercase in the database ("cy"); the Weekly class times picture, its text and its sheet
//   always show the display name with a capital ("Teacher Cy"), whatever the source of the name.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["async function avPic(){ const A = AVD, W = avWeek();", "const avNm = n => String(n || '').trim().replace(/(^|[\\s&/,-])([a-z])/g, (m, a, c) => a + c.toUpperCase());\nasync function avPic(){ const A = AVD, W = avWeek();"],
  ["c.fillText('Teacher ' + A.name, CX, y + 82)", "c.fillText('Teacher ' + avNm(A.name), CX, y + 82)"],
  ["const t = `Teacher ${A.name} · weekly class times", "const t = `Teacher ${avNm(A.name)} · weekly class times"],
  ["openSheet(`<h1>Weekly class times · Teacher ${esc(A.name)}", "openSheet(`<h1>Weekly class times · Teacher ${esc(avNm(A.name))}"],
]);
