const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const \[supplierId, setSupplierId\] = useState\(""\);/g, `const [supplierId, setSupplierId] = useState("");
  const [supplierPrices, setSupplierPrices] = useState({});`);

content = content.replace(/setSupplierId\(""\);\s*setIsModalOpen\(true\);/, `setSupplierId("");
    setSupplierPrices({});
    setIsModalOpen(true);`);

content = content.replace(/setSupplierId\(product\.supplierId \|\| ""\);\s*setIsModalOpen\(true\);/, `setSupplierId(product.supplierId || "");
    let initPrices = {};
    if (product.supplierPrices) {
      initPrices = { ...product.supplierPrices };
    } else if (product.supplierId) {
      initPrices[product.supplierId] = product.estimatedPrice || 0;
    }
    setSupplierPrices(initPrices);
    setIsModalOpen(true);`);

content = content.replace(/supplierId: supplierId \|\| ""/g, `supplierId: supplierId || "",
      supplierPrices: supplierPrices`);

// Replacing the old select with the new multi-supplier UI
const selectRegex = /<label className="form-label">Proveedor Asignado<\/label>\s*<select[\s\S]*?<\/select>/;
const multiSelectUI = `<label className="form-label">Proveedores Asignados y Precios</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    {suppliers.length === 0 && <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>No hay proveedores registrados.</span>}
                    {suppliers.map(s => {
                      const isSelected = supplierPrices.hasOwnProperty(s.id);
                      return (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => {
                               const newPrices = { ...supplierPrices };
                               if (e.target.checked) {
                                  newPrices[s.id] = estimatedPrice ? parseFloat(estimatedPrice) : 0;
                               } else {
                                  delete newPrices[s.id];
                               }
                               setSupplierPrices(newPrices);
                            }}
                            style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span style={{ flex: 1, fontSize: '0.9rem', color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>{s.name}</span>
                          {isSelected && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>$</span>
                              <input 
                                type="number"
                                className="form-input"
                                style={{ width: '80px', padding: '0.3rem 0.5rem', height: 'auto', fontSize: '0.9rem' }}
                                value={supplierPrices[s.id] === 0 ? '' : supplierPrices[s.id]}
                                onChange={(e) => {
                                   const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                   setSupplierPrices({ ...supplierPrices, [s.id]: val });
                                }}
                                placeholder="Precio"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>`;
content = content.replace(selectRegex, multiSelectUI);

// Update the card UI to show all badges
const badgeRegex = /const assignedSupplier = suppliers\.find\(s => s\.id === product\.supplierId\);\s*return \(\s*<div\s*key=\{product\.id\}\s*className="catalog-card"\s*style=\{\{ borderLeft: `4px solid \$\{borderCol\}` \}\}\s*>\s*<div style=\{\{ flex: 1 \}\}>\s*<h3 style=\{\{ fontSize: "1\.05rem", fontWeight: 700, color: "var\(--text-main\)", marginBottom: "0\.2rem" \}\}>\s*\{product\.name\}\s*<\/h3>\s*<div className="catalog-meta">\s*<span>\{product\.category\}<\/span>\s*<span className="meta-dot"><\/span>\s*<span>\{product\.unit\}<\/span>\s*<span className="meta-dot"><\/span>\s*<span style=\{\{ fontWeight: 600, color: "var\(--text-main\)" \}\}>\s*\$\{product\.estimatedPrice\}\s*<\/span>\s*<\/div>\s*\{assignedSupplier && \(\s*<>\s*<span className="meta-dot"><\/span>\s*<span style=\{\{ fontSize: "0\.75rem", backgroundColor: "rgba\(46, 196, 182, 0\.1\)", color: "var\(--success\)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 \}\}>\s*Y>' \{assignedSupplier\.name\}\s*<\/span>\s*<\/>\s*\)\}/;

const newBadgeUI = `const productSuppliers = suppliers.filter(s => 
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

content = content.replace(badgeRegex, newBadgeUI);

fs.writeFileSync(file, content, 'utf8');
