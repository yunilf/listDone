const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/Historial de [^<]*rdenes/g, 'Historial de \u00d3rdenes');
content = content.replace(/tus [^<]*rdenes de compra/g, 'tus \u00f3rdenes de compra');
content = content.replace(/env[^a]a por WhatsApp/g, 'env\u00eda por WhatsApp');
content = content.replace(/No hay [^<]*rdenes de compra/g, 'No hay \u00f3rdenes de compra');
content = content.replace(/"A[^n]n no has generado ninguna/g, '"A\u00fan no has generado ninguna');
content = content.replace(/pesta[^a]a 'Lista Activa'/g, "pesta\u00f1a 'Lista Activa'");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed using hex escapes');
