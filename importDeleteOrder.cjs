const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('updateOrder,', 'updateOrder,\n  deleteOrder,');

fs.writeFileSync(file, content);
console.log('Imported deleteOrder in App.jsx');
