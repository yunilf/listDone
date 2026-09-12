const fs = require('fs');

const d = JSON.parse(fs.readFileSync('C:/Users/Yunil/Downloads/backup-gestor-pedidos-2026-08-06.json'));

const s = d.suppliers.find(x => x.name === 'Plaza de la Yaroa');

const p = d.products.map(x => ({
  name: x.name,
  category: x.category,
  unit: x.unit,
  estimatedPrice: x.estimatedPrice
}));

const categoriesList = [...new Set(p.map(x => x.category).filter(Boolean))];
const c = categoriesList.map(name => ({ name }));

const fileContent = `
export const DEFAULT_SEED_SUPPLIERS = ${JSON.stringify([{ name: s.name, phone: s.phone, contactName: s.contactName }], null, 2)};

export const DEFAULT_SEED_CATEGORIES = ${JSON.stringify(c, null, 2)};

export const DEFAULT_SEED_PRODUCTS = ${JSON.stringify(p, null, 2)};
`;

fs.writeFileSync('src/defaultSeedData.js', fileContent);
console.log('Seed data generated successfully!');
