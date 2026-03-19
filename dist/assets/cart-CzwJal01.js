import{g as e}from"./utils-DWpuXFaE.js";/* empty css              */function o(){const r=(e("so-cart")||[]).map(c=>s(c));document.querySelector(".product-list").innerHTML=r.join("")}function s(t){return`<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${t.Image}"
      alt="${t.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${t.Name}</h2>
  </a>
  <p class="cart-card__color">${t.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${t.FinalPrice}</p>
</li>`}function l(){const r=(e("so-cart")||[]).reduce((a,n)=>a+(n.quantity||1),0),c=document.querySelector(".cart");if(c){let a=c.querySelector(".cart-count");a||(a=document.createElement("span"),a.classList.add("cart-count"),c.appendChild(a)),a.textContent=r}}o();l();
