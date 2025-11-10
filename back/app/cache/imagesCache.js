import fs from 'fs';
import path from 'path';
import csv2json from 'csvtojson';
const __dirname = path.resolve();

let productCache = new Map();

// Fonction pour charger/recharger le CSV
export async function loadCache() {
  const file = fs
    .readdirSync(path.join(__dirname, '/app/data'))
    .find((f) => f.endsWith('.csv'));

  const filePath = path.join(__dirname, '/app/data', file);

  const jsonArray = await csv2json({
    noheader: false,
    delimiter: ';',
  }).fromFile(filePath);

  const newCache = new Map();
  for (const product of jsonArray) {
    const key = `${product.brand}-${product.pattern}-${product.color}`;
    newCache.set(key, product);
  }

  productCache = newCache;
  console.log(`Cache ready ${productCache.size} products`);
}

// Fonction pour accéder au cache
export function getProduct(brand, pattern, color) {
  const key = `${brand}-${pattern}-${color}`;
  return productCache.get(key);
}
