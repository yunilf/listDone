const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

const regex = /list\.sort\(\(a, b\) => new Date\(b\.createdAt\) - new Date\(a\.createdAt\)\);/g;
const replacement = `list.sort((a, b) => {
          const numA = parseInt((a.orderNumber || "").replace(/\\D/g, ""), 10) || 0;
          const numB = parseInt((b.orderNumber || "").replace(/\\D/g, ""), 10) || 0;
          if (numA !== numB) return numB - numA;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content, 'utf8');
