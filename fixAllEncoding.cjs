const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const replacements = [
  { bad: /Cat[\uFFFD\?]logo/g, good: 'Cat\u00e1logo' },
  { bad: /cat[\uFFFD\?]logo/g, good: 'cat\u00e1logo' },
  { bad: /[\uFFFD\?]rdenes/g, good: '\u00d3rdenes' },
  { bad: /rdenes\b/g, good: '\u00d3rdenes' }, 
  { bad: /"rdenes\b/g, good: '\u00d3rdenes' },
  { bad: /Electr[\uFFFD\?]nico/g, good: 'Electr\u00f3nico' },
  { bad: /Sesi[\uFFFD\?]n/g, good: 'Sesi\u00f3n' },
  { bad: /Configuraci[\uFFFD\?]n/g, good: 'Configuraci\u00f3n' },
  { bad: /acci[\uFFFD\?]n/g, good: 'acci\u00f3n' },
  { bad: /borrar[\uFFFD\?]\b/g, good: 'borrar\u00e1' },
  { bad: /opci[\uFFFD\?]n/g, good: 'opci\u00f3n' },
  { bad: /Categor[\uFFFD\?]a/g, good: 'Categor\u00eda' },
  { bad: /categor[\uFFFD\?]a/g, good: 'categor\u00eda' },
  { bad: /autom[\uFFFD\?]tico/g, good: 'autom\u00e1tico' },
  { bad: /R[\uFFFD\?]pida/g, good: 'R\u00e1pida' },
  { bad: /Men[\uFFFD\?]\s/g, good: 'Men\u00fa ' },
  { bad: /Contrase[\uFFFD\?]a/g, good: 'Contrase\u00f1a' },
  { bad: /suscripci[\uFFFD\?]n/g, good: 'suscripci\u00f3n' },
  { bad: /M[\uFFFD\?]s/g, good: 'M\u00e1s' },
  { bad: /m[\uFFFD\?]s\b/g, good: 'm\u00e1s' },
  { bad: /Ning[\uFFFD\?]n/g, good: 'Ning\u00fan' },
  { bad: /ning[\uFFFD\?]n/g, good: 'ning\u00fan' },
  { bad: /est[\uFFFD\?]n/g, good: 'est\u00e1n' },
  { bad: /Est[\uFFFD\?]n/g, good: 'Est\u00e1n' },
  { bad: /D[\uFFFD\?]a\b/g, good: 'D\u00eda' },
  { bad: /d[\uFFFD\?]a\b/g, good: 'd\u00eda' },
  { bad: /s[\uFFFD\?]lo\b/g, good: 's\u00f3lo' },
  { bad: /Aqu[\uFFFD\?]\b/g, good: 'Aqu\u00ed' },
  { bad: /aqu[\uFFFD\?]\b/g, good: 'aqu\u00ed' },
  { bad: /Reg[\uFFFD\?]strate/g, good: 'Reg\u00edstrate' },
  { bad: /[\uFFFD\?]Ya\b/g, good: '\u00bfYa' },
  { bad: /[\uFFFD\?]No\b/g, good: '\u00bfNo' },
  { bad: /[\uFFFD\?]C/g, good: '\u00bfC' },
  { bad: /[\uFFFD\?]Q/g, good: '\u00bfQ' }
];

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    replacements.forEach(r => {
      content = content.replace(r.bad, r.good);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Fixed:', filePath);
    }
  }
});
console.log('Done fixing encoding globally.');
