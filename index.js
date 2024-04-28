const btn = document.querySelector("#searchBtn");
const input = document.querySelector("#cityInput");
const weatherMsg= document.querySelector('.weather-info')
const city = document.querySelector("#city-name");
const time = document.querySelector("#city-time");
const temp = document.querySelector("#city-temp");
const wind = document.querySelector("#city-wind");
const humidity = document.querySelector("#city-humidity");
const aqi = document.querySelector("#city-AQI");

async function getData(cityName) {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=29d045388faf4692bb180213242804&q=${cityName}&aqi=yes`;
        const response = await fetch(url);
        const data = await response.json();

        // Check if the API response contains error message
        if (data.error) {
            throw new Error(data.error.message);
        }

        return data;
    } catch (error) {
        // Display error message on UI
        showError(error.message);
        throw error; // Rethrow the error for handling elsewhere if needed
    }
}

function showError(message) {
    clearInfo();
    // Create a div element for displaying error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.innerText = message;

    // Append error message to weather-info div
    const weatherInfo = document.querySelector("#weatherInfo");
    weatherInfo.appendChild(errorDiv);
}

btn.addEventListener("click", async () => {
    const cityName = input.value;

    // Clear previous error messages
    clearError();

    try {
        const result = await getData(cityName);

        city.innerText = `${result.location.name}, ${result.location.region} - ${result.location.country}`;
        time.innerText = `Time: ${result.location.localtime}`;
        temp.innerText = `Temperature: ${result.current.temp_c}\u00B0C`;
        wind.innerText = `Wind Speed: ${result.current.wind_kph} km/h, Wind Direction: ${result.current.wind_dir}`;
        humidity.innerText = `Humidity: ${result.current.humidity}%`;

        const aqiData = result.current.air_quality;
        const aqiTable = `
            <table>
                <tr>
                    <th>Pollutant</th>
                    <th>Concentration (µg/m³)</th>
                </tr>
                <tr>
                    <td>CO</td>
                    <td>${aqiData.co}</td>
                </tr>
                <tr>
                    <td>NO2</td>
                    <td>${aqiData.no2}</td>
                </tr>
                <tr>
                    <td>O3</td>
                    <td>${aqiData.o3}</td>
                </tr>
                <tr>
                    <td>SO2</td>
                    <td>${aqiData.so2}</td>
                </tr>
                <tr>
                    <td>PM2.5</td>
                    <td>${aqiData.pm2_5}</td>
                </tr>
                <tr>
                    <td>PM10</td>
                    <td>${aqiData.pm10}</td>
                </tr>
            </table>
        `;
        aqi.innerHTML = `<h4>Air Quality Index</h4>${aqiTable}`;
    } catch (error) {
        // Error is already handled in getData function
        console.error(error);
    }
});

function clearError() {
    const errorDiv = document.querySelector(".error");
    if (errorDiv) {
        errorDiv.remove();
    }
}

function clearInfo() {
    // Clear all weather information
    city.innerText = "";
    time.innerText = "";
    temp.innerText = "";
    wind.innerText = "";
    humidity.innerText = "";
    aqi.innerText = "";
}
