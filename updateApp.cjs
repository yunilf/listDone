const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('updateOrderStatus,', 'updateOrderStatus,\n  updateOrder,');

const newHandler = `  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el estado de la orden");
    }
  };

  const handleUpdateOrder = async (id, updatedData) => {
    try {
      await updateOrder(id, updatedData);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updatedData } : o));
    } catch (e) {
      console.error(e);
      alert("Error al actualizar la orden");
    }
  };`;

content = content.replace(/  const handleUpdateOrderStatus = async[\s\S]*?alert\("Error al actualizar el estado de la orden"\);\s*\}\s*};/, newHandler);

const oldOrderHistoryRender = `<OrderHistory
              orders={orders}
              suppliers={suppliers}
              onUpdateStatus={handleUpdateOrderStatus}
            />`;

const newOrderHistoryRender = `<OrderHistory
              orders={orders}
              suppliers={suppliers}
              onUpdateStatus={handleUpdateOrderStatus}
              onUpdateOrder={handleUpdateOrder}
            />`;

content = content.replace(oldOrderHistoryRender, newOrderHistoryRender);

fs.writeFileSync(file, content);
console.log('App.jsx updated');
