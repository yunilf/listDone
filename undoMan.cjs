const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/mainejo/g, 'manejo');
content = content.replace(/permainentemente/g, 'permanentemente');

fs.writeFileSync(file, content, 'utf8');
