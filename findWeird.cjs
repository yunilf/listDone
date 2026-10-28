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
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Match characters outside the standard ASCII and common Spanish ranges
    // Standard Spanish: áéíóúÁÉÍÓÚñÑüÜ ¿¡
    const weirdRegex = /[^\x00-\x7F\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1\u00fc\u00dc\u00bf\u00a1]/g;
    let match;
    let found = false;
    while ((match = weirdRegex.exec(content)) !== null) {
      console.log(`File: ${filePath} at index ${match.index}: ${match[0]} (Hex: ${match[0].charCodeAt(0).toString(16)})`);
      found = true;
    }
  }
});
