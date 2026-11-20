// 2506 (Misty: compact Students list, "as long as texts are not disrupted"): the teacher/books line, Agreement and source chips
//   share one line under the name (they wrap to a new line when space runs out, nothing is cut); tighter row padding.
const file = process.argv[2];
const CSS = '<style id="s2506">'
 + '#v-astudents .li.sa{padding-top:8px!important;padding-bottom:8px!important;margin:1px 0!important}'
 + '#v-astudents .li.sa .grow{display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px}'
 + '#v-astudents .li.sa .grow>.row{flex:1 1 100%;min-width:0}'
 + '#v-astudents .li.sa .grow>.small.mute{flex:0 1 auto;white-space:normal;overflow:visible;text-overflow:clip}'
 + '#v-astudents .li.sa .grow>.tags{margin-top:0!important;display:inline-flex;flex-wrap:wrap;gap:4px}'
 + '#v-astudents .li.sa .grow>div:has(>.sa-src){display:inline-flex;max-width:100%}'
 + '#v-astudents .li.sa .grow .sa-src{margin-top:0}'
 + '#v-astudents .li.sa>.av{width:34px;height:34px;font-size:14px}'
 + '</style>';
require('../tools/lib.js')(file, [['<script id="b2278">', CSS + '<script id="b2278">']]);
