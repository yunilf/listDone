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

    content = content.replace(/mA\u00fan/g, 'main');
    content = content.replace(/contA\u00f1er/g, 'container'); // wait, Aún, not Añ
    content = content.replace(/contA\u00faner/g, 'container');
    content = content.replace(/A\u00f1adir/g, 'A\u00f1adir'); // Aún is \u00fa
    
    // Are there any other "ain" replacements?
    // "again"? "domain"? 
    content = content.replace(/domA\u00fan/g, 'domain');
    content = content.replace(/agA\u00fan/g, 'again');
    content = content.replace(/remA\u00fan/g, 'remain');
    content = content.replace(/plA\u00fan/g, 'plain');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed Aún in:', filePath);
    }
  }
});
