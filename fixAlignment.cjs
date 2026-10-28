const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the wrapping div for the totals to include marginLeft: "auto"
content = content.replace(/<div style=\{\{ display: "flex", gap: "1\.5rem" \}\}>/, '<div style={{ display: "flex", gap: "1.5rem", marginLeft: "auto", flexWrap: "wrap", justifyContent: "flex-end" }}>');

fs.writeFileSync(file, content);
console.log('Fixed totals alignment');
