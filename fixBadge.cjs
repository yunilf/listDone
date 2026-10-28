const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = 'const assignedSupplier = suppliers.find(s => s.id === product.supplierId);';
const endStr = ')}'; // Needs to find the end of the assignedSupplier block
const startIdx = content.indexOf(startStr);
if (startIdx !== -1) {
  const endIdx = content.indexOf('</div>', startIdx + 500); // just before the Edit buttons
  
  const oldBlock = content.substring(startIdx, endIdx);
  
  const newBlock = `const productSuppliers = suppliers.filter(s => 
                  (product.supplierPrices && product.supplierPrices.hasOwnProperty(s.id)) || 
                  product.supplierId === s.id
                );
                
                return (
                  <div 
                    key={product.id} 
                    className="catalog-card"
                    style={{ borderLeft: \`4px solid \${borderCol}\` }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.2rem" }}>
                        {product.name}
                      </h3>
                      <div className="catalog-meta">
                        <span>{product.category}</span>
                        <span className="meta-dot"></span>
                        <span>{product.unit}</span>
                        <span className="meta-dot"></span>
                        <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                          \${product.estimatedPrice} (Ref)
                        </span>
                      </div>
                      
                      {productSuppliers.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                          {productSuppliers.map(assignedSupplier => {
                            const price = product.supplierPrices?.[assignedSupplier.id] ?? product.estimatedPrice;
                            return (
                              <span key={assignedSupplier.id} style={{ fontSize: "0.75rem", backgroundColor: "rgba(46, 196, 182, 0.1)", color: "var(--success)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>
                                {assignedSupplier.name} (\${price})
                              </span>
                            );
                          })}
                        </div>
                      )}
                    `;
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(file, content, 'utf8');
} else {
  console.log("Not found");
}
