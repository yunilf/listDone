const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/textTransform: "uppercase\u00d3rdenes de Compra/g, 'textTransform: "uppercase" }}>\n              \u00d3rdenes de Compra');
content = content.replace(/textTransform: "uppercase[^>]*rdenes de Compra/g, 'textTransform: "uppercase" }}>\n              \u00d3rdenes de Compra');

fs.writeFileSync(file, content, 'utf8');
