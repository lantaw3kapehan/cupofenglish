// 819: (Misty) "the word MONEY on the screen can be changed, as the word itself may attract evil eye"
// "Money" leaves every screen: the management menu group is now "Finance" (Payroll · Sales & costs · History),
// the Monitor sub-tab and the activity tag say "Finance", and the teacher's own pay group says "Pay". Sales & costs: "Money in / out" → "Received / Paid out".
// coe-monitor v3 sends the tab name "Finance" too.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["label: 'Money'", "label: 'Finance'"],
  ["g.label === 'Money' ? 'Money'", "g.label === 'Finance' ? 'Finance'"],
  ["['payroll','Payroll','pay',0,'Money'],['money','Sales & costs','money',1,'Money'],['mypay','My pay','pay',1,'Money'],", "['payroll','Payroll','pay',0,'Finance'],['money','Sales & costs','money',1,'Finance'],['mypay','My pay','pay',1,'Finance'],"],
  ["['payroll','Money'],['money','Money'],['gov','Money'],['mypay','Money']", "['payroll','Finance'],['money','Finance'],['gov','Finance'],['mypay','Finance']"],
  ["loading('Money')", "loading('Finance')"],
  ["pay: 'Money' };", "pay: 'Pay' };"],
  ["[/expense|sale|pay|invoice|money/i, 'Money',", "[/expense|sale|pay|invoice|money/i, 'Finance',"],
  ["'Leave & cases', 'Students', 'Money', 'Messages'", "'Leave & cases', 'Students', 'Finance', 'Messages'"],
  ["['out', 'Money out'], ['in', 'Money in']", "['out', 'Paid out'], ['in', 'Received']"],
  ["out: 'Money out', in: 'Money in'", "out: 'Paid out', in: 'Received'"]
]);
