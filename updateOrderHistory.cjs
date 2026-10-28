const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Calculate checkedTotal and inject into header
const headerRegex = /\{order\.totalEstimated > 0 && \([\s\S]*?<div style=\{\{ textAlign: "right" \}\}>[\s\S]*?<span style=\{\{ fontSize: "0\.75rem", color: "var\(--text-muted\)", display: "block" \}\}>TOTAL ESTIMADO<\/span>[\s\S]*?<span style=\{\{ fontSize: "1\.4rem", fontWeight: 800, color: "var\(--text-main\)" \}\}>[\s\S]*?\$\{formatPrice\(order\.totalEstimated\)\}[\s\S]*?<\/span>[\s\S]*?<\/div>[\s\S]*?\)\}/;

const headerReplacement = `
                    <div style={{ display: "flex", gap: "1.5rem" }}>
                      {(() => {
                        const checkedTotal = order.items.reduce((acc, item) => item.checked ? acc + ((item.quantity || 0) * (item.price || 0)) : acc, 0);
                        return checkedTotal > 0 ? (
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--primary)", display: "block", fontWeight: 700 }}>REVISADO</span>
                            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)" }}>
                              \${formatPrice(checkedTotal)}
                            </span>
                          </div>
                        ) : null;
                      })()}
                      {order.totalEstimated > 0 && (
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>TOTAL ESTIMADO</span>
                          <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)" }}>
                            \${formatPrice(order.totalEstimated)}
                          </span>
                        </div>
                      )}
                    </div>`;

content = content.replace(headerRegex, headerReplacement);

// 2. Modify item row rendering
const itemRegex = /<span>\s*\{item\.quantity\} \{item\.unit\}\s*\{item\.price > 0 && ` x \$\{formatPrice\(item\.price\)\}`\}\s*<\/span>/;
const itemReplacement = `<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem" }}>
                              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                {item.quantity} {item.unit}
                                {item.price > 0 && \` x $\${formatPrice(item.price)}\`}
                              </span>
                              {item.price > 0 && (
                                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
                                  \${formatPrice((item.quantity || 0) * (item.price || 0))}
                                </span>
                              )}
                            </div>`;

// Global replace for itemRegex since it might be in the map
content = content.replace(new RegExp(itemRegex, 'g'), itemReplacement);

// Just in case it had a $ already
const itemRegex2 = /<span>\s*\{item\.quantity\} \{item\.unit\}\s*\{item\.price > 0 && ` x \$\$\{formatPrice\(item\.price\)\}`\}\s*<\/span>/;
content = content.replace(new RegExp(itemRegex2, 'g'), itemReplacement);

fs.writeFileSync(file, content);
console.log('OrderHistory UI updated');
