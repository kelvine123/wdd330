import { getLocalStorage, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  return `<li class="cart-card divider">

    <button class="remove-item" data-id="${item.Id}">
      ❌
    </button>

    <a href="#" class="cart-card__image">
      <img src="${item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: ${item.quantity || 1}</p>

  </li>`;
}

function removeFromCart(productId) {
  let cartItems = getLocalStorage("so-cart") || [];

  cartItems = cartItems.filter(item => {
    const id = item.Id || item.id;
    return id != productId;
  });

  localStorage.setItem("so-cart", JSON.stringify(cartItems));

  renderCartContents();
  updateCartCount();
}

// Event listener
document.querySelector(".product-list").addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-item")) {
    const productId = e.target.dataset.id;
    removeFromCart(productId);
  }
});

// ✅ RUN ON PAGE LOAD
renderCartContents();
updateCartCount();