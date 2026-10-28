const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state
const stateRegex = /const \[activeTab, setActiveTab\] = useState\("activa"\);/;
const newStates = `const [activeTab, setActiveTab] = useState("activa");
  const [showDecimals, setShowDecimals] = useState(() => localStorage.getItem("listdone_show_decimals") !== "false");

  const toggleDecimals = () => {
    const newVal = !showDecimals;
    setShowDecimals(newVal);
    localStorage.setItem("listdone_show_decimals", String(newVal));
  };`;
content = content.replace(stateRegex, newStates);

// 2. Add passing props
const activeListRegex = /<ActiveList[\s\S]*?\/>/;
content = content.replace(activeListRegex, (match) => {
    return match.replace('/>', '  showDecimals={showDecimals}\n            />');
});

const orderHistoryRegex = /<OrderHistory[\s\S]*?\/>/;
content = content.replace(orderHistoryRegex, (match) => {
    return match.replace('/>', '  showDecimals={showDecimals}\n            />');
});

const catalogRegex = /<Catalog[\s\S]*?\/>/;
content = content.replace(catalogRegex, (match) => {
    return match.replace('/>', '  showDecimals={showDecimals}\n            />');
});

// 3. Add to Settings UI
const settingsCardRegex = /\{\/\* Card de Borrar Datos de Prueba \*\/\}/;
const newSettingsCard = `{/* Card de Preferencias Visuales */}
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

              {/* Card de Borrar Datos de Prueba */}`;
content = content.replace(settingsCardRegex, newSettingsCard);

fs.writeFileSync(file, content);
console.log('App.jsx updated with settings');
