const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

const badBlockRegex = /\s*\/\/ Crear la orden de compra\s*onCreateOrder\(orderData\);\s*\/\/ Eliminar el borrador actual de la base de datos \(limpieza\)\s*onDeleteDraft\(currentDraftId\);\s*\/\/ Limpiar estado local\s*setQuantities\(\{\}\);\s*if \(currentDraftId === "general"\) \{\s*setSelectedSupplierId\(""\);\s*\}\s*navigateToHistory\(\);\s*\};/m;

content = content.replace(badBlockRegex, '');

fs.writeFileSync(file, content, 'utf8');
