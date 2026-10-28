const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\s*\/\/ Crear la orden de compra[\s\S]*?navigateToHistory\(\);\s*\};/m;
content = content.replace(regex, '');

fs.writeFileSync(file, content, 'utf8');
