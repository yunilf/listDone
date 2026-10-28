const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the junk
content = content.replace(/\} \}\`\}<\/style>\s*<\/div>\s*\);\s*\}/, '');

fs.writeFileSync(file, content);
console.log('Cleaned up junk');
