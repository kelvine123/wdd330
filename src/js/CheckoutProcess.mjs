import ExternalServices from './ExternalServices.mjs';

export default class CheckoutProcess {
    constructor(key) {
        this.key = key; // localStorage key
        this.list = [];
        this.itemTotal = 0;
        this.tax = 0;
        this.shipping = 0;
        this.orderTotal = 0;
        this.external = new ExternalServices();
    }

    init() {
        this.list = this.getCartItems();
        this.calculateItemSubTotal();
        this.displayOrderTotals();
    }

    getCartItems() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }

    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        this.shipping = this.list.length > 0 ? 10 + 2 * (this.list.length - 1) : 0;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;
        this.displayOrderTotals();
    }

    displayOrderTotals() {
        document.getElementById('subtotal').innerText = this.itemTotal.toFixed(2);
        document.getElementById('tax').innerText = this.tax.toFixed(2);
        document.getElementById('shipping').innerText = this.shipping.toFixed(2);
        document.getElementById('orderTotal').innerText = this.orderTotal.toFixed(2);
    }

    packageItems(items) {
        return items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
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
            state: data.state,
            zip: data.zip,
            cardNumber: data.cardNumber,
            expiration: data.expiration,
            code: data.code,
            items: this.packageItems(this.list),
            orderTotal: this.orderTotal.toFixed(2),
            shipping: this.shipping,
            tax: this.tax.toFixed(2)
        };

        return await this.external.checkout(order);
    }
}