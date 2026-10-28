const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<button[\s\S]*?className=\{`btn \$\{showDecimals[\s\S]*?<\/button>/;

const replacement = `<div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
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
                  </div>`;

if(regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Button replaced with switch');
} else {
    console.log('Regex did not match the button');
}
