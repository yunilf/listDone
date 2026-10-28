const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\s*productSuppliers\.map\(assignedSupplier => \{[\s\S]*?\}\)\s*\}[\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*<div style=\{\{ display: "flex", gap: "0\.4rem" \}\}>/m;

// wait, let's just find `)} </div> <div style={{ display: "flex", gap: "0.4rem" }}>`
// It currently is `)} </div> </div> <div style={{ display: "flex", gap: "0.4rem" }}>` 
// Let's replace `)} </div> </div>` with `)} </div> </div> </div>`? No, let's look at the structure.
