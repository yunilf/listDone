const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="order-actions" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>`;
const replacement = `<div className="order-actions" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <button className="btn btn-outline" onClick={() => handleEditClick(order)} style={{ width: "100%", borderColor: "var(--border-color)", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                    Editar Orden
                  </button>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
console.log('Button inserted');
