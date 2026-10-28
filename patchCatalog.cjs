const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. State
content = content.replace(/const \[supplierId, setSupplierId\] = useState\(""\);/g, `const [supplierId, setSupplierId] = useState("");\n  const [supplierPrices, setSupplierPrices] = useState({});`);

// 2. openAddModal
content = content.replace(/setSupplierId\(""\);\s*setIsModalOpen\(true\);/, `setSupplierId("");\n    setSupplierPrices({});\n    setIsModalOpen(true);`);

// 3. openEditModal
content = content.replace(/setSupplierId\(product\.supplierId \|\| ""\);\s*setIsModalOpen\(true\);/, `setSupplierId(product.supplierId || "");
    
    let initPrices = {};
    if (product.supplierPrices) {
      initPrices = { ...product.supplierPrices };
    } else if (product.supplierId) {
      initPrices[product.supplierId] = product.estimatedPrice || 0;
    }
    setSupplierPrices(initPrices);
    setIsModalOpen(true);`);

// 4. handleSubmit
content = content.replace(/supplierId: supplierId \|\| ""/g, `supplierId: supplierId || "",
      supplierPrices: supplierPrices`);

// 5. Card UI - remove old supplier span
const oldSpanRegex = /const assignedSupplier = suppliers\.find\(s => s\.id === product\.supplierId\);[\s\S]*?\{assignedSupplier && \([\s\S]*?<\/span>\s*<\/>\s*\)\}/m;
const newSpan = `const productSuppliers = suppliers.filter(s => 
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
                              <span key={assignedSupplier.id} style={{ fontSize: "0.7rem", backgroundColor: "rgba(46, 196, 182, 0.1)", color: "var(--success)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>
                                {assignedSupplier.name} (\${price})
                              </span>
                            );
                          })}
                        </div>
                      )}`;

// Wait, doing this replacement with regex on the JSX is risky. I'll use string replacement carefully.
