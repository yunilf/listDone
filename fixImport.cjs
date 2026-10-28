const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('updateOrderStatus,', 'updateOrderStatus,\n  updateOrder,');

fs.writeFileSync(file, content);
console.log('Fixed App.jsx import');
