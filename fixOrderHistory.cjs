const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// The file has several corrupted strings now. Let's fix them with regex or direct replace
content = content.replace(/Historial de [^<]*rdenes/g, 'Historial de Órdenes');
content = content.replace(/tus [^<]*rdenes de compra/g, 'tus órdenes de compra');
content = content.replace(/env[^a]a por WhatsApp/g, 'envía por WhatsApp');
content = content.replace(/No hay [^<]*rdenes de compra/g, 'No hay órdenes de compra');
content = content.replace(/"A[^n]n no has generado ninguna/g, '"Aún no has generado ninguna');
content = content.replace(/pesta[^a]a 'Lista Activa'/g, "pestaña 'Lista Activa'");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed OrderHistory typos');
