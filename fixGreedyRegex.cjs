const fs = require('fs');

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<label>Contrase[^<]*<\/label>/g, '<label>Contraseña</label>');
  content = content.replace(/<label>Contraseña<\/label>bel>/g, '<label>Contraseña</label>');
  content = content.replace(/Contraseñabel>/g, 'Contraseña</label>');
  
  // also fix Correo
  content = content.replace(/Correo Electr[^<]*<\/label>/g, 'Correo Electrónico</label>');
  content = content.replace(/Correo Electrónico<\/label>nico/g, 'Correo Electrónico</label>');
  content = content.replace(/Correo Electróniconico<\/label>/g, 'Correo Electrónico</label>');
  content = content.replace(/Correo Electróniconico/g, 'Correo Electrónico');
  
  fs.writeFileSync(file, content, 'utf8');
}

fixFile('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Login.jsx');
fixFile('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Register.jsx');
console.log('Fixed greedy regex issue');
