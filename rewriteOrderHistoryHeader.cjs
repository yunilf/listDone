const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/tus\u00d3rdenes de Compra/g, 'tus \u00f3rdenes de compra');
content = content.replace(/<h3\u00bfNo hay\u00d3rdenes de Compra<\/h3>/g, '<h3>No hay \u00f3rdenes de compra</h3>');

fs.writeFileSync(file, content, 'utf8');
