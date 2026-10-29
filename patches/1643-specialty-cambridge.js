// 1643: (Misty 29 Oct) the teacher-page Specialties editor also offers the Cambridge exams KET (A2 Key), PET (B1 Preliminary), FCE (B2 First).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["const BOOKS = ['PHONICS', 'OD1', 'OD2', 'OD3', 'ODF', 'REF', 'RE1', 'RE2', 'IELTS', 'TOEFL'];",
  "const BOOKS = ['PHONICS', 'OD1', 'OD2', 'OD3', 'ODF', 'REF', 'RE1', 'RE2', 'IELTS', 'TOEFL', 'KET', 'PET', 'FCE'];   // 1643 · Cambridge KET A2 Key · PET B1 Preliminary · FCE B2 First"]]);
