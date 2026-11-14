import CheckoutProcess from './CheckoutProcess.mjs';

const checkout = new CheckoutProcess('so-cart');
checkout.init();

const form = document.getElementById('checkout-form');
const postalCodeInput = document.getElementById('postalCode');

postalCodeInput.addEventListener('blur', () => {
    checkout.calculateOrderTotal();
});

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    checkout.calculateOrderTotal();

    try {
        const result = await checkout.checkout(form);
        alert('Order placed successfully! Order ID: ' + result.id);
        localStorage.removeItem('so-cart');
        window.location.href = '/index.html';
    } catch (error) {
        alert('Error submitting order: ' + error.message);
    }
});