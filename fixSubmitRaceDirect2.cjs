const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('const handleFinalizeOrder = () => {');
const endIdx = content.indexOf('};', startIdx) + 2; // end of function

const oldFunc = content.substring(startIdx, endIdx);

const newFunc = `const handleFinalizeOrder = async () => {
    if (isSubmitting) return;
    if (activeItems.length === 0) {
      alert("Debes agregar al menos un producto a la lista.");
      return;
    }
    if (!selectedSupplierId) {
      alert("Por favor, selecciona un proveedor para asignar a esta orden de compra.");
      return;
    }

    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    if (!supplier) return;

    const orderData = {
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierPhone: supplier.phone,
      totalEstimated: totalEstimatedCost,
      items: activeItems
    };

    try {
      setIsSubmitting(true);
      await onCreateOrder(orderData);
      await onDeleteDraft(currentDraftId);
      setQuantities({});
      if (currentDraftId === "general") {
        setSelectedSupplierId("");
      }
      navigateToHistory();
    } catch (e) {
      console.error(e);
      alert("Error al finalizar orden");
    } finally {
      setIsSubmitting(false);
    }
  };`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync(file, content, 'utf8');
