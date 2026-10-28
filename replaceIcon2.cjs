const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = '<span className="brand-icon">??</span>';
const replacement = `<div className="brand-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><ListChecks size={32} color="var(--primary)" /></div>`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Icon successfully replaced');
} else {
    console.log('Target NOT found in file.');
}
