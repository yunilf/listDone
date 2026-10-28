const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Icon replacement
const iconTarget = /<span className="brand-icon">.*?<\/span>/;
content = content.replace(iconTarget, '<div className="brand-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><ListChecks size={32} color="var(--primary)" /></div>');

// Preferences card
const connectDoneRegex = /\s*\{\/\* Card de Conex.*n al Ecosistema \*\/\}[\s\S]*?Ecosistema Connect Done[\s\S]*?<\/div>/;
content = content.replace(connectDoneRegex, `
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
`);

// Auth Bypass block
const authRegex = /const unsubscribeAuth = onAuthStateChanged\(auth, \(currentUser\) => \{\s*setUser\(currentUser\);\s*setAuthLoading\(false\);\s*if \(currentUser\) \{/g;
content = content.replace(authRegex, `const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        signInAnonymously(auth).then(({ user }) => {
           setUser(user);
           setUserId(user.uid);
           setAuthLoading(false);
        }).catch(err => {
           console.error("Anonymous auth error", err);
           const localUser = { uid: "local_user" };
           setUser(localUser);
           setUserId("local_user");
           setAuthLoading(false);
        });
        return;
      }

      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {`);

fs.writeFileSync(file, content);
console.log('App.jsx patched 2 successfully');
