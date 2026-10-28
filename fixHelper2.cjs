const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/error: "No hay Sesi\u00f3n activa/g, 'error: `No hay Sesi\u00f3n activa');

fs.writeFileSync(file, content, 'utf8');
