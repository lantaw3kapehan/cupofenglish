// 1802: (Misty 6 Nov 15:39–15:41) "a short notice here is less than 4 hours, right? as per our contract?" · "put there the number of
//   leave she has asked whether short or not" · "is the amount here accurate from our contract and rules?" · "ensure alignment with
//   our contract and rules". Checked against Addendum No. 1 (v1.0):
//   - Clause 2.9: notice at least 4 h before the lesson, proof where available → 4 h or more = requirement met, NO service credit
//     (the "planned under 7 days" charge and the 48 h proof deadline were not in the contract and are removed).
//   - Clause 4.1: Excused = Operations notified in advance with a valid reason; Unexcused = not. New = first 60 days of service,
//     Regular = from day 61 (replaces 1800/1801 rank and 6-month rules). Amounts ₱100/₱300 excused, ₱300/₱500 unexcused.
//   - Clause 5.1: a notice of breach comes before any credit · Clause 5.2: a 3rd cancellation case in one calendar month may pause offers.
//   Count line: notices in the last 60 days, how many with less than 4 h notice, this year, and late ones this month.
//   The old/new texts are in 1802-late-notice-count.pairs.json.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, require('./1802-late-notice-count.pairs.json'));
