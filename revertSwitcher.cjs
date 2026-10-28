const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div style=\{\{ display: "flex", alignItems: "center", gap: "0\.8rem" \}\}>[\s\S]*?<\/div>\s*<\/div>/;

const replacement = `<button 
                    className={\`btn \${showDecimals ? "btn-primary" : "btn-secondary"}\`}
                    onClick={toggleDecimals}
                  >
                    {showDecimals ? "Sí (1.00)" : "No (1)"}
                  </button>`;

if(regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Reverted to original button');
} else {
    console.log('Regex did not match the switch block');
}
