import { getLocalStorage, updateCartCount } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.FinalPrice ?? item.price ?? 0) * (Number(item.quantity) || 1),
    0
  );
  document.querySelector('#cart-total').textContent = subtotal.toFixed(2);
}

function cartItemTemplate(item) {
  const color = item.Colors && item.Colors[0] ? item.Colors[0].ColorName : 'N/A';
  const price = Number(item.FinalPrice ?? item.price ?? 0);

  return `<li class="cart-card divider">

    <button class="remove-item" data-id="${item.Id ?? item.id}">
      Remove
    </button>

    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${color}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">$${price.toFixed(2)}</p>

  </li>`;
}

function removeFromCart(productId) {
  let cartItems = getLocalStorage('so-cart') || [];

  cartItems = cartItems.filter((item) => String(item.Id || item.id) !== String(productId));

  localStorage.setItem('so-cart', JSON.stringify(cartItems));

  renderCartContents();
  updateCartCount();
}

// Event listener
document.querySelector('.product-list').addEventListener('click', function (event) {
  const removeButton = event.target.closest('.remove-item');
  if (removeButton) {
    const productId = removeButton.dataset.id;
    removeFromCart(productId);
  }
});

// ✅ RUN ON PAGE LOAD
renderCartContents();
updateCartCount();