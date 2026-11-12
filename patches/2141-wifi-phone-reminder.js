// 2141 (12 Nov, Misty 17:31–17:35): the phone's own Wi-Fi no longer locks "I'm in" (it does not show which device the class is taught on;
// Christian was locked from a phone on Wi-Fi). It shows a short reminder once and lets the teacher go on. The lock now comes from the
// time-in / I'm in picture: coe-shot-read reads the network icon in every new picture (Wi-Fi icon → the contract warning and the lock,
// as in 2135). Server: table coe_shot_read, trigger coe_shot_enqueue on log_rows, cron coe-shot-read; trigger coe_wifi_timein no longer flags.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["    if(wifiNow()){ if(!sentB){ sentB = 1; await quick(call('browser')); } const f = await quick(state(true)); return show(f || { id: 0, status: 'warned', contract: '', src: 'browser' }, go); }\n",
   "    if(wifiNow() && !sentB){ sentB = 1; return remind(go); }   /* 2141: a reminder, not a lock */\n"],
  ["const w = async function(){ if(isT() && (wifiNow() || (C.flag && Date.now() - C.at < 120000))){",
   "const w = async function(){ if(isT() && (C.flag && Date.now() - C.at < 120000)){"],
  ["    if(wifiNow()){ if(!sentB){ sentB = 1; await call('browser'); } f = await state(true) || { id: 0, status: 'warned', src: 'browser' }; } else f = await state(true);\n",
   "    f = await state(true);\n"],
  ["  async function gate(go){\n",
   "  /* 2141: phone on Wi-Fi → one reminder per session; the laptop picture decides (coe-shot-read) */\n" +
   "  function remind(go){ try{ openSheet('<div class=\"wf2135\"><div class=\"wf-h\"><b>Teach on your laptop with the LAN cable</b></div>'\n" +
   "      + '<div class=\"small\" style=\"margin:10px 2px 0;line-height:1.55\">This phone is on Wi-Fi. That is fine for the app, but your <b>class</b> must be on your laptop with the <b>LAN cable</b> (Wi-Fi off). '\n" +
   "      + 'Your <b>I&#39;m in</b> picture is checked: if it shows Wi-Fi, you get the contract warning and I&#39;m in is locked until the cable is connected.</div>'\n" +
   "      + '<button type=\"button\" class=\"btn teal block\" id=\"wfRem\" style=\"margin-top:14px\">OK · my class laptop is on the LAN cable</button></div>');\n" +
   "    const b = document.getElementById('wfRem'); if(b) b.onclick = () => { closeSheet(); go && go(); }; }catch(e){ go && go(); } }\n" +
   "  async function gate(go){\n"],
]);
