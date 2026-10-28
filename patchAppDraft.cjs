const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state
content = content.replace('const [activeTab, setActiveTab] = useState("lista-activa");', 'const [activeTab, setActiveTab] = useState("lista-activa");\n  const [targetDraftId, setTargetDraftId] = useState("general");');

// 2. Update handleReturnOrderToActiveList
const returnRegex = /const handleReturnOrderToActiveList = async \(order\) => \{[\s\S]*?setActiveTab\("lista-activa"\);\s*\} catch \(e\) \{/;
const returnReplacement = `const handleReturnOrderToActiveList = async (order) => {
    try {
      if (!window.confirm("¿Deseas devolver esta orden a la lista activa para modificarla? La orden actual será eliminada del historial.")) return;
      
      const draftId = order.supplierId || "general";
      
      // 1. Save to specific supplier draft
      await handleSaveDraft(draftId, order.items, order.supplierName || "");
      
      // 2. Delete the order from history
      await deleteOrder(order.id);
      setOrders(prev => prev.filter(o => o.id !== order.id));
      
      // 3. Go to active list
      setTargetDraftId(draftId);
      setActiveTab("lista-activa");
    } catch (e) {`;

content = content.replace(returnRegex, returnReplacement);

// 3. Pass prop to ActiveList
content = content.replace(/<ActiveList\s*products=\{products\}/, '<ActiveList\n              initialDraftId={targetDraftId}\n              products={products}');

fs.writeFileSync(file, content);
console.log('App.jsx patched for targetDraftId');
