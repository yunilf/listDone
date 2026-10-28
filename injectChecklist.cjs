const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

const functionCode = `
  const handleToggleItemCheck = (order, itemIndex) => {
    if (!onUpdateOrder) return;
    const updatedItems = [...order.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      checked: !updatedItems[itemIndex].checked
    };
    onUpdateOrder(order.id, { items: updatedItems });
  };
`;

content = content.replace(/(const formatPrice = \(val\) => \{[\s\S]*?\};\s*)/, `$1\n${functionCode}`);

fs.writeFileSync(file, content);
console.log('Checklist function injected');
