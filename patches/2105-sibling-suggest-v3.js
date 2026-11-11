// 2105: sibling suggestion needs the same first two Chinese characters (family + generation name). Replaces the 2103 script.
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2103-sibling-suggest-v2.client.js"), "utf8"), NEW = fs.readFileSync(path.join(__dirname, "src/2105-sibling-suggest-v3.client.js"), "utf8");
lib(file, [['<script id="s2102">\n' + OLD + '</script>', '<script id="s2102">\n' + NEW + '</script>']]);
