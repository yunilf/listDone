const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldProps = `export default function Catalog({ 
  products, 
  categories = [], 
  onAdd, 
  onDelete, 
  onUpdate,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  suppliers = []
}) {`;

const newProps = `export default function Catalog({ 
  products, 
  categories = [], 
  onAdd, 
  onDelete, 
  onUpdate,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  suppliers = [],
  showDecimals = true
}) {`;

content = content.replace(/export default function Catalog\(\{[\s\S]*?suppliers = \[\]\s*\}\) \{/, newProps);

fs.writeFileSync(file, content);
console.log('Fixed Catalog props');
