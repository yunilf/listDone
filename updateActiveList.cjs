const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update props
const propsRegex = /navigateToHistory\s*\n\}\) \{/;
content = content.replace(propsRegex, 'navigateToHistory,\n  showDecimals = true \n}) {');

// Update formatting helper
const newHelper = `
  const formatPrice = (val) => {
    if (!val && val !== 0) return "";
    return showDecimals ? val.toFixed(2) : Math.round(val).toString();
  };
`;
const searchFilterRegex = /  \/\/ Categor.*as de productos para los filtros/;
content = content.replace(searchFilterRegex, newHelper + '\n  // Categorías de productos para los filtros');

// Replace .toFixed(2)
content = content.replace(/product\.estimatedPrice\.toFixed\(2\)/g, 'formatPrice(product.estimatedPrice)');
content = content.replace(/\(product\.estimatedPrice \* qty\)\.toFixed\(2\)/g, 'formatPrice(product.estimatedPrice * qty)');
content = content.replace(/totalEstimatedCost\.toFixed\(2\)/g, 'formatPrice(totalEstimatedCost)');

fs.writeFileSync(file, content);
console.log('ActiveList updated');
