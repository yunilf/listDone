const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/vite.config.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/registerType: 'autoUpdate',/, "registerType: 'autoUpdate',\n      devOptions: {\n        enabled: true\n      },");

fs.writeFileSync(file, content);
console.log('Added devOptions to VitePWA');
