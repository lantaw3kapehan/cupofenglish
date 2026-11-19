// 2461 (Misty 18:22 "label if the topic is CULTURE, EDUCATION, TECH … or mixed") · the teacher Today card shows every topic a
//   Talk of the Day touches (main one first), e.g. Today in China · STEM / STEAM.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["lb(ST[t.strand] || '', SC[t.strand] || SC.china)", "lb(ST[t.strand] || '', SC[t.strand] || SC.china) + (t.tags || []).filter(function(k){ return k !== t.strand && ST[k]; }).map(function(k){ return ' ' + lb(ST[k], SC[k] || SC.china); }).join('')"]
]);
