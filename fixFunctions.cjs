const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const brokenBlockRegex = /const handleAddCategory = async \(categoryData\) => \{[\s\S]*?alert\("Error al eliminar Categor[\s\S]*?"\);\s*\}\s*\};/m;

const fixedBlock = `const handleAddCategory = async (categoryData) => {
    try {
      const newCat = await addCategory(categoryData);
      setCategories(prev => {
        if (prev.some(c => c.id === newCat.id)) return prev;
        return [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name));
      });
    } catch (e) {
      console.error(e);
      alert("Error al agregar Categor\\u00eda");
    }
  };

  const handleDeleteCategory = async (id) => {
    const catToDelete = categories.find(c => c.id === id);
    if (catToDelete) {
      const hasProducts = products.some(p => p.category === catToDelete.name);
      if (hasProducts) {
        alert(\`No puedes eliminar la Categor\\u00eda "\${catToDelete.name}" porque tiene productos asociados en el Cat\\u00e1logo. Cambia la Categor\\u00eda de esos productos antes de eliminarla.\`);
        return;
      }
    }

    if (!window.confirm("\\u00bfSeguro que deseas eliminar esta Categor\\u00eda?")) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      alert("Error al eliminar Categor\\u00eda");
    }
  };`;

if (brokenBlockRegex.test(content)) {
  content = content.replace(brokenBlockRegex, fixedBlock);
} else {
  console.log("Regex didn't match.");
}

// Fix the other error: `¿No"` on line 677
content = content.replace(/\{showDecimals \? "S\\u00ed" : \u00bfNo"\}/g, '{showDecimals ? "S\\u00ed" : "No"}');
content = content.replace(/\{showDecimals \? "S\\u00ed" : "\u00bfNo"\}/g, '{showDecimals ? "S\\u00ed" : "No"}');
content = content.replace(/¿No"/g, '"No"');
content = content.replace(/"¿No"/g, '"No"');
content = content.replace(/\\u00bfNo"/g, '"No"');
content = content.replace(/"\\u00bfNo"/g, '"No"');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed functions and quotes');
