import ProductData from "./ProductData.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { updateCartCount } from "../js/utils.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  let cart = getLocalStorage("so-cart") || [];

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

  setLocalStorage("so-cart", cart);
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
  } else {
    console.error("Product not loaded!");
  }
}

async function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("product");

  const product = await dataSource.findProductById(productId);

  currentProduct = product;

  document.getElementById("addToCart").disabled = false; // ✅ FIX
}

// disable until loaded
document.getElementById("addToCart").disabled = true;

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