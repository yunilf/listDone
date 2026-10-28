const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/components/ActiveList.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Filtering Catalog Base
const filterRegex = /if \(currentDraftId !== "general" && product\.supplierId !== currentDraftId\) \{\s*return false;\s*\}/;
const newFilter = `if (currentDraftId !== "general") {
      const hasSupplier = (product.supplierPrices && product.supplierPrices.hasOwnProperty(currentDraftId)) || (product.supplierId === currentDraftId);
      if (!hasSupplier) return false;
    }`;
content = content.replace(filterRegex, newFilter);

// 2. Setting correct price when adding item
const mapRegex = /price: product \? product\.estimatedPrice \|\| 0 : 0,/;
const newMap = `price: (() => {
          if (!product) return 0;
          let p = product.estimatedPrice || 0;
          if (currentDraftId !== "general" && product.supplierPrices && product.supplierPrices.hasOwnProperty(currentDraftId)) {
            p = product.supplierPrices[currentDraftId];
          } else if (selectedSupplierId && product.supplierPrices && product.supplierPrices.hasOwnProperty(selectedSupplierId)) {
            p = product.supplierPrices[selectedSupplierId];
          }
          return p;
        })(),`;
content = content.replace(mapRegex, newMap);

fs.writeFileSync(file, content, 'utf8');
