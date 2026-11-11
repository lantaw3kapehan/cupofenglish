// 2087 (11 Nov, Misty: Team Chat "the message being sent seemed adjusting the message to rectangle or square"). One steady rounded bubble shape.
//   Source: patches/src/2087-chat-bubbles-steady.css
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CSS = fs.readFileSync(path.join(__dirname, "src/2087-chat-bubbles-steady.css"), "utf8");
lib(file, [['<script id="t2060">', '<style id="d2087">\n' + CSS + '</style>\n<script id="t2060">']]);
