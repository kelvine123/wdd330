CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  category_slug TEXT NOT NULL REFERENCES categories (slug) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  name_without_brand TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description_html TEXT NOT NULL DEFAULT '',
  source_price_usd NUMERIC(12, 2) NOT NULL,
  price_kes INTEGER NOT NULL,
  suggested_retail_price_kes INTEGER,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes_available JSONB NOT NULL DEFAULT '{}'::jsonb,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_name_idx
  ON products (category_slug, name);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
