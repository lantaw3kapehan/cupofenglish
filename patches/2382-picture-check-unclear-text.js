// 2382 (Misty 18 Nov 18:35, Teacher Kat's screenshot): "Can't tell" told a Windows teacher about the MacBook menu bar.
// Now one line for everyone: Operations looks at the picture; keep the network icon by the clock showing (Windows: LAN icon · MacBook: Wi-Fi off).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["['Can’t tell · keep your taskbar showing (MacBook: Wi-Fi icon in the menu bar, Wi-Fi off)', '#ECEAF2', '#4A4660']",
 "['Can’t tell from the picture · Operations checks it · keep the network icon by the clock showing (Windows: LAN cable icon · MacBook: Wi-Fi off)', '#ECEAF2', '#4A4660']"]
]);
