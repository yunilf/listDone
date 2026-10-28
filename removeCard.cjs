const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\s*\{\/\* Card de Conexión al Ecosistema \*\/\}[\s\S]*?Ecosistema Connect Done[\s\S]*?<\/div>/;

if(regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content);
    console.log('Card removed successfully');
} else {
    // try fallback with looser match due to encoding
    const regex2 = /\s*\{\/\* Card de Conexin al Ecosistema \*\/\}[\s\S]*?Ecosistema Connect Done[\s\S]*?<\/div>/;
    const regex3 = /\s*\{\/\* Card de Conexi.n al Ecosistema \*\/\}[\s\S]*?Ecosistema Connect Done[\s\S]*?<\/div>/;
    
    if(regex3.test(content)) {
        content = content.replace(regex3, '');
        fs.writeFileSync(file, content);
        console.log('Card removed successfully (regex 3)');
    } else {
        console.log('Target not found');
    }
}
