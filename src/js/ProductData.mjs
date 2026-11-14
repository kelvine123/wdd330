async function requestJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Catalog request failed (${response.status}).`);
  }
  return response.json();
}

export default class ProductData {
  constructor(category = '') {
    this.category = category;
  }

  getData() {
    const query = this.category ? `?category=${encodeURIComponent(this.category)}` : '';
    return requestJson(`/api/products${query}`);
  }

  getCategories() {
    return requestJson('/api/categories');
  }

  findProductById(id) {
    return requestJson(`/api/products/${encodeURIComponent(id)}`);
  }
}
