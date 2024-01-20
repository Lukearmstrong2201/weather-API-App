const weatherInfo = document.getElementById('weatherInfo');

function getWeather() {
    const cityInput = document.getElementById('cityInput').value;
    const apiUrl = `http://localhost:5500/weather/${cityInput}`; 

    if (!cityInput) {
        console.error('City input is empty.');
        // You might want to handle this case, e.g., display an error message to the user.
        return;
    }

    loader.style.display = 'block'

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            displayError(`Error fetching weather data. ${error.message}`);;
        })
        .finally(() => {
            // Hide loader after fetching data
            loader.style.display = 'none';
        });
        
}

function displayWeather(data) {

    try {

        //this line is for debugging perposes, comment out when not in use!
        console.log('Weather Data:', data);
    
        // Ensure the response is valid JSON
        const jsonData = JSON.parse(JSON.stringify(data));

        if (jsonData && jsonData.main && jsonData.weather) {
            const temperature = Math.round(jsonData.main.temp - 273.15); // Convert from Kelvin to Celsius
            const description = jsonData.weather[0].description;
            const cityName = jsonData.name;
            const iconCode = jsonData.weather[0].icon;
            const windSpeed = Math.round(jsonData.wind.speed);
            const humidity = Math.round(jsonData.main.humidity);
            console.log(iconCode);
            const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

            const weatherIconClass = mapIconCodeToWeatherIcon(iconCode);
            const iconHtml = `<i class="wi ${weatherIconClass} weather-icon"></i>`;

            document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${cityName},weather')`;
            const weatherHTML = `
                <h2>${cityName}</h2>
                <p>${description}</p>
                <p>Temperature: ${temperature} ℃</p>
                <p><i class="fas fa-wind"></i>Wind Speed: ${windSpeed} m/s</p>
                <p><i class="fas fa-tint"></i>Humidity: ${humidity}%</p>
                ${iconHtml}
            `;

            weatherInfo.innerHTML = weatherHTML;

        } else {
            console.error('Invalid weather data received.');
            displayError('Error fetching weather data. Please try again');;
        }

    } catch (error) {
        console.error(`Error parsing JSON: ${error.message}`);
        displayError('Error fetching weather data. Please try again');
    }
}

function displayError(message) {
    // Display error message
    weatherInfo.innerHTML = `<p class="error">${message}</p>`;
}

function mapIconCodeToWeatherIcon(iconCode) {
    // Example mappings, you might need to adjust these based on your needs
    const iconMappings = {
        '01d': 'wi-day-sunny',
        '02d': 'wi-day-cloudy',
        '03d': 'wi-cloud',
        '04d': 'wi-cloudy',
        '09d': 'wi-showers',
        '10d': 'wi-rain',
        '11d': 'wi-thunderstorm',
        '13d': 'wi-snow',
        '50d': 'wi-fog',
        // Similar mappings for night icons, e.g., '01n': 'wi-night-clear'
    };

    return iconMappings[iconCode] || 'wi-day-sunny'; // Default to a sunny icon if not found
}
