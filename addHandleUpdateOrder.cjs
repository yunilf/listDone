const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const handleUpdateOrderStatus = async \(id, newStatus\) => \{/;
const replacement = `const handleUpdateOrder = async (id, updatedData) => {
    try {
      await updateOrder(id, updatedData);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o));
    } catch (e) {
      console.error(e);
      alert("Error al actualizar la orden");
    }
  };

  const handleUpdateOrderStatus = async (id, newStatus) => {`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Added handleUpdateOrder');
} else {
    console.log('Regex did not match');
}
