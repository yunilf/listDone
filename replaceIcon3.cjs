const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<span className="brand-icon">.*?<\/span>/;
const replacement = `<div className="brand-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><ListChecks size={32} color="var(--primary)" /></div>`;

if(regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Icon successfully replaced using Regex');
} else {
    console.log('Regex did NOT match anything.');
}
