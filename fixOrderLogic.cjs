const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix getOrders sorting to sort by orderNumber descending instead of just date
const getOrdersRegex = /return list\.sort\(\(a, b\) => new Date\(b\.createdAt\) - new Date\(a\.createdAt\)\);/;
const getOrdersReplacement = `return list.sort((a, b) => {
        const numA = parseInt((a.orderNumber || "").replace(/\\D/g, ""), 10) || 0;
        const numB = parseInt((b.orderNumber || "").replace(/\\D/g, ""), 10) || 0;
        if (numA !== numB) return numB - numA; // Sort by OC number descending
        return new Date(b.createdAt) - new Date(a.createdAt); // Fallback to date
      });`;
content = content.replace(getOrdersRegex, getOrdersReplacement);

// 2. Fix getLocalStorageData sorting for getOrders fallback
const localGetOrdersRegex = /return getLocalStorageData\("fastfood_orders", \[\]\);/;
const localGetOrdersReplacement = `const localOrders = getLocalStorageData("fastfood_orders", []);
      return localOrders.sort((a, b) => {
        const numA = parseInt((a.orderNumber || "").replace(/\\D/g, ""), 10) || 0;
        const numB = parseInt((b.orderNumber || "").replace(/\\D/g, ""), 10) || 0;
        if (numA !== numB) return numB - numA;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });`;
content = content.replace(localGetOrdersRegex, localGetOrdersReplacement);

// 3. Fix generateNextOrderNumber to find the MAX number instead of relying on date sorting
const generateNextOrderRegex = /if \(\!snapshot\.empty\) \{[\s\S]*?latestNum = parseInt\(match\[0\], 10\);\s*\}\s*\}/;
const generateNextOrderReplacement = `if (!snapshot.empty) {
        let maxNum = 0;
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.orderNumber) {
            const match = data.orderNumber.match(/\\d+/);
            if (match) {
              const n = parseInt(match[0], 10);
              if (n > maxNum) maxNum = n;
            }
          }
        });
        latestNum = maxNum;
      }`;
content = content.replace(generateNextOrderRegex, generateNextOrderReplacement);

// 4. Fix local generateNextOrderNumber
const localGenerateRegex = /const orders = getLocalStorageData\("fastfood_orders", \[\]\);\s*if \(orders\.length > 0\) \{[\s\S]*?latestNum = parseInt\(match\[0\], 10\);\s*\}\s*\}/;
const localGenerateReplacement = `const orders = getLocalStorageData("fastfood_orders", []);
    let maxNum = 0;
    orders.forEach(data => {
      if (data.orderNumber) {
        const match = data.orderNumber.match(/\\d+/);
        if (match) {
          const n = parseInt(match[0], 10);
          if (n > maxNum) maxNum = n;
        }
      }
    });
    latestNum = maxNum;`;
content = content.replace(localGenerateRegex, localGenerateReplacement);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed order sorting logic');
