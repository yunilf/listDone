const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/error: \u00bfNo/g, 'error: "No');

fs.writeFileSync(file, content, 'utf8');
