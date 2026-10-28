const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

// Insert handleToggleItemCheck
const shareFuncRegex = /  \/\/ Formatear y Compartir Mensaje/;
const newChecklistFunc = `  const handleToggleItemCheck = (order, itemIndex) => {
    if(!onUpdateOrder) return;
    const updatedItems = [...order.items];
    updatedItems[itemIndex] = { 
      ...updatedItems[itemIndex], 
      checked: !updatedItems[itemIndex].checked 
    };
    onUpdateOrder(order.id, { items: updatedItems });
  };

  // Formatear y Compartir Mensaje`;
content = content.replace(shareFuncRegex, newChecklistFunc);

// Update item render
const itemRenderRegex = /<div key=\{idx\} className="order-item-row">[\s\S]*?<\/div>/g;
const newItemRender = `<div 
                          key={idx} 
                          className="order-item-row" 
                          onClick={() => handleToggleItemCheck(order, idx)}
                          style={{ 
                            cursor: "pointer", 
                            opacity: item.checked ? 0.5 : 1,
                            textDecoration: item.checked ? "line-through" : "none",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{
                              width: "16px", 
                              height: "16px", 
                              borderRadius: "4px", 
                              border: "2px solid var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: item.checked ? "var(--primary)" : "transparent",
                              flexShrink: 0
                            }}>
                              {item.checked && <CheckCircle2 size={12} color="white" />}
                            </div>
                            {item.name}
                          </span>
                          <span>
                            {item.quantity} {item.unit}
                            {item.price > 0 && \` x $\${formatPrice(item.price)}\`}
                          </span>
                        </div>`;

content = content.replace(itemRenderRegex, newItemRender);

fs.writeFileSync(file, content);
console.log('Checklist feature added');
