// 1965: (Misty 9 Nov 12:30 "That the app feels like a website to use, too" · "Go ahead do it now") app check, teacher screens, laptop 1440 and phone 390.
//   · Every clickable text link shows the hand pointer (18 "Edit ID", meeting-number and "Test / Turn off" links on Today did not).
//   · Trainings: a long coaching note pushed the page sideways (laptop 1493 px, phone 706 px). The card now wraps inside the screen.
//   · Pay: the paid-months table was 5 px wider than a phone; it now fits (scrolls inside its card if ever needed).
//   · Contract: "Signed … 2:55:25 PM" → 24-hour time (14:55:25), as everywhere else in CupOfEnglish.
//   · Phone header: the rank chip was cut to "Gol" next to the time-in chip. It shows in full on phones wider than 400 px;
//     on smaller phones it steps aside (rank stays on Growth and Pay) so the time-in chip and buttons keep their room.
//   · Books: "Tap a book · it opens in Google Drive, no Adobe needed" → a full sentence that also fits a laptop.
const file = process.argv[2];
const H24 = "const phT = iso => { if(!iso) return ''; const d = new Date(new Date(iso).getTime() + 8 * 3600e3); const h = d.getUTCHours(), m = d.getUTCMinutes(), s = d.getUTCSeconds();\n    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getUTCDay()] + ' ' + ph(iso) + ', ' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0'); };";
require('../tools/lib.js')(file, [
  ["}catch(e){} })();\n</script>\n</head>",
   "}catch(e){} })();\n</script>\n<style id=\"s1965\">/* 1965: website feel */\n" +
   "a.link,a[onclick],[role=button],button:not(:disabled){cursor:pointer}\n" +
   ".tx5-grid>*,.tx5 aside,.tx5 aside>*,.trm-it,.trm-it>span,.tx-cn,.tx-cn summary,.tx-cn summary span{min-width:0;max-width:100%}\n" +
   ".tx-cn summary span{overflow-wrap:anywhere}\n" +
   ".p1110r{max-width:100%;overflow-x:auto}.p1110r table{width:100%}\n" +
   "@media (max-width:899px){header .hd .sp{min-width:max-content}}\n" +
   "@media (max-width:400px){header .hd .sp{min-width:0}header .hd #cmHead{display:none}header .hd>button.on{margin-left:auto}}\n" +
   "</style>\n</head>"],
  ['<div class="bl-hd"><div><h1>Books</h1><div class="bl-sub">Tap a book · it opens in Google Drive, no Adobe needed</div></div></div>\n<input',
   '<div class="bl-hd"><div><h1>Books</h1><div class="bl-sub">Open a book to read it in Google Drive. No Adobe needed.</div></div></div>\n<input'],
  ['<div class="bl-hd"><div><h1>Books</h1><div class="bl-sub">Tap a book · it opens in Google Drive, no Adobe needed</div></div>${teach',
   '<div class="bl-hd"><div><h1>Books</h1><div class="bl-sub">Open a book to read it in Google Drive. No Adobe needed.</div></div>${teach'],
  ["const phT = iso => { if(!iso) return ''; const d = new Date(new Date(iso).getTime() + 8 * 3600e3); let h = d.getUTCHours(), m = d.getUTCMinutes(), s = d.getUTCSeconds(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;\n    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getUTCDay()] + ' ' + ph(iso) + ', ' + h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + ' ' + ap; };", H24],
  ["const phT = iso => { if(!iso) return ''; const d = new Date(new Date(iso).getTime() + 8 * 3600e3); let h = d.getUTCHours(); const m = d.getUTCMinutes(), ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return ph(iso) + ', ' + h + ':' + String(m).padStart(2, '0') + ' ' + ap; };",
   "const phT = iso => { if(!iso) return ''; const d = new Date(new Date(iso).getTime() + 8 * 3600e3); const h = d.getUTCHours(), m = d.getUTCMinutes(); return ph(iso) + ', ' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); };"],
]);
