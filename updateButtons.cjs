const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add Share2 to imports
content = content.replace(/import \{([^}]+)\} from "lucide-react";/, (match, p1) => {
    if (!p1.includes('Share2')) {
        return `import {${p1}, Share2} from "lucide-react";`;
    }
    return match;
});

// Replace the buttons block
const buttonsRegex = /<div className="order-actions" style=\{\{ display: "flex", flexDirection: "column", gap: "0\.5rem" \}\}>[\s\S]*?<\/div>\s*<\/div>\s*\)\)\}\s*<\/div>/;

const replacement = `<div className="order-actions" style={{ display: "flex", width: "100%", borderRadius: "8px", overflow: "hidden", marginTop: "1rem" }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEditClick(order)} 
                      style={{ flex: 1, borderRadius: 0, border: "none", borderRight: "1px solid rgba(255,255,255,0.1)", justifyContent: "center" }}
                    >
                      <Edit size={16} />
                      Modificar
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleSendWhatsApp(order, "personal")} 
                      style={{ flex: 1, borderRadius: 0, border: "none", backgroundColor: "#25D366", color: "white", justifyContent: "center" }}
                    >
                      <Share2 size={16} />
                      Compartir
                    </button>
                  </div>
                </div>
              ))}
            </div>`;

content = content.replace(buttonsRegex, replacement);

fs.writeFileSync(file, content);
console.log('Buttons replaced');
