// 2714 (Misty 22 Nov 18:49): Misty and Virgo teach at the office · their time-in / I'm in pictures are not read for LAN / Wi-Fi
// (docs sys:office, coe_shot_enqueue_trg, coe_wifi_flag) · the picture check shows "At the office ✓"
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`  const lab = n => n === 'cable' ? ['LAN cable ✓', '#E3F2F3', '#00616A'] : n === 'wifi' ?`, `  const lab = n => n === 'cable' ? ['LAN cable ✓', '#E3F2F3', '#00616A'] : n === 'office' ? ['At the office ✓', '#E3F2F3', '#00616A'] : n === 'wifi' ?`],
  [`  const lab = n => n === 'cable' ? 'LAN cable' : n === 'wifi' ? 'Wi-Fi' :`, `  const lab = n => n === 'cable' ? 'LAN cable' : n === 'office' ? 'At the office' : n === 'wifi' ? 'Wi-Fi' :`],
]);
