const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove Filter Bar
const filterBarRegex = /\s*\{\/\* Barra de Filtros de Estado \*\/\}[\s\S]*?<div className="category-filter-scroll"[\s\S]*?<\/div>\s*\}\)\}\s*<\/div>/;
content = content.replace(filterBarRegex, '');

// 2. Remove Status Badge group
const badgeRegex = /\s*<div className="order-badge-group">[\s\S]*?<\/div>/;
content = content.replace(new RegExp(badgeRegex, 'g'), '');

// 3. Remove "Actualizar Estado" block
const updateStatusRegex = /\s*\{\/\* Acciones Rápidas del Estado \*\/\}[\s\S]*?<\/select>\s*<\/div>/;
content = content.replace(new RegExp(updateStatusRegex, 'g'), '');
// Wait, the comment might have accent marks: "Acciones R.pidas del Estado"
const updateStatusRegex2 = /\s*\{\/\* Acciones R.pidas del Estado \*\/\}[\s\S]*?<\/select>\s*<\/div>/;
content = content.replace(new RegExp(updateStatusRegex2, 'g'), '');

// 4. Remove status filter logic
const filteredOrdersLogic = /const filteredOrders = orders\.filter\(\(order\) => \{[\s\S]*?\}\);/;
const replacementFilteredOrders = `const filteredOrders = orders; // All orders shown`;
content = content.replace(filteredOrdersLogic, replacementFilteredOrders);

// 5. Remove statusFilter state
const statusStateRegex = /\s*const \[statusFilter, setStatusFilter\] = useState\("Todos"\);/;
content = content.replace(statusStateRegex, '');

fs.writeFileSync(file, content);
console.log('Status sections removed');
