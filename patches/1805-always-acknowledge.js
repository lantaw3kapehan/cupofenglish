// 1805: (Misty 6 Nov 15:55 "this will always be there on teacher's access right? it's important they acknowledge consequences")
//   The acknowledgement is now on every notice of unavailability, not only when a lesson is under 4 h, and it must be ticked to send.
//   Its words follow the notice: under 4 h → "lessons with less than 4 h notice carry a service credit …"; otherwise the general rule.
//   The tick survives screen refreshes while the words stay the same, and the exact words with the time are saved at the end of
//   the reason ("[Acknowledged in the App …]") so the record shows what the teacher agreed to.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  TLV1795.needAck = n > 0 && h0 < 4;   /* 1802: only when a lesson is under 4 h (Clause 2.9) */",
   "  TLV1795.needAck = true;   /* 1805: always */\n"
   + "  TLV1795.ackText = n && h0 < 4 ? 'I understand that ' + (n === 1 ? 'this lesson has' : 'lessons here have') + ' less than 4 hours’ notice (Clause 2.9) and carry a service credit (Clause 4.1) after review (Clause 5.1), and that a third late cancellation in one calendar month may pause my lesson offers (Clause 5.2).'\n"
   + "    : 'I understand that a notice given less than 4 hours before a lesson carries a service credit (Clause 4.1) after review (Clause 5.1), and that a third late cancellation in one calendar month may pause my lesson offers (Clause 5.2).';\n"
   + "  if(TLV1795.ackSeen !== TLV1795.ackText){ TLV1795.ack = false; TLV1795.ackSeen = TLV1795.ackText; }"],
  ["if(TLV1795.needAck) out += '<label class=\"row\" style=\"gap:8px;margin-top:8px;font-weight:600\"><input type=\"checkbox\" id=\"tlAck\"> I understand lessons with less than 4 h notice carry a service credit (Clause 4.1), after review (Clause 5.1).</label>';",
   "if(TLV1795.needAck) out += '<label class=\"row\" style=\"gap:8px;margin-top:10px;font-weight:600;align-items:flex-start\"><input type=\"checkbox\" id=\"tlAck\" style=\"margin-top:3px\" onchange=\"TLV1795.ack=this.checked\"' + (TLV1795.ack ? ' checked' : '') + '> <span>' + esc(TLV1795.ackText) + '</span></label>';"],
  ["if(TLV1795.needAck && !($('tlAck') || {}).checked) return toast('Tick the box: less than 4 h notice');",
   "if(!$('tlAck')){ try{ tlv1795(); }catch(e){} TLV1795.needAck = true; if(!TLV1795.ackText) TLV1795.ackText = 'I understand that a notice given less than 4 hours before a lesson carries a service credit (Clause 4.1) after review (Clause 5.1), and that a third late cancellation in one calendar month may pause my lesson offers (Clause 5.2).'; if(!$('tlAck')) return toast('Wait for the booked lessons to load, then tick the box'); }\n"
   + "if(TLV1795.needAck && !($('tlAck') || {}).checked) return toast('Tick the box to confirm you understand the service credit');\n"
   + "if(TLV1795.needAck) f.reason = String(f.reason).trim() + '\\n[Acknowledged in the App ' + new Date().toLocaleString('en-GB', { timeZone: 'Asia/Manila', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' PH: ' + TLV1795.ackText + ']';   /* 1805 */"],
]);
