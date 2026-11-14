import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';
import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

const dataSource = new ProductData();
let currentProduct = null;

function addProductToCart(product) {
  const cart = getLocalStorage('so-cart') || [];
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      priceKes: product.priceKes,
      colors: product.colors,
      categorySlug: product.categorySlug,
      quantity: 1,
    });
  }

  setLocalStorage('so-cart', cart);
}

function animateCart() {
  const cartIcon = document.querySelector('.cart');
  cartIcon.classList.add('animate');
  setTimeout(() => cartIcon.classList.remove('animate'), 400);
}

async function loadProduct() {
  const details = document.querySelector('.product-detail');
  const productId = new URLSearchParams(window.location.search).get('product');
  try {
    if (!productId) {
      throw new Error('A product id is required.');
    }

    currentProduct = await dataSource.findProductById(productId);
    new ProductDetails(currentProduct).render();
    document.getElementById('addToCart').disabled = false;
  } catch (error) {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'Product details could not be loaded. Please try again.';
    details.prepend(message);
    console.error(error);
  }
}

document.getElementById('addToCart').disabled = true;
document.getElementById('addToCart').addEventListener('click', () => {
  if (currentProduct) {
    addProductToCart(currentProduct);
    updateCartCount();
    animateCart();
  }
});

loadProduct();
updateCartCount();
