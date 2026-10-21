// 21 Oct · Misty: only the "This document…" note felt crowded. Note 8.5 px with more line spacing (1.8) and a wider gap before the Chinese;
// the verification card text goes back to its earlier size.
require('../tools/lib.js')(process.argv[2], [
[".ivp .ft .note{flex:1;display:flex;flex-direction:column;justify-content:center;font-size:9.5px;color:#6B6884;text-align:left;line-height:1.6}", ".ivp .ft .note{flex:1;display:flex;flex-direction:column;justify-content:center;font-size:8.5px;color:#7A7790;text-align:left;line-height:1.8;letter-spacing:.01em;padding-right:6px}"],
[".ivp .ft .note .zh{display:block;margin-top:5px;line-height:1.65;font-size:9px;letter-spacing:0}", ".ivp .ft .note .zh{display:block;margin-top:8px;line-height:1.85;font-size:8.5px;letter-spacing:.02em}"],
[".ivp .ft .seal>span b{display:block;font:11px/1.3 \"Fredoka One\",Fredoka,Rockwell,Arvo,serif;color:#2E2650}", ".ivp .ft .seal>span b{display:block;font:12.5px/1.3 \"Fredoka One\",Fredoka,Rockwell,Arvo,serif;color:#2E2650}"],
[".ivp .ft .seal>span{flex:1;font-size:9px;color:#6B6884;line-height:1.5;text-align:left}", ".ivp .ft .seal>span{flex:1;font-size:10px;color:#6B6884;line-height:1.5;text-align:left}"],
[".ivp .ft .seal>span small{display:block;margin-top:7px;padding-top:5px;border-top:1px solid #E7E5EF;font-size:7.5px;color:#8A879C;letter-spacing:.02em}", ".ivp .ft .seal>span small{display:block;margin-top:8px;padding-top:6px;border-top:1px solid #E7E5EF;font-size:8.5px;color:#8A879C;letter-spacing:.02em}"]
]);
