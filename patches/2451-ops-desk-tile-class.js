// 2451 (Misty 16:57 · "fixed and cleared" box still tall) · the number's colour class "g" also matched another screen's
//   ".g{flex:1 1 300px}" rule and stretched that box · renamed to kr / kg.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["od2447Show(\\'found\\')\"><b class=\"r\">", "od2447Show(\\'found\\')\"><b class=\"kr\">"],
  ["od2447Show(\\'fixed\\')\"><b class=\"g\">", "od2447Show(\\'fixed\\')\"><b class=\"kg\">"],
  ['<script id="b2278">', `<style id="u2451">#v-mtoday #od2341>.c:first-of-type .k b.kr{color:#A2462C!important}#v-mtoday #od2341>.c:first-of-type .k b.kg{color:#1E7A4F!important}#v-mtoday #od2341 .k>.kt>b{flex:none!important}</style>
<script id="b2278">`]
]);
