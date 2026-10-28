const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Title change
content = content.replace('<h1 className="brand-name">Gestor de Pedidos</h1>', '<h1 className="brand-name">listDone</h1>');

// 2. Icon change
content = content.replace('ClipboardList,', 'ClipboardList, \n  ListChecks,');
content = content.replace('<span className="brand-icon">??</span>', '<div className="brand-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><ListChecks size={32} color="var(--primary)" /></div>');

// 3. Add showDecimals state and toggle
const stateRegex = /const \[activeTab, setActiveTab\] = useState\("lista-activa"\);/;
const newStates = `const [activeTab, setActiveTab] = useState("lista-activa");
  const [showDecimals, setShowDecimals] = useState(() => localStorage.getItem("listdone_show_decimals") !== "false");

  const toggleDecimals = () => {
    const newVal = !showDecimals;
    setShowDecimals(newVal);
    localStorage.setItem("listdone_show_decimals", String(newVal));
  };`;
content = content.replace(stateRegex, newStates);

// 4. Pass showDecimals down
content = content.replace(/<ActiveList([\s\S]*?)\/>/, '<ActiveList$1 showDecimals={showDecimals} />');
content = content.replace(/<OrderHistory([\s\S]*?)\/>/, '<OrderHistory$1 showDecimals={showDecimals} />');
content = content.replace(/<Catalog([\s\S]*?)\/>/, '<Catalog$1 showDecimals={showDecimals} />');

// 5. Add Preferences Card and Remove Connect Done Card
const prefsCard = `              {/* Card de Preferencias Visuales */}
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
content = content.replace(/\{\/\* Card de Conexión al Ecosistema \*\/\}[\s\S]*?Ecosistema Connect Done[\s\S]*?<\/div>/, prefsCard);

// 6. Fix Firebase Auth (Anonymous Login) + Remove UI Login
content = content.replace('import { onAuthStateChanged, signOut } from "firebase/auth";', 'import { onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";');

const authBlock = `    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        setUserId(currentUser.uid);
        setLoading(true);`;
        
const newAuthBlock = `    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        setUserId(currentUser.uid);
        setLoading(true);
      } else {
        // Bypass visual login using anonymous auth
        signInAnonymously(auth).then(({ user }) => {
           setUserId(user.uid);
           setLoading(true);
        }).catch(err => {
           console.error("Anonymous auth failed", err);
           setUser({ uid: "local_user" });
           setUserId("local_user");
           setLoading(false);
        });
        return;
      }
      
      if (currentUser) {`;
content = content.replace(authBlock, newAuthBlock);

// Disable the Login screen
content = content.replace(/if \(\!user\) \{[\s\S]*?<Register[\s\S]*?\/>;\s*\}/, '');

fs.writeFileSync(file, content);
console.log('App.jsx patched successfully');
