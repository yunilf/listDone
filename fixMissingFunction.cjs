const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const missingFunction = `const handleUpdateCategory = async (id, updatedData) => {
    try {
      const updatedCat = await updateCategory(id, updatedData);
      setCategories(prev => prev.map(c => c.id === id ? updatedCat : c).sort((a, b) => a.name.localeCompare(b.name)));
    } catch (e) {
      console.error(e);
      alert("Error al actualizar Categor\\u00eda");
    }
  };

  const handleDeleteCategory`;

content = content.replace(/const handleDeleteCategory/g, missingFunction);

fs.writeFileSync(file, content, 'utf8');
