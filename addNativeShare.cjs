const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/OrderHistory.jsx';
let content = fs.readFileSync(file, 'utf8');

const shareFunctionCode = `  const handleNativeShare = async (order) => {
    let message = \`Saludos, cotizame esto porfavor;\\n\\n\`;
    order.items.forEach((item) => {
      message += \`• \${item.quantity} \${item.unit} de \${item.name}\\n\`;
    });
    message += \`\\nincluye el precio del delivery, \\nGracias\`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cotización',
          text: message
        });
      } catch (err) {
        console.error("Error compartiendo nativamente:", err);
      }
    } else {
      navigator.clipboard.writeText(message).then(() => {
        alert("¡Texto copiado al portapapeles! (Compartir nativo no soportado aquí)");
      }).catch(err => {
        console.error("Error copiando:", err);
        alert("No se pudo copiar el texto.");
      });
    }
  };

  const handleSendWhatsApp =`;

content = content.replace('  const handleSendWhatsApp =', shareFunctionCode);

content = content.replace(/handleSendWhatsApp\(order, "personal"\)/, 'handleNativeShare(order)');

fs.writeFileSync(file, content);
console.log('Native share added');
