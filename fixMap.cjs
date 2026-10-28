const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{productSuppliers\.length > 0 && \([\s\S]*?\}\)/m;
// Actually I'll use string replacement of the whole block again to be safe.
