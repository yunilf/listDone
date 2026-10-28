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
    let original = content;

    content = content.replace(/\u00f3\u00d3rdenes/g, '\u00d3rdenes'); // óÓrdenes -> Órdenes
    content = content.replace(/borrar\u00e1\u00e1/g, 'borrar\u00e1'); // borraráá -> borrará
    content = content.replace(/Deseas/g, '\u00bfDeseas');
    content = content.replace(/Seguro/g, '\u00bfSeguro');
    content = content.replace(/Est\u00e1s/g, '\u00bfEst\u00e1s');
    content = content.replace(/¿No/g, 'No'); // I noticed: ¿No puedes eliminar la Categoría... This should just be "No puedes"

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
