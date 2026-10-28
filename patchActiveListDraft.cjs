const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update Props and initial state
content = content.replace(/export default function ActiveList\(\{[\s\S]*?showDecimals = true\s*\}\) \{/, 
  'export default function ActiveList({ products, suppliers, drafts = [], onSaveDraft, onDeleteDraft, onCreateOrder, navigateToHistory, showDecimals = true, initialDraftId = "general" }) {');

content = content.replace(/const \[currentDraftId, setCurrentDraftId\] = useState\("general"\);/, 'const [currentDraftId, setCurrentDraftId] = useState(initialDraftId);');

// 2. Update useEffect for loading the draft
const effectRegex = /useEffect\(\(\) => \{\s*if \(\!isInitialized && drafts\.length > 0\) \{\s*const generalDraft = drafts\.find\(d => d\.id === "general"\);\s*if \(generalDraft && generalDraft\.items\) \{\s*const newQties = \{\};\s*generalDraft\.items\.forEach\(item => \{\s*newQties\[item\.productId\] = item\.quantity;\s*\}\);\s*setQuantities\(newQties\);\s*\}\s*setIsInitialized\(true\);\s*\}\s*\}, \[drafts, isInitialized\]\);/;

const effectReplacement = `useEffect(() => {
    if (!isInitialized && drafts.length > 0) {
      const draftToLoad = drafts.find(d => d.id === initialDraftId) || drafts.find(d => d.id === "general");
      if (draftToLoad && draftToLoad.items) {
        const newQties = {};
        draftToLoad.items.forEach(item => {
          newQties[item.productId] = item.quantity;
        });
        setQuantities(newQties);
      }
      
      // Auto-select supplier if not general
      if (initialDraftId !== "general") {
        setSelectedSupplierId(initialDraftId);
      }
      
      setIsInitialized(true);
    }
  }, [drafts, isInitialized, initialDraftId]);`;

content = content.replace(effectRegex, effectReplacement);

fs.writeFileSync(file, content);
console.log('ActiveList.jsx patched for initialDraftId');
