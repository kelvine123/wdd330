import ProductData from './ProductData.mjs';
import { formatKsh } from './currency.mjs';
import { updateCartCount } from './utils.mjs';

const dataSource = new ProductData();
const productList = document.querySelector('.product-list');
const categoryFilter = document.querySelector('#category-filter');
const searchInput = document.querySelector('#product-search');
const resultCount = document.querySelector('#result-count');
const statusMessage = document.querySelector('#catalog-status');
let products = [];

function productCardTemplate(product) {
  const compareAt = product.suggestedRetailPriceKes > product.priceKes
    ? `<p class="product-card__was">Was ${formatKsh(product.suggestedRetailPriceKes)}</p>`
    : '';

  return `
    <li class="product-card">
      <a href="/product_pages/index.html?product=${encodeURIComponent(product.id)}">
        <img src="${product.imageUrl}" alt="${product.name}" loading="lazy">
        <span class="product-card__category">${product.categoryName}</span>
        <h2 class="card__brand">${product.brand}</h2>
        <h3 class="card__name">${product.nameWithoutBrand}</h3>
        <p class="product-card__price">${formatKsh(product.priceKes)}</p>
        ${compareAt}
      </a>
    </li>
  `;
}

function renderProducts() {
  const category = categoryFilter.value;
  const search = searchInput.value.trim().toLocaleLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = category === 'all' || product.categorySlug === category;
    const matchesSearch = `${product.name} ${product.brand}`.toLocaleLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  productList.innerHTML = visibleProducts.map(productCardTemplate).join('');
  resultCount.textContent = `${visibleProducts.length} products`;
  statusMessage.hidden = visibleProducts.length > 0;
  statusMessage.textContent = visibleProducts.length ? '' : 'No products match your search.';
}

async function initializeCatalog() {
  try {
    const [categories, catalogProducts] = await Promise.all([
      dataSource.getCategories(),
      dataSource.getData(),
    ]);

    products = catalogProducts;
    categoryFilter.innerHTML = [
      `<option value="all">All products (${products.length})</option>`,
      ...categories.map(
        (category) =>
          `<option value="${category.slug}">${category.name} (${category.product_count})</option>`,
      ),
    ].join('');
    renderProducts();
  } catch (error) {
    statusMessage.hidden = false;
    statusMessage.textContent = 'The product catalog could not be loaded. Please try again later.';
    statusMessage.dataset.error = error.message;
    console.error(error);
  }
}

categoryFilter.addEventListener('change', renderProducts);
searchInput.addEventListener('input', renderProducts);
updateCartCount();
initializeCatalog();
