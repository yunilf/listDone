const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\s*productSuppliers\.map\(assignedSupplier => \{[\s\S]*?\}\)\s*\}[\s\S]*?<\/div>\s*\)\}\s*<\/div>\s*<\/div>\s*<div style=\{\{ display: "flex", gap: "0\.4rem" \}\}>/m;
const replacement = `                           })}
                          </div>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem" }}>`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content, 'utf8');
