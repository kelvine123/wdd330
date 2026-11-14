import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';
import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

const dataSource = new ProductData('tents');

function addProductToCart(product) {
  let cart = getLocalStorage('so-cart') || [];

  const cleanProduct = {
    Id: product.Id || product.id,
    Name: product.Name,
    Image: product.Image,
    FinalPrice: product.FinalPrice,
    Colors: product.Colors,
    quantity: product.quantity || 1
  };

  const existingItem = cart.find(item => item.Id === cleanProduct.Id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push(cleanProduct);
  }

  setLocalStorage('so-cart', cart);
}

// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   console.log("PRODUCT:", product);
//   addProductToCart(product);
//   updateCartCount();
//   animateCart();
// }

let currentProduct = null; // ✅ FIX

function addToCartHandler() {
  if (currentProduct) {
    addProductToCart(currentProduct);
    updateCartCount();
    animateCart();
  }
}

async function loadProduct() {
  try {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    const product = await dataSource.findProductById(productId);

    if (!product) {
      throw new Error(`Product "${productId}" was not found.`);
    }

    new ProductDetails(product).render();
    currentProduct = product;
    document.getElementById('addToCart').disabled = false;
  } catch (error) {
    const message = document.createElement('p');
    message.setAttribute('role', 'alert');
    message.textContent = 'Product details could not be loaded. Please try again.';
    document.querySelector('.product-detail').prepend(message);
  }
}

// disable until loaded
document.getElementById('addToCart').disabled = true;

function animateCart() {
  const cartIcon = document.querySelector('.cart');

  cartIcon.classList.add('animate');

  setTimeout(() => {
    cartIcon.classList.remove('animate');
  }, 400);
}

loadProduct();

document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);

updateCartCount();