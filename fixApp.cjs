const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const stateRegex = /const \[activeTab, setActiveTab\] = useState\("lista-activa"\);/;
const newStates = `const [activeTab, setActiveTab] = useState("lista-activa");
  const [showDecimals, setShowDecimals] = useState(() => localStorage.getItem("listdone_show_decimals") !== "false");

  const toggleDecimals = () => {
    const newVal = !showDecimals;
    setShowDecimals(newVal);
    localStorage.setItem("listdone_show_decimals", String(newVal));
  };`;

content = content.replace(stateRegex, newStates);
fs.writeFileSync(file, content);
console.log('App.jsx fixed state');
