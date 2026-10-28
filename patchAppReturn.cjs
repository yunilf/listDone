const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Insert handleReturnOrderToActiveList
const handleUpdateOrderStatusRegex = /const handleUpdateOrderStatus = async \(id, newStatus\) => \{/;
const returnFunction = `const handleReturnOrderToActiveList = async (order) => {
    try {
      if (!window.confirm("¿Deseas devolver esta orden a la lista activa para modificarla? La orden actual será eliminada del historial.")) return;
      
      // 1. Save to "general" draft
      await handleSaveDraft("general", order.items, order.supplierName || "");
      
      // 2. Delete the order from history
      await deleteOrder(order.id);
      setOrders(prev => prev.filter(o => o.id !== order.id));
      
      // 3. Go to active list
      setActiveTab("lista-activa");
    } catch (e) {
      console.error(e);
      alert("Error al devolver la orden a la lista activa.");
    }
  };

  const handleUpdateOrderStatus = async (id, newStatus) => {`;

content = content.replace(handleUpdateOrderStatusRegex, returnFunction);

// Pass it to OrderHistory
const orderHistoryRegex = /<OrderHistory\s*orders=\{orders\}\s*suppliers=\{suppliers\}\s*onUpdateStatus=\{handleUpdateOrderStatus\}\s*onUpdateOrder=\{handleUpdateOrder\}\s*showDecimals=\{showDecimals\}\s*\/>/;
const orderHistoryReplacement = `<OrderHistory
              orders={orders}
              suppliers={suppliers}
              onUpdateStatus={handleUpdateOrderStatus}
              onUpdateOrder={handleUpdateOrder}
              onReturnToActiveList={handleReturnOrderToActiveList}
              showDecimals={showDecimals} 
            />`;

if (orderHistoryRegex.test(content)) {
    content = content.replace(orderHistoryRegex, orderHistoryReplacement);
    fs.writeFileSync(file, content);
    console.log('App.jsx patched with return to active list functionality');
} else {
    console.log('Regex did not match for OrderHistory');
}
