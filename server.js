const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Add parentheses here

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.static('public'));

app.get('/weather/:city', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHERMAP_API_KEY;
        const city = req.params.city;
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        const response = await axios.get(apiUrl);

        if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
            // If the response has a JSON content type, send the JSON data
            res.json(response.data);
            const formattedData = {
                temperature: Math.round(weatherData.main.temp - 273.15),
                description: weatherData.weather[0].description,
                cityName: weatherData.name,
                iconCode: weatherData.weather[0].icon,
                windSpeed: weatherData.wind.speed,
                humidity: weatherData.main.humidity,
            };

            res.json(formattedData);
        } else {
            // If the response is not JSON, handle it accordingly
            console.error('Invalid content type. Expected JSON.');
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
