const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

const newFunc = `export const updateOrder = async (id, updatedData) => {
  return executeMutation(
    async () => {
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, updatedData);
      return { id, ...updatedData };
    },
    async () => {
      const orders = await getOrders();
      const index = orders.findIndex(o => o.id === id);
      if (index !== -1) {
        orders[index] = { ...orders[index], ...updatedData };
        localStorage.setItem("fastfood_orders", JSON.stringify(orders));
      }
      return { id, ...updatedData };
    }
  );
};`;

content = content.replace('export const updateOrderStatus =', newFunc + '\n\nexport const updateOrderStatus =');
fs.writeFileSync(file, content);
console.log('Added updateOrder');
