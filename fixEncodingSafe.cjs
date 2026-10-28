const fs = require('fs');

function fixMojibake(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace everything corrupted
  content = content.replace(/Sesin/g, 'Sesi\u00f3n'); // ó
  content = content.replace(/Sesi\uFFFDn/g, 'Sesi\u00f3n');
  content = content.replace(/Sesi\?n/g, 'Sesi\u00f3n');
  content = content.replace(/Electrnico/g, 'Electr\u00f3nico');
  content = content.replace(/Electr\uFFFDnico/g, 'Electr\u00f3nico');
  content = content.replace(/Electr\?nico/g, 'Electr\u00f3nico');
  content = content.replace(/Contrasea/g, 'Contrase\u00f1a');
  content = content.replace(/Contrase\uFFFDa/g, 'Contrase\u00f1a');
  content = content.replace(/Contrase\?a/g, 'Contrase\u00f1a');
  content = content.replace(/Regstrate aqu/g, 'Reg\u00edstrate aqu\u00ed');
  content = content.replace(/Reg\uFFFDstrate aqu\uFFFD/g, 'Reg\u00edstrate aqu\u00ed');
  content = content.replace(/Reg\?strate aqu\?/g, 'Reg\u00edstrate aqu\u00ed');
  content = content.replace(/No/g, '\u00bfNo'); // ¿
  content = content.replace(/\uFFFDNo/g, '\u00bfNo');
  content = content.replace(/\?No/g, '\u00bfNo');
  content = content.replace(/Ya/g, '\u00bfYa');
  content = content.replace(/\uFFFDYa/g, '\u00bfYa');
  content = content.replace(/\?Ya/g, '\u00bfYa');
  content = content.replace(/vlido/g, 'v\u00e1lido');
  content = content.replace(/v\uFFFDo/g, 'v\u00e1lido');
  content = content.replace(/v\?lido/g, 'v\u00e1lido');
  content = content.replace(/ms/g, 'm\u00e1s');
  content = content.replace(/m\uFFFDo/g, 'm\u00e1s');
  content = content.replace(/m\?s/g, 'm\u00e1s');

  fs.writeFileSync(file, content, 'utf8');
}

fixMojibake('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Login.jsx');
fixMojibake('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Register.jsx');

console.log('Fixed properly using unicode escapes');
