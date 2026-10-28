const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

const deleteCode = `\n\nexport const deleteOrder = async (id) => {
  return executeMutation(
    async () => {
      await deleteDoc(doc(db, "orders", id));
      return id;
    },
    async () => {
      const orders = await getOrders();
      const newOrders = orders.filter(o => o.id !== id);
      saveLocalStorageData("fastfood_orders", newOrders);
      return id;
    }
  );
};`;

content += deleteCode;

fs.writeFileSync(file, content);
console.log('Appended deleteOrder');
