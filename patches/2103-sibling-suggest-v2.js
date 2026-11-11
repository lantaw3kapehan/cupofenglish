// 2103: 2102 loads the package list and student records first when they are not loaded yet. Replaces the 2102 script.
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const OLD = fs.readFileSync(path.join(__dirname, "src/2102-sibling-suggest.client.js"), "utf8"), NEW = fs.readFileSync(path.join(__dirname, "src/2103-sibling-suggest-v2.client.js"), "utf8");
lib(file, [['<script id="s2102">\n' + OLD + '</script>', '<script id="s2102">\n' + NEW + '</script>']]);
