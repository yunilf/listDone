const fs = require('fs');
const path = require('path');

function fixMojibake(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace known broken characters based on user's output and common patterns
  content = content.replace(/SesiÃ³n/g, 'Sesión');
  content = content.replace(/Sesi\uFFFDn/g, 'Sesión'); // replacement char
  content = content.replace(/ElectrÃ³nico/g, 'Electrónico');
  content = content.replace(/ContraseÃ±a/g, 'Contraseña');
  content = content.replace(/Â¿/g, '¿');
  content = content.replace(/RegÃstrate aquÃ/g, 'Regístrate aquí');
  content = content.replace(/Reg\uFFFDstrate aqu\uFFFD/g, 'Regístrate aquí');
  
  // Let's do a safer direct UI string replace for Login/Register just in case
  content = content.replace(/Iniciar Sesi\S+n/g, 'Iniciar Sesión');
  content = content.replace(/Correo Electr\S+nico/g, 'Correo Electrónico');
  content = content.replace(/Contrase\S+a/g, 'Contraseña');
  content = content.replace(/No tienes cuenta\? Reg\S+strate aqu\S+/g, 'No tienes cuenta? Regístrate aquí');
  content = content.replace(/Ya tienes cuenta\? Inicia Sesi\S+n aqu\S+/g, 'Ya tienes cuenta? Inicia Sesión aquí');
  content = content.replace(/Crear Cuenta/g, 'Crear Cuenta'); // Just to be sure
  content = content.replace(/Cat\S+logo/g, 'Catálogo');
  content = content.replace(/Cargando cat\S+logo/g, 'Cargando catálogo');
  content = content.replace(/Verificando sesi\S+n/g, 'Verificando sesión');
  content = content.replace(/R\S+pida/g, 'Rápida');
  content = content.replace(/Men\S+ Principal/g, 'Menú Principal');
  content = content.replace(/\?rdenes/g, 'Órdenes');
  content = content.replace(/"rdenes/g, 'Órdenes');

  fs.writeFileSync(filePath, content, 'utf8');
}

fixMojibake('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Login.jsx');
fixMojibake('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Register.jsx');
fixMojibake('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx');
fixMojibake('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx');
fixMojibake('c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx');

console.log('Fixed encoding issues');
