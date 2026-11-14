import { formatKsh } from './currency.mjs';
import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${encodeURIComponent(product.id)}">
        <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
        <span class="product-card__category">${product.categoryName}</span>
        <h2 class="card__brand">${product.brand}</h2>
        <h3 class="card__name">${product.nameWithoutBrand}</h3>
        <p class="product-card__price">${formatKsh(product.priceKes)}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(dataSource, listElement) {
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const products = await this.dataSource.getData();
    this.renderList(products);
  }

  renderList(products) {
    renderListWithTemplate(productCardTemplate, this.listElement, products, 'beforeend', true);
  }
}
