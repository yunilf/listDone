const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<button className="btn btn-outline" onClick={() => handleEditClick(order)} style={{ width: "100%", borderColor: "var(--border-color)", color: "var(--text-main)", marginBottom: "0.5rem" }}>
                    Editar Orden
                  </button>`;

const replacement = `<button className="btn btn-secondary" onClick={() => handleEditClick(order)} style={{ width: "100%", marginBottom: "0.5rem" }}>
                    <Edit size={16} />
                    Modificar Orden
                  </button>`;

if(content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content);
    console.log('Button updated');
} else {
    console.log('Target not found');
}
