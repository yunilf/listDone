const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update props
content = content.replace(/export default function OrderHistory\(\{\s*orders,\s*suppliers,\s*onUpdateStatus,\s*onUpdateOrder,\s*showDecimals = true\s*\}\) \{/, 
  'export default function OrderHistory({ orders, suppliers, onUpdateStatus, onUpdateOrder, onReturnToActiveList, showDecimals = true }) {');

// Update the Modificar button
content = content.replace(/onClick=\{\(\) => handleEditClick\(order\)\}/, 'onClick={() => onReturnToActiveList ? onReturnToActiveList(order) : handleEditClick(order)}');

fs.writeFileSync(file, content);
console.log('OrderHistory.jsx patched to call onReturnToActiveList');
