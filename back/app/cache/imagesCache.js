import fs from 'fs';
import path from 'path';
import csv2json from 'csvtojson';
const __dirname = path.resolve();

let productCache = new Map();

// Fonction pour charger/recharger le CSV
export async function loadCache(batchSize = 1000) {
  const file = fs
    .readdirSync(path.join(__dirname, '/app/data'))
    .find((f) => f.endsWith('.csv'));

  const filePath = path.join(__dirname, '/app/data', file);

  // New cache to build
  const newCache = new Map();

  try {
    let processed = 0;

    await csv2json({
      noheader: false,
      delimiter: ';',
    })
      .fromFile(filePath)
      .subscribe(async (product) => {
        // Traitement par lot
        const key = `${product.brand}-${product.pattern}-${product.color}`;
        newCache.set(key, product);
        processed++;

        // Log progress every batchSize items
        if (processed % batchSize === 0) {
          console.log(`Processed ${processed} products...`);
          await new Promise((resolve) => setImmediate(resolve)); // Yield to event loop
        }
      });

    productCache = newCache;
    console.log(`Cache ready ${productCache.size} products`);
  } catch (error) {
    console.error('Error loading cache:', error);
  }
}

// Fonction pour accéder au cache
export function getProduct(brand, pattern, color) {
  const key = `${brand}-${pattern}-${color}`;
  return productCache.get(key);
}
