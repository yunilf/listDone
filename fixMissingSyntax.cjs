const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/firebaseHelper.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/return id;\s*export const getOrders = async \(\) => \{/, 'return id;\n    }\n  );\n};\n\nexport const getOrders = async () => {');

// Remove the `}` at the end that I added with echo
content = content.replace(/\}\s*$/, '');

fs.writeFileSync(file, content, 'utf8');
