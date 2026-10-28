const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const handleFinalizeOrder = \(\) => \{([\s\S]*?)onCreateOrder\(orderData\);\s*onDeleteDraft\(currentDraftId\);\s*setQuantities\(\{\}\);\s*if \(currentDraftId === "general"\) \{\s*setSelectedSupplierId\(""\);\s*\}\s*navigateToHistory\(\);\s*\}/m;

const replacement = `const handleFinalizeOrder = async () => {
    if (isSubmitting) return;
$1
    try {
      setIsSubmitting(true);
      await onCreateOrder(orderData);
      await onDeleteDraft(currentDraftId);
      setQuantities({});
      if (currentDraftId === "general") {
        setSelectedSupplierId("");
      }
      navigateToHistory();
    } finally {
      setIsSubmitting(false);
    }
  }`;

content = content.replace(regex, replacement);

fs.writeFileSync(file, content, 'utf8');
