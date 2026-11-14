export async function getFlights(from, to) {
    try {
        const API_KEY =
            import.meta.env.VITE_API_KEY;

        const res = await fetch(
            `https://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=${from}&arr_iata=${to}`
        );

        const data = await res.json();

        if (!data || !data.data) {
            console.error("Invalid API response:", data);
            return [];
        }

        return data.data;

    } catch (error) {
        console.error('Error fetching flights:', error);
        return [];
    }
}