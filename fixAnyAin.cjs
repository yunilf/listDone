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

    content = content.replace(/m[A\u00e0-\u02ff]n/gi, 'main'); // main, mAún, mAgn, etc.
    content = content.replace(/cont[A\u00e0-\u02ff]ner/gi, 'container');
    content = content.replace(/rem[A\u00e0-\u02ff]n/gi, 'remain');
    content = content.replace(/pl[A\u00e0-\u02ff]n/gi, 'plain');
    content = content.replace(/ag[A\u00e0-\u02ff]n/gi, 'again');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed regex Ain in:', filePath);
    }
  }
});
