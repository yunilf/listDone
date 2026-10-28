const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldFuncRegex = /  \/\/ Formatear y Enviar Mensaje por WhatsApp[\s\S]*?onUpdateStatus\(order\.id, "enviado"\);\s*}\s*};/;

const newFunc = `  // Formatear y Compartir Mensaje
  const handleShare = async (order) => {
    // Armar el mensaje con el formato de cotización solicitado
    let message = \`Saludos, cotizame esto porfavor;\\n\\n\`;
    
    order.items.forEach((item) => {
      message += \`• \${item.quantity} \${item.unit} de \${item.name}\\n\`;
    });

    message += \`\\nincluye el precio del delivery, \\nGracias\`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: \`Orden \${order.orderNumber}\`,
          text: message,
        });
        
        // Marcar automáticamente el estado como "enviado" si estaba en "borrador"
        if (order.status === "borrador") {
          onUpdateStatus(order.id, "enviado");
        }
      } catch (error) {
        console.log('Error compartiendo:', error);
      }
    } else {
      // Fallback si no soporta Share API
      try {
        await navigator.clipboard.writeText(message);
        alert("Mensaje copiado al portapapeles. Puedes pegarlo en WhatsApp u otra app.");
        if (order.status === "borrador") {
          onUpdateStatus(order.id, "enviado");
        }
      } catch (err) {
        alert("Error al copiar el texto.");
      }
    }
  };`;

content = content.replace(oldFuncRegex, newFunc);

const oldButtonsRegex = /<div className="order-actions" style=\{\{ display: "flex", flexDirection: "column", gap: "0\.5rem" \}\}>[\s\S]*?<\/div>/;

const newButtons = `<div className="order-actions" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <button className="btn btn-primary" onClick={() => handleShare(order)} style={{ backgroundColor: "var(--primary)", color: "white", width: "100%" }}>
                    <Share2 size={16} />
                    Compartir
                  </button>
                </div>`;

content = content.replace(oldButtonsRegex, newButtons);

fs.writeFileSync(file, content);
console.log('Done');
