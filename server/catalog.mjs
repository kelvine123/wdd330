import { readFile } from 'node:fs/promises';
import { USD_TO_KES_RATE, toKes } from '../src/js/currency.mjs';

export const categoryDefinitions = [
  { slug: 'tents', name: 'Tents', file: 'tents.json' },
  { slug: 'sleeping-bags', name: 'Sleeping Bags', file: 'sleeping-bags.json' },
  { slug: 'backpacks', name: 'Backpacks', file: 'backpacks.json' },
];

function getRecords(dataset) {
  if (Array.isArray(dataset)) {
    return dataset;
  }

  if (Array.isArray(dataset.Result)) {
    return dataset.Result;
  }

  throw new Error('Product catalog file has an unsupported format.');
}

function normalizeProduct(product, category) {
  const sourcePriceUsd = Number(product.FinalPrice ?? product.ListPrice);
  if (!product.Id || !Number.isFinite(sourcePriceUsd) || sourcePriceUsd < 0) {
    throw new Error(`Invalid product data in ${category.file}.`);
  }

  const imageUrl =
    product.Image ??
    product.Images?.PrimaryMedium ??
    product.Images?.PrimarySmall ??
    product.Images?.PrimaryLarge ??
    '';
  const suggestedRetailPriceUsd = Number(
    product.SuggestedRetailPrice ?? product.ListPrice ?? sourcePriceUsd,
  );
  const colors = (product.Colors ?? []).map(({ ColorCode, ColorName }) => ({
    code: ColorCode ?? '',
    name: ColorName ?? '',
  }));
  const details = {
    isNew: Boolean(product.IsNew),
    isClearance: Boolean(product.IsClearance),
    reviewCount: Number(product.Reviews?.ReviewCount ?? 0),
    averageRating: Number(product.Reviews?.AverageRating ?? 0),
  };

  return {
    id: String(product.Id),
    categorySlug: category.slug,
    categoryName: category.name,
    brand: product.Brand?.Name ?? 'Unbranded',
    name: product.Name ?? product.NameWithoutBrand ?? 'Outdoor gear',
    nameWithoutBrand: product.NameWithoutBrand ?? product.Name ?? 'Outdoor gear',
    imageUrl,
    descriptionHtml: product.DescriptionHtmlSimple ?? '',
    sourcePriceUsd,
    priceKes: toKes(sourcePriceUsd),
    suggestedRetailPriceKes: toKes(suggestedRetailPriceUsd),
    colors,
    sizesAvailable: product.SizesAvailable ?? {},
    details,
  };
}

export async function loadCatalog() {
  const categories = [];
  const products = [];

  for (const category of categoryDefinitions) {
    const file = new URL(`../src/public/json/${category.file}`, import.meta.url);
    const dataset = JSON.parse(await readFile(file, 'utf8'));
    const records = getRecords(dataset);
    categories.push({ slug: category.slug, name: category.name, sortOrder: categories.length });
    products.push(...records.map((product) => normalizeProduct(product, category)));
  }

  return { categories, products, exchangeRate: USD_TO_KES_RATE };
}
