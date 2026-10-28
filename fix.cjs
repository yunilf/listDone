const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// The exact corrupted string in the template literal
content = content.replace("`? ${item.quantity}", "`• ${item.quantity}");

fs.writeFileSync(file, content);
console.log('Fixed bullet point');
