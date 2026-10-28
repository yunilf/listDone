const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/disabled=\{activeItems\.length === 0 \|\| \!selectedSupplierId\}/g, 'disabled={activeItems.length === 0 || !selectedSupplierId || isSubmitting}');
content = content.replace(/opacity: \(activeItems\.length === 0 \|\| \!selectedSupplierId\) \? 0\.5 : 1/g, 'opacity: (activeItems.length === 0 || !selectedSupplierId || isSubmitting) ? 0.5 : 1');
content = content.replace(/<CheckCircle2 size=\{18\} \/>\s*Generar Orden de Compra/g, '<CheckCircle2 size={18} /> {isSubmitting ? "Generando..." : "Generar Orden de Compra"}');

fs.writeFileSync(file, content, 'utf8');
