const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<OrderHistory\s*orders=\{orders\}\s*suppliers=\{suppliers\}\s*onUpdateStatus=\{handleUpdateOrderStatus\}\s*showDecimals=\{showDecimals\} \/>/;
const replacement = `<OrderHistory
            orders={orders}
            suppliers={suppliers}
            onUpdateStatus={handleUpdateOrderStatus}
            onUpdateOrder={handleUpdateOrder}
            showDecimals={showDecimals} 
          />`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Fixed OrderHistory props');
} else {
    console.log('Regex did not match');
}
