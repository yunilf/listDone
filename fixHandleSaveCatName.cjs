const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/handleSaveCa\.name/g, 'handleSaveCatName');

fs.writeFileSync(file, content, 'utf8');
