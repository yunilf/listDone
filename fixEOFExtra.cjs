const fs = require('fs');

const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove trailing }
content = content.replace(/\}\s*$/, '');

fs.writeFileSync(file, content, 'utf8');
console.log('Removed extra brace at EOF');
