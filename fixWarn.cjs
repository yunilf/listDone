const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/wA[^\w\s]n/g, 'warn');
content = content.replace(/wA\u01e7n/g, 'warn');
content = content.replace(/n\u01e7mero/g, 'n\u00famero');
content = content.replace(/n\u01e7/g, 'n\u00fa');

fs.writeFileSync(file, content, 'utf8');
