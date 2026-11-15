// 2247 (Misty 15 Nov): To do › Wi-Fi checks buttons say clearly what to click when the teacher had permission to use Wi-Fi.
// · Picture alert (not locked):  "OK · LAN cable or approved Wi-Fi"  /  "Wi-Fi, not approved · warn the teacher"
// · Locked teacher:              "Unlock · LAN cable or approved Wi-Fi"  /  "Wi-Fi, not approved · open a case"
// Same actions as before; only the words (and a hover hint) change.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["')\">Wi-Fi · warn the teacher</button>' + '<button type=\"button\" onclick=\"o2091ok(' + i + ', this)\">It\\'s the LAN cable</button>",
  "')\" title=\"The teacher used Wi-Fi without permission: send the contract warning and lock I\\'m in\">Wi-Fi, not approved · warn the teacher</button>' + '<button type=\"button\" onclick=\"o2091ok(' + i + ', this)\" title=\"The picture shows the LAN cable, or the teacher told us before and we allowed Wi-Fi: close this, no warning\">OK · LAN cable or approved Wi-Fi</button>"],
 [",\\'cleared\\',\\'' + String(x.teacher || '').replace(/[^A-Za-z .-]/g, '') + '\\')\">Allow · not Wi-Fi</button>",
  ",\\'cleared\\',\\'' + String(x.teacher || '').replace(/[^A-Za-z .-]/g, '') + '\\')\" title=\"The picture shows the LAN cable, or the teacher told us before and we allowed Wi-Fi: unlock I\\'m in, no case\">Unlock · LAN cable or approved Wi-Fi</button>"],
 [",\\'confirmed\\',\\'' + String(x.teacher || '').replace(/[^A-Za-z .-]/g, '') + '\\')\">Taught on Wi-Fi · open a case</button>",
  ",\\'confirmed\\',\\'' + String(x.teacher || '').replace(/[^A-Za-z .-]/g, '') + '\\')\" title=\"The teacher used Wi-Fi without permission: unlock I\\'m in and open the case form\">Wi-Fi, not approved · open a case</button>"]
]);
