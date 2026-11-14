import { getFlights } from './utils.mjs';
import { saveBooking } from './booking.mjs';

const form = document.getElementById('searchForm');
const results = document.getElementById('results');
const searchBtn = document.getElementById('searchBtn');

form.addEventListener('submit', async(e) => {
    e.preventDefault();

    searchBtn.classList.add('loading');

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;

    const flights = await getFlights(from, to);

    displayFlights(flights);

    searchBtn.classList.remove('loading');
});


function normalizeFlight(flight) {
    return {
        airline: flight?.airline?.name ?? 'Unknown Airline',
        from: flight?.departure?.iata ?? 'N/A',
        to: flight?.arrival?.iata ?? 'N/A',
        departure: flight?.departure?.scheduled ?? 'N/A',
        arrival: flight?.arrival?.scheduled ?? 'N/A',
        flightNumber: flight?.flight?.iata ?? 'N/A',
        status: flight?.flight_status ?? 'Unknown'
    };
}


function displayFlights(flights) {
    results.innerHTML = '';

    if (!Array.isArray(flights) || flights.length === 0) {
        results.innerHTML = '<p>No flights found.</p>';
        return;
    }

    flights.slice(0, 5).forEach(flight => {

        const data = normalizeFlight(flight);

        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <h3>${data.airline}</h3>
            <p><strong>From:</strong> ${data.from}</p>
            <p><strong>To:</strong> ${data.to}</p>
            <p><strong>Time:</strong> ${data.time}</p>
            <button class="bookBtn">Book Now</button>
        `;

        card.querySelector('.bookBtn').addEventListener('click', () => {
            saveBooking(data);
            alert('Flight booked successfully!');
        });

        results.appendChild(card);
    });
}