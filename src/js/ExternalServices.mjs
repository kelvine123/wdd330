export default class ExternalServices {

    constructor() {
        this.baseUrl = 'https://wdd330-backend.onrender.com/checkout';
    }

    async checkout(orderData) {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        };

        const response = await fetch(this.baseUrl, options);
        if (!response.ok) throw new Error('Order submission failed.');
        return await response.json();
    }
}