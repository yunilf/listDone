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
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span style={{ fontSize: "0.9rem", color: showDecimals ? "var(--primary)" : "var(--text-muted)", fontWeight: 600, width: "20px", textAlign: "right" }}>
                      {showDecimals ? "Sí" : "No"}
                    </span>
                    <div 
                      onClick={toggleDecimals}
                      style={{
                        width: "50px",
                        height: "26px",
                        backgroundColor: showDecimals ? "var(--primary)" : "rgba(255,255,255,0.15)",
                        borderRadius: "13px",
                        position: "relative",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                        border: showDecimals ? "none" : "1px solid rgba(255,255,255,0.2)"
                      }}
                    >
                      <div 
                        style={{
                          width: "22px",
                          height: "22px",
                          backgroundColor: "#ffffff",
                          borderRadius: "50%",
                          position: "absolute",
                          top: showDecimals ? "2px" : "1px",
                          left: showDecimals ? "26px" : "1px",
                          transition: "left 0.3s ease",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              `;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Fixed settings UI correctly this time!');
} else {
    console.log('Regex did not match');
}
