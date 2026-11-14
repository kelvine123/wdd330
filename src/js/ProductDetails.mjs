export default class ProductDetails {
    constructor(product) {
        this.product = product;
    }

    render() {
        const { product } = this;
        const image = document.getElementById('productImage');
        const color = product.Colors && product.Colors[0] ? product.Colors[0].ColorName : 'N/A';

        document.querySelector('.product-detail h2').textContent = product.Brand.Name;
        document.querySelector('.product-detail h3').textContent = product.NameWithoutBrand;
        image.src = product.Image;
        image.alt = product.Name;
        document.getElementById('productPrice').textContent = `$${Number(product.FinalPrice).toFixed(2)}`;
        document.getElementById('productColor').textContent = color;
        document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;
        document.title = `Sleep Outside | ${product.NameWithoutBrand}`;
    }
}