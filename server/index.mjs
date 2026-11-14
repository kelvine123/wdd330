import dotenv from 'dotenv';
import express from 'express';
import { Pool } from 'pg';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { categoryDefinitions, loadCatalog } from './catalog.mjs';

const app = express();
dotenv.config();
const port = Number(process.env.PORT ?? 3001);
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const catalog = await loadCatalog();
const isProduction = process.env.NODE_ENV === 'production';
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isProduction ? { rejectUnauthorized: false } : undefined,
    })
  : null;

if (isProduction && !pool) {
  throw new Error('DATABASE_URL is required in production.');
}

async function initializeDatabase() {
  const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
  await pool.query(schema);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO app_settings (key, value)
       VALUES ('country', 'KE'), ('currency', 'KES'), ('usd_to_kes_rate', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [String(catalog.exchangeRate)],
    );

    for (const category of catalog.categories) {
      await client.query(
        `INSERT INTO categories (slug, name, sort_order)
         VALUES ($1, $2, $3)
         ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order`,
        [category.slug, category.name, category.sortOrder],
      );
    }

    for (const product of catalog.products) {
      await client.query(
        `INSERT INTO products (
           id, category_slug, brand, name, name_without_brand, image_url,
           description_html, source_price_usd, price_kes,
           suggested_retail_price_kes, colors, sizes_available, details
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::jsonb, $13::jsonb)
         ON CONFLICT (id) DO UPDATE SET
           category_slug = EXCLUDED.category_slug,
           brand = EXCLUDED.brand,
           name = EXCLUDED.name,
           name_without_brand = EXCLUDED.name_without_brand,
           image_url = EXCLUDED.image_url,
           description_html = EXCLUDED.description_html,
           source_price_usd = EXCLUDED.source_price_usd,
           price_kes = EXCLUDED.price_kes,
           suggested_retail_price_kes = EXCLUDED.suggested_retail_price_kes,
           colors = EXCLUDED.colors,
           sizes_available = EXCLUDED.sizes_available,
           details = EXCLUDED.details,
           updated_at = NOW()`,
        [
          product.id,
          product.categorySlug,
          product.brand,
          product.name,
          product.nameWithoutBrand,
          product.imageUrl,
          product.descriptionHtml,
          product.sourcePriceUsd,
          product.priceKes,
          product.suggestedRetailPriceKes,
          JSON.stringify(product.colors),
          JSON.stringify(product.sizesAvailable),
          JSON.stringify(product.details),
        ],
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

if (pool) {
  await initializeDatabase();
}

function toApiProduct(row) {
  return {
    id: row.id,
    categorySlug: row.category_slug,
    categoryName: categoryDefinitions.find((category) => category.slug === row.category_slug)?.name,
    brand: row.brand,
    name: row.name,
    nameWithoutBrand: row.name_without_brand,
    imageUrl: row.image_url,
    descriptionHtml: row.description_html,
    sourcePriceUsd: Number(row.source_price_usd),
    priceKes: Number(row.price_kes),
    suggestedRetailPriceKes: Number(row.suggested_retail_price_kes),
    colors: row.colors,
    sizesAvailable: row.sizes_available,
    details: row.details,
    currency: 'KES',
  };
}

app.get('/api/health', async (request, response, next) => {
  try {
    if (pool) {
      await pool.query('SELECT 1');
    }
    response.json({ status: 'ok', database: Boolean(pool), country: 'KE', currency: 'KES' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/categories', async (request, response, next) => {
  try {
    if (pool) {
      const { rows } = await pool.query(
        `SELECT c.slug, c.name, COUNT(p.id)::int AS product_count
         FROM categories c
         LEFT JOIN products p ON p.category_slug = c.slug
         GROUP BY c.slug, c.name, c.sort_order
         ORDER BY c.sort_order`,
      );
      response.json(rows);
      return;
    }

    response.json(
      catalog.categories.map((category) => ({
        slug: category.slug,
        name: category.name,
        product_count: catalog.products.filter((product) => product.categorySlug === category.slug).length,
      })),
    );
  } catch (error) {
    next(error);
  }
});

app.get('/api/products', async (request, response, next) => {
  try {
    const category = request.query.category;
    if (category && !categoryDefinitions.some((entry) => entry.slug === category)) {
      response.status(400).json({ error: 'Unknown product category.' });
      return;
    }

    if (pool) {
      const { rows } = category
        ? await pool.query(
            'SELECT * FROM products WHERE category_slug = $1 ORDER BY name',
            [category],
          )
        : await pool.query('SELECT * FROM products ORDER BY category_slug, name');
      response.json(rows.map(toApiProduct));
      return;
    }

    const products = category
      ? catalog.products.filter((product) => product.categorySlug === category)
      : catalog.products;
    response.json(products);
  } catch (error) {
    next(error);
  }
});

app.get('/api/products/:id', async (request, response, next) => {
  try {
    if (pool) {
      const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [request.params.id]);
      if (rows.length === 0) {
        response.status(404).json({ error: 'Product not found.' });
        return;
      }
      response.json(toApiProduct(rows[0]));
      return;
    }

    const product = catalog.products.find((entry) => entry.id === request.params.id);
    if (!product) {
      response.status(404).json({ error: 'Product not found.' });
      return;
    }
    response.json({ ...product, currency: 'KES' });
  } catch (error) {
    next(error);
  }
});

const distDirectory = resolve(projectRoot, 'dist');
app.use(express.static(distDirectory));
app.get('/', (request, response, next) => {
  response.sendFile(resolve(distDirectory, 'index.html'), (error) => {
    if (error) {
      next(error);
    }
  });
});

app.use((request, response) => {
  response.status(404).json({ error: 'Not found.' });
});

app.use((error, request, response, next) => {
  console.error(error);
  if (response.headersSent) {
    next(error);
    return;
  }
  response.status(500).json({ error: 'The request could not be completed.' });
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`SleepOutside server listening on port ${port}.`);
});

async function shutdown() {
  server.close(async () => {
    if (pool) {
      await pool.end();
    }
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
