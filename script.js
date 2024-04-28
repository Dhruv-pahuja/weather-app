const btn = document.querySelector("#searchBtn");
const input = document.querySelector("#cityInput");
const city = document.querySelector("#city-name");
const time = document.querySelector("#city-time");
const temp = document.querySelector("#city-temp");
const wind = document.querySelector("#city-wind");
const humidity = document.querySelector("#city-humidity");
const condition = document.querySelector("#city-condition");
const aqi = document.querySelector("#city-AQI");
const locationBtn = document.getElementById('get-location');

async function getData(cityName) {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=29d045388faf4692bb180213242804&q=${cityName}&aqi=yes`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

async function getDataLoc(lat, long) {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=29d045388faf4692bb180213242804&q=${lat},${long}&aqi=yes`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

async function gotLocation(position){
    try {
        const result = await getDataLoc(position.coords.latitude, position.coords.longitude);
        updateWeatherInfo(result);
    } catch (error) {
        console.error(error);
    }
}

function failedToGet(){
    showError("There was some issue in getting your location");
}

locationBtn.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
});

btn.addEventListener("click", async () => {
    clearError();
    const cityName = input.value.trim();
    if (!cityName) {
        navigator.geolocation.getCurrentPosition(gotLocation, failedToGet);
    } else {
        try {
            const result = await getData(cityName);
            updateWeatherInfo(result);
        } catch (error) {
            console.error(error);
        }
    }
});

function updateWeatherInfo(result) {
    clearError()
    city.innerText = `${result.location.name}, ${result.location.region} - ${result.location.country}`;
    time.innerText = `Time: ${result.location.localtime}`;
    temp.innerText = `Temperature: ${result.current.temp_c}\u00B0C`;
    wind.innerText = `Wind Speed: ${result.current.wind_kph} km/h, Wind Direction: ${result.current.wind_dir}`;
    humidity.innerText = `Humidity: ${result.current.humidity}%`;
    condition.innerText = `Condition: ${result.current.condition.text}`;
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
}

function showError(message) {
    clearInfo();
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.innerText = message;
    const weatherInfo = document.querySelector("#weatherInfo");
    weatherInfo.appendChild(errorDiv);
}

function clearError() {
    const errorDiv = document.querySelector(".error");
    if (errorDiv) {
        errorDiv.remove();
    }
}

function clearInfo() {
    city.innerText = "";
    time.innerText = "";
    temp.innerText = "";
    wind.innerText = "";
    humidity.innerText = "";
    condition.innerText = "";
    aqi.innerHTML = "";
}
