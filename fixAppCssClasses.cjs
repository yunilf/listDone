const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/app-contA\u01e7ner/g, 'app-container');
content = content.replace(/@keyfram\u01eds/g, '@keyframes');
content = content.replace(/Cat\u01edlogo/g, 'Cat\u00e1logo');

fs.writeFileSync(file, content, 'utf8');
