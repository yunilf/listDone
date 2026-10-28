const fs = require('fs');

const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
        const checkLoadingFinished = (section) => {
          loadedSections[section] = true;
          const allLoaded = Object.values(loadedSections).every(val => val === true);
          if (allLoaded) {
            setLoading(false);
          }
        };

        // Failsafe Timeout
        setTimeout(() => {
          setLoading((prevLoading) => {
            if (prevLoading) {
              console.warn('Timeout: Firestore tardó demasiado en responder.');
              alert('Error de conexión: No se pudo cargar la base de datos. Si este es un proyecto nuevo, asegúrate de haber creado la base de datos "Firestore" en la consola de Firebase.');
              return false;
            }
            return prevLoading;
          });
        }, 8000);
`;

content = content.replace(
  /const checkLoadingFinished = \(section\) => \{\s*loadedSections\[section\] = true;\s*const allLoaded = Object\.values\(loadedSections\)\.every\(val => val === true\);\s*if \(allLoaded\) \{\s*setLoading\(false\);\s*\}\s*\};/,
  replacement
);

fs.writeFileSync(file, content, 'utf8');
console.log('Added timeout failsafe');
