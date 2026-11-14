import { getLocalStorage, updateCartCount } from './utils.mjs';
import { formatKsh, toKes } from './currency.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const normalizedItems = cartItems.map((item) => ({
    ...item,
    priceKes: Number(item.priceKes ?? toKes(item.FinalPrice ?? item.price ?? 0)),
    imageUrl: item.imageUrl ?? item.Image,
    colors: item.colors ?? item.Colors ?? [],
  }));
  localStorage.setItem('so-cart', JSON.stringify(normalizedItems));
  document.querySelector('.product-list').innerHTML = normalizedItems.map(cartItemTemplate).join('');

  const subtotal = normalizedItems.reduce(
    (total, item) => total + item.priceKes * (Number(item.quantity) || 1),
    0
  );
  document.querySelector('#cart-total').textContent = formatKsh(subtotal);
}

function cartItemTemplate(item) {
  const color = item.colors[0]?.name ?? item.Colors?.[0]?.ColorName ?? 'Not specified';

  return `<li class="cart-card divider">

    <button class="remove-item" data-id="${item.id ?? item.Id}">
      Remove
    </button>

    <a href="#" class="cart-card__image">
      <img src="${item.imageUrl}" alt="${item.name ?? item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.name ?? item.Name}</h2>
    </a>
    <p class="cart-card__color">${color}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>
    <p class="cart-card__price">${formatKsh(item.priceKes)}</p>

  </li>`;
}

function removeFromCart(productId) {
  let cartItems = getLocalStorage('so-cart') || [];

  cartItems = cartItems.filter((item) => String(item.id ?? item.Id) !== String(productId));

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