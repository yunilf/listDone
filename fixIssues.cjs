const fs = require('fs');

// 1. Fix Catalog.jsx formatPrice
const catalogFile = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let catalogContent = fs.readFileSync(catalogFile, 'utf8');

const formatPriceCode = `
  const formatPrice = (val) => {
    if (!val && val !== 0) return "";
    return showDecimals ? val.toFixed(2) : Math.round(val).toString();
  };
`;
const catalogTarget = /const \[selectedCategory, setSelectedCategory\] = useState\("Todos"\);/;
catalogContent = catalogContent.replace(catalogTarget, `const [selectedCategory, setSelectedCategory] = useState("Todos");\n${formatPriceCode}`);

fs.writeFileSync(catalogFile, catalogContent);
console.log('Fixed Catalog formatPrice');

// 2. Fix App.jsx Auth Bypass
const appFile = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let appContent = fs.readFileSync(appFile, 'utf8');

const bypassTarget = /const unsubscribeAuth = onAuthStateChanged\(auth, \(realUser\) => \{\s*\/\/ BYPASS TEMPORAL DE LOGIN: Forzamos un usuario ficticio\s*const currentUser = \{ uid: "test_bypass_user_123", email: "test@local\.com" \};\s*setUser\(currentUser\);/;
const bypassReplacement = `const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);`;

appContent = appContent.replace(bypassTarget, bypassReplacement);

fs.writeFileSync(appFile, appContent);
console.log('Fixed App.jsx bypass');
