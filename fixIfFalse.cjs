const fs = require('fs');

const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// The block starts at `if (false) {` and ends before `});` (the end of onAuthStateChanged)
// Let's use a regex that matches from `if \(false\) \{` down to the end of the `else` block.

const buggyBlockRegex = /if \(false\) \{[\s\S]*?if \(unsubDrafts\) unsubDrafts\(\);\s*\}/;

if (buggyBlockRegex.test(content)) {
  content = content.replace(buggyBlockRegex, '');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed the buggy if (false) else block!');
} else {
  console.log('Regex did not match.');
}
