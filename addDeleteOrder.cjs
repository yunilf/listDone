const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /export const updateOrder = async \(id, updatedData\) => \{[\s\S]*?\}\);\s*\};/;
const replacement = `export const updateOrder = async (id, updatedData) => {
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
        saveLocalStorageData("fastfood_orders", orders);
      }
      return { id, ...updatedData };
    }
  );
};

export const deleteOrder = async (id) => {
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

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Added deleteOrder to firebaseHelper');
} else {
    console.log('Regex did not match updateOrder');
}
