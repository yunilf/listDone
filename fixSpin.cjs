const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/<style>\{\`@keyframes spin \{ to \{ transform: rotate\(360deg\); \} \}\`\}<\/style>/g, '<style dangerouslySetInnerHTML={{ __html: "@keyframes spin { to { transform: rotate(360deg); } }" }} />');

fs.writeFileSync(file, content);
console.log('Fixed spin styles');
