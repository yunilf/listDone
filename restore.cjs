const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

const shareFuncRegex = /  \/\/ Formatear y Compartir Mensaje[\s\S]*?onUpdateStatus\(order\.id, "enviado"\);\s*\}\s*catch\s*\(err\)\s*\{\s*alert\("Error al copiar el texto\. Intenta desde un entorno seguro \(HTTPS\)\."\);\s*console\.error\(err\);\s*\}\s*\}\s*\};/;

const newWhatsAppFunc = `  // Formatear y Enviar Mensaje por WhatsApp
  const handleSendWhatsApp = (order, appType = "personal") => {
    let phone = order.supplierPhone;
    if (!phone) {
      const supplier = suppliers.find(s => s.id === order.supplierId);
      phone = supplier ? supplier.phone : "";
    }

    if (!phone) {
      alert("Este proveedor no tiene un número de WhatsApp registrado. Edita el proveedor antes de enviar.");
      return;
    }

    let message = \`Saludos, cotizame esto porfavor;\\n\\n\`;
    order.items.forEach((item) => {
      message += \`• \${item.quantity} \${item.unit} de \${item.name}\\n\`;
    });
    message += \`\\nincluye el precio del delivery, \\nGracias\`;

    const encodedText = encodeURIComponent(message);
    let whatsappUrl = \`https://api.whatsapp.com/send?phone=\${phone}&text=\${encodedText}\`;
    
    if (appType === "business") {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        whatsappUrl = \`intent://send?phone=\${phone}&text=\${encodedText}#Intent;package=com.whatsapp.w4b;scheme=whatsapp;end\`;
      } else {
        whatsappUrl = \`https://wa.me/\${phone}?text=\${encodedText}\`;
      }
    }

    window.open(whatsappUrl, "_blank");

    if (order.status === "borrador") {
      onUpdateStatus(order.id, "enviado");
    }
  };`;

content = content.replace(shareFuncRegex, newWhatsAppFunc);

const buttonsRegex = /<div className="order-actions" style=\{\{ display: "flex", flexDirection: "column", gap: "0\.5rem" \}\}>[\s\S]*?<\/div>/;

const newButtons = `<div className="order-actions" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <button className="btn btn-primary" onClick={() => handleSendWhatsApp(order, "personal")} style={{ backgroundColor: "#25D366", color: "white", width: "100%" }}>
                    <MessageSquare size={16} />
                    WhatsApp Personal
                  </button>
                  <button className="btn btn-primary" onClick={() => handleSendWhatsApp(order, "business")} style={{ backgroundColor: "#128C7E", color: "white", width: "100%" }}>
                    <MessageSquare size={16} />
                    WhatsApp Business
                  </button>
                </div>`;

content = content.replace(buttonsRegex, newButtons);
fs.writeFileSync(file, content);
console.log('Restored buttons successfully.');
