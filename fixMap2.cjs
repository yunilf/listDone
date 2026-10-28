const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/Catalog.jsx';
let content = fs.readFileSync(file, 'utf8');

const strStart = '{productSuppliers.length > 0 && (';
const strEnd = '<div style={{ display: "flex", gap: "0.4rem" }}>';

const startIdx = content.indexOf(strStart);
const endIdx = content.indexOf(strEnd, startIdx);

const oldBlock = content.substring(startIdx, endIdx);

const newBlock = `{productSuppliers.length > 0 && (
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
                    </div>
                  `;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(file, content, 'utf8');
