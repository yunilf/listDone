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
    
    content = content.replace(/A\u00faname/g, 'a.name');
    content = content.replace(/prodDatA\u00faname/g, 'prodData.name');
    content = content.replace(/supDatA\u00faname/g, 'supData.name');
    content = content.replace(/A\u01e7name/g, 'a.name'); // Also fix Agname from earlier

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
