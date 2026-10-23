#!/bin/bash
# Test a patch on a copy of app.html, and only if it applies and every script checks out, commit and push it.
# usage: tools/ship.sh patches/NNN-name.js "commit message" [extra files...]
set -euo pipefail
p="$1"; msg="$2"; shift 2
cp app.html /tmp/claude-0/ship.html
node "$p" /tmp/claude-0/ship.html
node tools/check.js /tmp/claude-0/ship.html
git checkout -q version.txt
git add "$p" "$@"
git commit -qm "$msg"
git pull -q --rebase
git push -q
git log --oneline -1
