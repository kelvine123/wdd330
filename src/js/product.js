import ProductData from "./ProductData.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartCount } from "../js/utils.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cart = getLocalStorage("so-cart") || [];
  cart.push(product);
  setLocalStorage("so-cart", cart);
}

async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
  animateCart();
}

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");
  const product = await dataSource.findProductById(productId);
  
  document.querySelector("#addToCart").dataset.id = product.Id;
}

function animateCart() {
  const cartIcon = document.querySelector(".cart");

  cartIcon.classList.add("animate");

  setTimeout(() => {
    cartIcon.classList.remove("animate");
  }, 400);
}

loadProduct();

document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);

updateCartCount();