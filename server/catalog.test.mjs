import { describe, expect, test } from '@jest/globals';
import { loadCatalog } from './catalog.mjs';
import { formatKsh, toKes } from '../src/js/currency.mjs';

describe('SleepOutside catalog', () => {
  test('loads products from all three categories with Kenyan prices', async () => {
    const catalog = await loadCatalog();

    expect(catalog.categories.map((category) => category.slug)).toEqual([
      'tents',
      'sleeping-bags',
      'backpacks',
    ]);
    expect(catalog.products).toHaveLength(94);
    expect(catalog.products.every((product) => product.priceKes > 0)).toBe(true);
    expect(catalog.products.find((product) => product.id === '880RR').priceKes).toBe(26399);
  });

  test('formats KSh values and converts USD using the chosen rate', () => {
    expect(toKes(10)).toBe(1320);
    expect(formatKsh(26399)).toBe('KSh 26,399');
  });
});
