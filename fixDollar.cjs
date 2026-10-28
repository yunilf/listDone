const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("` x ${formatPrice(item.price)}`", "` x $${formatPrice(item.price)}`");

fs.writeFileSync(file, content);
console.log('Fixed dollar sign');
