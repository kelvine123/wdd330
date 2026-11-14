import ExternalServices from './ExternalServices.mjs';
import { formatKsh, toKes } from './currency.mjs';

export default class CheckoutProcess {
    constructor(key) {
        this.key = key; // localStorage key
        this.list = [];
        this.itemTotal = 0;
        this.tax = 0;
        this.shipping = 0;
        this.orderTotal = 0;
        this.currency = 'KES';
        this.external = new ExternalServices();
    }

    init() {
        this.list = this.getCartItems();
        this.calculateOrderTotal();
    }

    getCartItems() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce(
            (total, item) => total + Number(item.priceKes ?? toKes(item.FinalPrice ?? item.price ?? 0)) * (Number(item.quantity) || 1),
            0
        );
    }

    calculateOrderTotal() {
        this.calculateItemSubTotal();
        this.tax = Math.round(this.itemTotal * 0.06);
        this.shipping = this.list.length > 0 ? toKes(10 + 2 * (this.list.length - 1)) : 0;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        document.getElementById('subtotal').innerText = formatKsh(this.itemTotal);
        document.getElementById('tax').innerText = formatKsh(this.tax);
        document.getElementById('shipping').innerText = formatKsh(this.shipping);
        document.getElementById('orderTotal').innerText = formatKsh(this.orderTotal);
    }

    packageItems(items) {
        return items.map((item) => ({
            id: item.id ?? item.Id,
            name: item.name ?? item.Name,
            price: Number(item.priceKes ?? toKes(item.FinalPrice ?? item.price ?? 0)),
            quantity: Number(item.quantity) || 1
        }));
    }

    async checkout(form) {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => data[key] = value);

        const order = {
            orderDate: new Date().toISOString(),
            fname: data.fname,
            lname: data.lname,
            street: data.street,
            city: data.city,
            state: data.county,
            zip: data.postalCode,
            country: 'Kenya',
            currency: this.currency,
            cardNumber: data.cardNumber,
            expiration: data.expiration,
            code: data.code,
            items: this.packageItems(this.list),
            orderTotal: this.orderTotal,
            shipping: this.shipping,
            tax: this.tax.toFixed(2)
        };

        return await this.external.checkout(order);
    }
}