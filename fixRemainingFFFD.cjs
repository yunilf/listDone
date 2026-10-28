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

    // Direct fixes for known FFFD corruptions
    content = content.replace(/tard\uFFFD/g, 'tard\u00f3');
    content = content.replace(/conexi\uFFFDn/g, 'conexi\u00f3n');
    content = content.replace(/aseg\uFFFDrate/g, 'aseg\u00farate');
    content = content.replace(/\uFFFD\u00bf/g, '\u00bf'); // Remove FFFD before ¿
    content = content.replace(/ser\uFFFD eliminaD\u00eda/g, 'ser\u00e1 eliminada'); // Also fix eliminaDía
    content = content.replace(/an\uFFFDnimo/g, 'an\u00f3nimo');
    content = content.replace(/versi\uFFFDn/g, 'versi\u00f3n');
    content = content.replace(/\uFFFD{8}/g, '********'); // password placeholders
    content = content.replace(/\uFFFD\u00d3rdenes/g, '\u00d3rdenes'); // stray FFFD before Órdenes
    content = content.replace(/\uFFFD/g, ''); // Remove any remaining stray FFFDs so they don't show up

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Cleaned up FFFD in:', filePath);
    }
  }
});
