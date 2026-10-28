const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the `return idÓrdenes de Compra`
    content = content.replace(/return id\u00d3rdenes de Compra/g, 'return id;');
    
    // Fix `alert(¿No ` back to `alert("No `
    content = content.replace(/alert\(\u00bfNo/g, 'alert("No');
    
    // Fix `<h3¿No` back to `<h3>No`
    content = content.replace(/<h3\u00bfNo/g, '<h3>No');

    // Fix `alert(¿Ya` back to `alert("Ya `
    content = content.replace(/alert\(\u00bfYa/g, 'alert("Ya');

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
