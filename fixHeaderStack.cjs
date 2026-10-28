const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div style=\{\{ display: "flex", gap: "1rem", marginTop: "0\.5rem", flexWrap: "wrap", fontSize: "0\.85rem", color: "var\(--text-muted\)" \}\}>/;
const replacement = `<div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Supplier moved below date');
} else {
    console.log('Regex did not match');
}
