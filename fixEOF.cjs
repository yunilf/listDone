const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content += '\n}';

fs.writeFileSync(file, content);
console.log('Added } at EOF');
