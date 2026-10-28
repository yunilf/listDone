const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Filter Bar completely
const filterBarRegex = /\s*\{\/\* Barra de Filtros de Estado \*\/\}[\s\S]*?<\/div>\s*\)\)\}\s*<\/div>/;
content = content.replace(filterBarRegex, '');

// 2. Fix the empty state
const emptyStateRegex = /\{statusFilter === "Todos"[\s\S]*?: `No tienes .*`\}/;
content = content.replace(emptyStateRegex, `"Aún no has generado ninguna orden de compra. Ve a la pestaña 'Lista Activa' para empezar."`);

fs.writeFileSync(file, content);
console.log('Cleaned up statusFilter references');
