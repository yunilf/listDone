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
  { bad: /Cat[^l]?logo/gi, good: 'Cat\u00e1logo' },
  { bad: /Historial de [^<A-Za-z]*rdenes/g, good: 'Historial de \u00d3rdenes' },
  { bad: /tus [^<A-Za-z]*rdenes/gi, good: 'tus \u00f3rdenes' },
  { bad: /hay [^<A-Za-z]*rdenes/gi, good: 'hay \u00f3rdenes' },
  { bad: /Las [^<A-Za-z]*rdenes/gi, good: 'Las \u00f3rdenes' },
  { bad: /[^<A-Za-z]*rdenes de Compra/gi, good: '\u00d3rdenes de Compra' },
  { bad: /Electr[^n]?nico/gi, good: 'Electr\u00f3nico' },
  { bad: /Sesi[^n]?n/gi, good: 'Sesi\u00f3n' },
  { bad: /Configuraci[^n]?n/gi, good: 'Configuraci\u00f3n' },
  { bad: /acci[^n]?n/gi, good: 'acci\u00f3n' },
  { bad: /opci[^n]?n/gi, good: 'opci\u00f3n' },
  { bad: /Categor[^a]?a/gi, good: 'Categor\u00eda' },
  { bad: /autom[^t]?tico/gi, good: 'autom\u00e1tico' },
  { bad: /R[^p]?pida/gi, good: 'R\u00e1pida' },
  { bad: /Men[^<\s]?\s/g, good: 'Men\u00fa ' },
  { bad: /Contrase[^a]?a/gi, good: 'Contrase\u00f1a' },
  { bad: /Ning[^n]?n/gi, good: 'Ning\u00fan' },
  { bad: /est[^n]?n\b/gi, good: 'est\u00e1n' },
  { bad: /D[^a]?a\b/gi, good: 'D\u00eda' },
  { bad: /s[^l]?lo\b/gi, good: 's\u00f3lo' },
  { bad: /Aqu[^<\s]?\b/g, good: 'Aqu\u00ed' },
  { bad: /aqu[^<\s]?\b/g, good: 'aqu\u00ed' },
  { bad: /Reg[^s]?strate/gi, good: 'Reg\u00edstrate' },
  { bad: /[^A-Za-z]Ya\b/g, good: '\u00bfYa' },
  { bad: /[^A-Za-z]No\b/g, good: '\u00bfNo' },
  { bad: /borrar[^<\s]?\b/g, good: 'borrar\u00e1' },
  { bad: /[^a-z]ltima\b/gi, good: '\u00faltima' },
  { bad: /[^a-z]De verdad/gi, good: '\u00bfDe verdad' },
  { bad: /env[^a]a/gi, good: 'env\u00eda' },
  { bad: /A[^n]n/gi, good: 'A\u00fan' },
  { bad: /pesta[^a]a/gi, good: 'pesta\u00f1a' },
  { bad: /A[^a]adir/g, good: 'A\u00f1adir' },
  { bad: /a[^a]adir/g, good: 'a\u00f1adir' },
  { bad: /a[^a]adido/g, good: 'a\u00f1adido' },
  { bad: /A[^a]adido/g, good: 'A\u00f1adido' },
  { bad: /Dise[^o]/g, good: 'Dise\u00f1o' },
  { bad: /dise[^o]/g, good: 'dise\u00f1o' },
  { bad: /m[^s]s\b/g, good: 'm\u00e1s' },
  { bad: /M[^s]s\b/g, good: 'M\u00e1s' },
  { bad: /suscripci[^n]n/g, good: 'suscripci\u00f3n' },
  { bad: /Suscripci[^n]n/g, good: 'Suscripci\u00f3n' }
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
