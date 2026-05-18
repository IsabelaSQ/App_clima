export function renderMultipleWeather(list) {
    const result = document.getElementById("result");
  
    result.innerHTML = list.map(item => {
      if (item.error) {
        return `<div class="empty-state">❌ ${item.city || ""}: ${item.error}</div>`;
      }
  
      // 🔹 Pega a imagem de fundo com base no código do clima
      const bgStyle = getBackgroundImage(item.weatherCode);
  
      const forecastHTML = item.forecast && item.forecast.length > 0
        ? `<div class="forecast-container">
            ${item.forecast.map(day => `
              <div class="forecast-day">
                <p>${formatDate(day.date)}</p>
                <span style="font-size: 1.5rem;">${getWeatherEmoji(day.code)}</span>
                <strong>${Math.round(day.max)}°</strong>
              </div>
            `).join("")}
           </div>`
        : `<p>⚠️ Previsão indisponível</p>`;
  
      return `
        <div class="hero-card" style="${bgStyle}">
          <div>
            <div class="hero-temp">${Math.round(item.temperature)}°</div>
            <div class="hero-city">${item.city}${item.state ? `, ${item.state}` : ""}</div>
          </div>
        </div>
  
        <div class="bottom-grid">
          <div class="info-card">
            <div class="info-item">
              <span>💧</span>
              <div class="info-text">
                <p>Umidade</p>
                <strong>${item.humidity}%</strong>
              </div>
            </div>
            <div class="info-item">
              <span>💨</span>
              <div class="info-text">
                <p>Vento</p>
                <strong>${item.windspeed} km/h</strong>
              </div>
            </div>
          </div>
  
          <div class="info-card">
            <p style="color: var(--text-light); font-size: 0.85rem; margin-bottom: 10px;">Previsão - 5 Dias</p>
            ${forecastHTML}
          </div>
        </div>
      `;
    }).join("");
  }
  
  // 🔹 Lógica que escolhe a foto baseado no código WMO da Open-Meteo
  function getBackgroundImage(code) {
    const overlay = "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.5))";
    
    let imageUrl = "";
  
    if (code === 0) {
      // 0: Céu limpo / Sol
      imageUrl = "https://i.pinimg.com/736x/83/4d/36/834d365c606cc5764ee28caab7d7be77.jpg";
    } 
    else if (code >= 1 && code <= 3) {
      // 1, 2, 3: Nublado / Parcialmente nublado
      imageUrl = "https://i.pinimg.com/736x/6d/0e/50/6d0e50e05fa85fd0b83e3a5ce2c7d1bc.jpg";
    } 
    else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      // 51 a 67 ou 80 a 82: Chuva / Garoa
      imageUrl = "https://i.pinimg.com/1200x/4c/51/14/4c5114772f81305fda461dd1c186da0f.jpg";
    } 
    else if (code >= 71 && code <= 77 || code === 85 || code === 86) {
      // 71 a 77, 85, 86: Neve
      imageUrl = "https://i.pinimg.com/1200x/bb/0b/40/bb0b402cb6a95d2cd4b274b3b895c029.jpg";
    } 
    else if (code >= 95) {
      // 95 a 99: Tempestade com raios
      imageUrl = "https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?q=80&w=800&auto=format&fit=crop";
    } 
    else {
      // Se der um código desconhecido, volta para o gradiente roxo do CSS
      return "background: var(--hero-gradient);";
    }
  
    // Junta a máscara escura com a imagem de fundo
    return `background: ${overlay}, url('${imageUrl}') center/cover no-repeat;`;
  }
  
  function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}`;
  }

  // 🔹 Função que transforma o código WMO em Emojis
    function getWeatherEmoji(code) {
        if (code === 0) return "☀️"; // Sol
        if (code >= 1 && code <= 3) return "⛅"; // Nublado
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "🌧️"; // Chuva
        if (code >= 71 && code <= 77 || code === 85 || code === 86) return "❄️"; // Neve
        if (code >= 95) return "⛈️"; // Tempestade
        return "🌤️"; // Padrão
    }