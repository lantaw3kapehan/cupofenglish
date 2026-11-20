// 2512: a Behind notice line uses the first real sentence: a line that is only a greeting or a name ("Celine,", "Hi Teacher Pam,") is skipped.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["String(t.root.subject || t.root.text || 'Notice').split(/\\n/)[0]",
   "(String(t.root.subject || t.root.text || 'Notice').split(/\\n/).map(z => z.trim().replace(/^[^A-Za-z0-9]+/, '').replace(/^(Hi|Hello|Dear|Good (morning|afternoon|evening))\\b[^,]{0,40},?\\s*/i, '')).find(z => z && !/^(Teacher\\s+)?[A-Z][\\w.'-]*( [A-Z][\\w.'-]*)?,?$/.test(z)) || 'Notice')"]
]);
