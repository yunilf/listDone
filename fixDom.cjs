const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseConfig.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/AUTH_DOM[^\s,]*/g, 'AUTH_DOMAIN');
content = content.replace(/authDom[^\s:]*/g, 'authDomain');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed authDomain');
