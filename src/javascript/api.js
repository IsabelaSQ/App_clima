import { saveCache, getCache } from "./utility/cache.js";
import { renderMultipleWeather } from "./renderWeather.js";

async function getCoordinates(cityOrState) {
  
  const parts = cityOrState.split(",");
  const cityName = parts[0].trim();
  const stateName = parts[1] ? parts[1].trim() : "";

  
  const geoRes = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5&language=pt`
  );
  const geo = await geoRes.json();

  if (!geo.results || geo.results.length === 0) {
    return null;
  }

  
  let location = geo.results[0];

  
  if (stateName) {
    const match = geo.results.find(loc =>
      loc.admin1 && loc.admin1.toLowerCase().includes(stateName.toLowerCase())
    );
    if (match) location = match;
  }

  return location;
}


async function getCurrentWeather(city) {
  const key = `weather-${city.toLowerCase().trim()}`;

  const cached = getCache(key);
  if (cached) return cached;

  try {
    
    const location = await getCoordinates(city);

    if (!location) {
      return { city, error: "Cidade não encontrada" };
    }

    const { latitude, longitude, name, admin1, country } = location;

    const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`
      );
      const weather = await weatherRes.json();
  
      const result = {
        city: name,
        state: admin1,
        country,
        temperature: weather.current.temperature_2m,
        windspeed: weather.current.wind_speed_10m,
        humidity: weather.current.relative_humidity_2m,
        // 2. Salvei o código aqui para usarmos no render:
        weatherCode: weather.current.weather_code 
      };

    saveCache(key, result);
    return result;

  } catch {
    const fallback = getCache(key);
    return fallback ? { ...fallback, offline: true } : { city, error: "Erro ou sem conexão" };
  }
}

// 🔹 PREVISÃO 5 DIAS
async function getForecast(city) {
  const key = `forecast-${city.toLowerCase().trim()}`;

  const cached = getCache(key);
  if (cached) return cached;

  try {
    const location = await getCoordinates(city);

    if (!location) {
      return { city, error: "Cidade não encontrada" };
    }

    const { latitude, longitude } = location;

    
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);

    const data = await res.json();

    const forecast = data.daily.time.map((date, i) => ({
      date,
      min: data.daily.temperature_2m_min[i],
      max: data.daily.temperature_2m_max[i],
      rain: data.daily.precipitation_sum[i],
      // 2. Guardamos o código de cada dia aqui:
      code: data.daily.weather_code[i] 
    }));

    const result = { forecast: forecast.slice(0, 5) };

    saveCache(key, result);
    return result;

  } catch {
    const fallback = getCache(key);
    return fallback ? { ...fallback, offline: true } : { error: "Sem dados" };
  }
}

// 🔹 JUNTA TUDO
async function getCityWeather(city) {
  const [current, forecast] = await Promise.all([
    getCurrentWeather(city),
    getForecast(city)
  ]);

  if (current.error) return current;

  return {
    ...current,
    forecast: forecast.forecast || [],
    offline: current.offline || forecast.offline
  };
}

// 🔹 VÁRIAS CIDADES
export async function getWeatherForCities(cities) {
  return Promise.all(cities.map(c => getCityWeather(c)));
}


// 🔹 LÓGICA DO DOM (BOTÃO DE BUSCA)
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const resultDiv = document.getElementById("result");

if (searchBtn) {
  searchBtn.addEventListener("click", async () => {
    const cityValue = cityInput.value;
    
    if (!cityValue.trim()) return;

    resultDiv.innerHTML = "<p>⏳ Buscando dados do clima...</p>";

    const weatherData = await getWeatherForCities([cityValue]);
    
    renderMultipleWeather(weatherData);
  });
}