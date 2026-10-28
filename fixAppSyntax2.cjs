const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/alert\(`No puedes eliminar la Categor\\u00eda/g, 'alert(`No puedes eliminar la Categor\u00eda');

fs.writeFileSync(file, content, 'utf8');
