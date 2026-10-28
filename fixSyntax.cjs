const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

const badEnd = `    </div>

      {editingOrder && (`;
const goodEnd = `
      {editingOrder && (`;

content = content.replace(badEnd, goodEnd);
fs.writeFileSync(file, content);
console.log('Fixed syntax');
