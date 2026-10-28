const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/alert\([^N]*No puedes eliminar la Categor[^a]*a/g, 'alert(`No puedes eliminar la Categor\\u00eda');
content = content.replace(/Cat\u01edlogo/g, 'Cat\u00e1logo'); // Fix Catologo if present

fs.writeFileSync(file, content, 'utf8');
