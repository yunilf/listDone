const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* Card de Copia de Seguridad \(Backup\) \*\/\}[\s\S]*?(?=\{\/\* Card de Borrar)/;

const replacement = `{/* Card de Copia de Seguridad (Backup) */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Copia de Seguridad (Backup)
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                  Descarga un respaldo con todos tus productos y proveedores registrados, o restaura tus datos desde un archivo guardado previamente.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={handleExportBackup}>
                    Exportar Datos (.json)
                  </button>
                  <label className="btn btn-secondary" style={{ display: "inline-flex", cursor: "pointer", margin: 0 }}>
                    Importar Datos (.json)
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImportBackup} 
                      style={{ display: "none" }} 
                    />
                  </label>
                </div>
              </div>

              {/* Card de Preferencias Visuales */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  Preferencias Visuales
                </h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>Mostrar Decimales en Precios</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Elige si quieres ver los precios con centavos (ej. $1.00) o redondeados (ej. $1).
                    </div>
                  </div>
                  <button 
                    className={\`btn \${showDecimals ? "btn-primary" : "btn-secondary"}\`}
                    onClick={toggleDecimals}
                  >
                    {showDecimals ? "Sí (1.00)" : "No (1)"}
                  </button>
                </div>
              </div>

              `;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Fixed settings UI');
} else {
    console.log('Settings UI regex did not match');
}
