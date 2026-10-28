const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add ListChecks to imports
content = content.replace('ClipboardList,', 'ClipboardList, \n  ListChecks,');

// Replace burger emoji
const target = `<span className="brand-icon">??</span>`;
const replacement = `<div className="brand-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><ListChecks size={32} color="var(--primary)" /></div>`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('Icon replaced');
