const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

const stateRegex = /const \[currentDraftId, setCurrentDraftId\] = useState\(initialDraftId\);/;
const stateReplacement = `const [currentDraftId, setCurrentDraftId] = useState(initialDraftId);
  const [isSubmitting, setIsSubmitting] = useState(false);`;

content = content.replace(stateRegex, stateReplacement);

const funcRegex = /const handleFinalizeOrder = \(\) => \{([\s\S]*?)\/\/ Crear la orden de compra\s*onCreateOrder\(orderData\);\s*\/\/ Eliminar el borrador actual de la base de datos \(limpieza\)\s*onDeleteDraft\(currentDraftId\);\s*\/\/ Limpiar estado local\s*setQuantities\(\{\}\);\s*if \(currentDraftId === "general"\) \{\s*setSelectedSupplierId\(""\);\s*\}\s*navigateToHistory\(\);\s*\};/m;

const funcReplacement = `const handleFinalizeOrder = async () => {
    if (isSubmitting) return;
$1
    try {
      setIsSubmitting(true);
      // Crear la orden de compra
      await onCreateOrder(orderData);
      
      // Eliminar el borrador actual de la base de datos (limpieza)
      await onDeleteDraft(currentDraftId);
      
      // Limpiar estado local
      setQuantities({});
      if (currentDraftId === "general") {
        setSelectedSupplierId("");
      }
      
      navigateToHistory();
    } finally {
      setIsSubmitting(false);
    }
  };`;

content = content.replace(funcRegex, funcReplacement);

const btnRegex = /disabled=\{activeItems\.length === 0 \|\| !selectedSupplierId\}/g;
const btnReplacement = `disabled={activeItems.length === 0 || !selectedSupplierId || isSubmitting}`;

content = content.replace(btnRegex, btnReplacement);

const btnTextRegex = />\s*<CheckCircle2 size=\{18\} \/>\s*Generar Orden de Compra\s*<\/button>/g;
const btnTextReplacement = `>
              <CheckCircle2 size={18} />
              {isSubmitting ? "Generando..." : "Generar Orden de Compra"}
            </button>`;

content = content.replace(btnTextRegex, btnTextReplacement);

fs.writeFileSync(file, content, 'utf8');
