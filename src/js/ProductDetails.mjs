import { formatKsh } from './currency.mjs';

export default class ProductDetails {
  constructor(product) {
    this.product = product;
  }

  render() {
    const { product } = this;
    const image = document.getElementById('productImage');
    const firstColor = product.colors[0]?.name ?? 'Color not specified';

    document.querySelector('.product-detail h2').textContent = product.brand;
    document.querySelector('.product-detail h3').textContent = product.nameWithoutBrand;
    image.src = product.imageUrl;
    image.alt = product.name;
    document.getElementById('productPrice').textContent = formatKsh(product.priceKes);
    document.getElementById('productColor').textContent = firstColor;
    document.getElementById('productDesc').innerHTML = product.descriptionHtml;
    document.title = `SleepOutside | ${product.nameWithoutBrand}`;
  }
}
